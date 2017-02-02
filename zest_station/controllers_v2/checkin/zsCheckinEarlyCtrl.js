sntZestStation.controller('zsCheckinEarlyCtrl', [
    '$scope',
    '$state',
    'zsEventConstants',
    '$stateParams',
    'zsCheckinSrv',
    'zsPaymentSrv',
    '$timeout',

    function($scope, $state, zsEventConstants, $stateParams, zsCheckinSrv, zsPaymentSrv, $timeout) {

        /** ********************************************************************************************
         **		Please note that, not all the stateparams passed to this state will not be used in this state, 
         **      however we will have to pass this so as to pass again to future states which will use these.
         **
         **      Expected state params -----> early_checkin_data (will be parsed back to object)    
         **      Exit function -> successCallBack                              
         **                                                                       
         ***********************************************************************************************/

        BaseCtrl.call(this, $scope);

        var init = function() {
            $scope.$emit('hideLoader');

            // Quick-jump from Screen-jumping feature
            // mainly for editing language text and demos
            if ($stateParams.isQuickJump) {
                $stateParams = getDummyData($stateParams.quickJumpMode);
            }

            var params = JSON.parse($stateParams.early_checkin_data);
            
            $scope.selectedReservation = JSON.parse($stateParams.selected_reservation);

            setEarlyParams(params);
        };

        var getDummyData = function(mode) {
            if (mode === 'EARLY_CHECKIN_PREPAID') {
                return '{"early_checkin_on":true,"early_checkin_available":true,"checkin_time":" 6:00 PM","eci_upsell_limit_reached":false,"offer_eci_bypass":false,"is_room_already_assigned":true,"is_room_ready":true,"is_donot_move_room_marked":false,"guest_arriving_today":true,"reservation_in_early_checkin_window":true,"early_checkin_charge":"£51.00","is_early_checkin_purchased":true,"is_early_checkin_bundled":true,"is_early_checkin_bundled_by_addon":false,"free_eci_for_vips":false,"is_vip":false,"early_checkin_restrict_hour_for_display":" 5","early_checkin_restrict_hour":"05","early_checkin_restrict_minute":"45","early_checkin_restrict_primetime":"PM","early_checkin_restrict_time":"05:45:00 PM","early_checkin_offer_id":1780}';    

            } else if (mode === 'EARLY_CHECKIN_SELECT') {
                return '{"early_checkin_on":true,"early_checkin_available":true,"checkin_time":" 6:00 PM","eci_upsell_limit_reached":false,"offer_eci_bypass":true,"is_room_already_assigned":true,"is_room_ready":true,"is_donot_move_room_marked":false,"guest_arriving_today":true,"reservation_in_early_checkin_window":true,"early_checkin_charge":"£51.00","is_early_checkin_purchased":false,"is_early_checkin_bundled":false,"is_early_checkin_bundled_by_addon":false,"free_eci_for_vips":false,"is_vip":false,"early_checkin_restrict_hour_for_display":" 5","early_checkin_restrict_hour":"05","early_checkin_restrict_minute":"45","early_checkin_restrict_primetime":"PM","early_checkin_restrict_time":"05:45:00 PM","early_checkin_offer_id":1780}';

            } else if (mode === 'EARLY_CHECKIN_FREE') {
                return '{"early_checkin_on":true,"early_checkin_available":true,"checkin_time":" 6:00 PM","eci_upsell_limit_reached":false,"offer_eci_bypass":false,"is_room_already_assigned":true,"is_room_ready":true,"is_donot_move_room_marked":false,"guest_arriving_today":true,"reservation_in_early_checkin_window":true,"early_checkin_charge":"£51.00","is_early_checkin_purchased":false,"is_early_checkin_bundled":false,"is_early_checkin_bundled_by_addon":false,"free_eci_for_vips":true,"is_vip":true,"early_checkin_restrict_hour_for_display":" 5","early_checkin_restrict_hour":"05","early_checkin_restrict_minute":"45","early_checkin_restrict_primetime":"PM","early_checkin_restrict_time":"05:45:00 PM","early_checkin_offer_id":1783}';

            }
        };
        
        var onBackButtonClicked = function() {
            $state.go('zest_station.checkInReservationDetails');
        };

        var earlyCheckinOn = function(data) {
            // check 3 settings: 
            //    hotel > promo upsell > early checkin active
            //    hotel > promo upsell > early checkin available (limit not reached)
            //    zest station > checkin > early checkin active
            var earlyCheckinIsOFF = !data.early_checkin_on, 
                earlyCheckinNotAvailable = !data.early_checkin_available,
                stationNotOfferingEarlyCheckin = !$scope.zestStationData.offer_early_checkin;

            return !(earlyCheckinIsOFF || earlyCheckinNotAvailable || stationNotOfferingEarlyCheckin);
        };


        var setEarlyParams = function(response) {
            // Set the hotel Check-in Time
            $scope.standardCheckinTime = response.checkin_time; // maybe move, dont need for all modes?

            $scope.early_checkin_charge = response.early_checkin_charge;
            $scope.offerId = response.early_checkin_offer_id;

            $scope.early_charge_symbol = $scope.zestStationData.currencySymbol;

            $scope.early_checkin_unavailable = !earlyCheckinOn(response);

            var eciAvailable = !$scope.early_checkin_unavailable && response.reservation_in_early_checkin_window,
                wasPurchased = response.is_early_checkin_purchased,
                isBundled = response.is_early_checkin_bundled_by_addon,
                freeFromVIPStatus = response.free_eci_for_vips && response.is_vip,
                eciLimitReached = response.eci_upsell_limit_reached;

                // user probably purchased an early checkin from zest web, or through zest station
                // or was bundled in an add-on (the add-on could be paid or free, so show prepaid either way)
            var isPrepaid = eciAvailable && (isBundled || wasPurchased),
                bypass = response.offer_eci_bypass && !eciAvailable;


            var ableToPurchaseEarly = eciAvailable && !isPrepaid && !bypass && !eciLimitReached,
                freeEarlyCheckin = eciAvailable && !eciLimitReached && (bypass && !isPrepaid || freeFromVIPStatus);

            // ask the guest if they want to purchase early check-in
            if (ableToPurchaseEarly && !isPrepaid && !freeEarlyCheckin) {
                $scope.mode = 'EARLY_CHECKIN_SELECT';

            } else if (isPrepaid && eciAvailable) {
                $scope.mode = 'EARLY_CHECKIN_PREPAID';

            } else if (freeEarlyCheckin && eciAvailable) {
                $scope.mode = 'EARLY_CHECKIN_FREE';

            } else if (isPrepaid && !eciAvailable) {// may be unavailbe since outside of eci window of time
                $scope.mode = 'EARLY_CHECKIN_PREPAID_NOT_READY';   

            }

            console.info('MODE: ', $scope.mode);
        };

        $scope.checkinLater = function() {
            $scope.early_checkin_unavailable = true;

            $scope.mode = 'CHECKIN_LATER';
        };

        $scope.acceptEarlyCheckinOffer = function() {
            var postData = {
                'reservation_id': $scope.selectedReservation.reservation_details.reservation_id,
                'early_checkin_offer_id': $scope.offerId // TODO: move this to API logic,...shouldnt need to also send this via UI...
            };

            var onSuccess = function() {
                var zestStationRoomUpsellOn = $scope.zestStationData.offer_kiosk_room_upsell;

                $scope.$emit('hideLoader');
                if (!$scope.selectedReservation.isRoomUpraded && $scope.selectedReservation.reservation_details.is_upsell_available === 'true' && zestStationRoomUpsellOn) {
                    $state.go('zest_station.roomUpsell');
                } else {
                    $scope.initTermsPage();    
                }
                
            };

            var onFailure = function(response) {
                console.warn(response);
                $scope.$emit('hideLoader');
                $scope.$emit('GENERAL_ERROR');
            };

            if ($scope.inDemoMode()) {
                $scope.$emit('showLoader');
                $timeout(function() {
                    onSuccess();
                }, 1500);
                return;
            }

            $scope.invokeApi(zsPaymentSrv.acceptEarlyCheckinOffer, postData, onSuccess, onFailure);
        };

        $scope.continue = function() {
            var zestStationRoomUpsellOn = $scope.zestStationData.offer_kiosk_room_upsell;

            if (!$scope.selectedReservation.isRoomUpraded && $scope.selectedReservation.reservation_details.is_upsell_available === 'true' && zestStationRoomUpsellOn) {
                $state.go('zest_station.roomUpsell');
            } else {
                $scope.initTermsPage();    
            }
        };


        $scope.initTermsPage = function() {
            
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

            console.warn('to checkin terms: ', stateParams);
            $state.go('zest_station.checkInTerms', stateParams);
        };

        /**
         * [initializeMe description]
         * @return {[type]} [description]
         */
        var initializeMe = (function() {
            // hide back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

            init();
        }());

    }
]);