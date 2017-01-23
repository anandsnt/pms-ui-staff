sntZestStation.controller('zsCheckInReservationDetailsCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    '$stateParams',
    function($scope, $rootScope, $state, zsEventConstants, zsCheckinSrv, $stateParams) {


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

        (function() {
            // init
            // the data is service will be reset after the process from zscheckInReservationSearchCtrl
            $scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
            // show back button if not from upsell rooms
            if($scope.selectedReservation.isRoomUpraded){
                $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            }
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            // back button action
            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);
            $scope.$emit('hideLoader');
            // starting mode
            $scope.mode = 'RESERVATION_DETAILS';
            fetchReservationDetails();
            // set flag to show the contents of the page
            // when all the data are loaded
            $scope.isReservationDetailsFetched = false;
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


        var goToSignaturePage = function() {
            var stateParams = {
                'email': $scope.selectedReservation.guest_details[0].email,
                'reservation_id': $scope.selectedReservation.reservation_details.reservation_id,
                'room_no': $scope.selectedReservation.reservation_details.room_no,
                'first_name': $scope.selectedReservation.guest_details[0].first_name
            };

            $state.go('zest_station.checkInSignature', stateParams);
        };


        var shouldGoToEarlyCheckInFlow = function(response) {
            console.log('early checkin on reservation response: ', response);
            if (!response.reservation_in_early_checkin_window) {
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

            console.log('--HOTEL--');
            console.log('early checkin active: ', data.early_checkin_on);
            console.log('early checkin available   : ', data.early_checkin_available);
            console.log('---------');
            console.log('--STATION--');
            console.log('early checkin active : ', $scope.zestStationData.offer_early_checkin);
            console.log('---------');
            console.log('--RESERVATION--');
            // console.log('early Checkin Purchased: ', $state.earlyCheckinPurchased);
            console.log('in early window: ', data.reservation_in_early_checkin_window);
            console.log('has free early chkin   : ', early_checkin_free);
            console.log('---------');

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

            console.log('data.offer_eci_free_vip: ', data.offer_eci_free_vip);
            console.log('data.offer_eci_bypass: ', data.offer_eci_bypass);
            console.log('data.free_eci_for_vips: ', data.free_eci_for_vips);

            // data.offer_eci_free_vip - later story s54+ ~ offer free ECI when reservation has vip code &
            //  -matches a free ECI vip code (admin section to be added)
            // for now, using toggle switch - if free_eci_for_vips is enabled, and guest is VIP, then they get free ECI :)
            if (data.guest_arriving_today && (data.offer_eci_bypass || data.free_eci_for_vips && data.is_vip)) {
                var freeForVip = '';

                if (data.free_eci_for_vips && data.is_vip) {
                    freeForVip = ' [ for vip guest ]';
                }
                console.info('selected reservation includes free early check-in! ' + freeForVip);
                return true;
            } else {
                console.info('selected reservation does Not include free early check-in.');
                return false;
            }
        };

        var generalError = function(response) {
            console.warn(response);
            $scope.$emit('GENERAL_ERROR');
        };

        var fetchEarlyCheckinSettings = function(onSuccessCallback) {
            console.warn(': fetchEarlyCheckinSettings :');

            var onSuccessResponse = function(response) {
                console.info(': fetchEarlyCheckinSettings => onSuccessResponse :', response);
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
            console.info(':: begin early checkin ::  ');
            var params = {
                'early_checkin_data': ''
            };

            if (response) {
                // from early checkin controller, will parse back into an object to use data
                params.early_checkin_data = JSON.stringify(response);
                params.early_charge_symbol = $scope.selectedReservation.earlyCheckinChargeSymbol;
            }
            params.selected_reservation = JSON.stringify($scope.selectedReservation);
            console.info('sending stateparams: ', params);
            $state.go('zest_station.earlyCheckin', params);
        };

        var initTermsPage = function() {
            console.log($scope.zestStationData);
            console.info('$scope.selectedReservation: ', $scope.selectedReservation);
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
            console.warn('to checkin terms: ', stateParams);
            $state.go('zest_station.checkInTerms', stateParams);
        };

        var initRoomError = function() {
            $state.go('zest_station.checkinRoomError');
        };


        var assignRoomToReseravtion = function() {
            var reservation_id = $scope.selectedReservation.id;

            console.info('::assigning room to reservation::', reservation_id);


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

        var fetchedEarlyCheckinSettingsCallback = function(response) {
            console.info(': fetchedEarlyCheckinSettingsCallback :', response);
            var earlyCheckinWasPurchasedAtStation = $stateParams.earlyCheckinPurchased;
            var shouldGoThroughECI = shouldGoToEarlyCheckInFlow(response);

            console.info('earlyCheckinWasPurchasedAtStation: ', earlyCheckinWasPurchasedAtStation);
            console.info('shouldGoThroughECI: ', shouldGoThroughECI);
            if (!earlyCheckinWasPurchasedAtStation && // if they purchased it through zest station a minute ago...dont re-prompt the user
                shouldGoThroughECI) {
                // fetch reservation info with upsell data from /guest_web/reservations/{res_id}.json
                return true;
            } else {return false;}
        };

        var getMilTime = function(t, am_pm) {
            console.info(arguments);
            if (am_pm === 'PM') {
                var hour = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

                return hour[t];
            } else {
                return t;
            }
        };

        var continueRouting = function(settings) {
            var goToEarlyCheckin = fetchedEarlyCheckinSettingsCallback(settings);
            
            console.info(': continueRouting :', settings);
            console.info('*goToEarlyCheckin: ', goToEarlyCheckin);

              // TO DELETE
            var zestStationRoomUpsellOn = true;

            if (goToEarlyCheckin) {
                beginEarlyCheckin(settings);
            } else if (!$scope.selectedReservation.isRoomUpraded && $scope.selectedReservation.reservation_details.is_upsell_available  === 'true' && zestStationRoomUpsellOn) {
                $state.go('zest_station.roomUpsell', { 'reservation_id': $scope.selectedReservation.id});
            } else {
                // terms and condition skip is done in terms and conditions page
                initTermsPage();
            }
        };
        var routeToNext = function() {
            console.info(': routeToNext :');
            // in order to route to the next screen, check if we should go through early checkin,
            // also check terms and conditions (bypass) setting,
            // first fetch fresh early checkin settings, and continue from there
            fetchEarlyCheckinSettings(continueRouting);
        };

        var roomIsAssigned = function() {
            console.log('::reservation current room :: [ ', $scope.selectedReservation.room, ' ]');
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

            console.info('\n\nReservation arrival  time =>', $scope.selectedReservation.reservation_details.arrival_time, '------ Hotel current  time => ', currentHotelTime + '\n\n');

            if (hotelTime > arrivalTime) {
                // if hotel time is greater than arrival time allow guest to check-in
                return true;
            } else if (hotelTime + 3600000 > arrivalTime) {
                // current time plus an hour is greater than arrival time,
                // (within 60-minutes from arrival time, allow guest to check in (for yotel))
                return true;
            } else {
                return false;
            }
        };
            

        $scope.onNextFromDetails = function() {
            if ($scope.zestStationData.theme === 'yotel' && currentHotelTime.length === 0) {
                // fetch hotel time to check with reservation arrival time
                fetchHotelTime();


            } else {
                var roomAssigned = roomIsAssigned(),
                    roomReady = roomIsReady();

                console.info('roomAssigned: ', roomAssigned, ', roomReady: ', roomReady);
                console.info('reservation_details: ', $scope.selectedReservation.reservation_details);
                // the reservation at this point, for check-in, should have a due-in status + arrival time,
                // if this is for Yotel, we need to check the arrival time vs current time at the hotel,
                // to make sure the arriving guest is within the arrival time (within the first hour);

                if ($scope.zestStationData.theme === 'yotel' && !checkinTimeWithinTheHourForHotel()) {
                    
                    initCheckinTimeError();

                } else {
                    if (!roomIsAssigned()) {
                        console.info('assigning room');
                        assignRoomToReseravtion(); // assigns room, if success- goes to terms

                    } else if (roomIsAssigned() && roomIsReady()) {
                        console.info('room is assigned and ready, continuing');
                        routeToNext();

                    } else if (roomIsAssigned() && !roomIsReady()) {
                        console.info('room assigned but not ready, show room error');
                        initRoomError();
                    }
                }
            }

        };
    }
]);