angular.module('sntPay').controller('sntPaymentController', ["$scope", "sntPaymentSrv", "paymentAppEventConstants", "$location", "PAYMENT_CONFIG", "$rootScope", "$timeout", "ngDialog", "$filter",
    function($scope, sntPaymentSrv, payEvntConst, $location, PAYMENT_CONFIG, $rootScope, $timeout, ngDialog, $filter) {

        $scope.payment = {
            referenceText: "",
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
            guestFirstName: '',
            guestLastName: '',
            isManualEntryInsideIFrame: false,
            workstationId: '',
            emvTimeout: 120
        };

        $scope.giftCard = {
            number: "",
            amountAvailable: false,
            availableBalance: null
        };

        $scope.errorMessage = "";

        //--------------------------------------------------------------------------------------------------------------
        var timeOutForScrollerRefresh = 300,
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
            /**
             *
             * @returns {{postData: {bill_number: number, payment_type: string, amount: number}, reservation_id: (*|string)}}
             */
            intiateSubmitPaymentParams = function(payLoad) {
                payLoad = payLoad || {};
                //set up params for API
                var params = {
                    "postData": {
                        ...payLoad,
                        "bill_number": $scope.billNumber,
                        "payment_type": $scope.selectedPaymentType,
                        "amount": $scope.payment.amount,
                        "is_split_payment": $scope.splitBillEnabled && $scope.numSplits > 1,
                        "workstation_id": $scope.hotelConfig.workstationId
                    },
                    "reservation_id": $scope.reservationId,
                    "bill_id": $scope.billId
                };

                if ($scope.payment.showAddToGuestCard) {
                    //check if add to guest card was selected
                    params.postData.add_to_guest_card = $scope.payment.addToGuestCardSelected;
                }

                if ($scope.feeData && $scope.feeData.showFee) {
                    //if fee was calculated wrt to payment type
                    params.postData.fees_amount = $scope.feeData.calculatedFee;
                    params.postData.fees_charge_code_id = $scope.feeData.feeChargeCode;
                }

                if ($scope.isDisplayRef) {
                    //if reference text is presernt for the payment type
                    params.postData.reference_text = $scope.payment.referenceText;
                }
                return params;
            },
            /**
             * function to handle scroll related things
             * @param1: string as key
             * @param2: object as scroller options
             */
            setScroller = function(key, scrollerOptions) {
                if (typeof scrollerOptions === 'undefined') {
                    scrollerOptions = {};
                }
                //we are merging the settings provided in the function call with defaults
                var tempScrollerOptions = angular.copy(defaultScrollerOptions);
                angular.extend(tempScrollerOptions, scrollerOptions); //here is using a angular function to extend,
                scrollerOptions = tempScrollerOptions;
                //checking whether scroll options object is already initilised in parent controller
                //if so we need add a key, otherwise initialise and add
                var isEmptyParentScrollerOptions = isEmptyObject($scope.$parent.myScrollOptions);

                if (isEmptyParentScrollerOptions) {
                    $scope.$parent.myScrollOptions = {};
                }

                $scope.$parent.myScrollOptions[key] = scrollerOptions;
            },

            /**
             * function to refresh the scroller
             * @param1: string as key
             */
            refreshScroller = function(key) {
                setTimeout(function() {
                    if (!!$scope.$parent && $scope.$parent.myScroll) {
                        if (key in $scope.$parent.myScroll) {
                            $scope.$parent.myScroll[key].refresh();
                        }
                    }
                    if ($scope.hasOwnProperty('myScroll') && (key in $scope.myScroll)) {
                        $scope.myScroll[key].refresh();
                    }
                }, timeOutForScrollerRefresh);
            };

        /**
         * Method to check if the gift card balance is less than the amount to be paid
         * @returns {boolean}
         */
        $scope.isGCBalanceShort = function() {
            if ($scope.selectedPaymentType !== "GIFT_CARD") {
                return false;
            } else {
                return $scope.giftCard.availableBalance &&
                    parseFloat($scope.giftCard.availableBalance) < parseFloat($scope.payment.amount);
            }
        };

        /**
         * Hide payment method if there is no permission or no payment type
         * @returns {boolean}
         */
        $scope.shouldHidePaymentButton = function() {
            return !$scope.selectedPaymentType || !$scope.hasPermission || $scope.isGCBalanceShort();
        };

        /**
         *
         * @returns {boolean}
         */
        $scope.showSelectedCard = function() {
            var isCCPresent = ($scope.selectedPaymentType === "CC" &&
            (!!$scope.selectedCC && (!!$scope.selectedCC.ending_with || !!$scope.selectedCC.card_number || !!$scope.selectedCC.value)));
            var isManualEntry = !!PAYMENT_CONFIG[$scope.hotelConfig.paymentGateway].iFrameUrl &&
                $scope.payment.isManualEntryInsideIFrame;

            return (isCCPresent && $scope.payment.screenMode === "PAYMENT_MODE" &&
            (isManualEntry || $scope.hotelConfig.paymentGateway !== 'sixpayments'));
        };

        /**
         * show add to guest card checkbox to add the card to the guestcard
         */
        var showAddtoGuestCardBox = function() {
            //this need to be set to true only if new card is added
            $scope.payment.showAddToGuestCard = true;
        };

        /**
         * check if there are existing cards to be shown in list
         * @returns {boolean}
         */
        var existingCardsPresent = function() {
            return $scope.payment.linkedCreditCards.length > 0;
        };

        /**
         * change screen mode to collect CC info
         */
        var changeToCardAddMode = function() {
            $scope.payment.screenMode = "CARD_ADD_MODE";
            $scope.payment.addCCMode = existingCardsPresent() && !$scope.swipedCardData ? "EXISTING_CARDS" : "ADD_CARD";
            $scope.$broadcast('RESET_CARD_DETAILS');
            refreshScroller('cardsList');
        };

        /**
         *  we need to refresh iframe each time,
         *  as we don't have direct control over the fields on it
         */
        var refreshIFrame = function() {
            //in case of hotel with MLI iframe will not be present
            if ($scope.hotelConfig.paymentGateway === 'sixpayments' && !!$("#sixIframe").length) {
                var iFrame = document.getElementById('sixIframe');
                iFrame.src = iFrame.src;
            }
        };

        //toggle between manual card entry and six payment swipe (C&P option in UI) for sixpayments
        $scope.sixPayEntryOptionChanged = function() {
            if ($scope.payment.isManualEntryInsideIFrame) {
                $scope.payment.isManualEntryInsideIFrame = false;
                //Add to guestcard feature for C&P
                $scope.payment.showAddToGuestCard = $scope.payment.isManualEntryInsideIFrame ? false : true;
                $scope.selectedCC = {};
            } else {
                $scope.payment.isManualEntryInsideIFrame = true;
                changeToCardAddMode();
            }
        };

        //toggle between CC entry and existing card selection
        $scope.toggleCCMOde = function(mode) {
            $scope.payment.addCCMode = mode;
            mode === 'ADD_CARD' ? refreshIFrame() : '';
        };

        /********************* Payment Actions *****************************/

        $scope.cancelAction = function(arg) {
            $scope.$emit('PAYMENT_ACTION_CANCELLED', arg);
        };

        $scope.closeThePopup = function() {
            $scope.$emit('CLOSE_DIALOG');
        };

        $scope.payLater = function() {
            $scope.$emit('PAY_LATER', {
                paymentType: $scope.selectedPaymentType,
                cardDetails: $scope.selectedCC
            });
        };

        $scope.continueAction = function(arg) {
            $scope.$emit('PAYMENT_ACTION_CONTINUE', arg);
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
         *    Request Params: {reservation_id: 1348897, payment_type: "CK", workstation_id: 159}
         *
         *  * Request URL: /staff/reservation/link_payment
         *    Request Method: POST
         *    Request Params: {reservation_id: 1348897, payment_type: "CK", workstation_id: 159, user_payment_type_id: "1171"}
         */
        $scope.saveReservationPaymentMethod = function() {
            //check if chip and pin is selected in case of six payments
            //the rest of actions will in paySixPayController
            if ($scope.selectedPaymentType === "CC" && $scope.hotelConfig.paymentGateway === 'sixpayments' && !$scope.payment.isManualEntryInsideIFrame) {
                var params = {
                    workstation_id: $scope.hotelConfig.workstationId
                };

                if ($scope.actionType === "ADD_PAYMENT_GUEST_CARD") {
                    angular.extend(params, {
                        guest_id: $scope.guestId,
                        add_to_guest_card: true
                    });
                } else {
                    if ($scope.actionType === "ADD_PAYMENT_STAY_CARD") {
                        params["guest_id"] = $scope.guestId;
                    }
                    params["reservation_id"] = $scope.reservationId;
                    params["account_id"] = $scope.accountId;
                    params["group_id"] = $scope.groupId;
                    params["allotment_id"] = $scope.allotmentId;
                }

                $scope.$broadcast('INITIATE_CHIP_AND_PIN_TOKENIZATION', params);
                return;
            }

            // In case of guest card; we would be only adding credit cards
            if ($scope.actionType === "ADD_PAYMENT_GUEST_CARD") {
                sntPaymentSrv.addCardToGuest({
                    ...$scope.payment.tokenizedCardData.apiParams,
                    add_to_guest_card: true,
                    workstation_id: $scope.hotelConfig.workstationId,
                    user_id: $scope.guestId,
                }).then(response => {
                    var cardDetails = $scope.payment.tokenizedCardData;
                    $scope.$emit('SUCCESS_LINK_PAYMENT', {
                        response: response.data,
                        selectedPaymentType: $scope.selectedPaymentType,
                        cardDetails: {
                            "card_code": cardDetails.cardDisplayData.card_code,
                            "ending_with": cardDetails.cardDisplayData.ending_with,
                            "expiry_date": cardDetails.cardDisplayData.expiry_date,
                            "card_name": cardDetails.apiParams.name_on_card
                        }
                    });
                }, errorMessage => {
                    $scope.$emit('ERROR_OCCURED', errorMessage);
                });
            } else if ($scope.selectedPaymentType !== 'CC') {
                // NOTE: This block of code handles all payment types except
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
                }, errorMessage => {
                    $scope.$emit('ERROR_OCCURED', errorMessage);
                });
            } else if (!!$scope.accountId || !!$scope.groupId || !!$scope.allotmentId) {
                $scope.$emit('SUCCESS_LINK_PAYMENT', {
                    selectedPaymentType: $scope.selectedPaymentType,
                    cardDetails: $scope.selectedCC
                });
            } else if (!!$scope.payment.tokenizedCardData && !!$scope.payment.tokenizedCardData.apiParams.mli_token) {
                // NOTE: credit card is selected and coming through swipe
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
                }, errorMessage => {
                    $scope.$emit('ERROR_OCCURED', errorMessage);
                });
            } else if (!!$scope.reservationId) { // NOTE: This is the scenario where the user has selected an existing credit card from the list
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
                }, errorMessage => {
                    $scope.$emit('ERROR_OCCURED', errorMessage);
                });
            }
        };

        let promptCreateAR = function(params) {
            // $scope.closeThePopup();
            $timeout(()=> {
                ngDialog.open({
                    template: '/assets/partials/payCreateARPopup.html',
                    controller: 'payCreateARPopupCtrl',
                    className: '',
                    scope: $scope,
                    data: JSON.stringify(params)
                });
            }, 0);
        };

        $scope.$on("NEW_AR_ACCOUNT_CREATED", ()=> {
            $scope.submitPayment({
                is_new_ar_account: true
            });
        });

        $scope.$on("CONTINUE_DIRECT_BILL_PAYMENT", (e, data)=> {
            var arDetails = data.arDetails;
            if (data.ar_type === "company") {
                arDetails.company_ar_attached ? $scope.submitPayment({
                    "ar_type": "company"
                }) : promptCreateAR({
                    account_id: arDetails.company_id,
                    is_auto_assign_ar_numbers: arDetails.is_auto_assign_ar_numbers
                });
            } else if (data.ar_type === "travel_agent") {
                arDetails.travel_agent_ar_attached ? $scope.submitPayment({
                    "ar_type": "travel_agent"
                }) : promptCreateAR({
                    account_id: arDetails.travel_agent_id,
                    is_auto_assign_ar_numbers: arDetails.is_auto_assign_ar_numbers
                });
            }
        });

        /**
         * This method checks if the selected payment type is Direct Bill
         * In case the payment type is direct bill;
         *  then there MUST be an added Company or Travel Agent Card with an AR Account
         */
        $scope.submitAccountPayment = function() {
            if ($scope.payment.amount === '' || $scope.payment.amount === null) {
                var errorMessage = ["Please enter amount"];
                $scope.$emit('ERROR_OCCURED', errorMessage);
                return;
            }

            if ($scope.selectedPaymentType === "DB") {
                // TODO: Check if AR account is present
                sntPaymentSrv.checkARStatus($scope.postingAccountId).then(data=> {
                    if (data.company_present && data.travel_agent_present) {
                        $scope.$emit("SHOW_AR_SELECTION", data);
                    } else if (data.company_present) {
                        data.company_ar_attached ? $scope.submitPayment({
                            "ar_type": "company"
                        }) : promptCreateAR({
                            account_id: data.company_id,
                            is_auto_assign_ar_numbers: data.is_auto_assign_ar_numbers
                        });
                    } else if (data.travel_agent_present) {
                        data.travel_agent_ar_attached ? $scope.submitPayment({
                            "ar_type": "travel_agent"
                        }) : promptCreateAR({
                            account_id: data.travel_agent_id,
                            is_auto_assign_ar_numbers: data.is_auto_assign_ar_numbers
                        });
                    } else {
                        $scope.errorMessage = [$filter('translate')('ACCOUNT_ID_NIL_MESSAGE_PAYMENT')];
                    }
                }, errorMessage => {
                    console.log("payment failed" + errorMessage);
                    $scope.$emit('PAYMENT_FAILED', errorMessage);
                    $scope.$emit('hideLoader');
                })
            } else {
                $scope.submitPayment();
            }
        };

        /**
         *
         */
        $scope.submitPayment = function(payLoad) {

            if ($scope.payment.amount === '' || $scope.payment.amount === null) {
                var errorMessage = ["Please enter amount"];
                $scope.$emit('ERROR_OCCURED', errorMessage);
                return;
            }

            var params = intiateSubmitPaymentParams(payLoad);

            //check if chip and pin is selected in case of six payments
            //the rest of actions will in paySixPayController
            if ($scope.selectedPaymentType === 'CC' &&
                $scope.hotelConfig.paymentGateway === 'sixpayments' && !$scope.payment.isManualEntryInsideIFrame) {
                $scope.$broadcast('INITIATE_CHIP_AND_PIN_PAYMENT', params);
                return;
            }

            //for CC payments, we need payment type id
            var paymentTypeId;

            if ($scope.selectedPaymentType === 'CC' && $scope.selectedCard !== -1) {
                paymentTypeId = $scope.selectedCC.value;
            } else {
                paymentTypeId = null;
            }

            if (params.postData.payment_type === "GIFT_CARD") {
                params.postData.card_number = $.trim($scope.giftCard.number); //trim to remove whitespaces from copy-paste
            } else {
                //Needn't pass payment_type_id in case of gift card payment
                params.postData.payment_type_id = paymentTypeId;
            }

            //we need to notify the parent controllers to show loader
            //as this is an external directive
            $scope.$emit('showLoader');

            sntPaymentSrv.submitPayment(params).then(response => {
                    $scope.onPaymentSuccess(response);
                    $scope.$emit('hideLoader');
                }, errorMessage => {
                    $scope.paymentAttempted = true;
                    $scope.isPaymentFailure = true;

                    $scope.paymentErrorMessage = errorMessage[0];
                    console.log("payment failed" + errorMessage);
                    $scope.$emit('PAYMENT_FAILED', errorMessage);
                    $scope.$emit('hideLoader');
                }
            );

        };

        var calculateFee = function() {
            if (!$scope.hotelConfig.isStandAlone) {
                return;
            }
            var selectedPaymentType = _.find($scope.paymentTypes, {
                    name: $scope.selectedPaymentType
                }),
                feeInfo = selectedPaymentType && selectedPaymentType.charge_code && selectedPaymentType.charge_code.fees_information || {};

            // In case a credit card is selected; the fee information is to be that of the card
            if (!!selectedPaymentType && selectedPaymentType.name === "CC" && $scope.selectedCC) {
                var cardTypeInfo = _.find(selectedPaymentType.values, ({cardcode: $scope.selectedCC.card_code}));
                feeInfo = (cardTypeInfo && cardTypeInfo.charge_code && cardTypeInfo.charge_code.fees_information) ||
                    feeInfo;
            }


            var currFee = sntPaymentSrv.calculateFee($scope.payment.amount, feeInfo);

            $scope.isDisplayRef = selectedPaymentType && selectedPaymentType.is_display_reference;


            $scope.feeData = {
                calculatedFee: currFee.calculatedFee,
                totalOfValueAndFee: currFee.totalOfValueAndFee,
                showFee: currFee.showFees,
                feeChargeCode: currFee.feeChargeCode
            };
        };

        /**
         * This method handles manual entry of Gift Card
         */
        $scope.onChangeGiftCard = function() {
            var charLength = $scope.giftCard.number.length;

            if (charLength >= 8 && charLength <= 22) {

                $scope.$emit('showLoader');

                sntPaymentSrv.fetchGiftCardBalance($scope.giftCard.number).then(response => {
                    //NOTE: response.expiry_date is unused at this time
                    $scope.giftCard.availableBalance = response.amount;
                    $scope.giftCard.amountAvailable = true;
                    $scope.$emit('hideLoader');
                }, errorMessage => {
                    $scope.giftCard.amountAvailable = false;
                    $scope.errorMessage = errorMessage;
                });

            } else {
                //hides the field and reset the amount stored
                $scope.giftCard.amountAvailable = false;
                $scope.giftCard.availableBalance = null;
            }
        };

        // Payment type change action
        $scope.onPaymentInfoChange = function() {
            //NOTE: Fees information is to be calculated only for standalone systems
            //TODO: See how to handle fee in case of C&P

            calculateFee();
            var selectedPaymentType = _.find($scope.paymentTypes, {
                name: $scope.selectedPaymentType
            });

            $scope.$emit("PAYMENT_TYPE_CHANGED", $scope.selectedPaymentType);

            //If the changed payment type is CC and payment gateway is MLI show CC addition options
            //If there are attached cards, show them first
            if (!!selectedPaymentType && selectedPaymentType.name === "CC") {
                if (!!PAYMENT_CONFIG[$scope.hotelConfig.paymentGateway].iFrameUrl) {
                    //Add to guestcard feature for C&P
                    $scope.payment.showAddToGuestCard = $scope.payment.isManualEntryInsideIFrame ? false : true;
                    refreshIFrame();
                } else {
                    // In case no card has been selected yet, move to add card mode
                    !$scope.showSelectedCard() && changeToCardAddMode();
                }
            } else {
                $scope.payment.showAddToGuestCard = false;
            }
        };

        $scope.onFeeOverride = function() {
            var totalAmount = parseFloat($scope.feeData.calculatedFee) + parseFloat($scope.payment.amount);
            $scope.feeData.totalOfValueAndFee = totalAmount.toFixed(2);
        };

        /**************** CC handling ********************/
        //if the selected card is clicked, go to card entry page
        $scope.onCardClick = function() {
            changeToCardAddMode();
            refreshIFrame();
        };
        //cancel CC entry and go to initial page
        $scope.cancelCardSelection = function() {
            $scope.payment.screenMode = "PAYMENT_MODE";
            $scope.selectedPaymentType = "";
            $scope.$emit("PAYMENT_TYPE_CHANGED", $scope.selectedPaymentType);
            $scope.selectedCC = {};
            calculateFee();
        };
        //choose among the existing cards
        $scope.setCreditCardFromList = function(selectedCardValue) {
            var selectedCard = _.find($scope.payment.linkedCreditCards, {
                value: selectedCardValue
            });
            $scope.selectedCC = selectedCard;
            //this need to be set to true only if new card is added
            $scope.payment.showAddToGuestCard = false;
            $scope.payment.screenMode = "PAYMENT_MODE";
            calculateFee();
        };
        //hide existing cards in some places like in guestcard add CC
        $scope.hideCardToggles = function() {
            // Below is the original condition
            // TODO: Find why toggles was hidden in case of hasAccompanyGuest
            // return $scope.isFromGuestCard  || $scope.hasAccompanyguest || ($scope.cardsList && $scope.cardsList.length === 0)
            return $scope.actionType === "ADD_PAYMENT_GUEST_CARD" || $scope.actionType === "ADD_ROUTE_PAYMENT" || !existingCardsPresent();
        };
        //list the existing cards for the reservation
        var onFetchLinkedCreditCardListSuccess = function(data) {
            $scope.$emit('hideLoader');
            $scope.payment.linkedCreditCards = _.where(data.existing_payments, {
                is_credit_card: true
            });

            if ($scope.payment.linkedCreditCards.length > 0) {
                refreshScroller('cardsList');
            }
        };

        //if there is reservationID fetch the linked credit card items
        var fetchAttachedCreditCards = function() {
            if (!!$scope.reservationId) {
                $scope.$emit('showLoader');

                sntPaymentSrv.getLinkedCardList($scope.reservationId).then(function(response) {
                        onFetchLinkedCreditCardListSuccess(response);
                        $scope.$emit('hideLoader');
                    },
                    function(errorMessage) {
                        $scope.$emit('PAYMENT_FAILED', errorMessage);
                        $scope.$emit('hideLoader');
                    });
            } else {
                $scope.payment.linkedCreditCards = [];
            }
        };
        //Extract the credit card types
        var getCrediCardTypesList = function() {
            //filter CC types from payment types
            var creditCardTypes = _.find($scope.paymentTypes, {
                name: 'CC'
            });
            return creditCardTypes && creditCardTypes.values || [];
        };

        //save CC
        var saveCCPayment = function(cardDetails) {
            $scope.$emit('showLoader');
            var params = angular.copy(cardDetails.apiParams),
                onSaveSuccess = function(response) {

                    $scope.selectedCC = $scope.selectedCC || {};

                    $scope.selectedCC.value = response.data.id;
                    $scope.selectedCard = $scope.selectedCC.value;
                    $scope.selectedCC.card_code = cardDetails.cardDisplayData.card_code;
                    $scope.selectedCC.ending_with = cardDetails.cardDisplayData.ending_with;
                    $scope.selectedCC.expiry_date = cardDetails.cardDisplayData.expiry_date;
                    $scope.selectedCC.holder_name = cardDetails.cardDisplayData.name_on_card;

                    $scope.payment.screenMode = "PAYMENT_MODE";

                    $scope.$emit("PAYMENT_SAVE_CARD_SUCCESS");

                    calculateFee();
                    showAddtoGuestCardBox();
                }, onSaveFailure = function(errorMessage) {
                    $scope.errorMessage = errorMessage;
                };

            if (!!$scope.accountId) {
                params["account_id"] = $scope.accountId;
            }
            if (!!$scope.groupId) {
                params["group_id"] = $scope.groupId;
            }
            if (!!$scope.allotmentId) {
                params["allotment_id"] = $scope.allotmentId;
            }

            sntPaymentSrv.savePaymentDetails(params).then(function(response) {
                    if (response.status === "success") {
                        onSaveSuccess(response);
                    } else {
                        onSaveFailure(response.errors);
                    }
                    $scope.$emit('hideLoader');
                },
                function(errorMessage) {
                    onSaveFailure(errorMessage);
                    $scope.$emit('hideLoader');
                });
        };

        /**
         * This metod is used for saving a credit card in the AR Transactions Tab
         * @param cardDetails
         */
        var addBillPayment = function(cardDetails) {
            $scope.$emit('showLoader');
            var params = angular.copy(cardDetails.apiParams),
                onSaveSuccess = function(response) {

                    $scope.selectedCC = $scope.selectedCC || {};

                    $scope.selectedCC.value = response.id;
                    $scope.selectedCard = $scope.selectedCC.value;
                    $scope.selectedCC.card_code = cardDetails.cardDisplayData.card_code;
                    $scope.selectedCC.ending_with = cardDetails.cardDisplayData.ending_with;
                    $scope.selectedCC.expiry_date = cardDetails.cardDisplayData.expiry_date;
                    $scope.selectedCC.holder_name = cardDetails.cardDisplayData.name_on_card;

                    $scope.payment.screenMode = "PAYMENT_MODE";
                    calculateFee();
                }, onSaveFailure = function(errorMessage) {
                    $scope.errorMessage = errorMessage;
                };

            // NOTE: This API is very similar to that of the one called through sntPaymentSrv.savePaymentDetails
            sntPaymentSrv.addBillPaymentMethod({
                billId: $scope.billId,
                payLoad: {
                    ...params,
                    workstation_id: $scope.hotelConfig.workstationId
                }
            }).then(function(response) {
                    onSaveSuccess(response);
                    $scope.$emit('hideLoader');
                },
                function(errorMessage) {
                    onSaveFailure(errorMessage);
                    $scope.$emit('hideLoader');
                });
        };

        $scope.$on(payEvntConst.CC_TOKEN_GENERATED, function(event, data) {
            var paymentData = data.paymentData;

            if ($scope.actionType === "ADD_PAYMENT_GUEST_CARD" || !!paymentData.apiParams.mli_token) {
                $scope.payment.tokenizedCardData = paymentData;
                $scope.selectedCC = $scope.selectedCC || {};
                $scope.selectedCC.card_code = paymentData.cardDisplayData.card_code;
                $scope.selectedCC.ending_with = paymentData.cardDisplayData.ending_with;
                $scope.selectedCC.expiry_date = paymentData.cardDisplayData.expiry_date;
                $scope.selectedCC.holder_name = paymentData.apiParams.name_on_card;

                $scope.payment.screenMode = "PAYMENT_MODE";
            } else {
                $scope.payment.tokenizedCardData = null;
            }
            //TODO: APIs have to be evaluated in this add payment workflow!
            if ($scope.actionType === "AR_SUBMIT_PAYMENT") {
                addBillPayment(paymentData);
            }
            else if ($scope.actionType !== "ADD_PAYMENT_GUEST_CARD") {
                saveCCPayment(paymentData);
            }
        });

        /**
         * Method to find if a refund is happening
         * @returns {boolean}
         */
        $scope.isRefund = function() {
            return $scope.payment.amount < 0;
        };

        /**
         * The gift card toggle to be shown only for connected hotels and IFF
         * Gift card is enabled as a payment type
         * @returns {boolean}
         */
        $scope.showGiftCardToggle = function() {
            var isGiftCardEnabled = _.find($scope.paymentTypes, {
                name: "GIFT_CARD"
            });

            return !$scope.hotelConfig.isStandAlone && !!isGiftCardEnabled;
        };

        var onAmountChange = function() {
            $scope.payment.amount = $scope.amount || 0;
            calculateFee();
        };

        $scope.onPaymentSuccess = function(response) {
            $scope.paymentAttempted = true;
            $scope.isPaymentFailure = false;
            $scope.payment.authorizationCode = response.authorization_code;

            response.amountPaid = $scope.payment.amount;
            response.authorizationCode = response.authorization_code;
            // NOTE: The feePaid key and value would be sent IFF a fee was applied along with the payment
            if ($scope.feeData) {
                response.feePaid = $scope.feeData.calculatedFee;
            }

            if ($scope.selectedPaymentType === "CC") {
                response.cc_details = angular.copy($scope.selectedCC);
            }

            if ($scope.payment.showAddToGuestCard) {
                //check if add to guest card was selected
                response.add_to_guest_card = $scope.payment.addToGuestCardSelected;
            }

            $scope.$emit('PAYMENT_SUCCESS', response);
        };

        $scope.showSixPaymentsModeSelection = function() {
            return $scope.hotelConfig.paymentGateway === 'sixpayments' &&
                $scope.selectedPaymentType === 'CC' &&
                $scope.payment.screenMode === 'PAYMENT_MODE' &&
                (!$scope.paymentAttempted || $scope.isPaymentFailure);
        };

        /****************** init ***********************************************/

        (function() {
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

            $scope.$watch('paymentTypes', ()=> {
                $scope.payment.creditCardTypes = getCrediCardTypesList();
            });

            $scope.payment.amount = $scope.amount || 0;
            $scope.payment.isRateSuppressed = $scope.isRateSuppressed || false;
            $scope.payment.isEditable = $scope.isEditable || true;
            $scope.billNumber = $scope.billNumber || 1;
            $scope.payment.linkedCreditCards = $scope.linkedCreditCards || [];


            $scope.payment.screenMode = "PAYMENT_MODE";
            $scope.payment.addCCMode = "ADD_CARD";
            $scope.payment.creditCardTypes = getCrediCardTypesList();
            $scope.payment.guestFirstName = $scope.firstName || '';
            $scope.payment.guestLastName = $scope.lastName || '';

            if (!$scope.hotelConfig) {
                throw "Need hotel config to proceed. Need the following params.\n isStandAlone, paymentGateway, workstationId, emvTimeout, mliMerchantId, and currencySymbol";
            }

            /**
             * Note:
             * flags 'isManualCCEntryEnabled' and 'isStandAlone' are retained as set in rvRoverController.js for
             * Rover App -> These are obtained from the app settings
             */
            $scope.hotelConfig.mliMerchantId = $scope.hotelConfig.mliMerchantId || "";
            $scope.hotelConfig.workstationId = $scope.workstationId || '';
            $scope.hotelConfig.emvTimeout = $scope.hotelConfig.emvTimeout || 120;
            $scope.hotelConfig.paymentGateway = $scope.hotelConfig.paymentGateway || "";

            $scope.currencySymbol = $scope.hotelConfig.currencySymbol;

            if ($scope.fetchLinkedCards) {
                fetchAttachedCreditCards();
            }

            $scope.$emit('SET_SCROLL_FOR_EXISTING_CARDS');

            //check if card is present, if yes turn on flag
            if ($scope.hotelConfig.paymentGateway === 'sixpayments') {
                var isCCPresent = ($scope.selectedPaymentType === "CC" &&
                (!!$scope.selectedCC && !!$scope.selectedCC.ending_with && $scope.selectedCC.ending_with.length > 0));
                $scope.payment.isManualEntryInsideIFrame = true;
                //Add to guestcard feature for C&P
                $scope.payment.showAddToGuestCard = $scope.payment.isManualEntryInsideIFrame ? false : true;
            }

            var paths = sntPaymentSrv.resolvePaths($scope.hotelConfig.paymentGateway, {
                card_holder_first_name: $scope.payment.guestFirstName,
                card_holder_last_name: $scope.payment.guestLastName
            });

            $scope.payment.iFrameUrl = paths.iFrameUrl;
            $scope.paymentGatewayUIInterfaceUrl = paths.paymentGatewayUIInterfaceUrl;

            /* In case there is swiped data available
             * This scenario is possible in case of add payments in stay-card; guest-card and stay-card bill screens.
             */
            if ($scope.swipedCardData) {
                $timeout(()=> {
                    $scope.$broadcast("RENDER_SWIPED_DATA", JSON.parse($scope.swipedCardData));
                }, 300);
            }

            /**
             *
             */
            if (!$scope.hotelConfig.isStandAlone) {
                changeToCardAddMode();
            }

            // For initial calculation of fee and other details
            $timeout($scope.onPaymentInfoChange, 1000);

            setScroller('cardsList', {'click': true, 'tap': true});
        })();

    }
]);