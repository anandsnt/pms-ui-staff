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
    function($scope, $stateParams, $state, zsEventConstants, $controller, $timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv) {

        /**********************************************************************************************
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


        /**
         * [afterGuestCheckinCallback description]
         * @param  {[type]} response [description]
         * @return {[type]}          [description]
         */
        var afterGuestCheckinCallback = function(response) {
            var haveValidGuestEmail = $stateParams.email.length > 0 ? true : false;
             var stateParams = {
                    'guest_id': $stateParams.guest_id,
                    'email': $stateParams.email,
                    'reservation_id': $stateParams.reservation_id,
                    'room_no': $stateParams.room_no,
                    'first_name': $stateParams.first_name
                }


            if (haveValidGuestEmail) {
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
            afterGuestCheckinCallback();
            // commment out after finishing
            //$scope.callAPI(zsCheckinSrv.checkInGuest, options);
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