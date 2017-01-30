sntZestStation.controller('zsCheckinKeyDispenseCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$controller',
    function($scope, $stateParams, $state, zsEventConstants, $controller) {

        /** ********************************************************************************************
         **     Please note that, not all the stateparams passed to this state will not be used in this state, 
         **       however we will have to pass this so as to pass again to future states which will use these.
         **       
         **     Expected state params -----> reservation_id, room_no,  first_name, guest_id and email             
         **     Exit function -> $scope.goToNextScreen                              
         **                                                                      
         ***********************************************************************************************/

        /**
         *    MODES inside the page
         *    
         * 1. DISPENSE_KEY_MODE -> select No of keys
         * 2. DISPENSE_KEY_FAILURE_MODE -> failure mode
         * 3. SOLO_KEY_CREATION_IN_PROGRESS_MODE -> one key selected case
         * 4. KEY_ONE_CREATION_IN_PROGRESS_MODE -> 2 key selected, 1st in progress
         * 5. KEY_ONE_CREATION_SUCCESS_MODE -> 2 key selected, 1st completed
         * 6. KEY_CREATION_SUCCESS_MODE -> all requested keys were created
         */

        /**
         * [initializeMe description]
         */
        var initializeMe = (function() {
            // All the common actions for dispensing keys are to be included in
            // zsKeyDispenseCtrl
            $controller('zsKeyDispenseCtrl', {
                $scope: $scope
            });
            // hide back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // hide close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.mode = 'DISPENSE_KEY_MODE';
            console.info('station settings;', $scope.zestStationData);
            $scope.setScreenIcon('key');
        }());

        var stateParams = {
            'guest_id': $stateParams.guest_id,
            'email': $stateParams.email,
            'reservation_id': $stateParams.reservation_id,
            'room_no': $stateParams.room_no,
            'first_name': $stateParams.first_name
        };

        $scope.first_name = $stateParams.first_name;
        $scope.room = $stateParams.room_no;
        console.info('room number is: ', $scope.room);

        $scope.goToNextScreen = function(status) {

            stateParams.key_success = status === 'success';
            console.warn('goToNextScreen: ', stateParams);
            // check if a registration card delivery option is present (from Admin>Station>Check-in), if none are checked, go directly to final screen
            var registration_card = $scope.zestStationData.registration_card;

            if (!registration_card.email && !registration_card.print && !registration_card.auto_print) {
                $state.go('zest_station.zsCheckinFinal');
            } else {
                $state.go('zest_station.zsCheckinBillDeliveryOptions', stateParams);
            }
        };

    }
]);