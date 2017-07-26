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

        BaseCtrl.call(this, $scope);
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

        $scope.scannedPassportImage = [];
        $scope.scanning = {};// hold settings for this view

        var onBackButtonClicked = function() {
            if ($scope.lastMode === 'SCAN_RESULTS') {
                $scope.mode = 'SCAN_RESULTS';
                $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            }

        };

        var degrees = 0,
            back_degrees,
            rotated = false;

        $scope.imageRotated = false;

        $scope.rotateImage = function() {
            var div = document.getElementById('image-preview');

            degrees += 90;

            div.style.webkitTransform = 'rotate(' + degrees + 'deg)'; 
            div.style.mozTransform = 'rotate(' + degrees + 'deg)'; 
            div.style.msTransform = 'rotate(' + degrees + 'deg)'; 
            div.style.oTransform = 'rotate(' + degrees + 'deg)'; 
            div.style.transform = 'rotate(' + degrees + 'deg)'; 

            rotated = !rotated;
            $scope.imageRotated = rotated;
        };

        back_degrees = 0;
        var back_rotated = false;

        $scope.backImageRotated = false;

        $scope.rotateBackImage = function() {
            var div = document.getElementById('image-preview-back');

            back_degrees += 90;

            div.style.webkitTransform = 'rotate(' + back_degrees + 'deg)'; 
            div.style.mozTransform = 'rotate(' + back_degrees + 'deg)'; 
            div.style.msTransform = 'rotate(' + back_degrees + 'deg)'; 
            div.style.oTransform = 'rotate(' + back_degrees + 'deg)'; 
            div.style.transform = 'rotate(' + back_degrees + 'deg)'; 

            back_rotated = !back_rotated;
            $scope.backImageRotated = back_rotated;
        };


        var setGuestDetailsFromScan = function(guest, scanResponse) {
            if (scanResponse.DOC_TYPE === 'PP') {
                scanResponse.DOC_TYPE = 'passport';
            }

            if ($scope.scannedBackImage) {
                guest.back_img_path = scanResponse.FRONT_IMAGE;

            } else {
                // city, nationality, docExpiry, docID, dob, full_name, first_name, last_name 
                guest.first_name = scanResponse.FIRST_NAME;
                guest.last_name = scanResponse.LAST_NAME;
                guest.full_name = scanResponse.FULL_NAME;

                guest.nationality = scanResponse.NATIONALITY;
                guest.dob = scanResponse.BIRTH_DATE;

                guest.docExpiry = scanResponse.EXPIRY_DATE;
                guest.docID = scanResponse.DOCUMENT_NUMBER;

                guest.docType = scanResponse.DOC_TYPE;
                guest.identity_type = scanResponse.DOC_TYPE;
                guest.img_path = scanResponse.FRONT_IMAGE;

            }
        };

        $scope.scannedBackImage = false;

        var documentRequiresBackScan = function() {
            // return true; // TODO: Link with document types which require both sides to be scanned
            // for debugging/testing double-sided scan type IDs
            // set this variable
            if ($scope.zestStationData.doubleSidedScan) {
                return true;
            }
            
            return false;
            // return response.DOC_TYPE !== 'PP';    
        };

        var onPassportScanSuccess = function(response) {
            $scope.trackSessionActivity('CheckIn', 'Passport Scan Success', '', $scope.mode);

            var readyToContinue = true;

            for (var i in $scope.selectedReservation.guest_details) {

                if ($scope.selectedPassport) {
                    if ($scope.selectedPassportInfo.id === $scope.selectedReservation.guest_details[i].id) {
                        $scope.selectedReservation.guest_details[i].passport_scan_status = $filter('translate')('GID_SCAN_PASSPORT_SUCCESS');
                        $scope.selectedReservation.guest_details[i].passport_reviewed_status = $filter('translate')('GID_STAFF_REVIEW_NOT_STARTED');
                        if (!$scope.inDemoMode()) {
                            setGuestDetailsFromScan($scope.selectedReservation.guest_details[i], response);
                        }
                        
                    }
                }

                if ($scope.selectedReservation.guest_details[i].passport_scan_status !== $filter('translate')('GID_SCAN_PASSPORT_SUCCESS')) {
                    readyToContinue = false;
                }
            }

            if (documentRequiresBackScan(response) && !$scope.scannedBackImage) {
                $scope.mode = 'SCAN_BACK';
                $log.log('mode: ', $scope.mode);
                $scope.runDigestCycle();

            } else {
                $scope.allPassportReady = readyToContinue;
                $scope.mode = 'SCAN_RESULTS';
                $log.log('mode: ', $scope.mode);
                $scope.runDigestCycle();
            }

        };

        /*
        var setScroller = function(SCROLL_NAME) {
            $scope.setScroller(SCROLL_NAME, {
                probeType: 2,
                tap: false,
                preventDefault: false,
                scrollX: false,
                scrollY: true
            });
        };
        */


        var onPassportScanFailure = function() {
            
            if ($scope.mode === 'SCANNING_IN_PROGRESS') {
                $scope.mode = 'SCAN_FAILURE';

                var readyToContinue = true;

                for (var i in $scope.selectedReservation.guest_details) {

                    if ($scope.selectedPassport) {
                        if ($scope.selectedPassportInfo.id === $scope.selectedReservation.guest_details[i].id) {
                            $scope.selectedReservation.guest_details[i].passport_scan_status = $filter('translate')('GID_SCAN_PASSPORT_TRY_AGAIN');
                        }
                    }

                    if ($scope.selectedReservation.guest_details[i].passport_scan_status !== $filter('translate')('GID_SCAN_PASSPORT_SUCCESS')) {
                        readyToContinue = false;
                    }
                }
                $scope.allPassportReady = readyToContinue;
                $log.log('mode: ', $scope.mode);
                $scope.runDigestCycle();

            }
            $scope.trackSessionActivity('CheckIn', 'Passport Scan Failure', '', $scope.mode);

        };

        $scope.addAGuest = function() {
            // placeholder for future improvement, not used by yotel singapore yet
            return; 
            // $scope.AddGuestMode = true;
            // $log.log('mode: ', $scope.mode, ' - add guest mode: ', $scope.AddGuestMode);
        };

        $scope.selectGuest = function(guestInfo) {
            $scope.scanningBackImage = false;
            $scope.scannedBackImage = false;
            degrees = 0;
            $scope.selectedPassport = true;
            $scope.selectedPassportInfo = guestInfo;

            $log.log('guest', guestInfo);

            if ($scope.mode === 'SCAN_RESULTS') {
                $scope.lastMode = 'SCAN_RESULTS';

                $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
            } else {
                $scope.lastMode = '';
            }

            if ($scope.mode !== 'ADMIN_VERIFY_PASSPORTS') {
                $scope.reScanPassport();

            } else {
                // verify passport
                $scope.mode = 'ADMIN_VERIFY_PASSPORT_VIEW';                

                $timeout(function() {
                    // scroller setup
                    refreshScroller();
                }, 0);
            }

        };

        var listenForWebsocketActivity = function() {
            $scope.$on('SOCKET_CONNECTED', function() {
                if ($scope.socketOperator.returnWebSocketObject().readyState === 1) {
                    $scope.socketOperator.CapturePassport();
                }    
                
            });
            $scope.$on('SOCKET_FAILED', function() {
                $log.warn('socket failed.');
                onPassportScanFailure();
            });
        };

        var samsoTechScanPassport = function() {
            if ($scope.socketOperator.returnWebSocketObject().readyState === 1) {
                $scope.socketOperator.CapturePassport();
            } else {
                listenForWebsocketActivity();
                $scope.$emit('CONNECT_WEBSOCKET'); // connect socket
            }
        };


        $scope.$on('SOCKET_FAILED', function() {
            $log.warn('socket failed.');
            $scope.$emit('PASSPORT_SCAN_FAILURE');    
        });

        $scope.scan = function() {
            $log.info('$scope.selectedReservation: ', $scope.selectedReservation);


            $scope.mode = 'SCANNING_IN_PROGRESS';
            $scope.resetTime();

            samsoTechScanPassport();

            // debugging
            if ($scope.inDemoMode()) {
                $scope.$emit('PASSPORT_SCAN_SUCCESS', {'PR_DFE_FRONT_IMAGE': ''});
            }
            
        };

        $scope.scanBack = function(skip) {
            $scope.resetTime();
            $scope.scanningBackImage = true;
            // debugging
            if ($scope.inDemoMode() || skip) {
                $scope.$emit('PASSPORT_SCAN_SUCCESS', {'skipScan': true});
            } else {

                $scope.mode = 'SCANNING_IN_PROGRESS';
                samsoTechScanPassport();
            }
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
            $scope.focusInputField('input_text');
        };

        $scope.adminLoginError = false;

        var submitLogin = function() {
            $scope.hasLoader = true;
            $scope.callBlurEventForIpad();
            var onSuccess = function(response) {
                if (response.status && response.status.toLowerCase() === 'success') {
                    $scope.mode = 'ADMIN_VERIFY_PASSPORTS';

                    $scope.adminLoginError = false;

                    if ($stateParams.isQuickJump === 'true') {
                        // simulate Verification screen
                        $scope.allPassportReady = true;
                    }
                    // Turn Light OFF after admin login is successful
                    // 
                    $scope.turnOffLight();
                } else {
                    $scope.adminLoginError = true;
                    $log.warn('invalid admin login');
                    // prompt screen keyboard depending on the device, ios should call blur first for smooth transition
                    $scope.focusInputField('password_text');
                }
            };
            var onFail = function(response) {
                $log.warn(response);
                $scope.adminLoginError = true;
                $log.warn('failed admin login attempt');
                // prompt screen keyboard depending on the device, ios should call blur first for smooth transition
                $scope.focusInputField('password_text');
            };

            var options = {
                params: {
                    'email': $scope.userName,
                    'password': $scope.passWord
                },
                successCallBack: onSuccess,
                failureCallBack: onFail
            };

            $scope.input.inputTextValue = '';
            $scope.callAPI(zsGeneralSrv.validate_staff, options);
        };

        var passportRejected = function() {
            // has a Rejected or Not-Reviewed passport, will send the user back to re-scan passports
            // 
            var hasRejected = false;

            for (var i in $scope.selectedReservation.guest_details) {
                if ($scope.selectedReservation.guest_details[i].passport_reviewed_status !== $filter('translate')('GID_STAFF_REVIEW_ACCEPTED')) {
                    hasRejected = true;
                }
            }
            return hasRejected;
        };


        $scope.goToNext = function() {
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

            if ($scope.mode === 'SCAN_RESULTS') {
                $scope.mode = 'WAIT_FOR_STAFF';
                $scope.turnOnLight();

            } else if ($scope.mode === 'ADMIN_VERIFY_PASSPORTS') {

                if (passportRejected()) {
                    $scope.allPassportReady = false;

                    $log.log('continue or unable to complete check-in, re-scan rejected passports');

                    for (var i in $scope.selectedReservation.guest_details) {
                        if ($scope.selectedReservation.guest_details[i].passport_reviewed_status === $filter('translate')('GID_STAFF_REVIEW_REJECTED')) {
                            $scope.selectedReservation.guest_details[i].passport_scan_status = $filter('translate')('GID_STAFF_REVIEW_REJECTED');
                        }
                    }

                    $scope.viewResults();

                } else {
                    if ($scope.fromPickupKeyPassportScan) {
                        $scope.zestStationData.continuePickupFlow();
                    } else {
                        $scope.zestStationData.checkinGuest();    
                    }
                }
                
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
        $scope.gidImgSrcPath = '/assets/images/';
        // initial / demo mode reservation guest details
        $scope.selectedReservation.guest_details = [
            {
                'last_name': 'Sample',
                'first_name': 'Connor',
                'full_name': 'Connor Sample',
                'docID': '1234567',

                'dob': '14-02-2014',
                'docExpiry': '03/2010',
                'nationality': 'USA',
                'city': 'Montgomery',

                'img_path': 'sample_passport.png',
                'id': 1232,
                'passport_reviewed_status': $filter('translate')('GID_STAFF_REVIEW_ACCEPTED'),
                'passport_scan_status': $filter('translate')('GID_SCAN_PASSPORT_SUCCESS')
            }/* , {
                'last_name': 'walberg',
                'first_name': 'mark',

                'dob':'14-02-2014',
                'docExpiry':'11/20',
                'nationality':'Slovakian',
                'city':'Bethesda',

                'id': 1231,
                'img_path':'sample_passport.png',
                'passport_reviewed_status': $filter('translate')('GID_STAFF_REVIEW_NOT_STARTED'),
                'passport_scan_status': $filter('translate')('GID_SCAN_NOT_STARTED')
            }*/
        ];

        $scope.AddGuestMode = false;
        $scope.showRemoveButton = false;

        var validatePassportsView = function() {
            var hasIDNeedingReview = false;

            for (var gid in $scope.selectedReservation.guest_details) {
                if (gid.passport_reviewed_status === $filter('translate')('GID_STAFF_REVIEW_NOT_STARTED')) {
                    hasIDNeedingReview = true;
                }
            }

            $scope.allPassportReviewed = !hasIDNeedingReview;
        };

        $scope.staffUserToken = '';

        var onSuccessAdminReview = function() {
            if ($scope.acceptedPassport) {
                $scope.selectedPassportInfo.passport_reviewed_status = $filter('translate')('GID_STAFF_REVIEW_ACCEPTED');    
            } else {
                $scope.selectedPassportInfo.passport_reviewed_status = $filter('translate')('GID_STAFF_REVIEW_REJECTED');
            }


            savePassportToAPI($scope.selectedPassportInfo);
            if ($scope.inDemoMode()) {
                validatePassportsView();
                $scope.selectedPassport = false;
                $scope.mode = 'ADMIN_VERIFY_PASSPORTS';
            }
        };

        var onFailAdminReview = function() {
            $log.log('on fail admin review passport');
        };


        var savePassportToAPI = function(selectedPassportInfo) {
            var options = {
                params: {
                    'front_image_data': selectedPassportInfo.img_path,
                    'reservation_id': $stateParams.reservation_id,
                    'document_type': selectedPassportInfo.docType,
                    'document_number': selectedPassportInfo.docID,
                    'expiration_date': selectedPassportInfo.docExpiry,
                    'full_name': selectedPassportInfo.full_name,
                    'first_name': selectedPassportInfo.first_name,
                    'last_name': selectedPassportInfo.last_name,
                    'nationality': selectedPassportInfo.nationality,
                    'guest_id': selectedPassportInfo.id,
                    'date_of_birth': selectedPassportInfo.dob
                },
                successCallBack: function() {
                    validatePassportsView();
                    $scope.selectedPassport = false;
                    $scope.mode = 'ADMIN_VERIFY_PASSPORTS';   
                },
                failureCallBack: function() {
                    $log.warn('failed to save');
                    $log.warn(arguments);
                    $scope.$emit('GENERAL_ERROR');
                }
            };
            if (!$scope.acceptedPassport) {
                // do not save any data when a passport is rejected
                return;
            }

            // Also save the back image data if there was front+back to the document scan
            // 
            if (selectedPassportInfo.back_img_path) {
                options.params['back_image_data'] = selectedPassportInfo.back_img_path;
            }


            if ($scope.inDemoMode()) {
                $timeout(function() {
                    options.successCallBack();
                }, 1000);
            } else {
                $scope.callAPI(zsCheckinSrv.savePassport, options);    
            }
            

        };


        $scope.acceptPassport = function() {
            $scope.acceptedPassport = true;
            var options = {
                params: {
                    // 'staffUserToken': $scope.staffUserToken,
                    'passport_accepted': $scope.acceptedPassport,
                    'reservation_id': $stateParams.reservation_id
                    // 'passportData':$scope.selectedPassportInfo
                },
                successCallBack: onSuccessAdminReview,
                failureCallBack: onFailAdminReview
            };

            // onSuccessAdminReview();
            $scope.callAPI(zsCheckinSrv.acceptPassport, options);

        };

        $scope.rejectPassport = function() {
            $scope.acceptedPassport = false;
            var options = {
                params: {
                    // 'staffUserToken': $scope.staffUserToken,
                    'passport_accepted': $scope.acceptedPassport,
                    'reservation_id': $stateParams.reservation_id
                    // 'passportData':$scope.selectedPassportInfo
                },
                successCallBack: onSuccessAdminReview,
                failureCallBack: onFailAdminReview
            };

            // onSuccessAdminReview();
            $scope.callAPI(zsCheckinSrv.acceptPassport, options);

        };


        /* 
         *  To setup scroll
         */
        $scope.setScroller('passport-validate');

        var refreshScroller = function() {
            $scope.refreshScroller('passport-validate');

            var scroller = $scope.getScroller('passport-validate');

            $timeout(function() {
                scroller.scrollTo(0, 0, 300);
            }, 0);

        };


        /**
         * [initializeMe description]
         */
        var initializeMe = (function() {
            $scope.scanning.is_double_sided_required = true;// initial ID type is passport, for Yotel singapore they will do double-sided

            if (!$scope.inDemoMode() && $stateParams.isQuickJump !== 'true') {
                $scope.selectedReservation.guest_details = zsCheckinSrv.selectedCheckInReservation.guest_details;    
            }

            $scope.selectGuest($scope.selectedReservation.guest_details[0]);
            
            for (var i in $scope.selectedReservation.guest_details) {
                if ($scope.selectedPassport) {
                    $scope.selectedReservation.guest_details[i].passport_scan_status = $filter('translate')('GID_SCAN_NOT_STARTED');
                }
            }

            // show back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

            $scope.results = [];// scan results is the array of guests + status of passport (scanned/verified, etc)
            $scope.allPassportsScanned = false;
            $scope.allPassportReviewed = false;

            $scope.setScreenIcon('checkin');// yotel only

            if ($stateParams.isQuickJump === 'true') {
                $scope.mode = $stateParams.quickJumpMode;
            } else {
                $scope.mode = 'SCAN_PASSPORT';
            }

            $scope.fromPickupKeyPassportScan = $stateParams.from_pickup_key === 'true';

            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);

            var onSuccess = function(response) {
                $log.log(response);
                $scope.trackSessionActivity('CheckIn', 'SuccessFetching Passport Setting', '', $scope.mode);
                $scope.scanning.is_double_sided_required = response.data.is_double_sided;
            };
            var onFail = function(response) {
                $log.log(response);
                $scope.trackSessionActivity('CheckIn', 'FailedFetching Passport Setting', '', $scope.mode);
                $scope.scanning.is_double_sided_required = true;// allows user to skip if this only if API says double_sided not required
            };

            var options = {
                params: {
                    'reservation_id': $stateParams.reservation_id
                },
                successCallBack: onSuccess,
                failureCallBack: onFail
            };

            $scope.callAPI(zsCheckinSrv.checkIDType, options);

        }());

        var setTimedOut = function() {
            $scope.mode = 'TIMED_OUT';
        };

        $scope.$on('USER_ACTIVITY_TIMEOUT', function() {
            setTimedOut();
        });

        // error image path
        $scope.gidImgErrorSrcPath = '';

        // checks passport/ID response for all required fields,
        // if fields are missing (maybe the image was cut off or blurry)
        // then return failed scan instead of success

        var returnedAllRequiredFields = function(response) {
            // TODO: Verify minimum Required fields for passport to be 'programatically acceptable'
            //       ---> A staff member will validate all info and fields, and will be able to override-accept any passport
            //       CICO-41398

            if ($scope.inDemoMode()) {
                return true;
            }

            if (!response.PR_DFE_FRONT_IMAGE ||
                    !response.PR_DF_BIRTH_DATE ||
                    !response.PR_DF_DOCTYPE ||
                    !response.PR_DF_DOCUMENT_NUMBER ||
                    !response.PR_DF_EXPIRY_DATE ||
                    !response.PR_DF_GIVENNAME ||
                    !response.PR_DF_ISSUE_COUNTRY ||
                    !response.PR_DF_NAME ||
                    !response.PR_DF_NATIONALITY ||
                //  !response.PR_DF_SEX ||
                //  !response.PR_DF_SURNAME ||
                    !response.PR_DF_TYPE // TYPE = PP (passport)
                    ) {
                return false;
            } 
            return true;
        };

        var mappedResponse;

        $scope.$on('PASSPORT_SCAN_SUCCESS', function(evt, response) {
            $log.log('PASSPORT_SCAN_SUCCESS: ', response);
            $log.log('returnedAllRequiredFields(response): ', returnedAllRequiredFields(response), ': $scope.scanningBackImage: ', $scope.scanningBackImage);

            if (returnedAllRequiredFields(response) && !$scope.scanningBackImage) {
                // set local params, to map to different documents/versions of samsotech devices
                // if any updates/changes in response format, adjust here
                if ($scope.inDemoMode()) {
                    mappedResponse = {};
                } else {
                    mappedResponse = {
                        'FRONT_IMAGE': response.PR_DFE_FRONT_IMAGE,

                        // 'BIRTH_DATE':  returnUnformatedDateObj(response.PR_DF_BIRTH_DATE, 'MM-DD-YYYY'),
                        'BIRTH_DATE': response.PR_DF_BIRTH_DATE,
                        'LAST_NAME': response.PR_DF_SURNAME,
                        'FIRST_NAME': response.PR_DF_GIVENNAME,
                        'NATIONALITY': response.PR_DF_NATIONALITY,
                        'SEX': response.PR_DF_SEX,
                        'FULL_NAME': response.PR_DF_NAME,

                        'DOC_TYPE': response.PR_DF_DOCTYPE,
                        'DOCUMENT_NUMBER': response.PR_DF_DOCUMENT_NUMBER,
                        'EXPIRY_DATE': response.PR_DF_EXPIRY_DATE,
                        'ID_ISSUE_COUNTRY': response.PR_DF_ISSUE_COUNTRY,
                        'ID_TYPE': response.PR_DF_TYPE
                    };
                }
               
                onPassportScanSuccess(mappedResponse);

            } else if ($scope.scanningBackImage && (response.PR_DFE_FRONT_IMAGE || $scope.inDemoMode() || response.skipScan)) {
                // if scanning the back of a document, the only requirement is that an image is returned
                // the only failure would be if this ('PR_DFE_FRONT_IMAGE') was not returned from samsotech
                // CICO-41398

                $scope.scanningBackImage = false;
                $scope.scannedBackImage = true;
                mappedResponse = {
                    'FRONT_IMAGE': response.PR_DFE_FRONT_IMAGE ? response.PR_DFE_FRONT_IMAGE : ''
                };

                onPassportScanSuccess(mappedResponse);

            } else {
                onPassportScanFailure();

            }
        });

        $scope.$on('PASSPORT_SCAN_FAILURE', function() {
            onPassportScanFailure();
        });

    }
]);