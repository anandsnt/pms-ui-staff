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

        $scope.reTryCardSwipe = function() {
            if ($scope.screenMode.isUsingExistingCardPayment) {
                $scope.screenMode.value = 'SELECT_PAYMENT_METHOD';
            } else {
                $scope.payUsingNewCard();
                $scope.resetTime();
            }
        };

        $scope.$on('FETCH_PAYMENT_TYPES_COMPLETED', function() {
            // for CBA always use new payment method
            $scope.initiateCBAlisteners();
            $scope.startCBAPayment();
        });

        (function() {
            $log.info('init...');
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            $scope.screenMode.paymentAction = 'PAY_AMOUNT';
            var paymentParams = zsPaymentSrv.getPaymentData();

            paymentParams.amount = paymentParams.amount.replace (/,/g, "");
            $scope.cardDetails = paymentParams.payment_details;
            $scope.reservation_id = paymentParams.reservation_id;
            $scope.isCBAPayment = $scope.zestStationData.paymentGateway === 'CBA' || ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.hotelSettings.mli_cba_enabled);

            if ($scope.isCBAPayment && $scope.isIpad) {
                $scope.$emit("FETCH_PAYMENT_TYPES", {
                    paymentTypeName: 'CBA',
                    amountToPay: parseFloat(paymentParams.amount)
                });
            } else if ($scope.zestStationData.paymentGateway !== 'CBA') {
                $scope.screenMode.totalAmountPlusFees = parseFloat(paymentParams.amount);
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