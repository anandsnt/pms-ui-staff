sntZestStation.controller('zsCheckinEmailCollectionCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$controller',
    'zsModeConstants',
    function($scope, $stateParams, $state, zsEventConstants, $controller, zsModeConstants) {


        /** ********************************************************************************************
         **      Please note that, not all the stateparams passed to this state will not be used in this state, 
         **      however we will have to pass this so as to pass again to future states which will use these.
         **
         **      Expected state params -----> reservation_id, room_no,  first_name, guest_id and email           
         **      Exit function -> updateComplete                             
         **                                                                       
         ***********************************************************************************************/
        var stateParams = {
            'reservation_id': $stateParams.reservation_id,
            'room': $stateParams.room,
            'room_no': $stateParams.room_no,
            'guest_id': $stateParams.guest_id,
            'email': '', // email was'nt saved
            'first_name': $stateParams.first_name
        };

        var goToNextScreenInFlow = function(stateParams) {
            console.log('next screen in flow: ');
            // if nationality collection enabled then show here, otherwise straight to Dispense keys
            if ($scope.zestStationData.check_in_collect_nationality) {
                console.log('next screen in flow: nationality');
                $state.go('zest_station.collectNationality', stateParams);
            } else {
                console.log('next screen in flow: key dispense');
                $state.go('zest_station.checkinKeyDispense', stateParams);
            }
        };

        $scope.$on('EMAIL_UPDATION_SUCCESS', function() {
            stateParams.email = $scope.email;
            goToNextScreenInFlow(stateParams);
        });
        $scope.$on('SKIP_EMAIL', function() {
             console.info(' :: skipEmail :: ', stateParams);
             goToNextScreenInFlow(stateParams);
        });

        $scope.$on('EMAIL_UPDATION_FAILED', function() {
            var stateParams = {
                'message': 'Email Updation Failed.'
            };
            
            $state.go('zest_station.speakToStaff', stateParams);
        });

        /**
         * [initializeMe description]
         */
        (function() { // initializeMe
            // show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.email = '';
            $scope.mode = 'EMAIL_ENTRY_MODE';
            $scope.guestId = $stateParams.guest_id;
            $scope.focusInputField('email-entry');
        }());

    }
]);