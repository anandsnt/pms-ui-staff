sntZestStation.controller('zsReservationBillDetailsCtrl', [
    '$scope',
    '$state',
    'zsCheckoutSrv', 'zsEventConstants', '$stateParams', 'zsModeConstants', '$window', '$timeout',
    function($scope, $state, zsCheckoutSrv, zsEventConstants, $stateParams, zsModeConstants, $window, $timeout) {


        /***********************************************************************************************
        **      Please note that, not all the stateparams passed to this state will not be used in this state, 
        **      however we will have to pass this so as to pass again in future states which will use these.
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
        $scope.clickedOnCloseButton = function() {
            //if key card was inserted we need to eject that
            $scope.$emit('EJECT_KEYCARD');
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
            $scope.$emit('EJECT_KEYCARD');
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
        $scope.checkOutGuest = function() {
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
            return (!$scope.has_cc && $scope.balance > 0);
        };
        $scope.nextClicked = function() {

            if (cashReservationBalanceDue()) {
                console.warn("reservation has balance due");
                $state.go('zest_station.speak_to_staff');
            } else {
                var guest_bill = $scope.zestStationData.guest_bill;

                if (!guest_bill.email && !guest_bill.print) {
                    //immediate checkout
                    var printopted = 'false';
                    $scope.checkOutGuest(printopted);
                } else if (guest_bill.email && !guest_bill.print) {
                    $state.go('zest_station.emailBill', $scope.stateParamsForNextState);
                } else if (guest_bill.print) { //go to print nav
                    $scope.printOpted = true;
                }
            };
        };

        $scope.init = function() {
            //retrieve state variable to be displayed
            $scope.from = $stateParams.from;
            $scope.reservation_id = $stateParams.reservation_id;
            $scope.has_cc = $stateParams.has_cc;
            $scope.first_name = $stateParams.first_name;
            $scope.last_name = $stateParams.last_name;
            $scope.days_of_stay = $stateParams.days_of_stay;
            $scope.hours_of_stay = $stateParams.hours_of_stay;
            $scope.setupBillData();
            //storing state varibales to be used in print view also
            $scope.stateParamsForNextState = {
                "from": $stateParams.from,
                "reservation_id": $stateParams.reservation_id,
                "email": $stateParams.email,
                "guest_detail_id": $stateParams.guest_detail_id,
                "has_cc": $stateParams.has_cc,
                "first_name": $stateParams.first_name,
                "last_name": $stateParams.last_name,
                "days_of_stay": $stateParams.days_of_stay,
                "hours_of_stay": $stateParams.hours_of_stay,
                "is_checked_out": $stateParams.is_checked_out
            };
        };

        /**
         * [initializeMe description]
         * @return {[type]} [description]
         */
        var initializeMe = function() {
            //show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

            $scope.init();
        }();
    }
]);