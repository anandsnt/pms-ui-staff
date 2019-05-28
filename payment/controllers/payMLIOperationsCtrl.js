angular.module('sntPay').controller('payMLIOperationsController',
    ['$scope', 'sntPaymentSrv', 'paymentAppEventConstants', 'paymentUtilSrv',
        'paymentConstants', '$timeout', '$log', 'sntActivity',
        function ($scope, sntPaymentSrv, payEvntConst, util,
                  paymentConstants, $timeout, $log, sntActivity) {

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
            var notifyParent = function (tokenDetails) {
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
            var notifyParentError = function (errorMessage) {
                $log.error(errorMessage);
                $scope.$emit(payEvntConst.PAYMENTAPP_ERROR_OCCURED, errorMessage);
            };

            /**
             * [doSwipedCardActions description]
             * @param  {[type]} swipedCardData [description]
             * @return {[type]}                [description]
             */
            var doSwipedCardActions = function (swipedCardData) {
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
                notifyParent(response);
                sntActivity.stop('FETCH_MLI_TOKEN');
            };

            /**
             * [description]
             * @param  {[type]} error [description]
             * @return {[type]}       [description]
             */
            var failureCallBackOfGetMLIToken = (error) => {
                notifyParentError(error);
                sntActivity.stop('FETCH_MLI_TOKEN');
            };

            var renderDataFromSwipe = function (event, swipedCardData) {
                // Discard swipe actions incase of CBA + MLI and if the action is PAYMENT
                if ($scope.hotelConfig.paymentGateway === 'CBA_AND_MLI' && !$scope.payment.isAddPaymentMode) {
                    var errorMessage = ['Wrong Device ! Please use the CBA device to proceed with the payment action'];
                    
                    $scope.$emit(payEvntConst.PAYMENTAPP_ERROR_OCCURED, errorMessage);
                    return;
                }
                isSwiped = true;
                if ($scope.hotelConfig.isEMVEnabled) {
                    $scope.payment.isManualEntryInsideIFrame = true;
                    $scope.toggleManualIframe();
                }
                swipedCCData = swipedCardData;
                $scope.cardData.cardNumber = swipedCardData.cardNumber;
                $scope.cardData.nameOnCard = swipedCardData.nameOnCard;
                $scope.cardData.expiryMonth = swipedCardData.cardExpiryMonth;
                $scope.cardData.expiryYear = swipedCardData.cardExpiryYear;
                $scope.cardData.cardType = swipedCardData.cardType;
                $scope.payment.screenMode = 'CARD_ADD_MODE';
                $scope.payment.addCCMode = 'ADD_CARD';
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            var tokenize = function (params) {
                $scope.$emit('SHOW_SIX_PAY_LOADER');
                sntPaymentSrv.getSixPaymentToken(params).then(
                    response => {
                        /**
                         * The response here is expected to be of the following format
                         * {
                         *  card_type: "VX",
                         *  ending_with: "0088",
                         *  expiry_date: "1217"
                         *  payment_method_id: 35102,
                         *  token: "123465498745316854",
                         *  is_swiped: true
                         * }
                         *
                         * NOTE: In case the request params sends add_to_guest_card: true AND guest_id w/o reservation_id
                         * The API response has guest_payment_method_id instead of payment_method_id
                         */

                        var cardType = response.card_type || '';

                        $scope.$emit('SUCCESS_LINK_PAYMENT', {
                            response: {
                                id: response.payment_method_id || response.guest_payment_method_id,
                                guest_payment_method_id: response.guest_payment_method_id,
                                payment_name: 'CC',
                                usedEMV: true,
                                addToGuestCard: $scope.payment.addToGuestCardSelected
                            },
                            selectedPaymentType: $scope.selectedPaymentType || 'CC',
                            cardDetails: {
                                'card_code': cardType.toLowerCase(),
                                'ending_with': response.ending_with,
                                'expiry_date': response.expiry_date,
                                'card_name': '',
                                'is_swiped': response.is_swiped
                            }
                        });

                        $scope.$emit('HIDE_SIX_PAY_LOADER');
                    },
                    errorMessage => {
                        $log.info('Tokenization Failed');
                        $scope.$emit('PAYMENT_FAILED', errorMessage);
                        $scope.$emit('HIDE_SIX_PAY_LOADER');
                    }
                );
            };

            var proceedChipAndPinPayment = function (params) {
                // we need to notify the parent controllers to show loader
                // as this is an external directive

                $scope.$emit('SHOW_SIX_PAY_LOADER');
                sntPaymentSrv.submitPaymentForChipAndPin(params).then(
                    response => {
                        $log.info('payment success' + $scope.payment.amount);
                        response.amountPaid = $scope.payment.amount;
                        response.authorizationCode = response.authorization_code;

                        var cardType = (response.payment_method && response.payment_method.card_type) || '';

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
                        $scope.$emit('HIDE_SIX_PAY_LOADER');

                        $timeout(() => {
                            $scope.onPaymentSuccess(response);
                        }, 700);

                    },
                    errorMessage => {
                        $log.info('payment failed' + errorMessage);
                        $scope.$emit('PAYMENT_FAILED', errorMessage);
                        $scope.$emit('HIDE_SIX_PAY_LOADER');
                    });
            };

            /**
             * Function to get MLI token on click 'Add' button in form
             * @param {Event} $event Angular event
             * @return {undefined}
             */
            $scope.getMLIToken = function ($event) {
                $event.preventDefault();

                // if swiped data is present
                if (isSwiped) {
                    doSwipedCardActions(swipedCCData);
                    return;
                }

                var params = util.formParamsForFetchingTheToken($scope.cardData);

                sntActivity.start('FETCH_MLI_TOKEN');
                sntPaymentSrv.fetchMLIToken(params, successCallBackOfGetMLIToken, failureCallBackOfGetMLIToken);
            };

            $scope.$on('RENDER_SWIPED_DATA', function (e, data) {
                renderDataFromSwipe(e, data);
            });

            $scope.$on('INITIATE_CHIP_AND_PIN_PAYMENT', function (event, data) {
                var paymentParams = data;

                paymentParams.postData.is_emv_request = true;
                paymentParams.postData.workstation_id = $scope.hotelConfig.workstationId;
                paymentParams.emvTimeout = parseInt($scope.hotelConfig.emvTimeout);
                proceedChipAndPinPayment(data);
            });

            $scope.$on('INITIATE_CHIP_AND_PIN_TOKENIZATION', function (event, data) {
                var paymentParams = data;

                paymentParams.is_emv_request = true;
                paymentParams.emvTimeout = parseInt($scope.hotelConfig.emvTimeout);
                tokenize(data);
            });


            // when destroying we have to remove the attached '$on' events
            $scope.$on('destroy', resetCardEventHandler);


            var mockSwipeAction = () => {
                $scope.selectedPaymentType = 'CC';
                renderDataFromSwipe({}, sntPaymentSrv.sampleMLISwipedCardResponse);
            };

            // To Mock MLI swipe - 
            // Once payment screen is loaded, 
            // In browser console call document.dispatchEvent(new Event('MOCK_MLI_SWIPE')) 

            document.addEventListener('MOCK_MLI_SWIPE', () => {
                $scope.$emit('showLoader');
                $timeout(() => {
                    $scope.$emit('hideLoader');
                    mockSwipeAction();
                }, 1000);
            });

            /** **************** init ***********************************************/

            (function () {
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
