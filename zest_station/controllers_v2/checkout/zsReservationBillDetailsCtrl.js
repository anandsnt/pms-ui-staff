sntZestStation.controller('zsReservationBillDetailsCtrl', [
    '$scope',
    '$state',
    'zsCheckoutSrv', 'zsEventConstants', '$stateParams', 'zsModeConstants', '$window', '$timeout', 'zsUtilitySrv', '$log', 'zsPaymentSrv', 'zsStateHelperSrv',
    function ($scope, $state, zsCheckoutSrv, zsEventConstants, $stateParams, zsModeConstants, $window, $timeout, zsUtilitySrv, $log, zsPaymentSrv, zsStateHelperSrv) {


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


        var sendEmail = function (printopted, printYetToDone) {

            var emailSendingSuccess = function () {
                if (printYetToDone) {
                    $scope.stateParamsForNextState.email_sent = 'true';
                    $scope.printOpted = true; // print mode
                } else {
                    $state.go('zest_station.reservationCheckedOut', {
                        'printopted': printopted,
                        'email_sent': 'true'
                    });
                }
            };
            var emailSendingFailed = function () {
                if (printYetToDone) {
                    $scope.stateParamsForNextState.email_failed = 'true';
                    $scope.printOpted = true; // print mode
                } else {
                    $state.go('zest_station.reservationCheckedOut', {
                        'printopted': printopted,
                        'email_failed': 'true'
                    });
                }
            };
            var params = {
                reservation_id: $stateParams.reservation_id,
                bill_number: '1'
            };
            var options = {
                params: params,
                successCallBack: emailSendingSuccess,
                failureCallBack: emailSendingFailed
            };
            // check if email is valid
            // if invalid dont send mail

            if (zsUtilitySrv.isValidEmail($stateParams.email)) {
                $scope.callAPI(zsCheckoutSrv.sendBill, options);
            } else {
                if (printYetToDone) {
                    $scope.printOpted = true;
                } else {
                    $state.go('zest_station.reservationCheckedOut', {
                        'printopted': printopted
                    });
                }
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
                        sendEmail(printopted, printYetToDone);
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
        $scope.updateQuantity = function (index, addAmount) {
            $scope.chargeData.chargeItems[index].quantity += addAmount;
            $scope.chargeData.total += $scope.chargeData.chargeItems[index].unit_price * addAmount;
        };

        var setPostChargeContentHeight = function () {
            var $contentHeight = ($('#content').outerHeight()),
                $h1Height = $('#content h1').length ? $('#content h1').outerHeight(true) : 0,
                $h2Height = $('#content h2').length ? $('#content h2').outerHeight(true) : 0,
                $h3Height = $('#content h3').length ? $('#content h3').outerHeight(true) : 0,
                $headingsHeight = parseFloat($h1Height + $h2Height + $h3Height),
                $textualHeight = parseFloat($contentHeight - $headingsHeight);
            $scope.chargeData.maxHeight = $textualHeight + 'px';
        };

        // Fetch items
        $scope.getChargeItems = function () {
            var fetchItemsFailure = function (error) {
                console.log(error)
            };

            var fetchItemsSuccess = function (response) {
                $scope.showPostChargeScreen = true;
                $scope.chargeData.chargeItems = response.results;

                for (var i = 0, itemLen = $scope.chargeData.chargeItems.length; i < itemLen; i++) {
                    $scope.chargeData.chargeItems[i].quantity = 0;
                }

                setPostChargeContentHeight();
                refreshChargeScroller();
            };

            var options = {
                successCallBack: fetchItemsSuccess,
                failureCallBack: fetchItemsFailure
            };

            $scope.callAPI(zsCheckoutSrv.fetchChargeItems, options);
        };

        // Add charge button click handler
        $scope.clickedAddCharge = function () {
            $scope.getChargeItems();
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
                console.log(error)
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
            }

            $scope.callAPI(zsCheckoutSrv.postCharges, options);
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
                $stateParams.email = !_.isNull($stateParams.email) ? $stateParams.email : '';

                // storing state varibales to be used in print view also
                $scope.stateParamsForNextState = {
                    'from': $stateParams.from,
                    'reservation_id': $stateParams.reservation_id,
                    'email': $stateParams.email,
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
            $scope.chargeData = {
                chargeItems: [],
                maxHeight: 'none',
                total: 0
            };

            $scope.init();
        }());
    }
]);
