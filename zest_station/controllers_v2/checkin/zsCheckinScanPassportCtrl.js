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
    '$filter',
    '$log',
    function($scope, $stateParams, $state, zsEventConstants, 
        $controller, $timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv, zsUtilitySrv, $filter, $log) {

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

            var readyToContinue = true;

            for (var i in $scope.selectedReservation.guest_details) {

                if ($scope.selectedPassport) {
                    if ($scope.selectedPassportInfo.id === $scope.selectedReservation.guest_details[i].id) {
                        $scope.selectedReservation.guest_details[i].passport_scan_status = $filter('translate')('SCAN_PASSPORT_SUCCESS');
                    }
                }

                if ($scope.selectedReservation.guest_details[i].passport_scan_status !== $filter('translate')('SCAN_PASSPORT_SUCCESS')) {
                    readyToContinue = false;
                }
            }
            $scope.allPassportReady = readyToContinue;
            $scope.mode = 'SCAN_RESULTS';
            $log.log('mode: ', $scope.mode);
        };


        var onPassportScanfailure = function() {
            $scope.mode = 'SCAN_FAILURE';
            $log.log('mode: ', $scope.mode);

            var readyToContinue = true;

            for (var i in $scope.selectedReservation.guest_details) {

                if ($scope.selectedPassport) {
                    if ($scope.selectedPassportInfo.id === $scope.selectedReservation.guest_details[i].id) {
                        $scope.selectedReservation.guest_details[i].passport_scan_status = $filter('translate')('SCAN_PASSPORT_TRY_AGAIN');
                    }
                }

                if ($scope.selectedReservation.guest_details[i].passport_scan_status !== $filter('translate')('SCAN_PASSPORT_SUCCESS')) {
                    readyToContinue = false;
                }
            }
            $scope.allPassportReady = readyToContinue;
            $log.log('mode: ', $scope.mode);

        };

        $scope.addAGuest = function() {
            $scope.AddGuestMode = true;
            $log.log('mode: ', $scope.mode, ' - add guest mode: ', $scope.AddGuestMode);
        };


        $scope.selectGuest = function(guestInfo) {
            $scope.selectedPassport = true;
            $scope.selectedPassportInfo = guestInfo;
            $log.log('guest', guestInfo);

            if ($scope.mode !== 'ADMIN_VERIFY_PASSPORTS') {
                $scope.reScanPassport();

            } else {
                // verify passport
                $scope.mode = 'ADMIN_VERIFY_PASSPORT_VIEW';
            }

        };


        $scope.scan = function() {
            $scope.mode = 'SCANNING_IN_PROGRESS';

            $log.log('mode: ', $scope.mode);
            $scope.resetTime();


            // debugging
            $timeout(function() {

                if ($scope.inDemoMode()) {
                    $scope.$emit('PASSPORT_SCAN_SUCCESS');
                } else {


                    $scope.$emit('PASSPORT_SCAN_FAILURE');    
                }
                

            }, 2000);
            
        };

        $scope.viewResults = function() {
            $scope.selectedPassport = false;
            $scope.mode = 'SCAN_RESULTS';
        };

        $scope.reScanPassport = function() {
            $scope.mode = 'SCAN_PASSPORT';
        };

        $scope.onDoneClicked = function() {
            if ($scope.allPassportReady) {
                $scope.mode = 'WAIT_FOR_STAFF';
            }
        };

        $scope.adminVerify = function() {
            $scope.mode = 'ADMIN_LOGIN_ID';

        };
        $scope.adminLoginError = false;

        var submitLogin = function() {
            $scope.hasLoader = true;
            $scope.callBlurEventForIpad();
            var onSuccess = function(response) {
                if (response.admin) {
                    $scope.mode = 'ADMIN_VERIFY_PASSPORTS';

                    $scope.adminLoginError = false;

                    if ($stateParams.isQuickJump === 'true') {
                        // simulate Verification screen
                        $scope.allPassportReady = true;
                    }
                } else {
                    $scope.adminLoginError = true;
                    console.warn('invalid admin login');
                    // prompt screen keyboard depending on the device, ios should call blur first for smooth transition
                    $scope.focusInputField('password_text');
                }
            };
            var onFail = function(response) {
                console.warn(response);
                $scope.adminLoginError = true;
                console.warn('failed admin login attempt');
                // prompt screen keyboard depending on the device, ios should call blur first for smooth transition
                $scope.focusInputField('password_text');
            };

            var options = {
                params: {
                    'apiUser': $scope.userName,
                    'apiPass': $scope.passWord
                },
                successCallBack: onSuccess,
                failureCallBack: onFail
            };

            $scope.callAPI(zsGeneralSrv.validate, options);
        };

        $scope.goToNext = function() {
            if ($scope.mode === 'SCAN_RESULTS') {
                $scope.mode = 'WAIT_FOR_STAFF';

            } else if ($scope.mode === 'ADMIN_VERIFY_PASSPORTS') {
                $log.log('continue or unable to complete check-in');
                
            } else {
                if ($scope.mode === 'ADMIN_LOGIN_ID') {
                    // user has entered username
                    $scope.adminLoginError = false;
                    $scope.userName = angular.copy($scope.input.inputTextValue);
                    $scope.input.inputTextValue = '';
                    $scope.mode = 'ADMIN_LOGIN_PWD';
                    $scope.passwordField = true;
                    // prompt screen keyboard depending on the device, ios should call blur first for smooth transition
                    $scope.focusInputField('password_text');
                } else {
                    // user has entered password
                    $scope.adminLoginError = false;
                    $scope.passWord = angular.copy($scope.input.inputTextValue);
                    submitLogin();
                }
            }
            
        };

        $scope.exitAdminLogin = function() {
            $scope.mode = 'WAIT_FOR_STAFF';
            $scope.input.inputTextValue = '';
        };

        $scope.selectedReservation = {};
        $scope.selectedReservation.guest_details = [
            {
                'last_name': 'fuller',
                'first_name': 'mike',
                'id': 1232,
                'passport_reviewed_status': $filter('translate')('GID_STAFF_REVIEW_SUCCESS'),
                'passport_scan_status': $filter('translate')('SCAN_PASSPORT_SUCCESS')
            }, {
                'last_name': 'walberg',
                'id': 1231,
                'first_name': 'mark',
                'passport_reviewed_status': $filter('translate')('GID_STAFF_REVIEW_NOT_STARTED'),
                'passport_scan_status': $filter('translate')('SCAN_PASSPORT_NOT_STARTED')
            }
        ];
        $scope.AddGuestMode = false;
        $scope.showRemoveButton = false;

        /**
         * [initializeMe description]
         */
        var initializeMe = (function() {
            // show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

            $log.log('collectPassportEnabled: ', collectPassportEnabled);
            $log.log('show mode: ', $scope.mode);

            $scope.results;// scan results is the array of guests + status of passport (scanned/verified, etc)
            $scope.allPassportsScanned = false;
            $scope.allPassportReviewed = false;

            $scope.setScreenIcon('checkin');// yotel only

            if ($stateParams.isQuickJump === 'true') {
                $scope.mode = $stateParams.quickJumpMode;
            } else {
                $scope.mode = 'SCAN_PASSPORT';
            }
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
