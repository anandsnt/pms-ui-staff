angular.module('sntPay').controller('sntPaymentController',
    ['$scope', 'sntPaymentSrv', 'paymentAppEventConstants', '$location', 'PAYMENT_CONFIG',
        '$rootScope', '$timeout', 'ngDialog', '$filter', '$state', 'sntActivity', 'rvPermissionSrv',
        function ($scope, sntPaymentSrv, payEvntConst, $location, PAYMENT_CONFIG,
                  $rootScope, $timeout, ngDialog, $filter, $state, sntActivity, rvPermissionSrv) {
            // ---------------------------------------------------------------------------------------------------------
            var timeOutForScrollerRefresh = 300,
                initialPaymentAmount = 0,
                defaultScrollerOptions = {
                    snap: false,
                    scrollbars: 'custom',
                    hideScrollbar: false,
                    click: false,
                    scrollX: false,
                    scrollY: true,
                    preventDefault: true,
                    interactiveScrollbars: true,
                    preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/}
                },
                isEMVEnabled;
            var isInIpadApp = sntapp.browser === 'rv_native' && sntapp.cordovaLoaded;

            // ---------------------------------------------------------------------------------------------------------
            $scope.payment = {
                referenceText: $scope.referenceText,
                amount: 0,
                isRateSuppressed: false,
                isEditable: false,
                addToGuestCard: false,
                billNumber: 1,
                linkedCreditCards: [],
                MLImerchantId: '',
                creditCardTypes: [],
                showAddToGuestCard: false,
                addToGuestCardSelected: false,
                allocatePaymentAfterPosting: false,
                guestFirstName: '',
                guestLastName: '',
                isManualEntryInsideIFrame: false,
                workstationId: '',
                emvTimeout: 120,
                isConfirmedDBpayment: false
            };

            $scope.giftCard = {
                number: '',
                amountAvailable: false,
                availableBalance: null
            };

            $scope.errorMessage = '';

            // For some payment gateways, we might need to hide some payment types
            // conditionally. For eg:- Hide Credit card payment type for CBA + MLI payments
            // and hide CBA - Credit card for CBA + MLI card additions
            $scope.$on('REMOVE_PAYMENT_TYPE', function(ev, data) {
                $scope.paymentTypes = _.without($scope.paymentTypes, _.findWhere($scope.paymentTypes, {
                    name: data.paymentType
                }));
            });

            // ---------------------------------------------------------------------------------------------------------
            /**
             *
             * @param {{Object}} payLoad Object to be parsed to the API request
             * @return {{postData: {bill_number: (number|*|string), payment_type: (string|string|string),
             * amount: string, is_split_payment: (*|boolean), workstation_id: (string|string|*)}, reservation_id:
             * (*|string), bill_id: (*|string)}} API Request payload
             */
            function initiateSubmitPaymentParams(payLoad) {
                var params;

                payLoad = payLoad || {};
                // set up params for API
                params = {
                    'postData': {
                        ...payLoad,
                        'bill_number': $scope.billNumber,
                        'payment_type': $scope.selectedPaymentType,
                        'amount': $scope.payment.amount.toString().replace(/,/g, ''),
                        'is_split_payment': $scope.splitBillEnabled && $scope.numSplits > 1,
                        'workstation_id': $scope.hotelConfig.workstationId
                    },
                    'reservation_id': $scope.reservationId,
                    'bill_id': $scope.billId
                };

                // We need extra parameter parent ar id during AR refund
                if ($scope.actionType === 'AR_REFUND_PAYMENT') {
                    params.postData.parent_ar_id = $scope.arTransactionId;
                }

                if ($scope.payment.showAddToGuestCard) {
                    // check if add to guest card was selected
                    params.postData.add_to_guest_card = $scope.payment.addToGuestCardSelected;
                }

                if ($scope.feeData && $scope.feeData.showFee) {
                    // if fee was calculated wrt to payment type
                    params.postData.fees_amount = $scope.feeData.calculatedFee;
                    params.postData.fees_charge_code_id = $scope.feeData.feeChargeCode;
                    params.postData.total_value_plus_fees = $scope.feeData.totalOfValueAndFee;
                }

                if ($scope.isDisplayRef) {
                    // if reference text is presernt for the payment type
                    params.postData.reference_text = $scope.payment.referenceText;
                }

                if ($scope.reservationIds) {
                    params.postData.reservation_ids = $scope.reservationIds;
                }

                // CICO-43933
                if ($scope.selectedCC && $scope.selectedCC.params) {
                    params.postData = {
                        ...$scope.selectedCC.params,
                        ...params.postData
                    };
                }

                return params;
            }

            /**
             *
             * @param {String} key key
             * @param {{Object}} scrollerOptions scrollerOptions
             * @returns {{undefined}} undefined
             */
            function setScroller(key, scrollerOptions) {
                var tempScrollerOptions,
                    isEmptyParentScrollerOptions;

                scrollerOptions = scrollerOptions || {};
                // we are merging the settings provided in the function call with defaults
                tempScrollerOptions = angular.copy(defaultScrollerOptions);
                angular.extend(tempScrollerOptions, scrollerOptions); // here is using a angular function to extend,
                scrollerOptions = tempScrollerOptions;
                // checking whether scroll options object is already initilised in parent controller
                // if so we need add a key, otherwise initialise and add
                isEmptyParentScrollerOptions = isEmptyObject($scope.myScrollOptions);
                if (isEmptyParentScrollerOptions) {
                    $scope.myScrollOptions = {};
                }

                // CICO-48381
                if (isInIpadApp) {
                    scrollerOptions.click = false;
                    scrollerOptions.tap = true;
                    scrollerOptions.preventDefault = false;
                    scrollerOptions.deceleration =  0.0001;
                }

                $scope.myScrollOptions[key] = scrollerOptions;
            }

            /**
             *
             * @param {{String}} key key
             * @returns {{undefined}} undefined
             */
            function refreshScroller(key) {
                setTimeout(function () {
                    if (!!$scope.$parent && $scope.$parent.myScroll) {
                        if (key in $scope.$parent.myScroll) {
                            $scope.$parent.myScroll[key].refresh();
                        }
                    }
                    if ($scope.hasOwnProperty('myScroll') && key in $scope.myScroll) {
                        $scope.myScroll[key].refresh();
                    }
                }, timeOutForScrollerRefresh);
            }

            /**
             * @returns {{undefined}} undefined
             */
            function setEditableFlag() {
                if ($scope.isEditable !== false) {
                    $scope.payment.isEditable = true;
                }
            }

            /**
             *
             * @return {boolean} If card selection is not available for the payment gateway configured
             */
            function isCardSelectionDisabled() {
                // For CBA payments, we have to always use a new card
                let isCBAMLIPayment = $scope.hotelConfig.paymentGateway === 'CBA_AND_MLI';

                return !!PAYMENT_CONFIG[$scope.hotelConfig.paymentGateway].disableCardSelection || (isCBAMLIPayment && !$scope.payment.isAddCardAction);
            }

            /**
             *
             * @param {{String}} errorMessage errorMessage
             * @returns {{undefined}} undefined
             */
            function handlePaymentError(errorMessage) {
                $timeout(() => {
                    $scope.paymentAttempted = true;
                    $scope.isPaymentFailure = true;
                    $scope.paymentErrorMessage = errorMessage[0];
                    $scope.$emit('PAYMENT_FAILED', errorMessage);
                    sntActivity.stop('SUBMIT_PAYMENT');
                    $scope.$emit('hideLoader');
                }, 300);
            }

            /**
             *
             * @param {{String}} errorMessage errorMessage
             * @returns {{undefined}} undefined
             */
            function updateErrorMessage(errorMessage) {
                $scope.paymentErrorMessage = '';
                $timeout(() => {
                    $scope.paymentErrorMessage = errorMessage;
                    $scope.$emit('PAYMENT_FAILED', [errorMessage]);
                    $scope.$emit('hideLoader');
                }, 300);
            }

            /**
             *
             * @returns {{undefined}} undefined
             */
            function initiateCBAlisteners() {
                var listenerCBAPaymentFailure = $scope.$on('CBA_PAYMENT_FAILED', (event, errorMessage) => {
                    handlePaymentError(errorMessage);
                });
                var listenerCBAPaymentSuccess = $scope.$on('CBA_PAYMENT_SUCCESS', (event, response) => {
                    var params = initiateSubmitPaymentParams();

                    // we need to notify the parent controllers to show loader
                    // as this is an external directive
                    sntActivity.start('SUBMIT_PAYMENT');
                    params.postData.payment_type_id = response.payment_method_id;
                    params.postData.credit_card_transaction_id = response.id;
                    sntPaymentSrv.submitPayment(params).then(
                        response => {
                            $scope.onPaymentSuccess(response);
                            sntActivity.stop('SUBMIT_PAYMENT');
                        },
                        errorMessage => {
                            handlePaymentError(errorMessage);
                        }
                    );
                });

                var listenerUpdateErrorMessage = $rootScope.$on('UPDATE_NOTIFICATION', (event, response) => {
                    updateErrorMessage(response);
                });

                $scope.$on('$destroy', listenerCBAPaymentFailure);
                $scope.$on('$destroy', listenerCBAPaymentSuccess);
                $scope.$on('$destroy', listenerUpdateErrorMessage);
            }

            /**
             *
             * @returns {{undefined}} undefined
             */
            function initiateSHIJIListeners() {
                var listenerSHIJIPaymentFailure = $scope.$on('SHIJI_PAYMENT_FAILED', (event, errorMessage) => {
                    handlePaymentError(errorMessage);
                });

                var listenerSHIJIPaymentSuccess = $scope.$on('SHIJI_PAYMENT_SUCCESS', (event, response) => {
                    $scope.onPaymentSuccess(response);
                });

                $scope.$on('$destroy', listenerSHIJIPaymentFailure);
                $scope.$on('$destroy', listenerSHIJIPaymentSuccess);
            }

            /**
             * Method to check if the gift card balance is less than the amount to be paid
             * @returns {boolean} boolean
             */
            $scope.isGCBalanceShort = function () {
                var payableAmount;

                if ($scope.selectedPaymentType !== 'GIFT_CARD') {
                    return false;
                }

                payableAmount = parseFloat($scope.payment.amount);

                if ($scope.feeData) {
                    payableAmount = parseFloat($scope.feeData.totalOfValueAndFee);
                }
                // https:// stayntouch.atlassian.net/browse/CICO-34115?focusedCommentId=93132
                // &page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-93132
                return payableAmount < 0 || //  NOTE : We can't make a negative payment with a GIFT_CARD
                    $scope.giftCard.availableBalance && parseFloat($scope.giftCard.availableBalance) < payableAmount;
            };

            /**
             * Hide payment method if there is no permission or no payment type
             * @returns {boolean} boolean
             */
            $scope.shouldHidePaymentButton = function () {
                return !$scope.selectedPaymentType || !$scope.hasPermission ||
                    $scope.isGCBalanceShort() ||
                    (!$scope.splitBillEnabled && $scope.paymentAttempted && !$scope.isPaymentFailure);
            };

            /**
             *
             * @returns {boolean} boolean
             */
            $scope.showSelectedCard = function () {
                var config = $scope.hotelConfig;
                var isCCPresent = $scope.selectedPaymentType === 'CC' &&
                    (!!$scope.selectedCC && (!!$scope.selectedCC.ending_with || !!$scope.selectedCC.card_number));
                var isManualEntry = isEMVEnabled && $scope.payment.isManualEntryInsideIFrame;
                // For CBA payments, we have to always use a new card
                var isCBAMLIPayment = $scope.hotelConfig.paymentGateway === 'CBA_AND_MLI' && !$scope.payment.isAddPaymentMode;

                return !isCardSelectionDisabled() && (isCCPresent && $scope.payment.screenMode === 'PAYMENT_MODE' &&
                    (isManualEntry || !isEMVEnabled)) && !isCBAMLIPayment;
            };

            /**
             * show add to guest card checkbox to add the card to the guestcard
             * @returns {undefined} undefined
             */
            function showAddtoGuestCardBox() {
                $scope.payment.showAddToGuestCard = !!$scope.reservationId;
            }

            /**
             * check if there are existing cards to be shown in list
             * @returns {boolean} boolean
             */
            function existingCardsPresent() {
                return $scope.payment.linkedCreditCards.length > 0;
            }

            /**
             * change screen mode to collect CC info
             * @returns {undefined} undefined
             */
            function changeToCardAddMode() {
                $scope.payment.screenMode = 'CARD_ADD_MODE';
                $scope.payment.addCCMode = existingCardsPresent() && !$scope.swipedCardData ? 'EXISTING_CARDS' : 'ADD_CARD';
                $scope.$broadcast('RESET_CARD_DETAILS');
                refreshScroller('cardsList');
            }

            /**
             *  we need to refresh iframe each time,
             *  as we don't have direct control over the fields on it
             *  @returns {undefined} undefined
             */
            function refreshIFrame() {
                var iFrame;

                // in case of hotel with MLI iframe will not be present
                if ($scope.hotelConfig.paymentGateway === 'sixpayments' && !!$('#sixIframe').length) {
                    iFrame = document.getElementById('sixIframe');
                    iFrame.src = iFrame.src;
                }
            }

            // toggle between manual card entry and six payment swipe (C&P option in UI) for sixpayments
            $scope.sixPayEntryOptionChanged = function () {
                if ($scope.payment.isManualEntryInsideIFrame) {
                    changeToCardAddMode();
                } else {
                    // Add to guestcard feature for C&P
                    $scope.payment.showAddToGuestCard = !!$scope.reservationId && !$scope.payment.isManualEntryInsideIFrame;
                    $scope.selectedCC = {};
                }
                calculateFee();
            };

            // toggle between CC entry and existing card selection
            $scope.toggleCCMOde = function (mode) {
                if (mode === 'GIFT_CARD') {
                    $scope.selectedPaymentType = 'GIFT_CARD';
                    $scope.onPaymentInfoChange();
                } else {
                    $scope.selectedPaymentType = 'CC';
                    $scope.onPaymentInfoChange();
                }
                if (mode === 'ADD_CARD') {
                    refreshIFrame();
                }
                // adding timeout to avoid blinking effect when the iframe reloads
                $timeout(function () {
                    $scope.payment.addCCMode = mode;
                }, 350);
            };

            /** ******************* Payment Actions *****************************/

            $scope.cancelAction = function (arg) {
                $scope.$emit('PAYMENT_ACTION_CANCELLED', arg);
            };

            $scope.closeThePopup = function () {
                $scope.$emit('CLOSE_DIALOG');
            };

            $scope.payLater = function () {
                $scope.$emit('PAY_LATER', {
                    paymentType: $scope.selectedPaymentType,
                    cardDetails: $scope.selectedCC,
                    addToGuestCard: $scope.payment.addToGuestCardSelected
                });
            };

            $scope.continueAction = function (arg) {
                $scope.$emit('PAYMENT_ACTION_CONTINUE', arg);
            };

            $scope.resetPaymentAttempt = function () {
                $scope.paymentAttempted = false;
                $scope.isPaymentFailure = false;
            };

            /**
             * This method  is used adding a payment method
             * Places of use are
             *  * Staycard - Add Action Button next to Payment Method
             *  *
             *
             *  API Definition
             *
             *  * Request URL: /staff/reservation/save_payment
             *    Request Method: POST
             *    Request Params: {reservation_id: 1348897, payment_type: 'CK', workstation_id: 159}
             *
             *  * Request URL: /staff/reservation/link_payment
             *    Request Method: POST
             *    Request Params: {reservation_id: 1348897, payment_type: 'CK', workstation_id: 159, user_payment_type_id: '1171'}
             *    @returns {undefined} undefined
             */
            $scope.saveReservationPaymentMethod = function () {
                var params;

                //  in case of CBA and the card is not tokenized yet
                if ($scope.selectedPaymentType === 'CC' &&
                    $scope.hotelConfig.paymentGateway === 'CBA' && !$scope.payment.tokenizedCardData) {
                    $scope.$broadcast('INITIATE_CBA_TOKENIZATION');
                    return;
                }

                // check if chip and pin is selected in case of six payments
                // the rest of actions will in paySixPayController
                if ($scope.selectedPaymentType === 'CC' && isEMVEnabled && !$scope.payment.isManualEntryInsideIFrame) {
                    params = {
                        workstation_id: $scope.hotelConfig.workstationId,
                        bill_number: $scope.billNumber
                    };

                    if ($scope.actionType === 'ADD_PAYMENT_GUEST_CARD') {
                        angular.extend(params, {
                            guest_id: $scope.guestId,
                            add_to_guest_card: true
                        });
                    } else {
                        if ($scope.actionType === 'ADD_PAYMENT_STAY_CARD') {
                            params['guest_id'] = $scope.guestId;
                        }
                        if ($scope.reservationId) {
                            params['reservation_id'] = $scope.reservationId;
                        }
                        if ($scope.accountId) {
                            params['account_id'] = $scope.accountId;
                        }
                        if ($scope.groupId) {
                            params['group_id'] = $scope.groupId;
                        }
                        if ($scope.allotmentId) {
                            params['allotment_id'] = $scope.allotmentId;
                        }

                        params['add_to_guest_card'] = $scope.payment.addToGuestCardSelected;
                    }

                    $scope.$broadcast('INITIATE_CHIP_AND_PIN_TOKENIZATION', params);
                    return;
                }

                //  In case of guest card; we would be only adding credit cards
                if ($scope.actionType === 'ADD_PAYMENT_GUEST_CARD') {
                    var cardDetails;

                    sntActivity.start('ADD_PAYMENT_GUEST_CARD');
                    sntPaymentSrv.addCardToGuest({
                        ...$scope.payment.tokenizedCardData.apiParams,
                        add_to_guest_card: true,
                        workstation_id: $scope.hotelConfig.workstationId,
                        user_id: $scope.guestId
                    }).then(response => {
                        cardDetails = $scope.payment.tokenizedCardData;

                        $scope.$emit('SUCCESS_LINK_PAYMENT', {
                            response: response.data,
                            selectedPaymentType: $scope.selectedPaymentType,
                            cardDetails: {
                                'card_code': cardDetails.cardDisplayData.card_code,
                                'ending_with': cardDetails.cardDisplayData.ending_with,
                                'expiry_date': cardDetails.cardDisplayData.expiry_date,
                                'card_name': cardDetails.apiParams.name_on_card
                            }
                        });
                        sntActivity.stop('ADD_PAYMENT_GUEST_CARD');
                    }, errorMessage => {
                        $scope.$emit('ERROR_OCCURED', errorMessage);
                        sntActivity.stop('ADD_PAYMENT_GUEST_CARD');
                    });
                } else if ($scope.selectedPaymentType === 'CC'
                    && /^ADD_PAYMENT_/.test($scope.actionType)
                    && $scope.payment.tokenizedCardData
                    && $scope.payment.tokenizedCardData.apiParams) {

                    sntActivity.start('ADD_PAYMENT');
                    sntPaymentSrv.savePaymentDetails({
                        ...$scope.payment.tokenizedCardData.apiParams,
                        workstation_id: $scope.hotelConfig.workstationId,
                        reservation_id: $scope.reservationId,
                        bill_number: $scope.billNumber,
                        add_to_guest_card: $scope.payment.addToGuestCardSelected
                    }).then(response => {
                        var cardDetails = $scope.payment.tokenizedCardData;

                        $scope.$emit('SUCCESS_LINK_PAYMENT', {
                            response: {
                                ...response.data,
                                addToGuestCard: $scope.payment.addToGuestCardSelected
                            },
                            selectedPaymentType: $scope.selectedPaymentType,
                            cardDetails: {
                                'card_code': cardDetails.cardDisplayData.card_code,
                                'ending_with': cardDetails.cardDisplayData.ending_with,
                                'expiry_date': cardDetails.cardDisplayData.expiry_date,
                                'card_name': cardDetails.apiParams.name_on_card || cardDetails.apiParams.card_name
                            }
                        });
                        sntActivity.stop('ADD_PAYMENT');
                    }, errorMessage => {
                        $scope.$emit('ERROR_OCCURED', errorMessage);
                        sntActivity.stop('ADD_PAYMENT');
                    });
                } else if ($scope.selectedPaymentType !== 'CC') {
                    //  NOTE: This block of code handles all payment types except
                    sntActivity.start('ADD_PAYMENT_CC');
                    sntPaymentSrv.savePaymentDetails({
                        bill_number: $scope.billNumber,
                        reservation_id: $scope.reservationId,
                        payment_type: $scope.selectedPaymentType,
                        workstation_id: $scope.hotelConfig.workstationId
                    }).then(response => {
                        $scope.$emit('SUCCESS_LINK_PAYMENT', {
                            response: response.data,
                            selectedPaymentType: $scope.selectedPaymentType
                        });
                        sntActivity.stop('ADD_PAYMENT_CC');
                    }, errorMessage => {
                        $scope.$emit('ERROR_OCCURED', errorMessage);
                        sntActivity.stop('ADD_PAYMENT_CC');
                    });
                } else if (!!$scope.accountId || !!$scope.groupId || !!$scope.allotmentId) {
                    $scope.$emit('SUCCESS_LINK_PAYMENT', {
                        selectedPaymentType: $scope.selectedPaymentType,
                        cardDetails: $scope.selectedCC
                    });
                } else if (!!$scope.payment.tokenizedCardData && !!$scope.payment.tokenizedCardData.apiParams.mli_token) {
                    //  NOTE: credit card is selected and coming through swipe
                    sntActivity.start('ADD_PAYMENT_SWIPE');
                    sntPaymentSrv.savePaymentDetails({
                        ...$scope.payment.tokenizedCardData.apiParams,
                        bill_number: $scope.billNumber,
                        reservation_id: $scope.reservationId,
                        payment_type: $scope.selectedPaymentType,
                        workstation_id: $scope.hotelConfig.workstationId
                    }).then(response => {
                        $scope.$emit('SUCCESS_LINK_PAYMENT', {
                            response: response.data,
                            selectedPaymentType: $scope.selectedPaymentType,
                            cardDetails: $scope.selectedCC
                        });
                        sntActivity.stop('ADD_PAYMENT_SWIPE');
                    }, errorMessage => {
                        $scope.$emit('ERROR_OCCURED', errorMessage);
                        sntActivity.stop('ADD_PAYMENT_SWIPE');
                    });
                } else if ($scope.reservationId) { //  NOTE: This is the scenario where the user has selected an existing credit card from the list
                    sntActivity.start('ADD_EXISTING_PAYMENT_TYPE');
                    sntPaymentSrv.mapPaymentToReservation({
                        bill_number: $scope.billNumber,
                        reservation_id: $scope.reservationId,
                        payment_type: $scope.selectedPaymentType,
                        workstation_id: $scope.hotelConfig.workstationId,
                        user_payment_type_id: $scope.selectedCC.value,
                        add_to_guest_card: $scope.payment.addToGuestCardSelected
                    }).then(response => {
                        $scope.$emit('SUCCESS_LINK_PAYMENT', {
                            response: response.data,
                            selectedPaymentType: $scope.selectedPaymentType,
                            cardDetails: $scope.selectedCC
                        });
                        sntActivity.stop('ADD_EXISTING_PAYMENT_TYPE');
                    }, errorMessage => {
                        $scope.$emit('ERROR_OCCURED', errorMessage);
                        sntActivity.stop('ADD_EXISTING_PAYMENT_TYPE');
                    });
                }
            };

            let promptCreateAR = function (params) {
                //  $scope.closeThePopup();
                $timeout(() => {
                    ngDialog.open({
                        template: '/assets/partials/payCreateARPopup.html',
                        controller: 'payCreateARPopupCtrl',
                        className: '',
                        scope: $scope,
                        data: JSON.stringify(params)
                    });
                }, 0);
            };

            $scope.$on('NEW_AR_ACCOUNT_CREATED', () => {
                $scope.submitPayment({
                    is_new_ar_account: true
                });
            });

            $scope.$on('CONTINUE_DIRECT_BILL_PAYMENT', (e, data) => {
                var arDetails = data.arDetails;

                if (data.ar_type === 'company') {
                    if (arDetails.company_ar_attached) {
                        $scope.submitPayment({
                            'ar_type': 'company'
                        });
                    } else {
                        promptCreateAR({
                            account_id: arDetails.company_id,
                            is_auto_assign_ar_numbers: arDetails.is_auto_assign_ar_numbers
                        });
                    }
                } else if (data.ar_type === 'travel_agent') {
                    if (arDetails.travel_agent_ar_attached) {
                        $scope.submitPayment({
                            'ar_type': 'travel_agent'
                        });
                    } else {
                        promptCreateAR({
                            account_id: arDetails.travel_agent_id,
                            is_auto_assign_ar_numbers: arDetails.is_auto_assign_ar_numbers
                        });
                    }
                }
            });

            $scope.$on(payEvntConst.PAYMENTAPP_ERROR_OCCURED, (event, errorMessage) => {
                $timeout(() => {
                    $scope.errorMessage = errorMessage;
                }, 100);
            });

            /**
             * This method checks if the selected payment type is Direct Bill
             * In case the payment type is direct bill;
             * then there MUST be an added Company or Travel Agent Card with an AR Account
             * @returns {undefined} undefined
             */
            $scope.submitAccountPayment = function () {
                if ($scope.selectedPaymentType === 'DB') {
                    //  TODO: Check if AR account is present
                    sntPaymentSrv.checkARStatus($scope.postingAccountId).then(data => {
                        if (data.company_present && data.travel_agent_present) {
                            $scope.$emit('SHOW_AR_SELECTION', data);
                        } else if (data.company_present) {
                            if (data.company_ar_attached) {
                                $scope.submitPayment({
                                    'ar_type': 'company'
                                });
                            } else {

                                if (rvPermissionSrv.getPermissionValue('CREATE_AR_ACCOUNT')) {
                                    promptCreateAR({
                                        account_id: data.company_id,
                                        is_auto_assign_ar_numbers: data.is_auto_assign_ar_numbers
                                    });
                                } else {
                                    $scope.account_id = data.company_id;
                                    ngDialog.open({
                                        template: '/assets/partials/payment/rvAccountReceivableMessagePopup.html',
                                        controller: 'RVAccountReceivableMessagePopupCtrl',
                                        className: '',
                                        scope: $scope
                                    });
                                }   

                            }
                        } else if (data.travel_agent_present) {
                            if (data.travel_agent_ar_attached) {
                                $scope.submitPayment({
                                    'ar_type': 'travel_agent'
                                });
                            } else {

                                if (rvPermissionSrv.getPermissionValue('CREATE_AR_ACCOUNT')) {
                                    promptCreateAR({
                                        account_id: data.travel_agent_id,
                                        is_auto_assign_ar_numbers: data.is_auto_assign_ar_numbers
                                    });
                                } else {
                                    $scope.account_id = data.travel_agent_id;
                                    ngDialog.open({
                                        template: '/assets/partials/payment/rvAccountReceivableMessagePopup.html',
                                        controller: 'RVAccountReceivableMessagePopupCtrl',
                                        className: '',
                                        scope: $scope
                                    });
                                }                                 
                            }
                        } else {
                            $scope.errorMessage = [$filter('translate')('ACCOUNT_ID_NIL_MESSAGE_PAYMENT')];
                        }
                    }, errorMessage => {
                        $scope.$emit('PAYMENT_FAILED', errorMessage);
                        $scope.$emit('hideLoader');
                    });
                } else {
                    $scope.submitPayment();
                }
            };

            var paymentDialogId = null;

            // CICO-33971 : Confirm Direct Bill payment.
            let confirmDirectBillPayment = function (params) {
                $timeout(() => {
                    ngDialog.open({
                        template: '/assets/partials/rvConfirmDirectBillPaymentPopup.html',
                        className: '',
                        controller: 'confirmDirectBillPopupCtrl',
                        scope: $scope,
                        closeByDocument: false,
                        data: JSON.stringify(params)
                    });
                }, 0);
            };

            // CICO-33971 : To catch ngDialog id - to handle multiple popups.
            $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                paymentDialogId = $dialog.attr('id');
            });
            // CICO-33971 : Submit payment process after confirming as DB.
            $scope.$on('CONFIRMED_DB_PAYMENT', (event, params) => {
                $scope.payment.isConfirmedDBpayment = true;
                $scope.submitPayment(params);
            });

            // To close the confirm DB popup.
            var cancellConfirmDBpopup = function () {
                $scope.$emit('SHOW_BILL_PAYMENT_POPUP');
                ngDialog.close(paymentDialogId);
            };

            // CICO-33971 : Close confirmation popup.
            $scope.$on('CANCELLED_CONFIRM_DB_PAYMENT', () => {
                cancellConfirmDBpopup();
            });

            $scope.submitPayment = function (payLoad) {
                var errorMessage = ['Please enter a valid amount'],
                    paymentTypeId, // for CC payments, we need payment type id
                    params;

                if (!sntPaymentSrv.isValidAmount($scope.payment.amount)) {
                    $scope.errorMessage = errorMessage;
                    return;
                }

                $scope.errorMessage = '';

                params = initiateSubmitPaymentParams(payLoad);

                // check if chip and pin is selected in case of six payments
                // the rest of actions will in paySixPayController
                if ($scope.selectedPaymentType === 'CC' &&
                    $scope.hotelConfig.paymentGateway === 'sixpayments' && !$scope.payment.isManualEntryInsideIFrame) {
                    $scope.$broadcast('INITIATE_CHIP_AND_PIN_PAYMENT', params);
                    return;
                }


                // MLI EMV
                if ($scope.selectedPaymentType === 'CC' && isEMVEnabled
                    && !$scope.payment.isManualEntryInsideIFrame) {
                    $scope.$broadcast('INITIATE_CHIP_AND_PIN_PAYMENT', params);
                    return;
                }

                //  --- CBA ---
                if ($scope.selectedPaymentType === 'CC' && $scope.hotelConfig.paymentGateway === 'CBA') {
                    $scope.$broadcast('INITIATE_CBA_PAYMENT', params);
                    return;
                }

                // ---- CBA + MLI ----
                if ($scope.selectedPaymentType === 'CBA' && $scope.hotelConfig.paymentGateway === 'CBA_AND_MLI') {
                    if (isInIpadApp || sntPaymentSrv.mockCba) {
                        $scope.$broadcast('INITIATE_CBA_PAYMENT', params);
                    } else {
                        $scope.errorMessage = $scope.errorMessage = [$filter('translate')('USE_IPAD_TO_USE_CBA')];
                    }
                    return;
                }

                //  --- Shiji ---
                if ($scope.hotelConfig.paymentGateway === 'SHIJI' &&
                    ($scope.selectedPaymentType === 'ALIPAY' || $scope.selectedPaymentType === 'WECHAT')) {
                    $scope.$broadcast('INITIATE_SHIJI_PAYMENT', params);
                    return;
                }

                // -- CICO-33971 :: Direct Bill Payment --
                if ($scope.selectedPaymentType === 'DB' && !$scope.payment.isConfirmedDBpayment) {
                    $scope.$emit('HIDE_BILL_PAYMENT_POPUP');
                    confirmDirectBillPayment(params.postData);
                    return;
                }

                if ($scope.selectedPaymentType === 'CC' && $scope.selectedCard !== -1) {
                    paymentTypeId = $scope.selectedCC.value;
                } else {
                    paymentTypeId = null;
                }

                if (params.postData.payment_type === 'GIFT_CARD') {
                    params.postData.card_number = $.trim($scope.giftCard.number); // trim to remove whitespaces from copy-paste
                } else {
                    // Needn't pass payment_type_id in case of gift card payment
                    params.postData.payment_type_id = paymentTypeId;
                }


                sntActivity.start('SUBMIT_PAYMENT');

                sntPaymentSrv.submitPayment(params).then(
                    response => {
                        $scope.onPaymentSuccess(response);
                        sntActivity.stop('SUBMIT_PAYMENT');
                        if ($scope.payment.isConfirmedDBpayment) {
                            ngDialog.close();
                        }
                    },
                    errorMessage => {
                        // CICO-40539 - Handle error for DB payment from bill screen/confirm popup.
                        if ($scope.selectedPaymentType === 'DB' && $scope.payment.isConfirmedDBpayment) {
                            cancellConfirmDBpopup();
                            $scope.payment.isConfirmedDBpayment = false;
                        }
                        handlePaymentError(errorMessage);
                    }
                );
            };

            /**
             * @returns {undefined} undefined
             */
            function calculateFee() {
                var selectedPaymentType,
                    cardTypeInfo,
                    currFee,
                    feeInfo,
                    usingChipAndPin = isEMVEnabled && !$scope.payment.isManualEntryInsideIFrame;

                // For overlays we are not handling Fees from our side except for CBA payment type
                if (!$scope.hotelConfig.isStandAlone && $scope.selectedPaymentType !== 'CBA') {
                    $scope.feeData = {
                        calculatedFee: '',
                        totalOfValueAndFee: '',
                        showFee: false,
                        feeChargeCode: ''
                    };
                    return;
                }
                selectedPaymentType = _.find($scope.paymentTypes, {
                    name: $scope.selectedPaymentType
                });
                feeInfo = (selectedPaymentType &&
                    selectedPaymentType.charge_code
                    && selectedPaymentType.charge_code.fees_information) || {};

                //  In case a credit card is selected; the fee information is to be that of the card
                // CICO-42852 C&P - When C&P option is selected,  do not display CC fee
                if (!usingChipAndPin &&
                    !!selectedPaymentType &&
                    selectedPaymentType.name === 'CC' &&
                    $scope.selectedCC &&
                    $scope.selectedCC.hasOwnProperty('card_code')) {

                    if ($scope.selectedCC.card_code) {
                        cardTypeInfo = _.find(selectedPaymentType.values, {
                            cardcode: $scope.selectedCC.card_code.toUpperCase()
                        });
                    }

                    feeInfo = (cardTypeInfo &&
                        cardTypeInfo.charge_code &&
                        cardTypeInfo.charge_code.fees_information) ||
                        feeInfo;
                }

                currFee = sntPaymentSrv.calculateFee($scope.payment.amount, feeInfo);
                $scope.isDisplayRef = selectedPaymentType && selectedPaymentType.is_display_reference;

                $scope.feeData = {
                    calculatedFee: currFee.calculatedFee,
                    totalOfValueAndFee: currFee.totalOfValueAndFee,
                    showFee: currFee.showFees,
                    feeChargeCode: currFee.feeChargeCode
                };
            }

            /**
             * This method handles manual entry of Gift Card
             * @returns {undefined} undefined
             */
            $scope.onChangeGiftCard = function () {
                var charLength = $scope.giftCard.number.length;

                if (charLength >= 8 && charLength <= 22) {

                    sntActivity.start('FETCH_GIFT_CARD_BALANCE');

                    sntPaymentSrv.fetchGiftCardBalance($scope.giftCard.number).then(response => {
                        // NOTE: response.expiry_date is unused at this time
                        $scope.giftCard.availableBalance = response.amount;
                        $scope.giftCard.amountAvailable = true;
                        sntActivity.stop('FETCH_GIFT_CARD_BALANCE');
                    }, errorMessage => {
                        $scope.giftCard.amountAvailable = false;
                        $scope.errorMessage = errorMessage;
                        sntActivity.stop('FETCH_GIFT_CARD_BALANCE');
                    });

                } else {
                    // hides the field and reset the amount stored
                    $scope.giftCard.amountAvailable = false;
                    $scope.giftCard.availableBalance = null;
                }
            };

            //  Payment type change action
            $scope.onPaymentInfoChange = function (isReset) {
                // NOTE: Fees information is to be calculated only for standalone systems
                // TODO: See how to handle fee in case of C&P
                // CICO-44719: No need to show add payment screen
                if ($scope.actionType === 'AR_REFUND_PAYMENT') {
                    return false;
                }

                /** CICO-47989
                 * To handle scenarios where the bill might have a payment type associated, but it is no longer available in the list
                 * In such cases, clear the selected payment type
                 */
                if (!_.find($scope.paymentTypes, {name: $scope.selectedPaymentType})) {
                    $scope.selectedPaymentType = '';
                }

                var selectedPaymentType;

                if (isReset && $scope.payment.isEditable && $scope.selectedPaymentType === 'GIFT_CARD') {
                    $scope.payment.amount = 0;
                }

                calculateFee();
                selectedPaymentType = _.find($scope.paymentTypes, {
                    name: $scope.selectedPaymentType
                });
                $scope.$emit('PAYMENT_TYPE_CHANGED', $scope.selectedPaymentType);

                // -- CICO-33971 :: Direct Bill Payment --
                if ($scope.selectedPaymentType === 'DB') {
                    $scope.payment.isEditable = false;
                    $scope.splitBillEnabled = false;
                    $scope.payment.amount = initialPaymentAmount;
                    calculateFee();
                } else {
                    $scope.payment.isEditable = $scope.isEditable === undefined || Boolean($scope.isEditable);
                }

                // If the changed payment type is CC and payment gateway is MLI show CC addition options
                // If there are attached cards, show them first
                if (!!selectedPaymentType && selectedPaymentType.name === 'CC') {
                    if (PAYMENT_CONFIG[$scope.hotelConfig.paymentGateway].iFrameUrl) {
                        // Add to guestcard feature for C&P
                        //  The payment info may change after adding a payment method; in such a case, should not reset back to C&P mode
                        $scope.selectedCC = $scope.selectedCC || {};

                        if ($scope.payment.screenMode !== 'CARD_ADD_MODE' && !$scope.selectedCC.value) {
                            $scope.payment.isManualEntryInsideIFrame = false;
                            $scope.selectedCC = {};
                        }
                        // Add to guestcard feature for C&P
                        $scope.payment.showAddToGuestCard = !!$scope.reservationId && !$scope.payment.isManualEntryInsideIFrame;
                    } else if ($scope.hotelConfig.isEMVEnabled) {
                        $scope.selectedCC = $scope.selectedCC || {};

                        if ($scope.payment.screenMode !== 'CARD_ADD_MODE' && !$scope.selectedCC.value) {
                            $scope.payment.isManualEntryInsideIFrame = false;
                            $scope.selectedCC = {};
                        }
                        // Add to guestcard feature for C&P
                        $scope.payment.showAddToGuestCard = !!$scope.reservationId && !$scope.payment.isManualEntryInsideIFrame;
                    } else if (!isCardSelectionDisabled() && !$scope.showSelectedCard()) {
                        //  In case no card has been selected yet, move to add card mode
                        changeToCardAddMode();
                    }
                } else {
                    $scope.payment.showAddToGuestCard = false;
                }
            };

            $scope.onFeeOverride = function () {
                var totalAmount = parseFloat($scope.feeData.calculatedFee) + parseFloat($scope.payment.amount);

                $scope.feeData.totalOfValueAndFee = totalAmount.toFixed(2);
            };

            $scope.propagateAddToggle = function () {
                $scope.$emit('PAYMENT_TOGGLE_ATTACH_TO_GUEST_CARD', $scope.payment.addToGuestCardSelected);
            };

            /** ************** CC handling ********************/
            // if the selected card is clicked, go to card entry page
            $scope.onCardClick = function () {
                changeToCardAddMode();
                refreshIFrame();
            };

            // cancel CC entry and go to initial page
            $scope.cancelCardSelection = function () {
                $scope.errorMessage = '';
                $scope.payment.screenMode = 'PAYMENT_MODE';
                $scope.payment.showAddToGuestCard = false;
                $scope.selectedPaymentType = '';
                $scope.$emit('PAYMENT_TYPE_CHANGED', $scope.selectedPaymentType);
                $scope.selectedCC = {};
                calculateFee();
                refreshIFrame();
            };

            // choose among the existing cards
            $scope.setCreditCardFromList = function (selectedCardValue) {
                var selectedCard = _.find($scope.payment.linkedCreditCards, {
                    value: selectedCardValue
                });

                $scope.selectedCC = selectedCard;
                // this need to be set to true only if new card is added
                $scope.payment.showAddToGuestCard = false;
                $scope.payment.screenMode = 'PAYMENT_MODE';

                //  In case user decides to change card after adding a new one; or selecting one from the list
                //  Reset the card details
                $scope.payment.tokenizedCardData = null;

                calculateFee();
            };
            // hide existing cards in some places like in guestcard add CC
            $scope.hideCardToggles = function () {
                //  Below is the original condition
                //  TODO: Find why toggles was hidden in case of hasAccompanyGuest
                //  return $scope.isFromGuestCard  || $scope.hasAccompanyguest || ($scope.cardsList && $scope.cardsList.length === 0)
                return $scope.actionType === 'ADD_PAYMENT_GUEST_CARD' || $scope.actionType === 'ADD_ROUTE_PAYMENT' || !existingCardsPresent();
            };
            // list the existing cards for the reservation
            var onFetchLinkedCreditCardListSuccess = function (data) {
                $scope.$emit('hideLoader');
                $scope.payment.linkedCreditCards = _.where(data.existing_payments, {
                    is_credit_card: true
                });

                if ($scope.payment.linkedCreditCards.length > 0) {
                    refreshScroller('cardsList');
                }
            };

            // if there is reservationID fetch the linked credit card items
            var fetchAttachedCreditCards = function () {
                if ($scope.reservationId) {
                    sntActivity.start('FETCH_ATTACHED_CARDS');

                    sntPaymentSrv.getLinkedCardList($scope.reservationId).then(
                        response => {
                            onFetchLinkedCreditCardListSuccess(response);
                            sntActivity.stop('FETCH_ATTACHED_CARDS');
                        },
                        errorMessage => {
                            $scope.$emit('PAYMENT_FAILED', errorMessage);
                            sntActivity.stop('FETCH_ATTACHED_CARDS');
                        });
                } else {
                    $scope.payment.linkedCreditCards = [];
                }
            };

            /**
             * Extract the credit card types
             * @returns {*|Array} List of credit card types configured
             */
            function getCreditCardTypesList() {
                // filter CC types from payment types
                var creditCardTypes = _.find($scope.paymentTypes, {
                    name: 'CC'
                });

                return (creditCardTypes && creditCardTypes.values) || [];
            }

            /**
             *
             * @param {object} cardDetails cardDetails
             * @returns {undefined} undefined
             */
            function saveCCPayment(cardDetails) {
                var params;

                /**
                 *
                 * @param {object} response response
                 * @returns {undefined} undefined
                 */
                function onSaveSuccess(response) {
                    if (!$scope.selectedPaymentType) {
                        $scope.selectedPaymentType = 'CC';
                    }

                    $scope.selectedCC = $scope.selectedCC || {};
                    $scope.selectedCC.value = response.data.id;
                    $scope.selectedCard = $scope.selectedCC.value;
                    $scope.selectedCC.card_code = response.data.credit_card_type;
                    $scope.selectedCC.ending_with = cardDetails.cardDisplayData.ending_with;
                    $scope.selectedCC.expiry_date = cardDetails.cardDisplayData.expiry_date;
                    $scope.selectedCC.holder_name = cardDetails.cardDisplayData.name_on_card;
                    $scope.payment.screenMode = 'PAYMENT_MODE';
                    $scope.$emit('PAYMENT_SAVE_CARD_SUCCESS');

                    if (response.params) {
                        $scope.selectedCC.params = params;
                    }

                    calculateFee();
                    showAddtoGuestCardBox();
                }

                /**
                 *
                 * @param {Array} errorMessage errorMessage
                 * @returns {undefined} undefined
                 */
                function onSaveFailure(errorMessage) {
                    $scope.errorMessage = errorMessage;
                }

                sntActivity.start('SAVE_CC_PAYMENT');

                params = angular.copy(cardDetails.apiParams);

                if ($scope.accountId) {
                    params['account_id'] = $scope.accountId;
                }
                if ($scope.groupId) {
                    params['group_id'] = $scope.groupId;
                }
                if ($scope.allotmentId) {
                    params['allotment_id'] = $scope.allotmentId;
                }
                if ($scope.actionType === 'DEPOSIT_PAYMENT_RES_SUMMARY') {
                    params['reservation_id'] = $scope.reservationId;
                }

                if (params.mli_token &&
                    $state.current.name !== 'rover.reservation.staycard.mainCard.summaryAndConfirm') { // CICO-44480
                    params['do_not_attach_cc_to_bill'] = true;
                    params['reservation_id'] = $scope.reservationId;
                    // CICO-43933
                    sntActivity.stop('SAVE_CC_PAYMENT');
                    onSaveSuccess({
                        params,
                        data: {
                            id: null,
                            credit_card_type: $scope.selectedCC.card_code
                        }
                    });
                    // Don't make save payment call for swipes during submit payment
                    return;
                }
                sntPaymentSrv.savePaymentDetails(params).then(
                    response => {
                        if (response.status === 'success') {
                            onSaveSuccess(response);
                        } else {
                            onSaveFailure(response.errors);
                        }
                        sntActivity.stop('SAVE_CC_PAYMENT');
                    },
                    errorMessage => {
                        onSaveFailure(errorMessage);
                        sntActivity.stop('SAVE_CC_PAYMENT');
                    });
            }

            /**
             * This metod is used for saving a credit card in the AR Transactions Tab
             * @param {Object} cardDetails cardDetails object
             * @returns {undefined} undefined
             */
            function addBillPayment(cardDetails) {
                sntActivity.start('ADD_PAYMENT_METHOD_ON_BILL');

                var params = angular.copy(cardDetails.apiParams),
                    onSaveSuccess = function (response) {

                        $scope.selectedCC = $scope.selectedCC || {};

                        $scope.selectedCC.value = response.id;
                        $scope.selectedCard = $scope.selectedCC.value;
                        $scope.selectedCC.card_code = cardDetails.cardDisplayData.card_code;
                        $scope.selectedCC.ending_with = cardDetails.cardDisplayData.ending_with;
                        $scope.selectedCC.expiry_date = cardDetails.cardDisplayData.expiry_date;
                        $scope.selectedCC.holder_name = cardDetails.cardDisplayData.name_on_card;

                        $scope.payment.screenMode = 'PAYMENT_MODE';
                        calculateFee();
                    }, onSaveFailure = function (errorMessage) {
                        $scope.errorMessage = errorMessage;
                    };

                //  NOTE: This API is very similar to that of the one called through sntPaymentSrv.savePaymentDetails
                sntPaymentSrv.addBillPaymentMethod({
                    billId: $scope.billId,
                    payLoad: {
                        ...params,
                        workstation_id: $scope.hotelConfig.workstationId
                    }
                }).then(
                    response => {
                        onSaveSuccess(response);
                        sntActivity.stop('ADD_PAYMENT_METHOD_ON_BILL');
                    },
                    errorMessage => {
                        onSaveFailure(errorMessage);
                        sntActivity.stop('ADD_PAYMENT_METHOD_ON_BILL');
                    });
            }

            $scope.$on(payEvntConst.CC_TOKEN_GENERATED, function (event, data) {
                var paymentData = data.paymentData;

                $scope.errorMessage = '';

                if (/^ADD_PAYMENT_/.test($scope.actionType) || !!paymentData.apiParams.mli_token) {

                    showAddtoGuestCardBox();

                    $scope.payment.tokenizedCardData = paymentData;
                    $scope.selectedCC = $scope.selectedCC || {};
                    $scope.selectedCC.card_code = paymentData.cardDisplayData.card_code;
                    $scope.selectedCC.ending_with = paymentData.cardDisplayData.ending_with;
                    $scope.selectedCC.expiry_date = paymentData.cardDisplayData.expiry_date;
                    $scope.selectedCC.holder_name = paymentData.apiParams.name_on_card || paymentData.apiParams.card_name;
                    $timeout(() => {
                        $scope.selectedPaymentType = 'CC';
                        $scope.payment.screenMode = 'PAYMENT_MODE';
                        if (data.forceSaveRoutine) {
                            $scope.saveReservationPaymentMethod();
                        }
                    }, 600);
                } else {
                    $scope.payment.tokenizedCardData = null;
                }
                // TODO: APIs have to be evaluated in this add payment workflow!
                if ($scope.actionType === 'AR_SUBMIT_PAYMENT') {
                    addBillPayment(paymentData);
                }
                else if (!/^ADD_PAYMENT_/.test($scope.actionType)) {
                    saveCCPayment(paymentData);
                }

                $timeout(() => {
                    refreshIFrame();
                }, 600);

            });

            /**
             * Method to find if a refund is happening
             * @returns {boolean} boolean
             */
            $scope.isRefund = function () {
                return $scope.payment.amount < 0;
            };

            /**
             * The gift card toggle to be shown only for connected hotels and IFF
             * Gift card is enabled as a payment type
             * @returns {boolean} boolean
             */
            $scope.showGiftCardToggle = function () {
                var isGiftCardEnabled = _.find($scope.paymentTypes, {
                    name: 'GIFT_CARD'
                });

                return !$scope.hotelConfig.isStandAlone && !!isGiftCardEnabled && !$scope.hideOverlayGiftcard;
            };

            /**
             *
             * @returns {undefined} undefined
             */
            function onAmountChange() {
                $scope.payment.amount = $scope.amount || 0;
                initialPaymentAmount = initialPaymentAmount ? initialPaymentAmount : angular.copy($scope.payment.amount);
                calculateFee();
            }

            $scope.onPaymentSuccess = function (response) {
                $scope.paymentAttempted = !($scope.splitBillEnabled && $scope.numSplits > $scope.completedSplitPayments)
                
                $scope.isPaymentFailure = false;
                $scope.payment.authorizationCode = response.authorization_code;

                response.amountPaid = $scope.payment.amount;
                response.authorizationCode = response.authorization_code;

                response.selectedPaymentType = $scope.selectedPaymentType;
                response.selectedPaymentTypeDescription = _.findWhere($scope.paymentTypes, {name: $scope.selectedPaymentType}).description;
                //  NOTE: The feePaid key and value would be sent IFF a fee was applied along with the payment
                if ($scope.feeData) {
                    response.feePaid = $scope.feeData.calculatedFee;
                    response.showFee = $scope.feeData.showFee;
                }

                if ($scope.selectedPaymentType === 'CC') {
                    response.cc_details = angular.copy($scope.selectedCC);
                }

                if ($scope.payment.showAddToGuestCard) {
                    // check if add to guest card was selected
                    response.add_to_guest_card = $scope.payment.addToGuestCardSelected;
                }

                if ($scope.actionType === 'AR_SUBMIT_PAYMENT') {
                    // check if allocate payment after posting selected
                    response.allocatePaymentAfterPosting = $scope.payment.allocatePaymentAfterPosting;
                }

                $scope.$emit('PAYMENT_SUCCESS', response);
            };

            $scope.clearErrorMessage = function () {
                $scope.errorMessage = '';
            };

            $scope.showSixPaymentsModeSelection = function () {
                var isMLIEMV = ($scope.hotelConfig.paymentGateway === 'MLI' &&
                    $scope.hotelConfig.isEMVEnabled) || ($scope.hotelConfig.paymentGateway === 'CBA_AND_MLI' &&
                    $scope.hotelConfig.isEMVEnabled && $scope.payment.isAddCardAction);
                    
                var isPendingPayment = !$scope.paymentAttempted || // no payments attempted
                        // attempted payment failed
                        $scope.isPaymentFailure ||
                        // CICO-41498 in the middle of split bill payments
                        ($scope.splitBillEnabled && $scope.numSplits > $scope.completedSplitPayments);

                return (isMLIEMV || $scope.hotelConfig.paymentGateway === 'sixpayments') &&
                    $scope.selectedPaymentType === 'CC' &&
                    $scope.payment.screenMode === 'PAYMENT_MODE' &&
                    isPendingPayment && $scope.actionType !== 'AR_REFUND_PAYMENT';
            };

            /** **************** init ***********************************************/

            (function () {
                var paths, config;

                $scope.actionType = $scope.actionType || 'DEFAULT';
                if ($scope.fetchLinkedCards !== false) {
                    $scope.fetchLinkedCards = true;
                }

                /**
                 * NOTE: action types for add payment have to be named with ADD_PAYMENT (case-sensitive)
                 * @type {boolean}
                 */
                $scope.payment.isAddPaymentMode = !!$scope.actionType.match(/^ADD_PAYMENT/);

                $scope.$watch('amount', onAmountChange);

                $scope.$watch('paymentTypes', () => {
                    $scope.payment.creditCardTypes = getCreditCardTypesList();
                });

                $scope.$watch('isEditable', setEditableFlag);

                $scope.payment.amount = $scope.amount || 0;
                $scope.payment.isRateSuppressed = $scope.isRateSuppressed || false;
                $scope.billNumber = $scope.billNumber || 1;
                $scope.payment.linkedCreditCards = $scope.linkedCreditCards || [];


                $scope.payment.screenMode = 'PAYMENT_MODE';
                $scope.payment.addCCMode = 'ADD_CARD';
                $scope.payment.creditCardTypes = getCreditCardTypesList();
                $scope.payment.guestFirstName = $scope.firstName || '';
                $scope.payment.guestLastName = $scope.lastName || '';

                if (!$scope.hotelConfig) {
                    throw new Error('Need hotel config to proceed. Need the following params.\n isStandAlone, ' +
                        'paymentGateway, workstationId, emvTimeout, mliMerchantId, and currencySymbol');
                }

                /**
                 * Note:
                 * flags 'isManualCCEntryEnabled' and 'isStandAlone' are retained as set in rvRoverController.js for
                 * Rover App -> These are obtained from the app settings
                 */
                $scope.hotelConfig.mliMerchantId = $scope.hotelConfig.mliMerchantId || '';
                $scope.hotelConfig.workstationId = $scope.workstationId || '';
                $scope.hotelConfig.emvTimeout = $scope.hotelConfig.emvTimeout || 120;
                $scope.hotelConfig.paymentGateway = $scope.hotelConfig.paymentGateway || '';

                if ($scope.hotelConfig.paymentGateway === 'CBA' || $scope.hotelConfig.paymentGateway === 'CBA_AND_MLI') {
                    initiateCBAlisteners();
                } else if ($scope.hotelConfig.paymentGateway === 'SHIJI') {
                    initiateSHIJIListeners();
                }

                $scope.currencySymbol = $scope.hotelConfig.currencySymbol;

                if ($scope.fetchLinkedCards && !isCardSelectionDisabled()) {
                    fetchAttachedCreditCards();
                }

                $scope.$emit('SET_SCROLL_FOR_EXISTING_CARDS');

                // check if card is present, if yes turn on flag
                if ($scope.hotelConfig.paymentGateway === 'sixpayments') {
                    $scope.payment.isManualEntryInsideIFrame = true;
                    // Add to guestcard feature for C&P
                    $scope.payment.showAddToGuestCard = !$scope.payment.isManualEntryInsideIFrame;
                }

                paths = sntPaymentSrv.resolvePaths($scope.hotelConfig.paymentGateway, {
                    card_holder_first_name: $scope.payment.guestFirstName,
                    card_holder_last_name: $scope.payment.guestLastName
                });

                $scope.payment.iFrameUrl = paths.iFrameUrl;
                $scope.paymentGatewayUIInterfaceUrl = paths.paymentGatewayUIInterfaceUrl;

                // To disntiguish between Add card and Submit payment actions
                $scope.payment.isAddCardAction = sntPaymentSrv.isAddCardAction($scope.actionType);

                /* In case there is swiped data available
                 * This scenario is possible in case of add payments in stay-card; guest-card and stay-card bill screens.
                 */
                if ($scope.swipedCardData) {
                    $timeout(() => {
                        if (isEMVEnabled) {
                            $scope.payment.isManualEntryInsideIFrame = true;
                            $scope.sixPayEntryOptionChanged();
                        }
                        $scope.$broadcast('RENDER_SWIPED_DATA', JSON.parse($scope.swipedCardData));
                    }, 300);
                }

                /**
                 *
                 */
                if (!$scope.hotelConfig.isStandAlone && !isCardSelectionDisabled() && $scope.hotelConfig.paymentGateway !== 'CBA_AND_MLI') {
                    changeToCardAddMode();
                }

                //  For initial calculation of fee and other details
                $timeout($scope.onPaymentInfoChange, 1000);

                setScroller('cardsList', {
                    'click': true,
                    'tap': true
                });

                $scope.$watch('payment.screenMode', () => {
                    $scope.$emit('PAYMENT_SCREEN_MODE_CHANGED', $scope.payment.screenMode);
                });

                config = $scope.hotelConfig;

                isEMVEnabled = config.paymentGateway === 'sixpayments' ||
                    ((config.paymentGateway === 'MLI' || config.paymentGateway === 'CBA_AND_MLI') && config.isEMVEnabled);

                $scope.showSelectedCard();

            })();

        }
    ]);
