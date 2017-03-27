sntZestStation.controller('zsCheckInReservationDetailsCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    '$stateParams',
    '$log',
    function($scope, $rootScope, $state, zsEventConstants, zsCheckinSrv, $stateParams, $log) {


        // This controller is used for viewing reservation details 
        // add / removing additional guests and transitioning to 
        // early checkin upsell or terms and conditions


        /** ********************************************************************************************
         **         Please note that, not all the stateparams passed to this state will not be used in this state, 
         **         however we will have to pass this so as to pass again to future states which will use these.
         **         
         **         Expected state params -----> none    
         **         Exit function -> goToSignaturePage                              
         **                                                                       
         ***********************************************************************************************/

        /** MODES in the screen
         *   1.RESERVATION_DETAILS --> view details 
         *   2. --> Add / Remove Guests// placeholder
         **/

        BaseCtrl.call(this, $scope);

        $scope.setScroller('res-details');

        var refreshScroller = function() {
            $scope.refreshScroller('res-details');
        };

        var setSelectedReservation = function() {
            zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
        };

        var fetchReservationDetails = function() {
            var onSuccessFetchReservationDetails = function(data) {

                if (data.data) {
                    $scope.selectedReservation.reservation_details = data.data.reservation_card;
                    $scope.zestStationData.selectedReservation = $scope.selectedReservation;
                    if ($scope.isRateSuppressed()) {
                        $scope.selectedReservation.reservation_details.balance = 0;
                    }
                    fetchAddons();
                    setDisplayContentHeight(); // utils function
                    refreshScroller();
                } else {
                    // else some error occurred
                    generalError();   
                }

            };


            $scope.callAPI(zsCheckinSrv.fetchReservationDetails, {
                params: {
                    'id': $scope.selectedReservation.confirmation_number
                },
                'successCallBack': onSuccessFetchReservationDetails,
                'failureCallBack': onSuccessFetchReservationDetails
            });

        };

        var fetchAddons = function() {
            var fetchCompleted = function(data) {
                $scope.selectedReservation.addons = data.existing_packages;
                setDisplayContentHeight();
                refreshScroller();
                $scope.isReservationDetailsFetched = true;
                if ($scope.zestStationData.is_kiosk_ows_messages_active && !$scope.zestStationData.is_standalone) {
                    $scope.$broadcast('FETCH_OWS_MESSAGES');
                }
            };


            $scope.callAPI(zsCheckinSrv.fetchAddonDetails, {
                params: {
                    'id': $scope.selectedReservation.reservation_details.reservation_id
                },
                'successCallBack': fetchCompleted,
                'failureCallBack': fetchCompleted
            });
        };

        $scope.isRateSuppressed = function() {
            if (typeof $scope.selectedReservation === 'undefined') {
                return false;
            }
            // need to wait for api to update
            // this is used in HTML to hide things
            if (typeof $scope.selectedReservation.reservation_details !== 'undefined') {
                if ($scope.selectedReservation.reservation_details.is_rates_suppressed === 'true') {
                    return true;
                }
            }
            return false;
        };

        var onBackButtonClicked = function() {

            var reservations = zsCheckinSrv.getCheckInReservations();
            
            if ($stateParams.pickup_key_mode) {
                $state.go('zest_station.checkOutReservationSearch', {
                    'mode': 'PICKUP_KEY'
                });
            } else if (reservations.length > 0) {
                $state.go('zest_station.selectReservationForCheckIn');
            } else {
                $state.go('zest_station.checkInReservationSearch');
            }
            // what needs to be passed back to re-init search results
            //  if more than 1 reservation was found? else go back to input 2nd screen (confirmation, no of nites, etc..)
        };
        var initComplete = function() {
            // called after getting selectedReservation details

            // show back button if not from upsell rooms
            if ($scope.selectedReservation.isRoomUpraded) {
                $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            }
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            // back button action
            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);
            $scope.$emit('hideLoader');
            // starting mode
            $scope.mode = 'RESERVATION_DETAILS';
            if (!$stateParams.isQuickJump || $stateParams.isQuickJump === 'false') {
                fetchReservationDetails();
            } else {
                setDisplayContentHeight(); // utils function
                refreshScroller();
            }

            // set flag to show the contents of the page
            // when all the data are loaded
            $scope.isReservationDetailsFetched = false;
        };

        var setPlaceholderDataForDemo = function() {
            var options = {
                params: {},
                successCallBack: function(response) {
                    $scope.selectedReservation = response.paths[0].data;
                    $scope.selectedReservation.reservation_details = $scope.selectedReservation.reservation_card;
                    initComplete();    

                    $scope.isReservationDetailsFetched = true;
                }
            };

            $scope.callAPI(zsCheckinSrv.fetchDetailsPlaceholderData, options);
        };

        (function() {
            if ($stateParams.isQuickJump === 'true') {
                $log.warn('FROM QUICK JUMP');
                // set some dummy data when quick jumping here
                setPlaceholderDataForDemo();
            } else {
                // init
                // the data is service will be reset after the process from zscheckInReservationSearchCtrl
                $scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
                initComplete();
            }
        }());

        $scope.addRemove = function() {
            var stateParams = {};

            setSelectedReservation();

            if ($stateParams.pickup_key_mode) {
                stateParams.pickup_key_mode = 'manual';
            }
            $state.go('zest_station.add_remove_guests', stateParams);
        };

        // will need to check for ECI & Terms bypass, happy path for now


        var shouldGoToEarlyCheckInFlow = function(response) {
            if (!response.reservation_in_early_checkin_window || $scope.selectedReservation.skipECI) {
                return false;
            }

            if (earlyCheckinActiveForReservation(response) ||
                reservationIncludesEarlyCheckin(response)) {
                return true;
            } 
            return false;
        };

        var earlyCheckinActiveForReservation = function(data) { // early check-in (room available)
            var early_checkin_free = data.offer_eci_bypass;

            $log.log('--HOTEL--');
            $log.log('early checkin active: ', data.early_checkin_on);
            $log.log('early checkin available   : ', data.early_checkin_available);
            $log.log('---------');
            $log.log('--STATION--');
            $log.log('early checkin active : ', $scope.zestStationData.offer_early_checkin);
            $log.log('---------');
            $log.log('--RESERVATION--');
            $log.log('in early window: ', data.reservation_in_early_checkin_window);
            $log.log('has free early chkin   : ', early_checkin_free);
            $log.log('---------');

            if (!data.early_checkin_available && // if no early checkin is available but early checkin flow is On, go to unavailable screen
                $scope.zestStationData.offer_early_checkin &&
                data.early_checkin_on) {
                $state.go('zest_station.earlyCheckin');
                return false;
            }

            if ( // if early checkin is not yet purchased and meets early upsell criteria..try to sell early checkin
                $scope.zestStationData.offer_early_checkin && // hotel admin > station > checkin
                data.early_checkin_available && // hotel admin > promos & upsell > early checkin upsell
                data.early_checkin_on // hotel admin > promos & upsell > early checkin upsell
            ) {
                return true; // proceed to early checkin flow
            }
            return false; // else continue without early checkin offer
        };

        var reservationIncludesEarlyCheckin = function(data) {
            if (!$scope.zestStationData.offer_early_checkin ||
                !data.early_checkin_on ||
                !data.early_checkin_available ||
                !data.reservation_in_early_checkin_window) {
                return false;
            }

            // data.offer_eci_free_vip - later story s54+ ~ offer free ECI when reservation has vip code &
            //  -matches a free ECI vip code (admin section to be added)
            // for now, using toggle switch - if free_eci_for_vips is enabled, and guest is VIP, then they get free ECI :)
            var guestArrivingToday = data.guest_arriving_today, 
                bypass = data.offer_eci_bypass, 
                isFreeForVip = data.free_eci_for_vips && data.is_vip;

            if (guestArrivingToday && (bypass || isFreeForVip)) {
                var freeForVip = '';

                if (data.free_eci_for_vips && data.is_vip) {
                    freeForVip = ' [ for vip guest ]';
                }
                $log.info('selected reservation includes free early check-in! ' + freeForVip);
                return true;
            } 
            // else
            $log.info('selected reservation does Not include free early check-in.');
            return false;
        };

        var generalError = function(response) {
            $log.warn(response);
            $scope.$emit('GENERAL_ERROR');
        };

        var fetchEarlyCheckinSettings = function(onSuccessCallback) {
            $log.warn(': fetchEarlyCheckinSettings :');

            var onSuccessResponse = function(response) {
                $log.info(': fetchEarlyCheckinSettings => onSuccessResponse :', response);
                onSuccessCallback(response);
            };

            // this will also update the arrival time via backend, 
            // we should fetch upsell details and continue
            $scope.callAPI(zsCheckinSrv.fetchUpsellDetails, {
                params: {
                    id: $scope.selectedReservation.id
                },
                'successCallBack': onSuccessResponse,
                'failureCallBack': generalError
            });

        };


        var beginEarlyCheckin = function(response) {
            $log.info(':: begin early checkin ::  ');
            var params = {
                'early_checkin_data': ''
            };

            if (response) {
                // from early checkin controller, will parse back into an object to use data
                params.early_checkin_data = JSON.stringify(response);
                params.early_charge_symbol = $scope.selectedReservation.earlyCheckinChargeSymbol;
            }
            params.selected_reservation = JSON.stringify($scope.selectedReservation);
            $log.info('sending stateparams: ', params);
            $state.go('zest_station.earlyCheckin', params);
        };

        var initTermsPage = function() {
            $log.log($scope.zestStationData);
            $log.info('$scope.selectedReservation: ', $scope.selectedReservation);
            var stateParams = {
                'guest_id': $scope.selectedReservation.guest_details[0].id,
                'reservation_id': $scope.selectedReservation.reservation_details.reservation_id,
                'deposit_amount': $scope.selectedReservation.reservation_details.deposit_amount,
                'room_no': $scope.selectedReservation.reservation_details.room_number, // this changed from room_no, to room_number
                'room_status': $scope.selectedReservation.reservation_details.room_status,
                'payment_type_id': $scope.selectedReservation.reservation_details.payment_type,
                'guest_email': $scope.selectedReservation.guest_details[0].email,
                'guest_email_blacklisted': $scope.selectedReservation.guest_details[0].is_email_blacklisted,
                'first_name': $scope.selectedReservation.guest_details[0].first_name,
                'balance_amount': $scope.selectedReservation.reservation_details.balance_amount,
                'confirmation_number': $scope.selectedReservation.confirmation_number,
                'pre_auth_amount_for_zest_station': $scope.selectedReservation.reservation_details.pre_auth_amount_for_zest_station,
                'authorize_cc_at_checkin': $scope.selectedReservation.reservation_details.authorize_cc_at_checkin
            };
            // check if this page was invoked through pickupkey flow

            if ($stateParams.pickup_key_mode) {
                stateParams.pickup_key_mode = 'manual';
            }
            $log.warn('to checkin terms: ', stateParams);
            $state.go('zest_station.checkInTerms', stateParams);
        };

        var initRoomError = function() {
            $state.go('zest_station.checkinRoomError');
        };


        var assignRoomToReseravtion = function() {
            var reservation_id = $scope.selectedReservation.id;

            $log.info('::assigning room to reservation::', reservation_id);


            $scope.callAPI(zsCheckinSrv.assignGuestRoom, {
                params: {
                    'reservation_id': reservation_id
                },
                'successCallBack': roomAssignCallback,
                'failureCallBack': roomAssignCallback
            });
        };
        var roomAssignCallback = function(response) {
            if (response.status && response.status === 'success') {
                $scope.selectedReservation.room = response.data.room_number;
                // will need to check and combine one later
                // fixing for hotfix
                $scope.selectedReservation.reservation_details.room_number = response.data.room_number;
                routeToNext();
            } else {
                initRoomError();
            }
        };

        var continueRouting = function(settings) {
            var goToEarlyCheckin = shouldGoToEarlyCheckInFlow(settings);

            // TO DO : 
            $scope.selectedReservation.hasAddon = true;
            
            $log.info(': continueRouting :', settings);
            $log.info('*goToEarlyCheckin: ', goToEarlyCheckin);

            var zestStationRoomUpsellOn = $scope.zestStationData.offer_kiosk_room_upsell;

            if (goToEarlyCheckin) {
                beginEarlyCheckin(settings);
            } else if (!$scope.selectedReservation.isRoomUpraded && $scope.selectedReservation.reservation_details.is_upsell_available === 'true' && zestStationRoomUpsellOn) {
                $state.go('zest_station.roomUpsell');
            } else if ($scope.selectedReservation.hasAddon && !$scope.selectedReservation.skipAddon) {
                $state.go('zest_station.addOnUpsell');
            } else {
                // terms and condition skip is done in terms and conditions page
                initTermsPage();
            }
        };
        var routeToNext = function() {
            // in order to route to the next screen, check if we should go through early checkin,
            // also check terms and conditions (bypass) setting,
            // first fetch fresh early checkin settings, and continue from there
            fetchEarlyCheckinSettings(continueRouting);
        };

        var roomIsAssigned = function() {
            if ($scope.selectedReservation.room) {
                return true;
            }
            return false;
        };

        var roomIsReady = function() {
            if ($scope.selectedReservation.reservation_details) {
                if ($scope.selectedReservation.reservation_details.room_status === 'READY') {
                    return true;
                } 
            }
            return false;
        };

        var initCheckinTimeError = function() {
            /*
             *  guest attempted to check in too early, 
             *  - for hourly hotels such as Yotel, guest is not allowed to check-in
             *  - unless they are within the hour of the arrival time
             */
            $state.go('zest_station.checkinRoomError', {
                'early_checkin_unavailable': true,
                'first_name': $scope.selectedReservation.guest_details[0].first_name
            });
        };

        var currentHotelTime = '',
            fetchHotelTime = function() {
                var fetchHotelTimeSuccess = function(response) {
                    currentHotelTime = response.hote_time;
                    // once hoteltime is fetched, try to proceed
                    $scope.onNextFromDetails();
                };

                $scope.callAPI(zsCheckinSrv.fetchHotelTime, {
                    params: {
                        'reservation_id': $scope.selectedReservation.id
                    },
                    'successCallBack': fetchHotelTimeSuccess
                });
            };

        var checkinTimeWithinTheHourForHotel = function() {
            // date is assumed to be current day,
            //  since due_in on the reservation should already be checked from API
            var t = new Date(),
                d = t.getDate(),
                m = t.getMonth() + 1,
                y = t.getFullYear();

            // Convert time into date object
            var d1 = new Date(m + '/' + d + '/' + y + ' ' + $scope.selectedReservation.reservation_details.arrival_time);
            var d2 = new Date(m + '/' + d + '/' + y + ' ' + currentHotelTime);

            // Get timestamp
            var arrivalTime = d1.getTime();
            var hotelTime = d2.getTime();

            $log.info('\n\nReservation arrival  time =>', $scope.selectedReservation.reservation_details.arrival_time, '------ Hotel current  time => ', currentHotelTime + '\n\n');

            if (hotelTime > arrivalTime) {
                // if hotel time is greater than arrival time allow guest to check-in
                return true;
            } else if (hotelTime + 3600000 > arrivalTime) {
                // current time plus an hour is greater than arrival time,
                // (within 60-minutes from arrival time, allow guest to check in (for yotel))
                return true;
            }
            return false;
        };
            

        $scope.onNextFromDetails = function() {
            if ($scope.zestStationData.theme === 'yotel' && currentHotelTime.length === 0) {
                // fetch hotel time to check with reservation arrival time
                fetchHotelTime();


            } else {
                var roomAssigned = roomIsAssigned(),
                    roomReady = roomIsReady();

                $log.info('roomAssigned: ', roomAssigned, ', roomReady: ', roomReady);
                $log.info('reservation_details: ', $scope.selectedReservation.reservation_details);
                // the reservation at this point, for check-in, should have a due-in status + arrival time,
                // if this is for Yotel, we need to check the arrival time vs current time at the hotel,
                // to make sure the arriving guest is within the arrival time (within the first hour);
                if ($scope.zestStationData.theme === 'yotel' && !checkinTimeWithinTheHourForHotel() && $scope.zestStationData.isHourlyRateOn) {
                    
                    initCheckinTimeError();

                } else {
                    if (!roomIsAssigned()) {
                        $log.info('assigning room');
                        assignRoomToReseravtion(); // assigns room, if success- goes to terms

                    } else if (roomIsAssigned() && roomIsReady()) {
                        $log.info('room is assigned and ready, continuing');
                        routeToNext();

                    } else if (roomIsAssigned() && !roomIsReady()) {
                        $log.info('room assigned but not ready, show room error');
                        initRoomError();
                    }
                }
            }

        };
    }
]);