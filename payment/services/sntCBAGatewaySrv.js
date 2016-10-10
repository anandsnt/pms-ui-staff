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