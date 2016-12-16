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
            $scope.$emit('hideLoader'); // need to fix why loader is still appearing after init/success call
            console.info('init early checkin ctrl: ', $stateParams);

            var params = JSON.parse($stateParams.early_checkin_data);
            
            $scope.selectedReservation = JSON.parse($stateParams.selected_reservation);

            setEarlyParams(params);
        };

        var earlyCheckinOn = function(data) {
            // check 3 settings: 
            //    hotel > promo upsell > early checkin active
            //    hotel > promo upsell > early checkin available (limit not reached)
            //    zest station > checkin > early checkin active
            var earlyCheckinIsOFF = !data.early_checkin_on, 
                earlyCheckinNotAvailable = !data.early_checkin_available,
                stationNotOfferingEarlyCheckin = !$scope.zestStationData.offer_early_checkin;

            if (earlyCheckinIsOFF || earlyCheckinNotAvailable || stationNotOfferingEarlyCheckin) {
                return false;
            } 
            return true;
        };

        var setEarlyParams = function(response) {
            console.info('===============');
            console.info('===============', response);
            console.info('===============');
            $scope.reservation_in_early_checkin_window = response.reservation_in_early_checkin_window;
            $scope.is_early_prepaid = false;

            if (response.offer_eci_bypass) { // if bypass is true, early checkin may be part of their Rate
                $scope.is_early_prepaid = false;
                $scope.bypass = response.offer_eci_bypass;
            }

            if (response.is_early_checkin_purchased || response.is_early_checkin_bundled_by_addon) { // user probably purchased an early checkin from zest web, or through zest station
                $scope.is_early_prepaid = true; // or was bundled in an add-on (the add-on could be paid or free, so show prepaid either way)
            }
            

            $scope.standardCheckinTime = response.checkin_time;
            $scope.early_checkin_unavailable = !earlyCheckinOn(response);

            if ($scope.early_checkin_unavailable) {
                $scope.bypass = false;
                $scope.is_early_prepaid = false;
                $scope.reservation_in_early_checkin_window = false;
            }

            $scope.ableToPurchaseEarly = !$scope.early_checkin_unavailable && !$scope.is_early_prepaid && $scope.reservation_in_early_checkin_window && !$scope.bypass;
            $scope.early_checkin_charge = response.early_checkin_charge;

            $scope.prepaidEarlyCheckin = ($scope.bypass || $scope.is_early_prepaid) && !$scope.early_checkin_unavailable;
            $scope.freeEarlyCheckin = $scope.bypass && !$scope.is_early_prepaid && $scope.reservation_in_early_checkin_window;

            $scope.early_charge_symbol = $scope.zestStationData.currencySymbol;
            $scope.show_early_unavailable_from_checkin_later = false;

            $scope.offerId = response.early_checkin_offer_id;
            $scope.reservation_id = $scope.selectedReservation.reservation_details.reservation_id;

            if ($scope.ableToPurchaseEarly && 
                !$scope.prepaidEarlyCheckin && 
                !$scope.freeEarlyCheckin) {
                // ask the guest if they want to purchase early check-in
                    $scope.mode = 'EARLY_CHECKIN_SELECT';
            }

            if ($scope.prepaidEarlyCheckin) {
                $scope.mode = 'EARLY_CHECKIN_PREPAID';
            }

            if ($scope.freeEarlyCheckin && !$scope.early_checkin_unavailable) {
                $scope.mode = 'EARLY_CHECKIN_FREE';
            }

            if ($scope.is_early_prepaid && !$scope.reservation_in_early_checkin_window) {
                $scope.mode = 'EARLY_CHECKIN_PREPAID_NOT_READY';   
            }

            console.info('MODE: ', $scope.mode);
        };

        $scope.checkinLater = function() {
            $scope.early_checkin_unavailable = true;
            $scope.show_early_unavailable_from_checkin_later = true;

            ///NEW
            $scope.mode = 'CHECKIN_LATER';
        };

        $scope.acceptEarlyCheckinOffer = function() {
            var postData = {
                'reservation_id': $scope.reservation_id,
                'early_checkin_offer_id': $scope.offerId // TODO: move this to API logic,...shouldnt need to also send this via UI...
            };

            var onSuccess = function() {
                $scope.$emit('hideLoader');
                $scope.initTermsPage();
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
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

            init();
        }());

    }
]);