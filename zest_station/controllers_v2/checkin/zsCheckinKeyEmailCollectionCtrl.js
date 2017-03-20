sntZestStation.controller('zsCheckinMobileKeyEmailCollectionCtrl', [
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

        $scope.reEnterText = function() {
            $scope.emailMode = 'EMAIL_ENTRY_MODE';
            $scope.focusInputField('email-entry');
        };

        var checkIfEmailIsBlacklisted = function(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure) {
            var blacklistCheckOptions = {
                params: {
                    'email': $scope.guestDetails.guestEmail
                },
                successCallBack: function(data) {
                    // onSuccess, 
                    if (!data.black_listed_email) {
                        afterBlackListValidation();

                    } else {
                        $log.warn('email is black listed, request different email address');
                        onBlackListedEmailFound();
                    }
                },
                failureCallBack: onValidationAPIFailure
            };

            $scope.callAPI(zsGeneralSrv.emailIsBlackListed, blacklistCheckOptions);
        };


        /**
         * [updateGuestEmail description]
         * @return {[type]} [description]
         */
        var setInvalidEmailMode = function() {
            $scope.emailMode = 'EMAIL_INVLAID_MODE';
        };

        var goToNextScreenInFlow = function() {
            $scope.$emit("MODE_CHANGED", {
                menu: 'THIRD_PARTY_GET_IT_INFO'
            });
        };

        var updateGuestEmail = function() {
            var updateComplete = function() {
                goToNextScreenInFlow();
            };
            /*
             * [updateGuestEmailFailed description]
             * @return {[type]} [description]
             */
            var updateGuestEmailFailed = function(response) {
                $log.warn('updateGuestEmailFailed: ', response);
                $state.go('zest_station.speakToStaff');
            };

            var afterBlackListValidation = function() {
                var options = {
                    params: {
                        'guest_id': $stateParams.guest_id,
                        'email': $scope.guestDetails.guestEmail
                    },
                    successCallBack: updateComplete,
                    failureCallBack: updateGuestEmailFailed
                };

                $scope.callAPI(zsGeneralSrv.updateGuestEmail, options);
            };
            var onBlackListedEmailFound = function() {
                setInvalidEmailMode();
            };
            var onValidationAPIFailure = function() {
                updateGuestEmailFailed();
            };
            // checks if new email is blacklisted, if so, set invalid email mode
            // otherwise, continue updating guest email

            checkIfEmailIsBlacklisted(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure);
        };
        /**
         * [goToNext description]
         * @return {[type]} [description]
         */

        $scope.goToNext = function() {
            var isValidEmail = $scope.guestDetails.guestEmail.length > 0 ? zsUtilitySrv.isValidEmail($scope.guestDetails.guestEmail) : false;

            if (isValidEmail) {
                updateGuestEmail();
            } else {
                setInvalidEmailMode();
                $scope.callBlurEventForIpad();
            }
        };
        /**
         * [skipEmail description]
         * @return {[type]} [description]
         */
        $scope.skipEmail = function() {

            goToNextScreenInFlow();
            // $state.go('zest_station.checkinKeyDispense', stateParams);
        };


    }
]);