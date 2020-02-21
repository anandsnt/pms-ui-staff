angular.module('sntZestStation').controller('zsCheckoutBalancePaymentCtrl', ['$scope', '$log', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$timeout', '$controller', 'zsEventConstants', '$translate',
    function($scope, $log, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $timeout, $controller, zsEventConstants, $translate) {


        $controller('zsPaymentCtrl', {
            $scope: $scope
        });

        // uncomment for debugging
        // $scope.isIpad = true;

        var goToNextState = function () {
            $state.go('zest_station.checkoutReservationBill', angular.extend(zsStateHelperSrv.getPreviousStateParams(), {
                dueBalancePaid: true
            }));
        };

        var sendPaymentReceipt = function () {
            var paymentParams = zsPaymentSrv.getPaymentData();

            var apiParams = {
                transaction_id: paymentParams.transaction_id,
                bill_id: paymentParams.bill_id,
                email: $scope.reservationData.email,
                locale: $translate.use()
            };

            var options = {
                params: apiParams,
                successCallBack: goToNextState,
                failureCallBack: goToNextState
            };

            $scope.callAPI(zsPaymentSrv.sendPaymentReceipt, options);
        };

        $scope.$on('EMAIL_UPDATION_SUCCESS', function() {
            zsStateHelperSrv.setPreviousStateParams($scope.reservationData);
            sendPaymentReceipt();
        });
        $scope.goToNextScreen = function() {
            var sendPaymentReceiptOn =  $scope.zestStationData.hotelSettings.auto_email_pay_receipt;
            var emailPresent = $scope.reservationData.email;

            if (sendPaymentReceiptOn && emailPresent) {
                sendPaymentReceipt();
            } else if (sendPaymentReceiptOn && !emailPresent) {
                $scope.screenMode.value = 'ENTER_EMAIL';
                // mode inside the directive
                $scope.mode = 'EMAIL_ENTRY_MODE';
            }
            else {
                goToNextState();
            }
            
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
            $scope.reservationData = zsStateHelperSrv.getPreviousStateParams();

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