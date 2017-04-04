sntZestStation.controller('zsCheckinSuccessCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    'zsUtilitySrv',
    function($scope, $stateParams, $state, zsEventConstants, zsCheckinSrv, zsUtilitySrv) {

        var stateParams = $stateParams;

        $scope.user_name = stateParams.first_name;
        $scope.room = $stateParams.room_no;
        var checkIfEmailIsBlackListedOrValid = function() {
            return ($stateParams.email.length > 0 && !($stateParams.guest_email_blacklisted === 'true') && zsUtilitySrv.isValidEmail($stateParams.email));
        };

        /**
         * [afterGuestCheckinCallback description]
         * @param  {[type]} response [description]
         * @return {[type]}          [description]
         */
        var nextPageActions = function() {
            // if email is valid and is not blacklisted
            var haveValidGuestEmail = checkIfEmailIsBlackListedOrValid(),
                collectNationalityEnabled = $scope.zestStationData.check_in_collect_nationality;
        
            // if collectiing nationality after email, but email is already valid
            if (collectNationalityEnabled && haveValidGuestEmail) {
                $state.go('zest_station.collectNationality', stateParams);

            } else if (haveValidGuestEmail) {
                stateParams.email = $stateParams.email;
                $state.go('zest_station.checkinKeyDispense', stateParams);
            } else {
                $state.go('zest_station.checkInEmailCollection', stateParams);
            }

        };


        /* OWS MSG starts here **/

        var owsMsgsPresent = false,
            owsMsgs = [],
            fetchOwsMessages = function() {
                var onOwsMsgFetchSuccess = function(response) {
                    if (response.messages.length > 0) {
                        owsMsgsPresent = true;
                        owsMsgs = response.messages;
                    } else {
                        return;
                    }
                };
                
                $scope.owsMsgOpenPoup = false;
                var options = {
                    params: {
                        "reservation_id": $stateParams.reservation_id
                    },
                    successCallBack: onOwsMsgFetchSuccess
                };

                $scope.callAPI(zsCheckinSrv.fetchOwsMessage, options);

            };

        var isOwsMsgEnabled = function() {
            // if ows settings is turned for station and is connected property
            return $scope.zestStationData.is_kiosk_ows_messages_active && !$scope.zestStationData.is_standalone;
        };
        
        // fetch OWS messages
        if (isOwsMsgEnabled()) {
            fetchOwsMessages();
        }

        $scope.checkinFinalDoneAction = function() {
            if (owsMsgsPresent) {
                stateParams.ows_msgs = JSON.stringify(owsMsgs);
                $state.go('zest_station.owsMsgsPresent', stateParams);
            } else {
                nextPageActions();
            }
        };

    }
]);