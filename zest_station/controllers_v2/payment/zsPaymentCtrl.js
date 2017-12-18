angular.module('sntZestStation').controller('zsPaymentCtrl',
    ['$scope', '$log', 'sntActivity', 'sntPaymentSrv', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$timeout',
        function ($scope, $log, sntActivity, sntPaymentSrv, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $timeout) {

            $scope.makePayment = function () {
                $scope.$broadcast('INITIATE_CBA_PAYMENT', zsPaymentSrv.getSubmitPaymentParams());
            };


            /**
             * Method to initate listeners that handle CBA payment scenarios
             * @returns {undefined} undefined
             */
            function initiateCBAlisteners() {
                var listenerCBAPaymentFailure = $scope.$on('CBA_PAYMENT_FAILED', (event, errorMessage) => {
                    $log.warn(errorMessage);
                    $state.go('zest_station.checkoutReservationBill', angular.extend(zsStateHelperSrv.getPreviousStateParams(), {
                        dueBalancePaid: false
                    }));
                    // TODO : Handle Error here!
                });

                var listenerCBAPaymentSuccess = $scope.$on('CBA_PAYMENT_SUCCESS', (event, response) => {
                    var params = zsPaymentSrv.getSubmitPaymentParams();


                    // we need to notify the parent controllers to show loader
                    // as this is an external directive
                    sntActivity.start('SUBMIT_PAYMENT');
                    params.postData.payment_type_id = response.payment_method_id;
                    params.postData.credit_card_transaction_id = response.id;
                    sntPaymentSrv.submitPayment(params).then(
                        function (response) {
                            $log.info('success payment', response);
                            $state.go('zest_station.checkoutReservationBill', angular.extend(zsStateHelperSrv.getPreviousStateParams(), {
                                dueBalancePaid: true
                            }));
                            sntActivity.stop('SUBMIT_PAYMENT');
                        },
                        function (errorMessage) {
                            $log.warn(errorMessage);
                            $state.go('zest_station.checkoutReservationBill', angular.extend(zsStateHelperSrv.getPreviousStateParams(), {
                                dueBalancePaid: false
                            }));
                            // TODO : Handle Error here!
                        }
                    );
                });

                var listenerUpdateErrorMessage = $scope.$on('UPDATE_NOTIFICATION', (event, response) => {
                    $log.warn(response);
                    $state.go('zest_station.checkoutReservationBill', angular.extend(zsStateHelperSrv.getPreviousStateParams(), {
                        dueBalancePaid: false
                    }));
                    // TODO : Handle Error here!
                });

                $scope.$on('$destroy', listenerCBAPaymentFailure);
                $scope.$on('$destroy', listenerCBAPaymentSuccess);
                $scope.$on('$destroy', listenerUpdateErrorMessage);
            }

            (function () {
                $log.info('init...');

                if ($scope.zestStationData.paymentGateway === 'CBA') {
                    initiateCBAlisteners();
                    $timeout(function() {
                        $scope.makePayment();
                    }, 3000);
                }
            })();
        }
    ]);
