sntZestStation.controller('zsCheckinEmailCollectionCtrl', [
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
         **      Exit function -> updateComplete                             
         **                                                                       
         ***********************************************************************************************/

        /**
         * MODES IN THE SCREEN
         * 1.EMAIL_ENTRY_MODE
         * 2.EMAIL_INVLAID_MODE
         */

         
        var focusInputField = function(elementId) {
            $timeout(function() {
                if ($scope.isIpad){
                    $scope.callBlurEventForIpad();
                }
                document.getElementById(elementId).focus();
                document.getElementById(elementId).click();
            }, 300);

        };
         
        /**
         * [initializeMe description]
         */
        var initializeMe = function() {
            //show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.email = "";
            $scope.mode = "EMAIL_ENTRY_MODE";
            focusInputField('email-entry');
        }();

        /**
         * [reEnterText description]
         * @return {[type]} [description]
         */
        $scope.reEnterText = function() {
            $scope.mode = "EMAIL_ENTRY_MODE";
            focusInputField('email-entry');
        };
        /*
         * after validating email syntax, need to check the email against the hotel's black list
         * - settings/zest/email blacklist
         * if the email is validated as non-blacklisted, then proceed to next function
         */
        var checkIfEmailIsBlacklisted = function(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure) {
            var blacklistCheckOptions = {
                params: {
                    'email': $scope.email
                },
                successCallBack: function(data) {
                    //onSuccess, 
                    if (!data.black_listed_email) {
                        afterBlackListValidation();

                    } else {
                        console.warn('email is black listed, request different email address');
                        onBlackListedEmailFound();
                    };
                },
                failureCallBack: onValidationAPIFailure
            };
            $scope.callAPI(zsGeneralSrv.emailIsBlackListed, blacklistCheckOptions);
        }


        /**
         * [updateGuestEmail description]
         * @return {[type]} [description]
         */
        var setInvalidEmailMode = function() {
            $scope.mode = "EMAIL_INVLAID_MODE";
        };
        var updateGuestEmail = function() {
            var updateComplete = function(response) {
                console.info('updateGuestEmail :: updateComplete: ', response);
                var stateParams = {
                    "reservation_id": $stateParams.reservation_id,
                    "guest_id": $stateParams.guest_id,
                    "room_no": $stateParams.room_no,
                    "room": $stateParams.room_no,
                    "first_name": $stateParams.first_name,
                    "email": $scope.email
                };
                $state.go('zest_station.checkinKeyDispense', stateParams);
            };
            /**
             * [updateGuestEmailFailed description]
             * @return {[type]} [description]
             */
            var updateGuestEmailFailed = function(response) {
                console.warn('updateGuestEmailFailed: ', response); //if this fails would help give clues as to why
                var stateParams = {
                    "first_name": $stateParams.first_name,
                };
                if ($scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2 !== '') {
                    stateParams.message = $scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2;
                } else {
                    //do nothing
                };
                $state.go('zest_station.speakToStaff', stateParams);
            };

            var afterBlackListValidation = function() {
                var options = {
                    params: {
                        'guest_id': $stateParams.guest_id,
                        'email': $scope.email
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
            //checks if new email is blacklisted, if so, set invalid email mode
            //otherwise, continue updating guest email
            checkIfEmailIsBlacklisted(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure);
        };
        /**
         * [goToNext description]
         * @return {[type]} [description]
         */
        $scope.goToNext = function() {
            var isValidEmail = $scope.email.length > 0 ? zsUtilitySrv.isValidEmail($scope.email) : false;
            if (isValidEmail) {
                updateGuestEmail();
            } else {
                setInvalidEmailMode();
                $scope.callBlurEventForIpad();
            };
        };
        /**
         * [skipEmail description]
         * @return {[type]} [description]
         */
        $scope.skipEmail = function() {
            var stateParams = {
                "reservation_id": $stateParams.reservation_id,
                "room": $stateParams.room,
                "room_no": $stateParams.room_no,
                "guest_id": $stateParams.guest_id,
                "email": $stateParams.email,
                "first_name": $stateParams.first_name
            };
            console.info(' :: skipEmail :: ', stateParams);
            $state.go('zest_station.checkinKeyDispense', stateParams);
        };
    }
]);