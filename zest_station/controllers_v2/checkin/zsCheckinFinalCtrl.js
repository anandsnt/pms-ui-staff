sntZestStation.controller('zsCheckinFinalCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    function($scope, $stateParams, $state, zsEventConstants) {


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
            $scope.trackEvent('CI', 'Flow-End-Success');
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
            var keyType = $stateParams.key_type;

            if (printOpted) {
                if (keyType === 'ONLY_MOBILE_KEY' || keyType === 'MANUAL') {
                    if (printSuccess) {
                        $scope.subtext = 'PRINT_SUCCESS';
                    } else {
                        $scope.subtext = 'PRINT_FAILED';
                    }
                } else {
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
                }

            } else {
                if (keyType === 'ONLY_MOBILE_KEY' || keyType === 'MANUAL') {
                    if (emailSuccess) {
                        $scope.subtext = 'EMAIL_SUCCESS';
                    } else {
                        $scope.subtext = 'EMAIL_FAILED';
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
            }
            $scope.trackSessionActivity('CheckIn', 'Check In Success, Final Screen', $scope.zestStationData.session_conf, $scope.subtext, true);
            $scope.resetTrackers();
        }());


    }
]);