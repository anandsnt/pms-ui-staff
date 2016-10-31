angular.module('sntPay').controller('payShijiCtrl',
    ['$scope', 'sntShijiGatewaySrv', 'ngDialog',
        function($scope, sntShijiGatewaySrv, ngDialog) {

            /**
             * @return {undefined}
             */
            function showQRCode(response) {
                ngDialog.open({
                    template: '/assets/partials/payShijiQRPopup.html',
                    className: '',
                    scope: $scope,
                    data: JSON.stringify(response.data)
                });
            }

            /**
             * @return {undefined}
             */
            function initiatePaymentProcess() {
                $scope.$emit('showLoader');
                sntShijiGatewaySrv.initiatePayment($scope.reservationId, {
                    payment_type: $scope.selectedPaymentType,
                    amount: $scope.payment.amount
                }).then(response => {
                    showQRCode(response);
                    $scope.$emit('hideLoader');
                }, errorMessage => {
                    $scope.$emit("SHIJI_PAYMENT_FAILED", errorMessage.data);
                    $scope.$emit('hideLoader');
                });
            }

            // ----------- init -------------
            (() => {
                // Initialization code goes here
                var listenerPayment = $scope.$on('INITIATE_SHIJI_PAYMENT', initiatePaymentProcess);

                $scope.$on('$destroy', listenerPayment);
            })();

        }
    ]);