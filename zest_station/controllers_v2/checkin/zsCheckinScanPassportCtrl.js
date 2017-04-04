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
         * 1.SCAN_PASSPORT - Start scan for primary guest 
         * 2.SCANNING_IN_PROGRESS - In progress indicator (scanning activated by user)
         * 3.SCAN_RESULTS - List of Users with Scan status (stated/success/failed)
         *                - Show Done if all passports 'success'
         * 4.SCAN_FAILURE - Try again, speak to staff
         */
        
        var collectPassportEnabled = $scope.zestStationData.check_in_collect_passport;

        var onPassportScanSuccess = function() {

            var results = $scope.selectedReservation.guest_details,
                readyToContinue = true;

            for (var i in $scope.selectedReservation.guest_details) {

                if ($scope.selectedPassport) {
                    if ($scope.selectedPassportInfo.id === $scope.selectedReservation.guest_details[i].id) {
                        $scope.selectedReservation.guest_details[i].passport_scan_status = 'SUCCESS';
                    }
                }

                if ($scope.selectedReservation.guest_details[i].passport_scan_status !== 'SUCCESS') {
                    readyToContinue = false;
                }
            }
            $scope.allPassportReady = readyToContinue;
            $scope.mode = 'SCAN_RESULTS';
            console.log('mode: ',$scope.mode);


        };
        var onPassportScanfailure = function() {
            $scope.mode = 'SCAN_FAILURE';
            console.log('mode: ',$scope.mode);
        };

        $scope.addAGuest = function() {
            $scope.AddGuestMode = true;
            console.log('mode: ',$scope.mode,' - add guest mode: ',$scope.AddGuestMode);
        };


        $scope.scanPassport = function(guestInfo) {
            $scope.selectedPassport = true;
            $scope.selectedPassportInfo = guestInfo;
            console.log('guest',guestInfo);
            $scope.reScanPassport();
        };


        $scope.scan = function() {
            $scope.mode = 'SCANNING_IN_PROGRESS';

            console.log('mode: ',$scope.mode);
            $scope.resetTime();


            // debugging
            $timeout(function() {
             //   if (!gotoSuccess) {
                    $scope.$emit('PASSPORT_SCAN_SUCCESS');
            //    } else {
            //        $scope.$emit('PASSPORT_SCAN_FAILURE');    
             //   }
                

            }, 4000);
            
        };

        $scope.reScanPassport = function() {

            $scope.mode = 'SCAN_PASSPORT';

            // debugging
            gotoSuccess = true;
        };
        $scope.selectedReservation = {};
        $scope.selectedReservation.guest_details = [
            {
                'last_name': 'fuller',
                'first_name': 'mike',
                'id':1232,
                'passport_scan_status': 'SUCCESS'
            },{
                'last_name': 'guy',
                'id':1231,
                'first_name': 'that',
                'passport_scan_status': 'NOT STARTED'
            }
        ];
        $scope.AddGuestMode = false;
        $scope.showRemoveButton = false;

        /**
         * [initializeMe description]
         */
        var gotoSuccess = false; // debugging, remove when done
        var initializeMe = (function() {
            // show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.mode = 'SCAN_PASSPORT';
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
