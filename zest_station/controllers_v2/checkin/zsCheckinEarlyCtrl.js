sntZestStation.controller('zsCheckinEarlyCtrl', [
    '$scope',
    '$state',
    'zsEventConstants',
    '$stateParams',
    'zsCheckinSrv',
    'zsPaymentSrv',
    '$timeout',
    '$log',

    function($scope, $state, zsEventConstants, $stateParams, zsCheckinSrv, zsPaymentSrv, $timeout, $log) {

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
            $log.warn('init:: ',$stateParams);
            // Quick-jump from Screen-jumping feature
            // mainly for editing language text and demos
            if ($stateParams.isQuickJump === 'true') {
                $log.log('Jumping to ECI with demo data');
                setPlaceholderDataForDemo($stateParams.quickJumpMode);
            } else {
                var params = JSON.parse($stateParams.early_checkin_data);

                setInitEciParams(params);
            }

            
        };

        var setInitEciParams = function(params) {
            $log.log(params);

            $scope.selectedReservation = JSON.parse($stateParams.selected_reservation);
            setEarlyParams(params);

        };


        var setPlaceholderDataForDemo = function(mode) {
            var options = {
                params: {
                    'mode': mode
                },
                successCallBack: function(response) {
                    var data = response.paths;

                    for (var i in data) {
                        if (data[i].name === mode) {
                            setInitEciParams(data[i].data);        
                        }
                    }
                }
            };

            $scope.callAPI(zsCheckinSrv.fetchECIPlaceholderData, options);
        };

        
        var onBackButtonClicked = function() {
            $state.go('zest_station.checkInReservationDetails');
        };

        var earlyCheckinOn = function(data) {
            if (data.debugWithECIOn) {
                return true;
            }
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

            $log.info('MODE: ', $scope.mode);
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
                
                $scope.$emit('hideLoader');
                $scope.continue();                
            };

            var onFailure = function(response) {
                $log.warn(response);
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

            if (!$scope.selectedReservation.isRoomUpraded && $scope.selectedReservation.is_upsell_available === 'true' && !$scope.selectedReservation.reservation_details.cannot_move_room && zestStationRoomUpsellOn) {
                $state.go('zest_station.roomUpsell');
            } else if ($scope.zestStationData.station_addon_upsell_active && !$scope.selectedReservation.skipAddon) {
                $state.go('zest_station.addOnUpsell');
            } else {
                $scope.initTermsPage();
            }
        };


        $scope.initTermsPage = function() {
            
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

            $log.warn('to checkin terms: ', stateParams);
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