sntZestStation.controller('zsCheckinScanPassportCtrl', [
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

        /** ********************************************************************************************
         **      Please note that, not all the stateparams passed to this state will not be used in this state, 
         **      however we will have to pass this so as to pass again to future states which will use these.
         **
         **      Expected state params -----> reservation_id, room_no,  first_name, guest_id and email           
         **      Exit function -> afterGuestCheckinCallback                             
         **                                                                       
         ***********************************************************************************************/

        /**
         * MODES
         * 1.SCAN_PRIMARY - Start scan for primary guest 
         * 2.SCANNING_IN_PROGRESS - In progress indicator (scanning activated by user)
         * 3.SCAN_RESULTS - List of Users with Scan status (stated/success/failed)
         *                - Show Done if all passports 'success'
         * 4.SCAN_FAILURE - Try again, speak to staff
         */
        
        var collectPassportEnabled = $scope.zestStationData.check_in_collect_passport;

        var onPassportScanSuccess = function() {
            $scope.mode = 'SCAN_RESULTS';
        };
        var onPassportScanfailure = function() {
            $scope.mode = 'SCAN_FAILURE';
        };

        $scope.scan = function() {
            $scope.mode = 'SCANNING_IN_PROGRESS';
            $scope.resetTime();


            // debugging
            $timeout(function() {
                $scope.$emit('PASSPORT_SCAN_FAILURE');
            }, 4000);
            
        };

        $scope.reScanPassport = function() {
            
        };

        /**
         * [initializeMe description]
         */

        var initializeMe = (function() {
            // show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.mode = 'SCAN_PRIMARY';
            console.log('collectPassportEnabled: ', collectPassportEnabled);
            console.log('show mode: ', $scope.mode);

            $scope.results;// scan results is the array of guests + status of passport (scanned/verified, etc)
            $scope.allPassportsScanned = false;


            $scope.setScreenIcon('checkin');// yotel only
        }());

        var setTimedOut = function() {
            $scope.mode = 'TIMED_OUT';
        };

        $scope.$on('USER_ACTIVITY_TIMEOUT', function() {
            setTimedOut();
        });


        $scope.$on('PASSPORT_SCAN_SUCCESS', function() {
            onPassportScanSuccess();
        });

        $scope.$on('PASSPORT_SCAN_FAILURE', function() {
            onPassportScanfailure();
        });

    }
]);
