angular.module('sntPay').controller('payShijiCtrl',
    ['$scope', 'sntShijiGatewaySrv', 'ngDialog', '$log',
        function($scope, sntShijiGatewaySrv, ngDialog, $log) {

            $scope.shijiPaymentState = {
                isSuccess: false,
                isFailure: false,
                notificationText: '',
                modal: null
            };

            /**
             *
             * @param {object} response Success response from the API call to get QR code
             * @return {undefined}
             */
            function showQRCode(response) {
                $scope.shijiPaymentState.modal = ngDialog.open({
                    template: '/assets/partials/payShijiQRPopup.html',
                    className: '',
                    scope: $scope,
                    data: JSON.stringify(response.data),
                    preCloseCallback: function() {
                        $log.log('TODO:', 'Need to stop listening to the async callback');
                        return true;
                    }
                });
            }

            /**
             * @return {undefined}
             */
            function startPolling(id) {
                sntShijiGatewaySrv.pollPaymentStatus(
                    id,
                    $scope.hotelConfig.emvTimeout
                ).then(
                    response => {
                        $log.info(response);
                    },
                    errorMessage => {
                        $log.info(errorMessage);
                    }
                );
            }

            /**
             * @return {undefined}
             */
            $scope.cancelShijiPayment = function() {
                ngDialog.close($scope.shijiPaymentState.modal.id);
            };

            /*
             notification-text:
             - 'Payment successfull' - for success
             - 'There was an error while processing payment' - for error
             */

            /**
             * @return {undefined}
             */
            function initiatePaymentProcess() {
                $scope.$emit('showLoader');
                sntShijiGatewaySrv.initiatePayment($scope.reservationId, {
                    payment_type: $scope.selectedPaymentType,
                    bill_number: $scope.billNumber,
                    amount: $scope.payment.amount
                }).then(response => {
                    startPolling(response.data.async_callback_id);
                    showQRCode(response);
                    $scope.$emit('hideLoader');
                }, errorMessage => {
                    $scope.$emit('SHIJI_PAYMENT_FAILED', errorMessage.data);
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