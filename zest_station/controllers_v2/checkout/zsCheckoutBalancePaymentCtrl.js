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

        $scope.reTryCardSwipe = function() {
            if ($scope.screenMode.isUsingExistingCardPayment) {
                $scope.screenMode.value = 'SELECT_PAYMENT_METHOD';
            } else {
                $scope.payUsingNewCard();
                $scope.resetTime();
            }
        };

        (function() {
            $log.info('init...');

            var paymentParams = zsPaymentSrv.getPaymentData();

            $scope.balanceDue = paymentParams.amount;
            $scope.cardDetails = paymentParams.payment_details;
            $scope.reservation_id = paymentParams.reservation_id;
            
            if ($scope.zestStationData.paymentGateway !== 'CBA') {
                // check if  card is present, if so show two options
                if (paymentParams.payment_details && paymentParams.payment_details.card_number && paymentParams.payment_details.card_number.length) {
                    $scope.screenMode.value = 'SELECT_PAYMENT_METHOD';
                } else {
                    // no CC on File
                    $scope.payUsingNewCard();
                }
            }
            else if ($scope.zestStationData.paymentGateway === 'CBA' && $scope.isIpad) {
                // for CBA always use new payment method
                $scope.initiateCBAlisteners();
                $scope.startCBAPayment();
            } else {
                $scope.screenMode.value = 'PAYMENT_FAILED';
            }

            if ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.ccReader === 'websocket') {
                $scope.listenUserActivity();
            }
        })();
    }
]);