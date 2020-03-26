sntZestStation.controller('zsReservationBillDetailsCtrl', [
    '$scope',
    '$state',
    'zsCheckoutSrv', 'zsEventConstants', '$stateParams', 'zsModeConstants', '$window', '$timeout', 'zsUtilitySrv', '$log', 'zsPaymentSrv', 'zsStateHelperSrv', '$translate',
    function ($scope, $state, zsCheckoutSrv, zsEventConstants, $stateParams, zsModeConstants, $window, $timeout, zsUtilitySrv, $log, zsPaymentSrv, zsStateHelperSrv, $translate) {


        /** *********************************************************************************************
         **      Please note that, not all the stateparams passed to this state will not be used in this state,
         **      however we will have to pass this so as to pass again to future states which will use these.
         **
         **      Expected state params -----> from, reservation_id,email, guest_detail_id,
         **      has_cc, first_name, last_name, days_of_stay, is_checked_out and hours_of_stay
         **      Exit functions -> checkOutSuccess
         **
         ************************************************************************************************/

        /**
         * This controller is used to View bill
         * Print actions are separated and grouped in zsPrintBillCtrl - included in zsReservationBill.html
         * */

        BaseCtrl.call(this, $scope);
        var email = !_.isNull($stateParams.email) ? $stateParams.email : '';

        /**
         * [clickedOnCloseButton description]
         * @return {[type]} [description]
         */
        $scope.clickedOnCloseButton = function () {
            // if key card was inserted we need to eject that
            $scope.$emit('EJECT_KEYCARD');
            $state.go('zest_station.home');
        };

        /* 
         *  To setup scroll
         */
        $scope.setScroller('bill-list');

        var refreshScroller = function () {
            $scope.refreshScroller('bill-list');
        };

        $scope.setScroller('charge-list-scroll');
        $scope.setScroller('quantity-list-scroll');

        var refreshChargeScroller = function () {
            $scope.refreshScroller('charge-list-scroll');
            $scope.refreshScroller('quantity-list-scroll');
        };

        /**
         *  general failure actions inside bill screen
         **/
        var failureCallBack = function () {
            // if key card was inserted we need to eject that
            $scope.$emit('EJECT_KEYCARD');
            $state.go('zest_station.speakToStaff');
        };

        var fetchBillSuccess = function (response) {

            // process bill data
            var billsData = response.bill_details.fee_details;

            $scope.billData = [];
            $scope.zestStationData.currency = response.bill_details.currency;
            $scope.net_amount = response.bill_details.total_fees;
            $scope.deposit = response.bill_details.credits;
            $scope.balance = response.bill_details.balance;
            $scope.bill_id = response.bill_details.primary_bill_id;
            $scope.spillage_included = response.bill_details.spillage_included;

            $scope.paymentDetails = response.payment_details;

            angular.forEach(billsData, function (billData) {
                angular.forEach(billData.charge_details, function (chargeDetail) {
                    var bill_details = {
                        'date': billData.date,
                        'description': chargeDetail.description,
                        'reference_text': chargeDetail.reference_text || '',
                        'amount': chargeDetail.amount
                    };

                    $scope.billData.push(bill_details);
                });
            });
            $scope.isReservationDetailsFetched = true;
            // scroller setup
            setDisplayContentHeight(); // utils function
            refreshScroller();
        };

        $scope.setupBillData = function () {
            var options = {
                params: {
                    'reservation_id': $scope.reservation_id
                },
                successCallBack: fetchBillSuccess,
                failureCallBack: failureCallBack
            };

            $scope.callAPI(zsCheckoutSrv.fetchBillDetails, options);
        };

        var printoptedAfterEmail,
            printYetToDoneAfterEMail,
            emailToBeSendAlongWithPrint;

        var nextActionsFromEmail = function(emailToBeSendAlongWithPrint) {
            $scope.$broadcast('EMAIL_TO_BE_SEND_WITH_PRINT', {
                'sendEmail': emailToBeSendAlongWithPrint
            });
            if (printYetToDoneAfterEMail) {
                $scope.printOpted = true;
            } else {
                $state.go('zest_station.reservationCheckedOut', {
                    'printopted': printoptedAfterEmail
                });
            }
        };

        $scope.emailInvoice = function(addressType) {
            var emailSendingSuccess = function() {
                if (printYetToDoneAfterEMail) {
                    $scope.stateParamsForNextState.email_sent = 'true';
                    $scope.emailBillingOptions = false;
                    $scope.printOpted = true; // print mode
                } else {
                    $state.go('zest_station.reservationCheckedOut', {
                        'printopted': printYetToDoneAfterEMail ? "true" : "false",
                        'email_sent': 'true'
                    });
                }
            };
            var emailSendingFailed = function() {
                if (printYetToDone) {
                    $scope.stateParamsForNextState.email_failed = 'true';
                    $scope.printOpted = true; // print mode
                } else {
                    $state.go('zest_station.reservationCheckedOut', {
                        'printopted': printoptedAfterEmail,
                        'email_failed': 'true'
                    });
                }
            };
            var params = {
                reservation_id: $stateParams.reservation_id,
                bill_number: '1',
                bill_address_type: addressType
            };
            var options = {
                params: params,
                successCallBack: emailSendingSuccess,
                failureCallBack: emailSendingFailed
            };

            $scope.callAPI(zsCheckoutSrv.sendBill, options);
        };

        var fetcCompanyTADetails = function() {
            var successCallBack = function(response) {
                $scope.emailData = {};
                $scope.emailData.guest_info = response.guest;
                $scope.emailData.company_card_details = response.company_card;
                if (response &&
                    (response.company_card && response.company_card.name)) {
                    $scope.emailBillingOptions = true;
                } else {
                    $scope.emailInvoice('guest');
                }
            };

            var data = {
                'reservation_id': $scope.reservation_id
            };
            var options = {
                params: data,
                successCallBack: successCallBack
            };

            $scope.callAPI(zsCheckoutSrv.fetchCompanyTADetails, options);
        };


        var sendEmail = function(printopted, printYetToDone, emailToBeSendAlongWithPrint) {

            printoptedAfterEmail = printopted;
            printYetToDoneAfterEMail = printYetToDone;
            emailToBeSendAlongWithPrint = emailToBeSendAlongWithPrint;

            if (emailToBeSendAlongWithPrint && zsUtilitySrv.isValidEmail($stateParams.email || "")) {
                $scope.emailBillingOptions = false;
                nextActionsFromEmail(emailToBeSendAlongWithPrint);
            } else if (zsUtilitySrv.isValidEmail($stateParams.email || "")) {
                fetcCompanyTADetails();
            } else {
                nextActionsFromEmail();
            }
        };
        var setPlaceholderData = function (data) {
            // for demo | quick-jumping
            $scope.first_name = data.first_name;
            $scope.last_name = data.last_name;
            $scope.days_of_stay = data.days_of_stay;
            $scope.hours_of_stay = data.hours_of_stay;
            fetchBillSuccess(data.fees_sample);
        };
        var setupBillPlaceholderData = function () {
            $log.log('Jumping to Screen with demo data');

            var options = {
                successCallBack: function (response) {
                    var data = response.paths;

                    setPlaceholderData(data[0].data);
                }
            };

            $scope.callAPI(zsCheckoutSrv.fetchBillPlaceholderData, options);
        };


        /**
         *  Checkout the Guest
         */
        $scope.checkOutGuest = function () {
            var params = {
                'reservation_id': $scope.reservation_id,
                'is_kiosk': true
            };
            var checkOutSuccess = function () {
                $scope.$emit('CAPTURE_KEY_CARD');
                var guest_bill = $scope.zestStationData.guest_bill;

                // guest_bill.email refers to update email not the send email
                // email will be always send (atleast try to send, may fail sometimes)
                // yes..yes..the name is confusing..i know
                // cant do much with this now. It saved in admin like that
                var printopted = 'false';
                var printYetToDone;
                // if update email and print option are off

                if (!guest_bill.email && !guest_bill.print) {
                    printopted = 'false';
                    printYetToDone = false;
                    // send mail and don't print
                    sendEmail(printopted, printYetToDone);
                } else if (guest_bill.email && !guest_bill.print) {
                    // updat email turned on and print is off
                    $state.go('zest_station.emailBill', $scope.stateParamsForNextState);
                } else if (guest_bill.print) { // go to print nav
                    if (!guest_bill.email) {
                        // send mail and then print
                        printYetToDone = true;
                        sendEmail(printopted, printYetToDone, true);
                    } else {
                        // print first and then email
                        $scope.printOpted = true;
                    }
                }

            };
            var options = {
                params: params,
                successCallBack: checkOutSuccess,
                failureCallBack: failureCallBack
            };

            if ($scope.inDemoMode()) {
                checkOutSuccess();
            } else {
                $scope.callAPI(zsCheckoutSrv.checkoutGuest, options);
            }
        };
        /**
         *  We check if the balance is greater than 0 and has no CC.
         *  If so we redirect to the staff
         */

        var checkIfDueBalancePresent = function () {
            if (parseInt($scope.balance) === 0 || $scope.inDemoMode()) {
                // if balance is 0, allow checkout
                return false;
            } else if (parseInt($scope.balance) < 0) {
                // if refund if present, don't allow checkout
                return true;
            }
            $scope.has_cc = $scope.has_cc === 'true' || $scope.has_cc;
            // if balance >0, allow checkout if CC is present
            return !$scope.has_cc;

        };

        var noBalaceNextActions = function () {
            $scope.runDigestCycle();
            if (!$scope.zestStationData.is_standalone) {
                $scope.$emit('hideLoader');
                $state.go('zest_station.emailBill', $scope.stateParamsForNextState);
            } else {
                $scope.checkOutGuest();
            }
        };

        // Add/remove items to post charge
        $scope.updateQuantity = function (groupId, itemIndex, addAmount) {
            if (addAmount === -1 && $scope.chargeData.groupedItems[groupId].items[itemIndex].quantity === 0) {
                return;
            }
            $scope.chargeData.groupedItems[groupId].quantity += addAmount;
            $scope.chargeData.groupedItems[groupId].items[itemIndex].quantity += addAmount;
            $scope.chargeData.total += $scope.chargeData.groupedItems[groupId].items[itemIndex].unit_price * addAmount;
        };

        var setPostChargeContentHeight = function() {
            $timeout(function() {
                var $contentHeight = ($('#content').outerHeight()),
                    $h1Height = $('#minibar-heading').length ? $('#minibar-heading').outerHeight(true) : 0,
                    $textualHeight = parseFloat($contentHeight - $h1Height + 5);

                $scope.chargeData.maxHeight = $textualHeight + 'px';
                refreshChargeScroller();
            }, 100);
        };

        $scope.getChargeGroups = function () {
            var fetchChargeGroupFailure = function () {
                $scope.showPostChargeScreen = false;
            };

            var fetchChargeGroupSuccess = function (response) {
                $scope.chargeData.chargeGroups = response.results;
                $scope.getChargeItems();
            };

            var options = {
                params: {
                    locale: $translate.use()
                },
                successCallBack: fetchChargeGroupSuccess,
                failureCallBack: fetchChargeGroupFailure
            };

            $scope.callAPI(zsCheckoutSrv.fetchChargeGroups, options);
        };

        // Fetch items
        $scope.getChargeItems = function () {
            var fetchItemsFailure = function () {
                $scope.showPostChargeScreen = false;
            };

            var fetchItemsSuccess = function (response) {
                $scope.showPostChargeScreen = true;
                $scope.chargeData.chargeItems = response.results;
                $scope.chargeData.total = 0;

                $scope.chargeData.groupedItems = $scope.chargeData.chargeGroups.reduce(function (map, obj) {
                    obj['items'] = [];
                    obj['quantity'] = 0;
                    obj['is_open'] = false;
                    map[obj.id] = obj;
                    return map;
                }, {});

                // Map non-group-items to -1
                $scope.chargeData.groupedItems[-1] = {
                    id: -1,
                    items: [],
                    quantity: 0,
                    is_open: false
                };

                for (var i = 0, itemLen = $scope.chargeData.chargeItems.length; i < itemLen; i++) {
                    $scope.chargeData.chargeItems[i].quantity = 0;
                    if ($scope.chargeData.chargeItems[i].charge_group_id) {
                        $scope.chargeData.groupedItems[$scope.chargeData.chargeItems[i].charge_group_id].items.push($scope.chargeData.chargeItems[i]);
                    } else {
                        $scope.chargeData.groupedItems[-1].items.push($scope.chargeData.chargeItems[i]);
                    }
                }

                // Discard groups without any items
                for (var groupId in $scope.chargeData.groupedItems) {
                    if ($scope.chargeData.groupedItems.hasOwnProperty(groupId)) {
                        if (!$scope.chargeData.groupedItems[groupId].items.length) {
                            delete $scope.chargeData.groupedItems[groupId];
                        }
                    }
                }
                // If there is ony one group, by default keep it open
                if (Object.keys($scope.chargeData.groupedItems).length === 1) {
                    $scope.chargeData.groupedItems[Object.keys( $scope.chargeData.groupedItems)[0]].is_open = true;
                }

                setPostChargeContentHeight();
                
            };

            var options = {
                params: {
                    locale: $translate.use(),
                    application: 'KIOSK'
                },
                successCallBack: fetchItemsSuccess,
                failureCallBack: fetchItemsFailure
            };

            $scope.callAPI(zsCheckoutSrv.fetchChargeItems, options);
        };

        $scope.toggleOpenMenu = function(group) {
            group.is_open = !group.is_open;
            setPostChargeContentHeight();
        };

        var initPostChargeData = function () {
            $scope.chargeData = {
                chargeGroups: [],
                chargeItems: [],
                groupedItems: {},
                maxHeight: 'none',
                total: 0
            };
        };

        // Add charge button click handler
        $scope.clickedAddCharge = function () {
            initPostChargeData();
            $scope.getChargeGroups();
        };

        // Post charge for selected items
        $scope.postCharge = function () {
            var updatedItems = [],
                postData = {
                    bill_no: '1',
                    fetch_total_balance: false,
                    post_anyway: true,
                    total: $scope.chargeData.total,
                    reservation_id: $scope.reservation_id,
                    workstation_id: $scope.workstation_id
                };

            for (var i = 0, itemLen = $scope.chargeData.chargeItems.length; i < itemLen; i++) {
                if ($scope.chargeData.chargeItems[i].quantity > 0) {
                    updatedItems.push({
                        amount: $scope.chargeData.chargeItems[i].quantity * $scope.chargeData.chargeItems[i].unit_price,
                        is_item: true,
                        quantity: $scope.chargeData.chargeItems[i].quantity,
                        reference_text: "",
                        show_ref_on_invoice: true,
                        value: $scope.chargeData.chargeItems[i].id
                    });
                }
            }
            postData.items = updatedItems;

            var postChargeFailure = function (error) {
                $scope.errorMessage = error[0];
                $scope.errorHeader = 'POST_ITEMS_ERROR_HEADER';
                $scope.showPostErrorPopup = true;
            };

            var postChargeSuccess = function () {
                $scope.$emit('hideLoader');
                $scope.showPostChargeScreen = false;
                // Fetch data again to refresh the screen with new data
                $scope.setupBillData();
            };

            var options = {
                params: postData,
                successCallBack: postChargeSuccess,
                failureCallBack: postChargeFailure
            };

            if ($scope.chargeData.total) {
                $scope.callAPI(zsCheckoutSrv.postCharges, options);
            }
        };

        $scope.nextClicked = function () {
            if (parseFloat($scope.balance) !== 0 && $scope.zestStationData.kiosk_collect_balance) {
                zsStateHelperSrv.setPreviousStateParams($stateParams);

                zsPaymentSrv.setPaymentData({
                    amount: $scope.balance,
                    reservation_id: $scope.reservation_id,
                    workstation_id: $scope.workstation_id,
                    bill_id: $scope.bill_id,
                    payment_details: $scope.paymentDetails
                });

                $state.go('zest_station.payment');
            } else if (checkIfDueBalancePresent()) {
                $log.warn('reservation has balance due');
                $state.go('zest_station.speakToStaff');
            } else {
                noBalaceNextActions();
            }
        };

        $scope.init = function () {
            if ($stateParams.isQuickJump === 'true') {
                setupBillPlaceholderData();

            } else {
                // !! IF THESE STATEPARAMS CHANGE, PLEASE Update setupBillPlaceholderData method/dummy data !!
                // retrieve state variable to be displayed
                $scope.from = $stateParams.from;
                $scope.reservation_id = $stateParams.reservation_id;
                $scope.has_cc = $stateParams.has_cc;
                $scope.first_name = $stateParams.first_name;
                $scope.last_name = $stateParams.last_name;
                $scope.days_of_stay = $stateParams.days_of_stay;
                $scope.hours_of_stay = $stateParams.hours_of_stay;
                $scope.restrict_post = $stateParams.restrict_post;

                // storing state varibales to be used in print view also
                $scope.stateParamsForNextState = {
                    'from': $stateParams.from,
                    'reservation_id': $stateParams.reservation_id,
                    'email': email,
                    'guest_detail_id': $stateParams.guest_detail_id,
                    'has_cc': $stateParams.has_cc,
                    'first_name': $stateParams.first_name,
                    'last_name': $stateParams.last_name,
                    'days_of_stay': $stateParams.days_of_stay,
                    'hours_of_stay': $stateParams.hours_of_stay,
                    'is_checked_out': $stateParams.is_checked_out
                };

                if ($stateParams.dueBalancePaid === 'true' || $stateParams.dueBalancePaid === true) {
                    noBalaceNextActions();
                } else {
                    $scope.setupBillData();
                }
            }
            $scope.isReservationDetailsFetched = false;
        };

        /**
         * [initializeMe description]
         * @return {[type]} [description]
         */
        (function () {
            // show back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

            // back button action
            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function () {
                if ($scope.showPostChargeScreen) {
                    $scope.showPostChargeScreen = false;
                } else if ($stateParams.from === 'searchByName') {
                    $state.go('zest_station.checkOutReservationSearch');
                } else {
                    $state.go('zest_station.checkoutKeyCardLookUp');
                }
            });

            $scope.showPostChargeScreen = false;
            initPostChargeData();
            $scope.init();
        }());
    }
]);
