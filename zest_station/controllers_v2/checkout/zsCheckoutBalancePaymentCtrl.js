angular.module('sntZestStation').controller('zsCheckoutBalancePaymentCtrl', ['$scope', '$log', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$timeout', '$controller',
    function($scope, $log, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $timeout, $controller) {


        $controller('zsPaymentCtrl', {
            $scope: $scope
        });

        // uncomment for debugging
        $scope.isIpad = true;

        $scope.goToNextScreen = function(){
            $state.go('zest_station.checkoutReservationBill', angular.extend(zsStateHelperSrv.getPreviousStateParams(), {
                dueBalancePaid: true
            }));
        };


        $scope.$on('PAYMENT_SUCCESS', function() {
            $scope.screenMode.value = 'PAYMENT_SUCCESS';
        });

        var startCBAPayment = function(){
            if ($scope.isIpad) {
                $scope.screenMode.value = 'PAYMENT_IN_PROGRESS';
                $timeout(function() {
                    $scope.makeCBAPayment();
                }, 1000);
            } else {
                $scope.$emit('showLoader');
                $scope.screenMode.value = 'PAYMENT_IN_PROGRESS';
                $timeout(function() {
                   $scope.$emit('hideLoader');
                   $scope.screenMode.value = 'PAYMENT_FAILED';
                   $scope.screenMode.errorMessage = 'Use Zest station from an iPad';
                }, 2000);
            }
        };


        $scope.payUsingNewCard = function(){
           startCBAPayment();
        };

        $scope.payUsingExistingCard = function(){
            console.log('will be done later');
        };

        (function() {
            $log.info('init...');

            var paymentParams = zsPaymentSrv.getPaymentData();

            $scope.balanceDue = paymentParams.amount;

            if ($scope.zestStationData.paymentGateway === 'CBA') {
                $scope.initiateCBAlisteners();

                var isCCPresent = true;
                $scope.cardDetails = paymentParams.payment_details;

                if(isCCPresent){
                    $scope.screenMode.value = 'SELECT_PAYMENT_METHOD';
                } else{
                    startCBAPayment();
                }
              
            } else {
                $scope.screenMode.value = 'PAYMENT_FAILED';
            }
        })();
    }
]);