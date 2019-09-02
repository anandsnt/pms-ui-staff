sntZestStation.controller('zsPickupAndCheckoutReservationSearchCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'zsEventConstants',
    'zsCheckoutSrv',
    '$stateParams',
    '$timeout',
    'zsCheckinSrv',
    'zsGeneralSrv',
    function($scope, $rootScope, $state, zsEventConstants, zsCheckoutSrv, $stateParams, $timeout, zsCheckinSrv, zsGeneralSrv) {


        // This controller is used for searching reservation using last name
        // and room number

        /** MODES in the screen
         *   1.LAST_NAME_ENTRY --> enter last name
         *   2.ROOM_NUMBER_ENTRY --> enter room number
         *   3.NO_MATCH --> no reservation found
         **/

        BaseCtrl.call(this, $scope);

        var debugWithReservation = function() {
            // use this to quickly go through last name + room number and debug keys faster
            // just replace the below params for whichever reservation you want to use
            $scope.reservationParams = {
                'last_name': 'mike',
                'room_no': '102'
            };
            $timeout(function() {
                $scope.lastNameEntered();
            }, 300);

            $timeout(function() {
                $scope.roomNumberEntered();
            }, 500);
        };
        var jumpRefresh = false;
        var init = function() {
            // show back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            // back button action
            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
                if (!$scope.zestStationData.checkout_keycard_lookup || $stateParams.mode === 'PICKUP_KEY') {
                    $state.go('zest_station.home');
                } else {
                    $state.go('zest_station.checkoutSearchOptions');
                }
            });
            if ($stateParams.mode === 'PICKUP_KEY') {
                $scope.setScreenIcon('key');
            } else {
                $scope.setScreenIcon('checkout');
            }
            if (!jumpRefresh) {
                // starting mode
                $scope.mode = 'LAST_NAME_ENTRY';
                $scope.focusInputField('last-name');   
            }

            // debugWithReservation();//debugging, comment out before deploying
            if ($stateParams.isQuickJump === 'true' && !jumpRefresh) {
                if ($stateParams.quickJumpMode === 'PUK_SEARCH_BY_NAME') {
                    $stateParams.mode = 'PICKUP_KEY';
                    $scope.mode = 'LAST_NAME_ENTRY';
                    jumpRefresh = true;
                    init();
                } else if ($stateParams.quickJumpMode === 'PUK_SEARCH_BY_ROOM') {
                    $stateParams.mode = 'PICKUP_KEY';
                    $scope.mode = 'ROOM_NUMBER_ENTRY';
                    jumpRefresh = true;
                    init();
                } else if ($stateParams.quickJumpMode === 'CO_SEARCH_BY_ROOM') {
                    $stateParams.mode = '';
                    $scope.mode = 'ROOM_NUMBER_ENTRY';
                    jumpRefresh = true;
                    init();
                } else {
                    $stateParams.mode = '';
                    $scope.mode = 'LAST_NAME_ENTRY';
                }

            }

            // There are too many conditions and flows to and fro (like back button actions).
            //  So the safe way will be to navigate from this state to the new state
            //  There will be CC actions also coming to this new state shortly

            if ($stateParams.mode === 'PICKUP_KEY' && $scope.zestStationData.pickupkey_authenticate_cc) {
                $state.go('zest_station.pickUpKeyReservationSearch');
            }
        };

        init();

        $scope.alreadyCheckedOutActions = function() {
            $scope.$emit('EJECT_KEYCARD');
            $state.go('zest_station.home');
        };

        var generalFailureActions = function() {
            $scope.mode = 'NO_MATCH';
            $scope.trackSessionActivity($stateParams.mode, 'Failure Mode', '', $scope.mode, true);

            $scope.callBlurEventForIpad();
        };

        var fetchReservationDetailsForCheckingIn = function(reservation_id) {

            var goToCheckinFlow = function(response) {
                zsCheckinSrv.setSelectedCheckInReservation(response.results);
                var primaryGuest = _.find(response.results[0].guest_details, function(guest_detail) {
                    return guest_detail.is_primary === true;
                });

                $state.go('zest_station.checkInReservationDetails', {
                    'first_name': primaryGuest.first_name,
                    'pickup_key_mode': 'manual'
                });

            };

            var options = {
                params: {
                    'reservation_id': reservation_id
                },
                successCallBack: goToCheckinFlow,
                failureCallBack: generalFailureActions
            };

            $scope.callAPI(zsGeneralSrv.fetchCheckinReservationDetails, options);
        };

        var fetchReservationForPassportScanning = function(reservation_id, stateParams) {
            var onSuccess = function(response) {
                zsCheckinSrv.setSelectedCheckInReservation(response.results);// important
                stateParams.mode = 'PICKUP_KEY';
                stateParams.reservation_id = reservation_id;
                if ($scope.zestStationData.id_scan_enabled) {
                    $state.go('zest_station.sntIDScan', {
                        params: JSON.stringify(stateParams)
                    });
                } else if ($scope.zestStationData.kiosk_manual_id_scan) {
                    $state.go('zest_station.checkInIdVerification', {
                        params: JSON.stringify(stateParams)
                    });
                } else {
                    $state.go('zest_station.checkInScanPassport', stateParams);
                }

            };

            var options = {
                params: {
                    'reservation_id': reservation_id
                },
                successCallBack: onSuccess,
                failureCallBack: generalFailureActions
            };

            $scope.callAPI(zsGeneralSrv.fetchCheckinReservationDetails, options);
        };

        var goToKeyDispense = function(stateParams) {
            $state.go('zest_station.pickUpKeyDispense', stateParams);
        };

        var searchReservation = function() {
            var checkoutVerificationSuccess = function(data) {
                if (typeof data !== typeof undefined) {
                    $scope.reservation_id = data.reservation_id ? data.reservation_id : 'UNDEFINED';
                }

                if (data.is_checked_out) {
                    $scope.alreadyCheckedOut = true;
                    $scope.trackSessionActivity('PUK', 'Pickup, Found Reservation', 'R' + data.reservation_id, 'ALRDY_CHECKED_OUT', true);

                } else if (!!$stateParams.mode && $stateParams.mode === 'PICKUP_KEY' && data.is_checked_in) {
                    var stateParams = {
                        'reservation_id': data.reservation_id,
                        'room_no': $scope.reservationParams.room_no,
                        'first_name': data.first_name
                    };
                    /*
                        send through Passport scanning flow if Reservation 
                            *(has not scanned passports) 
                            station setting is active
                     */

                    if ($scope.zestStationData.check_in_collect_passport || $scope.zestStationData.kiosk_manual_id_scan || $scope.zestStationData.id_scan_enabled) {
                         // if passport setting is ON, 
                         //  call api to fetch guest details prior to continuing
                         //  
                         //  If any of the reservation guests do not have passport scanned
                         //  then go to passport scan, otherwise go to key dispense
                         //  

                        var successCallBack = function(guest_details) {
                            var areAllRequiredIDsPresent = $scope.reservationHasPassportsScanned(guest_details);
                            
                            if (($scope.zestStationData.check_in_collect_passport && !areAllRequiredIDsPresent)  ||
                               ($scope.zestStationData.kiosk_manual_id_scan && (!guest_details.primary_guest_details.guest_id_reviewed || $scope.zestStationData.pickup_key_always_ask_for_id)) ||
                               ($scope.zestStationData.id_scan_enabled && (!areAllRequiredIDsPresent || $scope.zestStationData.pickup_key_always_ask_for_id))) {

                                $scope.trackSessionActivity('PUK', 'Fetch Success', 'R' + data.reservation_id, 'TO_SCAN_PASSPORTS');
                                    // 
                                    // get reservation details object,
                                    // then set the currently selected reservation
                                    // then go to passport screen
                                    //
                                $scope.zestStationData.continuePickupFlow = function() {
                                    $scope.trackSessionActivity('PUK', 'Continue From Passport', 'R' + data.reservation_id, 'CONTINUE_TO_ENCODE');
                                    goToKeyDispense(stateParams);                           
                                };

                                stateParams.from_pickup_key = true;
                                fetchReservationForPassportScanning(data.reservation_id, stateParams);

                            } else {
                                $scope.trackSessionActivity('PUK', 'Pickup, Found Reservation', 'R' + data.reservation_id, 'CONTINUE_TO_ENCODE');
                                goToKeyDispense(stateParams);
                            }
                        };

                        var options = {
                            params: {
                                'id': data.reservation_id
                            },
                            successCallBack: successCallBack,
                            failureCallBack: generalFailureActions
                        };


                        if ($scope.usingFakeReservation()) {
                            successCallBack(zsCheckinSrv.guestDetailsDemoData);

                        } else {
                            $scope.callAPI(zsGeneralSrv.fetchGuestDetails, options);
                        }


                    } else {
                        $scope.trackSessionActivity('PUK', 'Pickup, Found Reservation', 'R' + data.reservation_id, 'CONTINUE_TO_ENCODE');
                        goToKeyDispense(stateParams);
                    }

                } else if (!!$stateParams.mode && $stateParams.mode === 'PICKUP_KEY' && !data.is_checked_in) {
                    if (data.guest_arriving_today) {
                        // go to Checkin flow -- CICO-32703
                        $scope.trackSessionActivity('PUK', 'Pickup, Found Reservation', 'R' + data.reservation_id, 'NOT_CHECKED_IN, GO_TO_CHECK_IN_FLOW');
                        fetchReservationDetailsForCheckingIn(data.reservation_id);
                    } else {
                        $scope.trackSessionActivity('PUK', 'Pickup, Found Reservation', 'R' + data.reservation_id, 'NOT_CHECKED_IN, NOT_ARRIVING_TODAY');
                        generalFailureActions();
                    }

                } else {
                    // checkout is allowed only if guest is departing 
                    // on the bussiness day
                    if (data.is_departing_today) {
                        var stateParams = {
                            'from': 'searchByName',
                            'reservation_id': data.reservation_id,
                            'email': data.email,
                            'guest_detail_id': data.guest_detail_id,
                            'has_cc': data.has_cc,
                            'first_name': data.first_name,
                            'last_name': data.last_name,
                            'days_of_stay': data.days_of_stay,
                            'hours_of_stay': data.hours_of_stay
                        };

                        $state.go('zest_station.checkoutReservationBill', stateParams);
                    } else {
                        generalFailureActions();
                    }

                }
            };

            var params = {
                'last_name': $scope.reservationParams.last_name,
                'room_no': $scope.reservationParams.room_no + ''.replace(/\-/g, '') // adding '' to for non-str values
            };

            if ($stateParams.mode === 'PICKUP_KEY') {
                params.checked_in = true;
            }

            var options = {
                params: params,
                successCallBack: checkoutVerificationSuccess,
                failureCallBack: generalFailureActions
            };

            if ($scope.usingFakeReservation()) {
                var data = zsCheckinSrv.findResDemoData;

                data.last_name = $scope.reservationParams.last_name;
                checkoutVerificationSuccess(data);
            } else {
                $scope.callAPI(zsCheckoutSrv.findReservation, options);
            }

        };

        var roomNumberEntered = false;

        $scope.lastNameEntered = function() {
            $scope.hideKeyboardIfUp();
            // if room is already entered, no need to enter again
            if (roomNumberEntered) {
                if ($scope.reservationParams.room_no.length > 0) {
                    searchReservation();
                }

            } else {
                if ($scope.reservationParams.last_name.length > 0) {
                    $scope.mode = 'ROOM_NUMBER_ENTRY';
                    $scope.focusInputField('room-number');
                } else {
                    return;
                }
            }
            $scope.resetTime();
        };

        $scope.roomNumberEntered = function() {
            $scope.hideKeyboardIfUp();
            roomNumberEntered = true;
            $scope.reservationParams.room_no.length > 0 ? searchReservation() : '';
            $scope.callBlurEventForIpad();
            $scope.resetTime();
        };

        $scope.reEnterText = function(type) {
            if (type === 'room') {
                $scope.mode = 'ROOM_NUMBER_ENTRY';
                $scope.focusInputField('room-number');
            } else {
                $scope.mode = 'LAST_NAME_ENTRY';
                $scope.focusInputField('last-name');
            }
        };

        /** *********** Fontainbleu specific ******************/

        $scope.tower = {
            'selected': ''
        };
        $scope.changedTheSelectedTower = function() {
            $scope.reservationParams.room_no = $scope.tower.selected;
        };
        var setTowers = function() {
            $scope.towerList = [];
            _.map($scope.zestStationData.towers, function(value, key) {
                $scope.towerList.push({
                    name: key,
                    value: value
                });
            });
            $scope.reservationParams.room_no = $scope.towerList[0].value;
            $scope.tower.selected = $scope.towerList[0].value;
        };

        // $scope.zestStationData.towers will be valid only for hotels that has
        // and will be supplied in api only then
        $scope.showTowers = typeof $scope.zestStationData.towers !== 'undefined' && $scope.zestStationData.towers.length > 0;
        $scope.showTowers ? setTowers() : '';
    }
]);
