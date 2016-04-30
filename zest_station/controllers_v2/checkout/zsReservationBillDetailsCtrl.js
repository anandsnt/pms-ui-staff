sntZestStation.controller('zsReservationBillDetailsCtrl', [
    '$scope',
    '$state',
    'zsCheckoutSrv', 'zsEventConstants', '$stateParams', 'zsModeConstants', '$window', '$timeout',
    function($scope, $state, zsCheckoutSrv, zsEventConstants, $stateParams, zsModeConstants, $window, $timeout) {

        /**
         * This controller is used to print Bill and View bill
         * They share data, so using same controller.
         * Print actions are separated and grouped below
         * */
        BaseCtrl.call(this, $scope);

        /**
         * when the back button clicked
         * @param  {[type]} event
         * @return {[type]} 
         */
        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {

            if ($stateParams.from !== 'searchByName') {
                //if key card was inserted we need to eject that
                if ($scope.zestStationData.keyCardInserted) {
                    $scope.socketOperator.EjectKeyCard();
                };
                $state.go('zest_station.checkoutSearchOptions');
            } else {
                $state.go('zest_station.checkOutReservationSearch');
            };

        });

        /**
         * [clickedOnCloseButton description]
         * @return {[type]} [description]
         */
        $scope.clickedOnCloseButton = function() {
            //if key card was inserted we need to eject that
            if ($scope.zestStationData.keyCardInserted) {
                $scope.socketOperator.EjectKeyCard();
            };
            $state.go('zest_station.home');
        };

        /* 
         *  To setup scroll
         */
        $scope.setScroller('bill-list');

        var setTermsConditionsHeight = function() {
            if ($('#textual').length) {
                var $contentHeight = ($('#content').outerHeight()),
                    $h1Height = $('#content h1').length ? $('#content h1').outerHeight(true) : 0,
                    $h2Height = $('#content h2').length ? $('#content h2').outerHeight(true) : 0,
                    $h3Height = $('#content h3').length ? $('#content h3').outerHeight(true) : 0,
                    $headingsHeight = parseFloat($h1Height + $h2Height + $h3Height),
                    $textualHeight = parseFloat($contentHeight - $headingsHeight);
                //$('#textual').css('height', $textualHeight + 'px');
                $('#textual').css('height', '45%');
                $('#textual').css('max-height', '100%');
            }
        };

        var refreshScroller = function() {
            $scope.refreshScroller('bill-list');
        };
        /**
         *  general failure actions inside bill screen
         **/
        var failureCallBack = function() {
            //if key card was inserted we need to eject that
            if ($scope.zestStationData.keyCardInserted) {
                $scope.socketOperator.EjectKeyCard();
            };
            $state.go('zest_station.speakToStaff');
        };

        var fetchBillSuccess = function(response) {

            //process bill data
            var billsData = response.bill_details.fee_details;
            $scope.billData = [];
            $scope.zestStationData.currency = response.bill_details.currency;
            $scope.net_amount = response.bill_details.total_fees;
            $scope.deposit = response.bill_details.credits;
            $scope.balance = response.bill_details.balance;

            angular.forEach(billsData, function(billData, key) {
                angular.forEach(billData.charge_details, function(chargeDetail, key) {
                    var bill_details = {
                        "date": billData.date,
                        "description": chargeDetail.description,
                        "amount": chargeDetail.amount
                    };
                    $scope.billData.push(bill_details);
                });
            });

            //scroller setup
            setTermsConditionsHeight();
            refreshScroller();
        };

        $scope.setupBillData = function() {
            var options = {
                params: {
                    "reservation_id": $scope.reservation_id
                },
                successCallBack: fetchBillSuccess,
                failureCallBack: failureCallBack
            };
            $scope.callAPI(zsCheckoutSrv.fetchBillDetails, options);
        };

        /**
         *  Checkout the Guest
         */
        var checkOutGuest = function() {
            var params = {
                "reservation_id": $scope.reservation_id,
                "is_kiosk": true
            };
            var checkOutSuccess = function() {
                $state.go('zest_station.reservationCheckedOut');
            };
            var options = {
                params: params,
                successCallBack: checkOutSuccess,
                failureCallBack: failureCallBack
            };
            $scope.callAPI(zsCheckoutSrv.checkoutGuest, options);
        };
        /**
         *  We check if the balance is greater than 0 and has no CC.
         *  If so we redirect to the staff
         */

        var cashReservationBalanceDue = function() {
            return (!$scope.has_cc && $scope.zestStationData.reservationData.balance > 0);
        };
        $scope.nextClicked = function() {

            //$scope.zestStationData.reservationData.edit_email = false;

            if (cashReservationBalanceDue()) {
                console.warn("reservation has balance due");
                $state.go('zest_station.speak_to_staff');
            } else {
                var guest_bill = $scope.zestStationData.guest_bill;

                if (!guest_bill.email && !guest_bill.print) { //immediate checkout
                    checkOutGuest();

                } else if (guest_bill.email && !guest_bill.print) { //email_only
                    $state.go('zest_station.bill_delivery_options');

                } else if (guest_bill.print) { //go to print nav
                    $scope.printOpted = true;
                }
            };
        };

        $scope.alreadyCheckedOutActions = function() {
            $state.go('zest_station.home');
            $scope.socketOperator.EjectKeyCard();
        };

        $scope.init = function() {
            $scope.from = $stateParams.from;
            $scope.reservation_id = $stateParams.reservation_id;
            // $scope.email = $stateParams.email;
            // $scope.guest_detail_id = $stateParams.guest_detail_id;
            $scope.has_cc = $stateParams.has_cc;
            $scope.first_name = $stateParams.first_name;
            $scope.last_name = $stateParams.last_name;
            $scope.days_of_stay = $stateParams.days_of_stay;
            $scope.hours_of_stay = $stateParams.hours_of_stay;

            var is_checked_out = $stateParams.is_checked_out === "true";

            if (is_checked_out) {
                $scope.alreadyCheckedOut = true;
            } else {
                $scope.alreadyCheckedOut = false;
                $scope.setupBillData();
            }
        };

        /**
         * [initializeMe description]
         * @return {[type]} [description]
         */
        var initializeMe = function() {
            //show back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

            $scope.init();
        }();

        /********************************************************************************
         *  Printer Actions
         *  starts here
         ********************************************************************************/

        var nextPageActions = function() {
            var emailCollectionTurnedOn = false;
            if (emailCollectionTurnedOn) {
                alert("email collection")
            } else {
                checkOutGuest();
            }
        };
        var handleBillPrint = function() {
            $scope.$emit('hideLoader');
            setBeforePrintSetup();
            var printFailedActions = function() {
                $scope.zestStationData.workstationOooReason = $filter('translate')('CHECKOUT_PRINT_FAILED');
                $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS, {
                    'status': 'out-of-order',
                    'reason': $scope.zestStationData.workstationOooReason
                });
                $state.go('zest_station.speakToStaff');
            };
            try {
                // this will show the popup with full bill
                $timeout(function() {
                    /*
                     * ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                     */
                    $window.print();
                    if (sntapp.cordovaLoaded) {
                        var printer = (sntZestStation.selectedPrinter);
                        cordova.exec(function(success) {
                            nextPageActions();
                        }, function(error) {
                            printFailedActions();
                        }, 'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
                    };
                    // provide a delay for preview to appear 

                }, 100);
            } catch (e) {
                console.info("something went wrong while attempting to print--->" + e);
                printFailedActions();
            };
            setTimeout(function() {
                // CICO-9569 to solve the hotel logo issue
                $("header .logo").removeClass('logo-hide');
                $("header .h2").addClass('text-hide');

                // remove the orientation after similar delay
                removePrintOrientation();
                nextPageActions();
            }, 100);
        };


        var fetchBillData = function() {
            var data = {
                "reservation_id": $scope.reservation_id,
                "bill_number": 1
            };

            var fetchBillSuccess = function(response) {
                $scope.printData = response;
                // add the orientation
                addPrintOrientation();
                // print section - if its from device call cordova.
                handleBillPrint();
            };
            var options = {
                params: data,
                successCallBack: fetchBillSuccess,
                failureCallBack: failureCallBack
            };
            $scope.callAPI(zsCheckoutSrv.fetchBillPrintData, options);
        };

        $scope.printBill = function() {
            fetchBillData();
        };

        $scope.clickedNoThanks = function() {
            nextPageActions();
        };
        /********************************************************************************
         *  Printer Actions
         *  ends here
         ********************************************************************************/

    }
]);