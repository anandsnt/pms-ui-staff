sntPay.service('sntPaymentSrv', ['$q', '$http', '$location', 'PAYMENT_CONFIG',
    function($q, $http, $location, PAYMENT_CONFIG) {
        var service = this;

        service.submitPayment = function(dataToSrv) {

            var deferred = $q.defer();
            var url = 'api/reservations/' + dataToSrv.reservation_id + '/submit_payment';
            $http.post(url, dataToSrv.postData).success(function(response) {
                deferred.resolve(response);
            }.bind(this))
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        service.getLinkedCardList = function(reservationId) {

            var deferred = $q.defer();
            var url = '/staff/staycards/get_credit_cards.json?reservation_id=' + reservationId;
            $http.get(url).success(function(response) {
                deferred.resolve(response.data);
            }.bind(this))
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        /**
         *
         * @param amount
         * @param feeInfo
         * @returns {{calculatedFee: string, minFees: number, defaultAmount: *, totalOfValueAndFee: string}}
         */
        service.calculateFee = function(amount, feeInfo) {
            /**
             * feeInfo object is expected to have these following keys
             * amount
             * amount_sign
             * amount_symbol
             * charge_code_id
             * description
             * minimum_amount_for_fees
             */

            var amountSymbol = "",
                feeAmount = 0,
                minFees = 0,
                calculatedFee = "",
                totalOfValueAndFee = "";

            if (!!feeInfo) {
                amountSymbol = feeInfo.amount_symbol;
                feeAmount = feeInfo.amount ? parseFloat(feeInfo.amount) : 0;
                minFees = feeInfo.minimum_amount_for_fees ? parseFloat(feeInfo.minimum_amount_for_fees) : 0;
            } else {
                console.warn("No fee information for the current selected payment type");
            }

            //Parse default Amount -- default to 0
            var defaultAmount = !amount ? 0 : parseFloat(amount);

            if (amountSymbol === "percent") {
                var appliedFee = parseFloat(defaultAmount * (feeAmount / 100));

                calculatedFee = parseFloat(appliedFee).toFixed(2);
                totalOfValueAndFee = parseFloat(appliedFee + defaultAmount).toFixed(2);
            } else {
                calculatedFee = parseFloat(feeAmount).toFixed(2);
                totalOfValueAndFee = parseFloat(defaultAmount + feeAmount).toFixed(2);
            }

            return {
                calculatedFee: calculatedFee,
                feeChargeCode: feeInfo.charge_code_id,
                minFees: minFees,
                defaultAmount: defaultAmount,
                totalOfValueAndFee: totalOfValueAndFee,
                showFees: defaultAmount >= minFees && !!defaultAmount && !!feeAmount
            };
        };

        /********************************* SIX PAY **********************************/

        service.getSixPayCreditCardType = function(cardCode) {
            var sixCreditCardTypes = {
                "AX": 'AX',
                "DI": 'DS',
                "DN": 'DC',
                "JC": 'JCB',
                "MC": 'MC',
                "VS": 'VA',
                "VX": 'VA',
                "MX": 'DS', //Six iframe returns MX for discover. not good,
                "MV": 'MC'
            };

            return sixCreditCardTypes[cardCode.toUpperCase()];
        };

        //SIX payment actions
        service.submitPaymentForChipAndPin = function(dataToSrv) {

            var deferred = $q.defer();
            var url = 'api/reservations/' + dataToSrv.reservation_id + '/submit_payment';

            var timeStampInSeconds = 0;
            var incrementTimer = function() {
                timeStampInSeconds++;
            };
            var refreshIntervalId = setInterval(incrementTimer, 1000);
            var pollToTerminal = function(async_callback_url) {
                //we will continously communicate with the terminal till 
                //the timeout set for the hotel
                if (timeStampInSeconds >= dataToSrv.emvTimeout) {
                    var errors = ["Request timed out. Unable to process the transaction"];
                    deferred.reject(errors);
                } else {
                    //TODO: remove below line of code and test with actual.
                    //This can be kept to mock the response

                    //var async_callback_url = '/sample_json/payment/six_payment_sample.json';
                    $http.get(async_callback_url).success(function(data, status) {
                        //if the request is still not proccesed
                        if (status === 202 || status === 102 || status === 250) {
                            setTimeout(function() {
                                console.info("POLLING::-> for emv terminal response");
                                pollToTerminal(async_callback_url);
                            }, 5000);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.resolve(data);
                        }
                    }, function(data) {
                        if (typeof data === 'undefined') {
                            pollToTerminal(async_callback_url);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.reject(data);
                        }
                    });
                }
            };

            $http.post(url, dataToSrv.postData).success(function(response, status, headers) {
                //202 ---> The request has been accepted for processing, but the processing has not been completed.
                //102 ---> This code indicates that the server has received and is processing the request, but no response is available yet
                if (status === 202 || status === 102 || status === 250) {
                    var location_header = headers('Location');
                    pollToTerminal(location_header);
                } else {
                    deferred.resolve(response);
                }
            }).error(function(errors, status) {
                webserviceErrorActions(url, deferred, errors, status);
            });
            return deferred.promise;
        };

        //fetch MLI session details
        service.fetchMLISessionDetails = function(sessionDetails, successCallback, failureCallback) {

            var callback = function(response) {
                (response.status === "ok") ? successCallback(response) : failureCallback(response);
            };

            HostedForm.updateSession(sessionDetails, callback);
        };

        service.fetchMLIToken = function(sessionDetails, successCallback, failureCallback) {

            var success = function(response) {
                successCallback(response);
            };
            var failure = function(data) {
                var errorMessage = ['There is a problem with your credit card'];
                failureCallback(errorMessage);
            };

            if (sessionDetails.cardNumber.length > 0) {
                try {
                    service.fetchMLISessionDetails(sessionDetails, success, failure);
                } catch (err) {
                    var errorMessage = ['There was a problem connecting to the payment gateway.'];
                    failureCallback(errorMessage);
                }
            } else {
                var errorMessage = ['There is a problem with your credit card'];
                failureCallback(errorMessage);
            }

        };

        /**
         *
         * @param gateWay
         * @returns {{iFrameUrl: string, paymentGatewayUIInterfaceUrl: string}}
         */
        service.resolvePaths = function(gateWay, params) {
            var iFrameUrlWithParams = "",
                paymentGatewayUIInterfaceUrl = PAYMENT_CONFIG[gateWay].partial;

            switch (gateWay) {
                case "MLI":
                    break;
                case "sixpayments":
                    var time = new Date().getTime(),
                        service_action = PAYMENT_CONFIG[gateWay].params.service_action;

                    iFrameUrlWithParams = PAYMENT_CONFIG[gateWay].iFrameUrl +
                        "card_holder_first_name=" + params.card_holder_first_name +
                        "&card_holder_last_name=" + params.card_holder_last_name +
                        "&service_action=" + service_action +
                        "&time=" + time;

                    break;
                default:
                    throw new Error("Payment Gateway not configured");
            }

            return {
                iFrameUrl: iFrameUrlWithParams,
                paymentGatewayUIInterfaceUrl: paymentGatewayUIInterfaceUrl
            };
        };


        /**
         *
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.fetchGiftCardBalance = function(cardNo) {
            var deferred = $q.defer(),
                url = '/api/gift_cards/balance_inquiry';

            $http.post(url, {
                'card_number': cardNo
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(response) {
                deferred.reject(response);
            });
            return deferred.promise;
        };

        service.savePaymentDetails = function(data) {
            var deferred = $q.defer();
            var url = '/staff/reservation/save_payment';

            $http.post(url, data).success(data => {
                deferred.resolve(data);
            }).error(data => {
                deferred.reject(data);
            });
            return deferred.promise;

        };

        /**
         * This method is used to link a card available with the guest card to the reservation
         * @param data
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.mapPaymentToReservation = function(data) {
            var deferred = $q.defer();
            var url = '/staff/reservation/link_payment';

            $http.post(url, data).success(data => {
                deferred.resolve(data);
            }).error(data => {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        /**
         *
         * @param data
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.addCardToGuest = function(data) {
            var deferred = $q.defer();
            var url = 'staff/payments/save_new_payment';

            $http.post(url, data).success(data => {
                if (data.errors.length > 0) {
                    deferred.reject(data.errors);
                } else {
                    deferred.resolve(data);
                }

            }).error(data => {
                deferred.reject(data);
            });

            return deferred.promise;
        };

    }
]);