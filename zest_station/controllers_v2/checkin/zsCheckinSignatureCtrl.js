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
    function($scope, $stateParams, $state, zsEventConstants, $controller, $timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv, zsUtilitySrv) {

        /**********************************************************************************************
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
            $("#signature").jSignature("clear");
        };

        var checkIfEmailIsBlackListedOrValid = function(){
            return  ($stateParams.email.length> 0 && !($stateParams.guest_email_blacklisted ==='true') && zsUtilitySrv.isValidEmail($stateParams.email));
        };

        /**
         * [afterGuestCheckinCallback description]
         * @param  {[type]} response [description]
         * @return {[type]}          [description]
         */
        var afterGuestCheckinCallback = function(response) {
            //if email is valid and is not blacklisted
            var haveValidGuestEmail = checkIfEmailIsBlackListedOrValid();
            console.info('current state params: ',$stateParams)
            var stateParams = {
                    'guest_id': $stateParams.guest_id,
                    'reservation_id': $stateParams.reservation_id,
                    'room_no': $stateParams.room_no,
                    'first_name': $stateParams.first_name
            };


            if (haveValidGuestEmail) {
                stateParams.email = $stateParams.email;
                $state.go('zest_station.checkinKeyDispense', stateParams);
            } else {
                $state.go('zest_station.checkInEmailCollection', stateParams);
            }

        };

        var checkInGuest = function() {
            var signature = $scope.signatureData;
            var checkinParams = {
                'reservation_id': $stateParams.reservation_id,
                'workstation_id': $scope.zestStationData.set_workstation_id,
                "authorize_credit_card": false,
                "do_not_cc_auth": false,
                "is_promotions_and_email_set": false,
                "no_post": "",
                "is_kiosk": true,
                'signature': signature
            };
            var options = {
                params: checkinParams,
                successCallBack: afterGuestCheckinCallback
            };
            $scope.callAPI(zsCheckinSrv.checkInGuest, options);
        };
        /**
         * [submitSignature description]
         * @return {[type]} [description]
         */
        $scope.submitSignature = function() {
            /*
             * this method will check the guest in after swiping a card
             */
            $scope.signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
            if ($scope.signatureData !== [] && $scope.signatureData !== null && $scope.signatureData !== '' && $scope.signatureData !== '[]') {
                checkInGuest();
            } else {
                return;
            }
        };

        $scope.reSignCC = function() {
            $scope.resetTime();
            $scope.mode = "SIGNATURE_MODE";
        };


        /**
         * [initializeMe description]
         */

        var initializeMe = function() {
            //show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.mode = "SIGNATURE_MODE";
            $scope.signaturePluginOptions = {
                height: 230,
                width: $(window).width() - 120,
                lineWidth: 1
            };
        }();

        var setTimedOut = function() {
            $scope.mode = 'TIMED_OUT';
        };

        $scope.$on('USER_ACTIVITY_TIMEOUT', function() {
            setTimedOut();
        });

    }
]);