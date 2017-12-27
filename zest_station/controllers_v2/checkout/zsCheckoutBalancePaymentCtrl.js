angular.module('sntZestStation').controller('zsCheckoutBalancePaymentCtrl', ['$scope', '$log', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$timeout', '$controller',
    function($scope, $log, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $timeout, $controller) {


        $controller('zsPaymentCtrl', {
            $scope: $scope
        });

        // uncomment for debugging
        $scope.isIpad = true;


        $scope.$on('PAYMENT_SUCCESS', function() {
            $state.go('zest_station.checkoutReservationBill', angular.extend(zsStateHelperSrv.getPreviousStateParams(), {
                dueBalancePaid: true
            }));
        });

        (function() {
            $log.info('init...');

            var params = zsPaymentSrv.getPaymentData();

            $scope.balanceDue = params.amount;

            if ($scope.zestStationData.paymentGateway === 'CBA' && $scope.isIpad) {
                $scope.initiateCBAlisteners();
                $scope.screeMode.value = 'PROCESS_IN_PROGRESS';
                $timeout(function() {
                    $scope.makeCBAPayment();
                }, 1000);
            } else {
                $scope.screeMode.value = 'PROCESS_FAILED';
            }
        })();
    }
]);