sntPay.service('sntCBAGatewaySrv', ['$q', '$http', '$location', 'PAYMENT_CONFIG',
    function($q, $http, $location, PAYMENT_CONFIG) {
        var service = this,
            cordovaAPI = new CardOperation();

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
            }).then(response => response.data.id, response => response.data);
        };

        service.updateTransactionSuccess = function(transactionId, cordovaResponse) {
            return $http.put('/api/cc/' + transactionId, {
                "status": true,
                "req_reference_no": cordovaResponse.rrn,
                "external_transaction_ref": null,
                "authorization_code": cordovaResponse.tid,
                "external_print_data": null,
                "external_message": "external_message",
                "payment_method": {
                    "card_name": cordovaResponse.card_name,
                    "card_expiry": cordovaResponse.expiry_date,
                    "card_number": cordovaResponse.card_sequence,
                    "credit_card_type": null
                }
            }).then(response => response.payment_method_id, response => response.data);
        };

        service.updateTransactionFailure = function(transactionId, cordovaResponse) {
            return $http.put('/api/cc/' + transactionId, {
                "status": false,
                "external_failure_reason": cordovaResponse.RVErrorCode,
                "external_message": cordovaResponse.RVErrorDesc
            }).then(response => response.data.id, response => response.data);
        };

        /**
         *
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