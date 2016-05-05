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

        /**
         * [initializeMe description]
         */

        var initializeMe = function() {
            //show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.mode = "EMAIL_ENTRY_MODE";
            $scope.signaturePluginOptions = {
                height: 230,
                width: $(window).width() - 120,
                lineWidth: 1
            };
        }();

        $scope.isValidEmail = function(email) {
            if (!email) {
                return false;
            }
            email = email.replace(/\s+/g, '');
            if ($scope.ValidateEmail(email)) {
                return false;
            } else return true;

        };

        $scope.updateGuestEmail = function() {
            var updateComplete = function(response) {
                if ($scope.from === 'signature') {
                    $state.go('zest_station.check_in_keys', {
                        'mode': zsModeConstants.CHECKIN_MODE
                    });
                } else { //at the end of check-in and now updating email address
                    $state.skipCheckinEmail = false;
                    $state.updatedEmail = true;
                    $state.go('zest_station.delivery_options');
                }
            };

            var updateGuestEmailFailed = function() {
                var stateParams = {};
                if (zestStationData.zest_station_message_texts.speak_to_crew_mod_message2 !== '') {
                    stateParams.message = zestStationData.zest_station_message_texts.speak_to_crew_mod_message2;
                } else {
                    //do nothing
                };
                $state.go('zest_station.speakToStaff', stateParams);
            }

            $scope.invokeApi(zsTabletSrv.updateGuestEmail, primaryGuest, updateComplete, updateGuestEmailFailed);
        };
        $scope.goToNext = function() {
            $state.input.email = $scope.input.inputTextValue;
            var isValidEmail = $scope.validEmailAddress($state.input.email);
            if (isValidEmail) {
                $scope.updateGuestEmail();
                $state.skipCheckinEmail = false;
            } else {
                $state.go('zest_station.invalid_email_retry');
            }
        };

        $scope.skipEmailEntryAfterSwipe = function() {
            $state.skipCheckinEmail = true;
            $state.go('zest_station.check_in_keys');
        };
    }
]);