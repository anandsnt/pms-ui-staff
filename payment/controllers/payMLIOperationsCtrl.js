angular.module('sntPay').controller('payMLIOperationsController',
    ['$scope', 'sntPaymentSrv', 'paymentAppEventConstants', 'paymentUtilSrv', 'paymentConstants', '$timeout', '$log',
        function($scope, sntPaymentSrv, payEvntConst, util, paymentConstants, $timeout, $log) {

            /**
             * variable to keep track swiped & data coming from swipe
             */
            var isSwiped;
            var swipedCCData;

            /**
             * to initialize the carda
             * @return undefined
             */
            var initializeCardData = () => {
                isSwiped = false;
                swipedCCData = {};
                $scope.cardData = {
                    cardNumber: '',
                    CCV: '',
                    expiryMonth: '',
                    expiryYear: '',
                    nameOnCard: ''
                };
            };

            /**
             * for processing the request from other areas to clear card details
             * @return {undefined}
             */
            var resetCardEventHandler =
                $scope.$on(payEvntConst.RESET_CARD_DETAILS, () => initializeCardData);

            /**
             * [notifyParent description]
             * @param  {[type]} tokenDetails [description]
             * @return {[type]}              [description]
             */
            var notifyParent = function(tokenDetails) {
                var paymentData = util.formCCTokenGeneratedParams({...$scope.cardData, ...tokenDetails});

                $scope.$emit(payEvntConst.CC_TOKEN_GENERATED, {
                    paymentData,
                    tokenDetails,
                    cardData: $scope.cardData
                });
            };

            /**
             * [notifyParentError description]
             * @param  {[type]} errorMessage [description]
             * @return {[type]}              [description]
             */
            var notifyParentError = function(errorMessage) {
                console.error(errorMessage);
                $scope.$emit(payEvntConst.PAYMENTAPP_ERROR_OCCURED, errorMessage);
            };

            /**
             * [doSwipedCardActions description]
             * @param  {[type]} swipedCardData [description]
             * @return {[type]}                [description]
             */
            var doSwipedCardActions = function(swipedCardData) {
                var swipedCardDataToSave = new SwipeOperation().createSWipedDataToSave(swipedCardData);

                var paymentData = util.formCCTokenGeneratedParams({
                    ...$scope.cardData,
                    ...swipedCardData,
                    ...swipedCardDataToSave
                });

                $scope.$emit(payEvntConst.CC_TOKEN_GENERATED, {
                    paymentData,
                    cardData: $scope.cardData,
                    tokenDetails: swipedCardData
                });
            };

            /**
             * [description]
             * @param  {[type]} response [description]
             * @return {[type]}          [description]
             */
            var successCallBackOfGetMLIToken = (response) => {
                $scope.$emit("hideLoader");
                notifyParent(response)
            };

            /**
             * [description]
             * @param  {[type]} error [description]
             * @return {[type]}       [description]
             */
            var failureCallBackOfGetMLIToken = (error) => {
                $scope.$emit("hideLoader");
                notifyParentError(error);
            };

            /*
             * Function to get MLI token on click 'Add' button in form
             */
            $scope.getMLIToken = function($event) {
                $event.preventDefault();

                // if swiped data is present
                if (isSwiped) {
                    doSwipedCardActions(swipedCCData);
                    return;
                }

                var params = util.formParamsForFetchingTheToken($scope.cardData);

                $scope.$emit("showLoader");
                sntPaymentSrv.fetchMLIToken(params, successCallBackOfGetMLIToken, failureCallBackOfGetMLIToken);
            };

            var renderDataFromSwipe = function(event, swipedCardData) {
                isSwiped = true;
                swipedCCData = swipedCardData;
                $scope.cardData.cardNumber = swipedCardData.cardNumber;
                $scope.cardData.nameOnCard = swipedCardData.nameOnCard;
                $scope.cardData.expiryMonth = swipedCardData.cardExpiryMonth;
                $scope.cardData.expiryYear = swipedCardData.cardExpiryYear;
                $scope.cardData.cardType = swipedCardData.cardType;
                $scope.payment.screenMode = "CARD_ADD_MODE";
                $scope.payment.addCCMode = "ADD_CARD";
            };

            $scope.$on("RENDER_SWIPED_DATA", function(e, data) {
                renderDataFromSwipe(e, data);
            });

            var proceedChipAndPinPayment = function(params) {
                // we need to notify the parent controllers to show loader
                // as this is an external directive

                $scope.$emit("SHOW_SIX_PAY_LOADER");
                sntPaymentSrv.submitPaymentForChipAndPin(params).then(
                    response => {
                        $log.info("payment success" + $scope.payment.amount);
                        response.amountPaid = $scope.payment.amount;
                        response.authorizationCode = response.authorization_code;

                        var cardType = (response.payment_method && response.payment_method.card_type) || "";

                        // NOTE: The feePaid key and value would be sent IFF a fee was applied along with the payment
                        if ($scope.feeData) {
                            response.feePaid = $scope.feeData.calculatedFee;
                        }

                        $scope.selectedCC = $scope.selectedCC || {};

                        if (response.payment_method) {
                            $scope.selectedCC.value = response.payment_method.id;
                            $scope.selectedCC.card_code = cardType.toLowerCase();
                            $scope.selectedCC.ending_with = response.payment_method.ending_with;
                            $scope.selectedCC.expiry_date = response.payment_method.expiry_date;
                        }

                        response.cc_details = angular.copy($scope.selectedCC);

                        if ($scope.payment.showAddToGuestCard) {
                            // check if add to guest card was selected
                            response.add_to_guest_card = $scope.payment.addToGuestCardSelected;
                        }
                        $scope.$emit("HIDE_SIX_PAY_LOADER");

                        $timeout(()=> {
                            $scope.onPaymentSuccess(response);
                        }, 700);

                    },
                    errorMessage => {
                        $log.info("payment failed" + errorMessage);
                        $scope.$emit('PAYMENT_FAILED', errorMessage);
                        $scope.$emit("HIDE_SIX_PAY_LOADER");
                    });
            };

            $scope.$on('INITIATE_CHIP_AND_PIN_PAYMENT', function(event, data) {
                var paymentParams = data;

                paymentParams.postData.is_emv_request = true;
                paymentParams.postData.workstation_id = $scope.hotelConfig.workstationId;
                paymentParams.emvTimeout = parseInt($scope.hotelConfig.emvTimeout);
                proceedChipAndPinPayment(data);
            });



            // when destroying we have to remove the attached '$on' events
            $scope.$on('destroy', resetCardEventHandler);

            /** **************** init ***********************************************/

            (function() {
                initializeCardData();

                $scope.modes = paymentConstants.modes;

                try {
                    // to set your merchant ID provided by Payment Gateway
                    HostedForm.setMerchant($scope.hotelConfig.mliMerchantId);
                } catch (e) {
                    //
                }

            })();

        }]);
