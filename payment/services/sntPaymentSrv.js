sntPay.service('sntPaymentSrv', ['$q', '$http',
    function($q, $http) {
        var service = this;

        this.submitPayment = function(dataToSrv) {

            //TO DO polling


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

        this.getLinkedCardList = function(reservationId) {
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
        var sixCreditCardTypes = {
              "AX": 'AX',
              "DI": 'DS',
              "DN": 'DC',
              "JC": 'JCB',
              "MC": 'MC',
              "VS": 'VA',
              "VX": 'VA',
              "MX": 'DS',//Six iframe reurns MX for discover. not good,
              "MV": 'MC'
        };

        this.getSixPayCreditCardType = function(cardCode){
            var card = cardCode.toUpperCase();
            return sixCreditCardTypes[card];
        };

        /********************************* MLI **************************************/

        this.getCreditCardTypeForMLI = function(cardBrand){
            var card = (typeof cardBrand  ==="undefined") ? "":cardBrand.toUpperCase();
            var cardArray = ['AX','DC','DS','JCB','MC','VA'];
            return (cardArray.indexOf(card) != -1 ) ? card : (typeof creditCardTypes[card]!='undefined') ? creditCardTypes[card] : 'credit-card';
        };

        this.savePaymentDetails = function(params){
            var deferred = $q.defer();
            var url = 'staff/reservation/save_payment';
             $http.post(url,params).success(function(response) {
                    deferred.resolve(response);
                }.bind(this))
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        //fetch MLI session details
        this.fetchMLISessionDetails = function(sessionDetails, successCallback, failureCallback) {

            var callback = function(response) {
                (response.status === "ok") ? successCallback(response) : failureCallback(response);
            };
            HostedForm.updateSession(sessionDetails, callback);
        };

        this.fetchMLIToken = function(sessionDetails, successCallback, failureCallback) {

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
                };
            } else {
                var errorMessage = ['There is a problem with your credit card'];
                failureCallback(errorMessage);
            };

        };

    }
]);