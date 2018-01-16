angular.module('sntZestStation').controller('zsCheckoutBalancePaymentCtrl', ['$scope', '$log', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$timeout', '$controller',
    function($scope, $log, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $timeout, $controller) {


        $controller('zsPaymentCtrl', {
            $scope: $scope
        });

        // uncomment for debugging
        // $scope.isIpad = true;

        $scope.goToNextScreen = function() {
            $state.go('zest_station.checkoutReservationBill', angular.extend(zsStateHelperSrv.getPreviousStateParams(), {
                dueBalancePaid: true
            }));
        };


        $scope.$on('PAYMENT_SUCCESS', function() {
            $scope.screenMode.value = 'PAYMENT_SUCCESS';
        });

        var startCBAPayment = function() {
            if ($scope.isIpad) {
                $timeout(function() {
                    $scope.makeCBAPayment();
                }, 3000);
            } else {
                $scope.$emit('showLoader');
                $timeout(function() {
                    $scope.$emit('hideLoader');
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                    $scope.screenMode.errorMessage = 'Use Zest station from an iPad';
                }, 2000);
            }
        };

        $scope.payUsingNewCard = function() {
            $scope.screenMode.value = 'PAYMENT_IN_PROGRESS';
            if ($scope.zestStationData.paymentGateway === 'CBA' && $scope.isIpad) {
                startCBAPayment();
            } else if ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.mliEmvEnabled) {
                $scope.proceedWithEMVPayment();
            } else {
                $scope.$emit('showLoader');
                $timeout(function() {
                    $scope.$emit('hideLoader');
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                    $scope.screenMode.errorMessage = ($scope.zestStationData.paymentGateway === 'CBA') ? 'Use Zest station from an iPad' : '';
                }, 2000);
            }
        };

        $scope.reTryCardSwipe = function() {
             $scope.payUsingNewCard();
        };

        (function() {
            $log.info('init...');

            var paymentParams = zsPaymentSrv.getPaymentData();

            $scope.balanceDue = paymentParams.amount;
            $scope.cardDetails = paymentParams.payment_details;
            $scope.reservation_id = paymentParams.reservation_id;
            // check if  card is present, if so show two options
            if ($scope.zestStationData.paymentGateway !== 'CBA' && paymentParams.payment_details.card_number && paymentParams.payment_details.card_number.length) {
                $scope.screenMode.value = 'SELECT_PAYMENT_METHOD';
            } else if ($scope.zestStationData.paymentGateway === 'CBA' && $scope.isIpad) {
                $scope.initiateCBAlisteners();
                startCBAPayment();
            } else {
                $scope.screenMode.value = 'PAYMENT_FAILED';
            }
        })();
    }
]);