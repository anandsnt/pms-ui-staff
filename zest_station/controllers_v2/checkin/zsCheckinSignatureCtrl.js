sntZestStation.controller('zsCheckinSignatureCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$controller',
    '$timeout',
    'zsCheckinSrv',
    'zsModeConstants',
    'zsGeneralSrv',
    'zsUtilitySrv',
    '$log',
    function($scope, $stateParams, $state, zsEventConstants, $controller, $timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv, zsUtilitySrv, $log) {

        /** ********************************************************************************************
         **      Please note that, not all the stateparams passed to this state will not be used in this state, 
         **      however we will have to pass this so as to pass again to future states which will use these.
         **
         **      Expected state params -----> reservation_id, room_no,  first_name, guest_id and email           
         **      Exit function -> afterGuestCheckinCallback                             
         **                                                                       
         ***********************************************************************************************/

        /**
         * TWO MODES
         * 1.SIGNATURE_MODE and
         * 2.TIMED_OUT
         */

        /**
         * [clearSignature description]
         * @return {[type]} [description]
         */
        $scope.clearSignature = function() {
            $scope.signatureData = '';
            $('#signature').jSignature('clear');
        };

        var checkIfEmailIsBlackListedOrValid = function() {
            var email = $stateParams.guest_email ? $stateParams.guest_email : $stateParams.email;

            if (!email) {
                email = '';
            }

            return email.length > 0 && !($stateParams.guest_email_blacklisted === 'true') && zsUtilitySrv.isValidEmail(email);
        };

        /**
         * [afterGuestCheckinCallback description]
         * @param  {[type]} response [description]
         * @return {[type]}          [description]
         */
        var afterGuestCheckinCallback = function(response) {
            // if email is valid and is not blacklisted
            var haveValidGuestEmail = checkIfEmailIsBlackListedOrValid(),
                collectNationalityEnabled = $scope.zestStationData.check_in_collect_nationality;

            $log.warn('afterGuestCheckinCallback :: current state params: ', $stateParams);
            var stateParams = {
                'guest_id': $stateParams.guest_id,
                'reservation_id': $stateParams.reservation_id,
                'room_no': $stateParams.room_no,
                'email': $stateParams.email,
                'first_name': $stateParams.first_name,
                'guest_email_blacklisted': $stateParams.guest_email_blacklisted
            };

            $log.info('haveValidGuestEmail: ', haveValidGuestEmail);
            if ($scope.zestStationData.is_kiosk_ows_messages_active) {
                $scope.setScreenIcon('checkin');
                $state.go('zest_station.checkinSuccess', stateParams);
            }
            // if collectiing nationality after email, but email is already valid
            else if (collectNationalityEnabled && haveValidGuestEmail) {
                $state.go('zest_station.collectNationality', stateParams);

            } else if (haveValidGuestEmail) {
                stateParams.email = $stateParams.email;
                $state.go('zest_station.checkinKeyDispense', stateParams);
            } else {
                $log.warn('to email collection: ', stateParams);
                $state.go('zest_station.checkInEmailCollection', stateParams);
            }

        };

        var collectPassportEnabled = $scope.zestStationData.check_in_collect_passport;

        var checkInGuest = function() {
            var signature = $scope.signatureData;
            var checkinParams = {
                'reservation_id': $stateParams.reservation_id,
                'workstation_id': $scope.zestStationData.set_workstation_id,
                'authorize_credit_card': false,
                'do_not_cc_auth': false,
                'is_promotions_and_email_set': false,
                //                "no_post": "",//handled by the API CICO-35315
                'is_kiosk': true,
                'signature': signature
            };
            var options = {
                params: checkinParams,
                successCallBack: afterGuestCheckinCallback
            };


            // when collectPassportEnabled (check_in_collect_passport) is enabled,
            // we should Not check in a guest until After the passports have been validated properly
            // if any passports are invalid during check-in, the user will need to see a staff member
            if (collectPassportEnabled) {
                $scope.zestStationData.checkinGuest = function() {// make a reference to current checkInGuest method used if passport scanning
                    
                    if ($scope.zestStationData.noCheckInsDebugger === 'true') {
                        afterGuestCheckinCallback({ 'status': 'success' });
                    } else {
                        $scope.callAPI(zsCheckinSrv.checkInGuest, options);
                    }
                    
                };   
            }

            if ($scope.zestStationData.noCheckInsDebugger === 'true') {
                $log.log('skipping checkin guest, no-check-ins debugging is ON');
                if (collectPassportEnabled && !$stateParams.passports_scanned) {
                    $state.go('zest_station.checkInScanPassport', $stateParams);
                } else {
                    afterGuestCheckinCallback({ 'status': 'success' });
                }
                
            } else {

                if (collectPassportEnabled && !$stateParams.passports_scanned) {
                    $state.go('zest_station.checkInScanPassport', $stateParams);
                } else {
                    $scope.callAPI(zsCheckinSrv.checkInGuest, options);
                }

            }

        };


        /**
         * [submitSignature description]
         * @return {[type]} [description]
         */

        $scope.submitSignature = function() {
            /*
             * this method will check the guest in after swiping a card
             */
            $scope.signatureData = JSON.stringify($('#signature').jSignature('getData', 'native'));
            if ($scope.signatureData !== [] && $scope.signatureData !== null && $scope.signatureData !== '' && $scope.signatureData !== '[]') {
                checkInGuest();
            } else {
                return;
            }
        };

        $scope.reSignCC = function() {
            $scope.resetTime();
            $scope.mode = 'SIGNATURE_MODE';
        };


        /**
         * [initializeMe description]
         */

        var initializeMe = (function() {
            // show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.mode = 'SIGNATURE_MODE';
            $scope.signaturePluginOptions = {
                height: 230,
                width: $(window).width() - 120,
                lineWidth: 1
            };
            $scope.setScreenIcon('card');
        }());

        var setTimedOut = function() {
            $scope.mode = 'TIMED_OUT';
        };

        $scope.$on('USER_ACTIVITY_TIMEOUT', function() {
            setTimedOut();
        });

    }
]);
