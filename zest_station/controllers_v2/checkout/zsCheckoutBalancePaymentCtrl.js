angular.module('sntZestStation').controller('zsCheckoutBalancePaymentCtrl', ['$scope', '$log', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$timeout', '$controller', 'zsEventConstants',
    function($scope, $log, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $timeout, $controller, zsEventConstants) {


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


        $scope.$on('RESET_TIMER', function() {
            $scope.resetTime();
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
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            $scope.screenMode.paymentAction = 'PAY_AMOUNT';
            var paymentParams = zsPaymentSrv.getPaymentData();

            $scope.balanceDue = parseFloat(paymentParams.amount);
            $scope.cardDetails = paymentParams.payment_details;
            $scope.reservation_id = paymentParams.reservation_id;

            if (($scope.zestStationData.paymentGateway === 'CBA' || ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.hotelSettings.mli_cba_enabled)) && $scope.isIpad) {
                // for CBA always use new payment method
                $scope.initiateCBAlisteners();
                $scope.startCBAPayment();
            } else if ($scope.zestStationData.paymentGateway !== 'CBA') {
                // check if  card is present, if so show two options
                if (paymentParams.payment_details && paymentParams.payment_details.card_number && paymentParams.payment_details.card_number.length) {
                    $scope.screenMode.value = 'SELECT_PAYMENT_METHOD';
                } else {
                    // no CC on File
                    $scope.payUsingNewCard();
                }
            } else {
                $scope.screenMode.value = 'PAYMENT_FAILED';
            }

        })();
    }
]);