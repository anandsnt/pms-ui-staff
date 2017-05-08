sntZestStation.controller('zsPickupKeyDispenseCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$controller',
    'zsCheckinSrv',
    '$log',
    function($scope, $stateParams, $state, zsEventConstants, $controller, zsCheckinSrv, $log) {

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
        var initializeMe = function() {
            // All the common actions for dispensing keys are to be included in
            // zsKeyDispenseCtrl
            $controller('zsKeyDispenseCtrl', {
                $scope: $scope
            });


            if ($stateParams.isQuickJump === 'true') {

                $log.log('Jumping to Screen with demo data');
                $scope.mode = $stateParams.quickJumpMode;

            } else {
                $scope.mode = 'DISPENSE_KEY_MODE';
                $scope.readyForUserToPressMakeKey = true;

            }
        };

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


        $scope.onKeyFailureGoToPrintPage = function(){
            var stateParams = {
                'reservation_id': $stateParams.reservation_id,
                'key_created': 'false'
            };
            $state.go('zest_station.pickUpKeyDispenseRegistrationCardPrint', stateParams);
        };

        $scope.pickupKeyNextPageAction = function() {
            if ($scope.zestStationData.pickup_key_reg_print === 'auto_print') {
                var stateParams = {
                    'reservation_id': $stateParams.reservation_id,
                    'key_created': 'true'
                };
                $state.go('zest_station.pickUpKeyDispenseRegistrationCardPrint', stateParams);
            } else {

                $scope.trackEvent('PUK', 'Flow-End-Success');
                $state.go('zest_station.home');
            }
        };

        initializeMe();

    }
]);