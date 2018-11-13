angular.module('sntPay').service('sntPaymentSrv', ['$q', '$http', '$location', 'PAYMENT_CONFIG', '$log', '$timeout', 'sntAuthorizationSrv',
    function($q, $http, $location, PAYMENT_CONFIG, $log, $timeout, sntAuthorizationSrv) {
        var service = this,
            state = {},
            TERMINAL_POLLING_INTERVAL_MS = 3000;

        service.set = function(key, status) {
            state[key] = status;
        };

        service.get = function(key) {
            return state[key];
        };

        var webserviceErrorActions = function(url, deferred, errors, status) {
            var urlStart = url.split('?')[0];
            // please note the type of error expecting is array
            // so form error as array if you modifying it
            

if (status === 406) { // 406- Network error
                deferred.reject(errors);
            } else if (status === 422) { // 422
                deferred.reject(errors);
            } else if (status === 500) { // 500- Internal Server Error
                deferred.reject(['Internal server error occured']);
            } else if (status === 501 || status === 502 || status === 503 || status === 504) { // 500- Internal Server Error
                $window.location.href = '/500';
            } else if (status === 401) { // 401- Unauthorized
                // so lets redirect to login page
                $window.location.href = '/logout';
            }

            // set of custom error emssage range http status
            else if (status >= 470 && status <= 490) {
                errors.httpStatus = status;
                errors.errorMessage = errors;
                deferred.reject(errors);
            }
            // CICO-26779 : Handling 404 - Not found.
            else if (status === 404) {
                console.warn("Found 404 Error : " + url);
            } else {
                deferred.reject(errors);
            }
        };

        service.submitPayment = function(dataToSrv) {

            var deferred = $q.defer(),
                url = "";

            if (!!dataToSrv.reservation_id) {
                url = 'api/reservations/' + dataToSrv.reservation_id + '/submit_payment';
            } else {
                url = 'api/bills/' + dataToSrv.bill_id + '/submit_payment';
                // TODO: clean up the above API so that the requests might be consistent
                dataToSrv.postData.payment_method_id = dataToSrv.postData.payment_type_id;
            }

            $http.post(url, dataToSrv.postData).then(function(response) {
                deferred.resolve(response.data);
            }, function(error) {
                deferred.reject(error.data);
            });

            return deferred.promise;
        };

        service.getLinkedCardList = function(reservationId) {

            var deferred = $q.defer(),
                url = '/staff/staycards/get_credit_cards.json?reservation_id=' + reservationId;

            $http.get(url).then(function(response) {
                deferred.resolve(response.data.data);
            }, function(error) {
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

            // Parse default Amount -- default to 0
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

        // --------------------------------------------------------------------------------------------------------------
        //                                  SIX PAYMENTS
        // --------------------------------------------------------------------------------------------------------------

        service.getSixPayCreditCardType = function(cardCode) {
            var sixCreditCardTypes = {
                "AX": 'AX',
                "DI": 'DS',
                "DN": 'DC',
                "JC": 'JCB',
                "MC": 'MC',
                "VS": 'VA',
                "VX": 'VA',
                "MX": 'DS', // Six iframe returns MX for discover. not good,
                "MV": 'MC',
                "CU": 'CU',
                "DK": 'DK'
            };

            return sixCreditCardTypes[cardCode.toUpperCase()] || 'credit-card';
        };

        /**
         *
         * @param dataToSrv
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.submitPaymentForChipAndPin = function(dataToSrv) {
            var deferred = $q.defer(),
                url = "";

            if (!!dataToSrv.reservation_id) {
                url = 'api/reservations/' + dataToSrv.reservation_id + '/submit_payment';
            } else {
                url = 'api/bills/' + dataToSrv.bill_id + '/submit_payment';
                // TODO: clean up the above API so that the requests might be consistent
                dataToSrv.postData.payment_method_id = dataToSrv.postData.payment_type_id;
            }

            var timeStampInSeconds = 0;
            var incrementTimer = function() {
                timeStampInSeconds++;
            };
            var refreshIntervalId = setInterval(incrementTimer, 1000);
            var pollToTerminal = function(async_callback_url) {
                // we will continously communicate with the terminal till
                // the timeout set for the hotel
                if (timeStampInSeconds >= dataToSrv.emvTimeout) {
                    var errors = ["Request timed out. Unable to process the transaction"];

                    deferred.reject(errors);
                } else {
                    // TODO: comment the assignment below before commits and pushes.
                    // NOTE:This sample json helps to mock the response
                    // For further info : https://stayntouch.atlassian.net/wiki/display/ROV/SIXPayment+Service+Design+Document
                    // var async_callback_url = '/sample_json/payment/six_payment_sample.json';
                    $http.get(async_callback_url).then(function(response) {
                        var data = response.data,
                            status = response.status;

                        // if the request is still not proccesed
                        if (status === 202 || status === 102 || status === 250) {
                            $timeout(function() {
                                $log.info("POLLING::-> for emv terminal response");
                                pollToTerminal(async_callback_url);
                            }, TERMINAL_POLLING_INTERVAL_MS);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.resolve(data);
                        }
                    }, function(response) {
                        if (typeof response.data === 'undefined') {
                            pollToTerminal(async_callback_url);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.reject(response.data);
                        }
                    });
                }
            };

            $http.post(url, dataToSrv.postData).then(function(response) {
                var data = response.data,
                    status = response.status,
                    headers = response.headers;

                // 202 ---> The request has been accepted for processing, but the processing has not been completed.
                // 102 ---> This code indicates that the server has received and is processing the request, but no response is available yet
                if (status === 202 || status === 102 || status === 250) {
                    var location_header = headers('Location');

                    pollToTerminal(location_header);
                } else {
                    deferred.resolve(data);
                }
            }, function(response) {
                var errors = response.data,
                    status = response.staus;

                webserviceErrorActions(url, deferred, errors, status);
            });
            return deferred.promise;
        };

        /**
         *
         * @param dataToSrv
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.getSixPaymentToken = function(dataToSrv) {

            var deferred = $q.defer(),
                url = '/api/cc/get_token.json',
                timeStampInSeconds = 0;

            var incrementTimer = function() {
                timeStampInSeconds++;
            };

            var refreshIntervalId = setInterval(incrementTimer, 1000);

            var pollToTerminal = function(async_callback_url) {
                // we will continously communicate with the terminal till
                // the timeout set for the hotel
                if (timeStampInSeconds >= dataToSrv.emvTimeout) {
                    var errors = ["Request timed out. Unable to process the transaction"];

                    deferred.reject(errors);
                } else {
                    // TODO: comment the assignment below before commits and pushes.
                    // NOTE:This sample json helps to mock the response
                    // For further info : https://stayntouch.atlassian.net/wiki/display/ROV/SIXPayment+Service+Design+Document
                    // async_callback_url = '/sample_json/payment/get_six_pay_token.json';

                    $http.get(async_callback_url).then(function(response) {
                        var data = response.data,
                            status = response.status;

                        // if the request is still not proccesed
                        if (status === 202 || status === 102 || status === 250) {
                            $timeout(function() {
                                $log.info("POLLING::-> for emv terminal response");
                                pollToTerminal(async_callback_url);
                            }, TERMINAL_POLLING_INTERVAL_MS);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.resolve(data);
                        }
                    }, response => {
                        var data = response.data;

                        if (typeof data === 'undefined') {
                            pollToTerminal(async_callback_url);
                        } else {
                            clearInterval(refreshIntervalId);
                            deferred.reject(data);
                        }
                    });
                }
            };

            $http.post(url, dataToSrv).then(function(response) {
                var data = response.data,
                    status = response.status,
                    headers = response.headers;

                // 202 ---> The request has been accepted for processing, but the processing has not been completed.
                // 102 ---> This code indicates that the server has received and is processing the request, but no response is available yet
                if (status === 202 || status === 102 || status === 250) {
                    var location_header = headers('Location');

                    pollToTerminal(location_header);
                } else {
                    deferred.resolve(data);
                }
            }, function(response) {
                var errors = response.data,
                    status = response.staus;

                webserviceErrorActions(url, deferred, errors, status);
            });
            return deferred.promise;
        };


        // --------------------------------------------------------------------------------------------------------------
        //                                  MLI
        // --------------------------------------------------------------------------------------------------------------
        // fetch MLI session details
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


        // --------------------------------------------------------------------------------------------------------------
        //                                  MLI
        // --------------------------------------------------------------------------------------------------------------
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
                case "CBA":
                case "SHIJI":
                case "CBA_AND_MLI":
                    break;
                case "sixpayments":
                    var time = new Date().getTime(),
                        service_action = PAYMENT_CONFIG[gateWay].params.service_action;

                    iFrameUrlWithParams = PAYMENT_CONFIG[gateWay].iFrameUrl + '?' +
                        "card_holder_first_name=" + params.card_holder_first_name +
                        "&card_holder_last_name=" + params.card_holder_last_name +
                        "&service_action=" + service_action +
                        "&time=" + time +
                        "&hotel_uuid=" + sntAuthorizationSrv.getProperty() ;
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
            }).then(function(response) {
                deferred.resolve(response.data);
            }, function(response) {
                deferred.reject(response.data);
            });
            return deferred.promise;
        };

        service.savePaymentDetails = function(data) {
            var deferred = $q.defer();
            var url = '/staff/reservation/save_payment';

            $http.post(url, data).then(response => {
                var data = response.data;

                if (data.status === "failure") {
                    deferred.reject(data.errors);
                } else {
                    deferred.resolve(data);
                }
            }, response => {
                deferred.reject(response.data);
            });
            return deferred.promise;

        };

        service.addBillPaymentMethod = function(data) {
            var deferred = $q.defer(),
                url = '/api/bills/' + data.billId + '/add_payment_method';

            $http.post(url, data.payLoad).then(response => {
                deferred.resolve(response.data);
            }, response => {
                deferred.reject(response.data);
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


            $http.post(url, data).then(response => {
                deferred.resolve(response.data);
            }, response => {
                deferred.reject(response.data);
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

            $http.post(url, data).then(response => {
                var data = response.data;

                if (data.errors && data.errors.length > 0) {
                    deferred.reject(data.errors);
                } else {
                    deferred.resolve(data);
                }

            }, response => {
                deferred.reject(response.data);
            });

            return deferred.promise;
        };


        service.checkARStatus = function(postingAccountId) {
            var deferred = $q.defer();
            var url = 'api/posting_accounts/' + postingAccountId + '/check_ar_account_attached';

            $http.get(url).then(response => {
                deferred.resolve(response.data);
            }, response => {
                deferred.reject(response.data);
            });

            return deferred.promise;
        };

        service.saveARDetails = function(data) {
            var deferred = $q.defer(),
                url = 'api/accounts/save_ar_details';

            $http.post(url, data).then(function(response) {
                deferred.resolve(response.data);
            }, function(response) {
                deferred.reject(response.data);
            });

            return deferred.promise;
        };

        service.isValidAmount = function(amount) {
            return !!amount && !isNaN(Number(amount)) && Number(amount) !== 0;
        };

        service.isAddCardAction = function(actoionType) {
            let addCardActionTypes = ['ADD_PAYMENT_GUEST_CARD', 'ADD_PAYMENT_BILL', 'ADD_PAYMENT_STAY_CARD'];
            
            return _.contains(addCardActionTypes, actoionType);
        };

        service.sampleMLISwipedCardResponse = {
            "cardType": "VA",
            "cardNumber": "xxxx-xxxx-xxxx-0135",
            "nameOnCard": "UAT USA/TEST CARD 19",
            "cardExpiry": "1912",
            "cardExpiryMonth": "12",
            "cardExpiryYear": "19",
            "et2": "",
            "ksn": "FFFF987654165420000E",
            "pan": "476173000000**35",
            "etb": "DA9693715C1DC7B6183F830BF0713E9FE849D0275D30FFF2677F44FB34383B4BE8A2CE89D62D2CC138668CFB914C2D998602969CC58326B5BDD1585174A846FD90096C75903BA1907C4B820B3AE9441F317F21DBDB2CCE8327E24C56CE6866A39085467D0C4D15528B1240C8777B83634DEA58EFD3D90AA3",
            "token": "8045832471460135",
            "isEncrypted": true
        };

        service.mockCba = false;
}]);
