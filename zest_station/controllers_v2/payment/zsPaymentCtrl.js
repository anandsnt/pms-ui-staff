angular.module('sntZestStation').controller('zsPaymentCtrl',
    ['$scope', '$log', 'sntActivity', 'sntPaymentSrv', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$timeout',
        function ($scope, $log, sntActivity, sntPaymentSrv, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $timeout) {

            var makeCBAPayment = function () {
                $scope.$emit('showLoader');
                $scope.$broadcast('INITIATE_CBA_PAYMENT', zsPaymentSrv.getSubmitPaymentParams());
            };


            /**
             * Method to initate listeners that handle CBA payment scenarios
             * @returns {undefined} undefined
             */
            function initiateCBAlisteners() {
                var listenerCBAPaymentFailure = $scope.$on('CBA_PAYMENT_FAILED', (event, errorMessage) => {
                    $log.warn(errorMessage);
                    $scope.$emit('hideLoader');
                    $scope.mode = 'PROCESS_FAILED';
                    // TODO : Handle Error here!
                });

                var listenerCBAPaymentSuccess = $scope.$on('CBA_PAYMENT_SUCCESS', (event, response) => {
                    var params = zsPaymentSrv.getSubmitPaymentParams();


                    // we need to notify the parent controllers to show loader
                    // as this is an external directive
                    $scope.$emit('showLoader');
                    params.postData.payment_type_id = response.payment_method_id;
                    params.postData.credit_card_transaction_id = response.id;
                    sntPaymentSrv.submitPayment(params).then(
                        function (response) {
                            $log.info('success payment', response);
                            $state.go('zest_station.checkoutReservationBill', angular.extend(zsStateHelperSrv.getPreviousStateParams(), {
                                dueBalancePaid: true
                            }));
                            $scope.$emit('hideLoader');
                        },
                        function (errorMessage) {
                            $log.warn(errorMessage);
                            $scope.$emit('hideLoader');
                            $scope.mode = 'PROCESS_FAILED';
                        }
                    );
                });

                var listenerUpdateErrorMessage = $scope.$on('UPDATE_NOTIFICATION', (event, response) => {
                    $log.warn(response);
                    $scope.$emit('hideLoader');
                    $scope.mode = 'PROCESS_FAILED';
                    // TODO : Handle Error here!
                });

                $scope.$on('$destroy', listenerCBAPaymentFailure);
                $scope.$on('$destroy', listenerCBAPaymentSuccess);
                $scope.$on('$destroy', listenerUpdateErrorMessage);
            }

            $scope.reTryCardSwipe = function() {
                $scope.mode = 'PROCESS_IN_PROGRESS';
                if ($scope.zestStationData.paymentGateway === 'CBA' && $scope.isIpad) {
                    makeCBAPayment();
                } else {
                    $scope.mode = 'PROCESS_FAILED';
                }
            };

            (function() {
                $log.info('init...');

                var params = zsPaymentSrv.getPaymentData();

                $scope.balanceDue = params.amount;

                if ($scope.zestStationData.paymentGateway === 'CBA' && $scope.isIpad) {
                    initiateCBAlisteners();
                    $scope.mode = 'PROCESS_IN_PROGRESS';
                    $timeout(function() {
                        makeCBAPayment();
                    }, 1000);
                } else {
                    $scope.mode = 'PROCESS_FAILED';
                }
            })();
        }
    ]);
