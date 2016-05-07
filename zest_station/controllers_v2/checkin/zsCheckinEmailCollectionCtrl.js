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
        **      however we will have to pass this so as to pass again in future states which will use these.
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

        /**
         * [initializeMe description]
         */
        var initializeMe = function() {
            //show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            //show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.email = $stateParams.email.length > 0 ? $stateParams.email : "";
            $scope.mode = "EMAIL_ENTRY_MODE";
        }();
        /**
         * [reEnterText description]
         * @return {[type]} [description]
         */
        $scope.reEnterText = function() {
            $scope.mode = "EMAIL_ENTRY_MODE";
        };
        /**
         * [updateGuestEmail description]
         * @return {[type]} [description]
         */
        var updateGuestEmail = function() {
            var updateComplete = function(response) {
                    var stateParams = {
                        "reservation_id": $stateParams.reservation_id,
                        "guest_id" : $stateParams.reservation_id,
                        "room": $stateParams.room_no,
                        "first_name": $stateParams.first_name
                    }
                    $state.go('zest_station.checkinKeyDispense', stateParams);
            };
            /**
             * [updateGuestEmailFailed description]
             * @return {[type]} [description]
             */
            var updateGuestEmailFailed = function() {
                var stateParams = {};
                if ($scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2 !== '') {
                    stateParams.message = $scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2;
                } else {
                    //do nothing
                };
                $state.go('zest_station.speakToStaff', stateParams);
            }

            var options = {
                params: {
                    'guest_id': $stateParams.guest_id,
                    'email': $scope.email
                },
                successCallBack: updateComplete,
                failureCallBack: updateGuestEmailFailed
            }
            $scope.callAPI(zsGeneralSrv.updateGuestEmail, options);
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
                $scope.mode = "EMAIL_INVLAID_MODE";
            };
        };
        /**
         * [skipEmail description]
         * @return {[type]} [description]
         */
        $scope.skipEmail = function() {
            var stateParams = {
                "reservationId": $stateParams.reservation_id,
                "room": $stateParams.room_no,
                "first_name": $stateParams.first_name
            }
            $state.go('zest_station.checkinKeyDispense', stateParams);
        };
    }
]);