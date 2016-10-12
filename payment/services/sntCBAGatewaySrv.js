sntPay.service('sntCBAGatewaySrv', ['$q', '$http', '$filter', 'PAYMENT_CONFIG',
    function($q, $http, $filter, PAYMENT_CONFIG) {
        var service = this,
            cordovaAPI = new CardOperation();


        cordovaAPI = new CBAMockOperation();

        /**
         *
         * @param amount
         * @param bill_id
         * @returns {*|Promise.<response.data|{}|{bill_details, room_number}>}
         */
        service.initiateTransaction = function(amount, bill_id) {
            return $http.post('/api/cc/', {
                amount,
                bill_id,
                credit_card_transaction_type: Number(amount) > 0 ? "PAYMENT" : "REFUND"
            });
        };

        /**
         *
         * @param transactionId
         * @param cordovaResponse
         * @returns {*|Promise.<response.data|{bill_details, room_number}>}
         */
        service.updateTransactionSuccess = function(transactionId, cordovaResponse) {

            var expiryDate = cordovaResponse.expiry_date,
                formattedExpiry = "20";
            //NOTE : Expiry Date from cordovaResponse would be in MMYY format; This has to be changed to YYYY-MM-DD format

            if (expiryDate.length === 4) {
                // Rover expects all dates to be formatted in YYYY-MM-DD; Here we are converting the MMYY string coming in
                // to YYYY-MM-DD with simple string manipulations
                var dateParts = expiryDate.match(/.{1,2}/g);
                formattedExpiry += [dateParts[1], dateParts[0], "01"].join("-");
            } else {
                throw new Error("The UI expects MMYY format date as the cordovaResponse!")
            }

            return $http.put('/api/cc/' + transactionId, {
                "status": true,
                "req_reference_no": cordovaResponse.rrn,
                "external_transaction_ref": cordovaResponse.tid,
                "authorization_code": cordovaResponse.auth_code,
                "external_print_data": cordovaResponse.custom_data,
                "external_message": null,
                "payment_method": {
                    "card_name": cordovaResponse.card_name,
                    "card_expiry": formattedExpiry,
                    "card_number": cordovaResponse.pan,
                    "credit_card_type": cordovaResponse.card_type
                }
            });
        };

        /**
         *
         * @param transactionId
         * @param cordovaResponse
         * @returns {*|Promise.<response.data|{bill_details, room_number}>}
         */
        service.updateTransactionFailure = function(transactionId, cordovaResponse) {
            return $http.put('/api/cc/' + transactionId, {
                "status": false,
                "external_failure_reason": cordovaResponse.RVErrorCode,
                "external_message": cordovaResponse.RVErrorDesc
            });
        };

        /**
         *
         * @param params
         * @param onSuccess
         * @param onFailure
         */
        service.doPayment = function(params, onSuccess, onFailure) {
            cordovaAPI.callCordovaService({
                arguments: [JSON.stringify(params)],
                service: "RVCardPlugin",
                action: "doPayment",
                successCallBack: onSuccess,
                failureCallBack: onFailure
            });
        };

        /**
         *
         * @param params
         * @param onSuccess
         * @param onFailure
         */
        service.doRefund = function(params, onSuccess, onFailure) {
            cordovaAPI.callCordovaService({
                arguments: [JSON.stringify(params)],
                service: "RVCardPlugin",
                action: "doRefund",
                successCallBack: onSuccess,
                failureCallBack: onFailure
            });
        };

    }
]);