sntZestStation.controller('zsCheckinFinalCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    function($scope, $stateParams, $state, zsEventConstants, zsCheckinSrv) {


        /** ********************************************************************************************
         **     Please note that, not all the stateparams passed to this state will not be used in this state, 
         **      however we will have to pass this so as to pass again to future states which will use these.
         **       
         **     Expected state params -----> print_opted, email_opted,  print_status, email_status 
         **     and key_success           
         **     Exit function -> $scope.navToHome                               
         **                                                                      
         ***********************************************************************************************/

        /**
         * [initializeMe description]
         */
        var initializeMe = (function() {        
            // hide back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // hide close button
            $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
            // show subtexts based upon actions selected
            var printOpted = $stateParams.print_opted === 'true';
            var emailOpted = $stateParams.email_opted === 'true';
            var printSuccess = $stateParams.print_status === 'success';
            var emailSuccess = $stateParams.email_status === 'success';
            var keySucess = $stateParams.key_success === 'true';

            if (printOpted) {
                if (printSuccess && keySucess) {
                    $scope.subtext = 'PRINT_SUCCESS_AND_KEY_SUCCESS';
                } else if (!printSuccess && keySucess) {
                    $scope.subtext = 'PRINT_FAILED_AND_KEY_SUCCESS';
                } else if (printSuccess && !keySucess) {
                    $scope.subtext = 'PRINT_SUCCESS_AND_KEY_FAILED';
                } else if (!printSuccess && !keySucess) {
                    $scope.subtext = 'PRINT_FAILED_AND_KEY_FAILED';
                } else {
                    $scope.subtext = '';
                }
            } else {
                if (emailSuccess && keySucess) {
                    $scope.subtext = 'EMAIL_SUCCESS_AND_KEY_SUCCESS';
                } else if (!emailSuccess && keySucess) {
                    $scope.subtext = 'EMAIL_FAILED_AND_KEY_SUCCESS';
                } else if (emailSuccess && !keySucess) {
                    $scope.subtext = 'EMAIL_SUCCESS_AND_KEY_FAILED';
                } else if (!emailSuccess && !keySucess) {
                    $scope.subtext = 'EMAIL_FAILED_AND_KEY_FAILED';
                } else {
                    $scope.subtext = '';
                }
            }
        }());

        /* OWS MSG starts here **/

        var owsMsgsPresent = false,
            owsMsgs = [],
            fetchOwsMessages = function() {
                var onOwsMsgFetchSuccess = function(response) {
                    if (response.messages.length > 0) {
                        owsMsgsPresent = true;
                        owsMsgs = response.messages;
                    } else {
                        $scope.navToHome();
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
        $scope.zestStationData.is_kiosk_ows_messages_active = true;
        $scope.zestStationData.is_standalone = false;

        var isOwsMsgEnabled = function() {
            return $scope.zestStationData.is_kiosk_ows_messages_active && !$scope.zestStationData.is_standalone;
        };
        // fetch OWS messages
        if (isOwsMsgEnabled()) {
            fetchOwsMessages();
        }

        $scope.checkinFinalDoneAction = function() {
            if (owsMsgsPresent) {
                var stateparams = {
                    reservation_id: $stateParams.reservation_id,
                    email: $stateParams.email,
                    ows_msgs: JSON.stringify(owsMsgs)
                };
                $state.go('zest_station.owsMsgsPresent', stateparams);
            } else {
                $scope.navToHome();
            }
        };

    }
]);