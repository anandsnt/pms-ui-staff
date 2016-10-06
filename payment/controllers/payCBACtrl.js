angular.module('sntPay').controller('payCBACtrl',
    ['$scope', 'sntPaymentSrv', 'paymentAppEventConstants', 'paymentUtilSrv', 'paymentConstants',
        function($scope, sntPaymentSrv, payEvntConst, util, paymentConstants) {

            var initiatePaymentProcess = function(event, params) {
                console.log("Initiate a Payment", params);
            };

            // ----------- init -------------
            (() => {
                console.log("CBA controller init");
                
                // Initiate Listeners
                var listenerPayment = $scope.$on("INITIATE_CBA_PAYMENT", initiatePaymentProcess);

                // Cleaning listeners
                $scope.$on("$destroy", listenerPayment);
            })();

        }
    ]);