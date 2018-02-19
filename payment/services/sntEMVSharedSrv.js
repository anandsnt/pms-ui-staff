angular.module('sntPay').service('sntEMVSharedSrv', ['$q', '$http', '$location', 'PAYMENT_CONFIG',
    '$log', '$timeout', 'sntAuthorizationSrv', '$rootScope', 'sntPaymentSrv', 'sntActivity',
    function ($q, $http, $location, PAYMENT_CONFIG,
              $log, $timeout, sntAuthorizationSrv, $rootScope, sntPaymentSrv, sntActivity) {

        var service = this;

        var constructCardDetails = function (response, cardType) {
            return {
                response: {
                    id: response.payment_method_id || response.guest_payment_method_id,
                    guest_payment_method_id: response.guest_payment_method_id,
                    payment_name: 'CC',
                    usedEMV: true
                },
                selectedPaymentType: 'CC',
                cardDetails: {
                    card_code: cardType.toLowerCase(),
                    ending_with: response.ending_with,
                    expiry_date: response.expiry_date,
                    card_name: '',
                    is_swiped: response.is_swiped
                }
            };
        };

        var tokenize = function (params, deferred) {
            sntActivity.toggleEMVIndicator();
            sntPaymentSrv.getSixPaymentToken(params).then(
                response => {
                    /**
                     * The response here is expected to be of the following format
                     * {
                         *  card_type: "VX",
                         *  ending_with: "0088",
                         *  expiry_date: "1217"
                         *  payment_method_id: 35102,
                         *  token: "123465498745316854"
                         * }
                     *
                     * NOTE: In case the request params sends add_to_guest_card: true AND guest_id w/o reservation_id
                     * The API response has guest_payment_method_id instead of payment_method_id
                     */

                    var cardType = response.card_type || '';

                    deferred.resolve(constructCardDetails(response, cardType));
                    sntActivity.toggleEMVIndicator();
                },
                errorMessage => {
                    $log.info('Tokenization Failed');
                    deferred.reject(errorMessage);
                    sntActivity.toggleEMVIndicator();
                }
            );
        };

        service.addCardInTerminal = function (params) {
            var deferred = $q.defer();

            params.is_emv_request = true;
            $log.info('addCardInTerminal', params);
            tokenize(params, deferred);

            return deferred.promise;
        };
    }
]);
