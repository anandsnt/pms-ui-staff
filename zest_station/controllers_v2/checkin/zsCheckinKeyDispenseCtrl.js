sntZestStation.controller('zsCheckinKeyDispenseCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$controller',
    'zsGeneralSrv',
    '$log',
    function($scope, $stateParams, $state, zsEventConstants, $controller, zsGeneralSrv, $log) {

        /** ********************************************************************************************
         **     Please note that, not all the stateparams passed to this state will not be used in this state, 
         **       however we will have to pass this so as to pass again to future states which will use these.
         **       
         **     Expected state params -----> reservation_id, room_no,  first_name, guest_id and email             
         **     Exit function -> $scope.goToNextScreen                              
         **                                                                      
         ***********************************************************************************************/

        /**
         *    MODES inside the page
         *    
         * 1. DISPENSE_KEY_MODE -> select No of keys
         * 2. DISPENSE_KEY_FAILURE_MODE -> failure mode
         * 3. SOLO_KEY_CREATION_IN_PROGRESS_MODE -> one key selected case
         * 4. KEY_ONE_CREATION_IN_PROGRESS_MODE -> 2 key selected, 1st in progress
         * 5. KEY_ONE_CREATION_SUCCESS_MODE -> 2 key selected, 1st completed
         * 6. KEY_CREATION_SUCCESS_MODE -> all requested keys were created
         */

        /**
         * [initializeMe description]
         */
        var initializeMe = (function() {
            // All the common actions for dispensing keys are to be included in
            // zsKeyDispenseCtrl
            $controller('zsKeyDispenseCtrl', {
                $scope: $scope
            });
            // hide back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // hide close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            if ($scope.zestStationData.station_mobile_key_status === 'third_party') {
                $scope.mode = 'MOBILE_OR_PHYSICAL_KEY';
            } else {
                $scope.mode = 'DISPENSE_KEY_MODE';
            }
            $scope.setScreenIcon('key');

            // for Manual key creation navigate to new screen.
            if ($scope.zestStationData.kiosk_key_creation_method === 'manual') {
                $state.go('zest_station.manualKeyPickup', {
                    'mode': 'CHECKIN',
                    'guest_id': $stateParams.guest_id,
                    'email': $stateParams.email,
                    'reservation_id': $stateParams.reservation_id,
                    'room_no': $stateParams.room_no,
                    'first_name': $stateParams.first_name
                });
            }
        }());

        $scope.$on('CLICKED_ON_CANCEL_BUTTON', function () {
            $scope.$emit('EJECT_KEYCARD');
        });

        $scope.guestDetails = {
            "guestEmail": $stateParams.email
        };
        $scope.guestId = $stateParams.guest_id;


        $scope.first_name = $stateParams.first_name;
        $scope.room = $stateParams.room_no;

        $scope.goToNextScreen = function(status) {
            var stateParams = {
                'guest_id': $stateParams.guest_id,
                'email': $scope.guestDetails.guestEmail,
                'reservation_id': $stateParams.reservation_id,
                'room_no': $stateParams.room_no,
                'first_name': $stateParams.first_name,
                'key_type': $scope.keyTypeselected
            };
            
            stateParams.key_success = status === 'success';
            // check if a registration card delivery option is present (from Admin>Station>Check-in), if none are checked, go directly to final screen
            var registration_card = $scope.zestStationData.registration_card;

            $scope.setScreenIcon('bed');

            if (!registration_card.email && !registration_card.print && !registration_card.auto_print) {
                $state.go('zest_station.zsCheckinFinal');
            } else {
                $state.go('zest_station.zsCheckinBillDeliveryOptions', stateParams);
            }
        };


        /** ***** Mobile key ***** **/

        /** MOBILE_OR_PHYSICAL_KEY mode actions **/

        $scope.keyTypeselected = '';
        $scope.selectMobileKey = function() {
            $scope.mobileKeySelected = !$scope.mobileKeySelected;
        };
        $scope.selectPhysicalKey = function() {
            $scope.physicalKeySelected = !$scope.physicalKeySelected;
        };
        $scope.keyTypeselected = function() {
            if (!$scope.mobileKeySelected && $scope.physicalKeySelected) {
                $scope.mode = 'DISPENSE_KEY_MODE';
                $scope.keyTypeselected = 'ONLY_PHYSICAL_KEY';
            } else if ($scope.mobileKeySelected && !$scope.physicalKeySelected) {
                $scope.mode = 'THIRD_PARTY_SELECTION';
                $scope.keyTypeselected = 'ONLY_MOBILE_KEY';
            } else {
                $scope.mode = 'THIRD_PARTY_SELECTION';
                $scope.keyTypeselected = 'BOTH_KEY';
            }
        };
        /** THIRD_PARTY_SELECTION mode actions **/

        $scope.thirdPartyHaveIt = function() {
            $scope.mode = 'THIRD_PARTY_HAVE_IT_INFO';
        };
        $scope.thirdPartyGetIt = function() {
            if ($scope.guestDetails.guestEmail.length > 0) {
                $scope.mode = 'THIRD_PARTY_GET_IT_INFO';
            } else {
                $scope.editEmailAddress();
            }
        };

        var nextPageActionsForMobileKey = function() {
            if ($scope.keyTypeselected === 'ONLY_MOBILE_KEY') {
                $scope.goToNextScreen({
                    status: 'success'
                });
            } else {
                $scope.mode = 'DISPENSE_KEY_MODE';
            }
        };
        
        $scope.thirdPartyNoThanks = function() {
            $scope.mode = 'DISPENSE_KEY_MODE';
        };

        /** *** THIRD_PARTY_HAVE_IT_INFO * **/
        $scope.thirdPartyAppPresentNext = function() {
            nextPageActionsForMobileKey();
        };

        /** THIRD_PARTY_GET_IT_INFO mode actions **/

        $scope.editEmailAddress = function() {
            $scope.mode = 'COLLECT_EMAIL';
            $scope.emailMode = 'EMAIL_ENTRY_MODE';
            $scope.focusInputField('email-entry');
        };
        $scope.sendMobileKeyEmail = function() {

            var onSuccessResponse = function() {
                $scope.mode = 'THIRD_PARTY_GET_IT_INFO_EMAIL_SENT';
            };

            var onFailure = function() {
                $log.warn('thirdPartyEmailFailure');
                $state.go('zest_station.speakToStaff');
            };

            $scope.callAPI(zsGeneralSrv.sendThirdPartyEmail, {
                params: {
                    reservation_id: $stateParams.reservation_id
                },
                'successCallBack': onSuccessResponse,
                'failureCallBack': onFailure
            });
        };

        $scope.thirdPartyMaileSent = function() {
            nextPageActionsForMobileKey();
        };
       

        /** COLLECT_EMAIL_MODE **/

         $scope.$on('EMAIL_UPDATION_SUCCESS', function() {
            $scope.mode = 'THIRD_PARTY_GET_IT_INFO';
            $scope.callBlurEventForIpad();
        });


        $scope.$on('EMAIL_UPDATION_FAILED', function() {
            var  stateParams = {
                'message': 'Email Updation Failed.'
            };

            $state.go('zest_station.speakToStaff', stateParams);
        });

    }
]);