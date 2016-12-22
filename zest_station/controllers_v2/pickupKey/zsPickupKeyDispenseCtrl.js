sntZestStation.controller('zsPickupKeyDispenseCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$controller',
    'zsGeneralSrv',
    '$timeout',
    function($scope, $stateParams, $state, zsEventConstants, $controller, zsGeneralSrv, $timeout) {

        /** ********************************************************************************************
         **     Expected state params -----> reservation_id, room_no and first_name'              
         **     Exit function -> clickedOnCloseButton- root ctrl function                       
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
            $scope.mode = 'DISPENSE_KEY_MODE';
            $scope.readyForUserToPressMakeKey = true;
        }());

        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            if ($scope.zestStationData.pickup_qr_scan) {
                $state.go('zest_station.qrPickupKey');
            } else {
                $state.go('zest_station.checkOutReservationSearch', {
                    'mode': 'PICKUP_KEY'
                });
            }
        });

        // handling style in ctrl, so as not to mess up style sheet
        // this is a small style addition
        var marginTop = $scope.zestStationData.show_room_number ? '40px' : '0px';

        $scope.doneButtonStyle = {
            'margin-top': marginTop
        };
        $scope.noOfKeysCreated = 0;


        $scope.$on('ON_GENERAL_ERROR', function() {
            $scope.onGeneralFailureCase();
        });

        /**
         * [makeKeys description]
         * @param  {[type]} no_of_keys [description]
         * @return {[type]}            [description]
         */
        $scope.makeKeys = function(no_of_keys) {
            $scope.noOfKeysSelected = no_of_keys;
            $scope.initMakeKey();
        };

    }
]);