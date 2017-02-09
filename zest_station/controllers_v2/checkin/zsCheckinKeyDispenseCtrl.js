sntZestStation.controller('zsCheckinKeyDispenseCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$controller',
    '$timeout',
    function($scope, $stateParams, $state, zsEventConstants, $controller, $timeout) {

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
        // Mobile Key is enabled for the Hotel and ZestStation->(room key delivery) + reservation (room) supports mobile key + 
        // offer_mobilekey_from_station
        var mobileKeyOptionAvailable = true;

        var setInitialScreenMode = function() {
            // if not using Mobile Key, and other settings are on/enabled for the reservation,
            //  go straight to Dispense key (regular flow)
            // otherwise, ask user if they want a mobile key, physical key, or both
            console.warn(':: mobileKeyOptionAvailable :: ', mobileKeyOptionAvailable);


            if ($stateParams.isQuickJump === 'true') {
                $stateParams.for_demo = 'true';
                $stateParams.email = 'guest@' + $scope.zestStationData.theme + '.com';
                $stateParams.room_no = 102;
                $stateParams.first_name = 'james';

                $scope.mode = $stateParams.quickJumpMode;
            } else {

                $scope.first_name = $stateParams.first_name;
                $scope.room = $stateParams.room_no;
                console.info('room number is: ', $scope.room);

                if (mobileKeyOptionAvailable) {
                    console.info('$stateParams: ', $stateParams);
                    if ($stateParams.for_demo === 'true') {
                        // flag (for_demo) only here when continuing from email collection after selecting mobile key
                        $scope.app_email = $stateParams.email;
                        $scope.mode = 'MOBILE_KEY_SETUP_ACCOUNT';    
                        return;
                    }

                    console.info('zestStationData.show_room_number: ', $scope.zestStationData.show_room_number);
                    
                    $scope.mode = 'MOBILE_OR_PHYSICAL_KEY_START';

                } else {
                    $scope.mode = 'DISPENSE_KEY_MODE';
                }
                console.info('MODE: -> ', $scope.mode);
                
            }
        };
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
                
            setInitialScreenMode();

            console.info('station settings;', $scope.zestStationData);
            $scope.setScreenIcon('key');

        }());

        var stateParams = {
            'guest_id': $stateParams.guest_id,
            'email': $stateParams.email,
            'reservation_id': $stateParams.reservation_id,
            'room_no': $stateParams.room_no,
            'first_name': $stateParams.first_name
        };

        var initSNTMobileKeyFlow = function() {
            console.log('request from API user has APP user account and is setup/associated?');
            
            // test failure first
            var userHasMobileAccountAlready = false;// debugging, check if user has email + if email is associated with the App
                // TODO: remove this link once we add backend logic

            userHasMobileAccountAlready = $scope.zestStationData.demoMobileKeyModeEmailLinked === 'true' ? true : false;

            // TODO: check flag if user account is setup already, then wont need to add email,etc.
            console.info('userHasMobileAccountAlready: ', userHasMobileAccountAlready);
            if (userHasMobileAccountAlready) {
                //  -- go to confirmation screen if success
                //  next button will continue with Key Flow 
                //  TODO--continue key flow logic(if only doing mobile, go to final, 
                //  --else need to continue w/ Physical key making)
                //  
                $timeout(function() {// demo timeout, remove once connected to api
                    $scope.mode = 'MOBILE_KEY_SENT_SUCCESS';
                }, 1000);
                

            } else {
                $scope.mode = 'MOBILE_KEY_ACCOUNT_NOT_CONNECTED';
                // $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

            }
        };
        var initThirdPartyMobileKeyFlow = function() {
            $scope.mode = 'THIRD_PARTY_SELECTION';

        };

        $scope.thirdPartyHaveIt = function() {
            $scope.mode = 'THIRD_PARTY_HAVE_IT_INFO';
        };

        $scope.thirdPartyGetIt = function() {
            $scope.mode = 'THIRD_PARTY_GET_IT_INFO';
            $scope.downloadAppShowEmail = '';// TODO link to API setting
            $scope.email = $stateParams.email;
        };

        $scope.thirdPartyNoThanks = function() {
            if ($scope.physicalKeySelected) {// probably dont need this check
                $scope.getPhysicalKey();
            } else {
                $scope.goToNextScreen();
            }

        };

        $scope.editEmail = function() {
                $state.go('zest_station.checkInEmailCollection',$stateParams);
        };

        $scope.sendEmail = function() {
            // TODO link with api call, onSuccess go to next screen (email sent)
            // for now, just show sent*
            $scope.mode = 'THIRD_PARTY_GET_IT_INFO_EMAIL_SENT';
        };
        

        $scope.goToNextScreen = function(status) {
            if ($scope.mode === 'MOBILE_OR_PHYSICAL_KEY_START') {
                $scope.mode = 'MOBILE_OR_PHYSICAL_KEY';
            }

            if ($scope.mode === 'MOBILE_KEY_SENT_SUCCESS' && $scope.physicalKeySelected) {
                $scope.getPhysicalKey();
                return;
            }

            if ($scope.mode === 'MOBILE_OR_PHYSICAL_KEY') {

                var mobileKeyRequested = $scope.mobileKeySelected;// TODO, link w/ checkboxes

                if (mobileKeyRequested) {
                    // MOBILE KEY FROM 1st (SNT) or 3rd party (..those guys -_-")
                    console.log('type of mobile key requested [',($scope.zestStationData.thirdPartyMobileKey === 'true' ? 'Third-Party':'Default'),']');
                    if ($scope.zestStationData.thirdPartyMobileKey === 'true') {
                        initThirdPartyMobileKeyFlow();

                    } else {
                        initSNTMobileKeyFlow();
                    }

                } else if ($scope.physicalKeySelected) {// probably dont need this check
                    $scope.getPhysicalKey();
                }

            } else {

                stateParams.key_success = status === 'success';
                console.warn('goToNextScreen: ', stateParams);
                // check if a registration card delivery option is present (from Admin>Station>Check-in), if none are checked, go directly to final screen
                var registration_card = $scope.zestStationData.registration_card;

                $scope.setScreenIcon('bed');

                if (!registration_card.email && !registration_card.print && !registration_card.auto_print) {
                    $state.go('zest_station.zsCheckinFinal');
                } else {
                    $state.go('zest_station.zsCheckinBillDeliveryOptions', stateParams);
                }
            }


        };

        
        $scope.mobileKeySelected = false;
        $scope.selectMobileKey = function() {
            // selects mobile key for encoding
            $scope.mobileKeySelected = !$scope.mobileKeySelected;

        };
        $scope.physicalKeySelected = false;
        $scope.selectPhysicalKey = function() {
            // selects mobile key for encoding
            $scope.physicalKeySelected = !$scope.physicalKeySelected;

        };

        $scope.getPhysicalKey = function() {
            $timeout(function() {// time gap incase user double-clicks, avoid going too far in flow
                $scope.mode = 'DISPENSE_KEY_MODE';
            }, 500);
            
        };

        $scope.sendAppLink = function() {
            if ($scope.zestStationData.demoMobileKeyModeUserEmailOnFile === 'false') {
                $timeout(function() {// time gap incase user double-clicks, avoid going too far in flow
                    $scope.mode = 'MOBILE_KEY_SETUP_ENTER_EMAIL';  
                    var params = {
                        'route_back_to': 'zest_station.checkinKeySelection', // route back to the mobile key UI-flow after adding email
                        'for_demo': true
                    };

                    $state.go('zest_station.checkInEmailCollection', params);
  
                }, 250);
            } else {
                $scope.app_email = 'you@stayntouch.com';
                $timeout(function() {// time gap incase user double-clicks, avoid going too far in flow
                    $scope.mode = 'MOBILE_KEY_SETUP_ACCOUNT';    
                }, 250);
            }
        };

    }
]);