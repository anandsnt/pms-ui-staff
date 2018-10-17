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
        $scope.scanning = {}; // hold settings for this view

        // disable scroll on signature canvas mousehover 
        // (jSignature will not work when scroll is active)
        $scope.disableScroll = function () {
            $scope.getScroller('passport-validate').disable();
        };
        // enable scroll on signature canvas mouseleave
        $scope.enableScroll = function () {
            $scope.getScroller('passport-validate').enable();
        };
        $scope.signaturePluginOptions = {
            height: 230,
            width: 350,
            lineWidth: 1,
            'background-color': 'transparent',
            'decor-color': 'transparent'
        };

        $scope.clearSignature = function() {
            $scope.signatureData = '';
            $('#signature').jSignature('clear');
        };

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
        $scope.checkinInProgress = false;

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

        var setValueIfPresent = function(key, value, data) {
            if (value) {
                data[key] = value;
            }
        };

        var setGuestDetailsFromScan = function(guest, scanResponse) {
            if (scanResponse.DOC_TYPE === 'PP') {
                scanResponse.DOC_TYPE = 'passport';
            }

            // prepend image data format, and save to API
            var imageFormat = 'data:image/png;base64,';

            if ($scope.scannedBackImage) {
                guest.back_img_path = imageFormat + scanResponse.BACK_IMAGE;
                // some ID cards have data in the backside. if Not null set them from
                // backside scan
                setValueIfPresent('scanned_first_name', scanResponse.FIRST_NAME, guest);
                setValueIfPresent('scanned_last_name', scanResponse.LAST_NAME, guest);
                setValueIfPresent('scanned_full_name', scanResponse.FULL_NAME, guest);
                setValueIfPresent('nationality', scanResponse.NATIONALITY, guest);
                setValueIfPresent('nationality_fullname', scanResponse.NATIONALITY_FULL_NAME, guest);
                setValueIfPresent('dob', scanResponse.BIRTH_DATE, guest);
                setValueIfPresent('docExpiry', scanResponse.EXPIRY_DATE, guest);
                setValueIfPresent('docID', scanResponse.DOCUMENT_NUMBER, guest);
                setValueIfPresent('docType', scanResponse.DOC_TYPE, guest);
                setValueIfPresent('identity_type', scanResponse.DOC_TYPE, guest);

            } else {
                // city, nationality, docExpiry, docID, dob, full_name, first_name, last_name 
                guest.scanned_first_name = scanResponse.FIRST_NAME;
                guest.scanned_last_name = scanResponse.LAST_NAME;
                guest.scanned_full_name = scanResponse.FULL_NAME;

                guest.nationality = scanResponse.NATIONALITY;
                guest.nationality_fullname = scanResponse.NATIONALITY_FULL_NAME;
                guest.dob = scanResponse.BIRTH_DATE;

                guest.docExpiry = scanResponse.EXPIRY_DATE;
                guest.docID = scanResponse.DOCUMENT_NUMBER;

                guest.docType = scanResponse.DOC_TYPE;
                guest.identity_type = scanResponse.DOC_TYPE;
                guest.img_path = imageFormat + scanResponse.FRONT_IMAGE;

            }
        };

        $scope.scannedBackImage = false;

        // var documentRequiresBackScan = function() {
        //     // return true; // TODO: Link with document types which require both sides to be scanned
        //     // for debugging/testing double-sided scan type IDs
        //     // set this variable
        //     return $scope.zestStationData.doubleSidedScan;
        //     // return response.DOC_TYPE !== 'PP';    
        // };

        var onPassportScanSuccess = function(response) {
            $scope.trackSessionActivity('CheckIn', 'Passport Scan Success', '', $scope.mode);

            var readyToContinue = true;

            for (var i in $scope.selectedReservation.guest_details) {

                if ($scope.selectedPassport) {
                    if ($scope.selectedPassportInfo.id === $scope.selectedReservation.guest_details[i].id) {
                        $scope.selectedReservation.guest_details[i].passport_scan_status = $filter('translate')('GID_SCAN_PASSPORT_SUCCESS');
                        $scope.selectedReservation.guest_details[i].passport_reviewed_status = $filter('translate')('GID_STAFF_REVIEW_NOT_STARTED');
                        setGuestDetailsFromScan($scope.selectedReservation.guest_details[i], response);
                    }
                }

                if ($scope.selectedReservation.guest_details[i].passport_scan_status !== $filter('translate')('GID_SCAN_PASSPORT_SUCCESS')) {
                    readyToContinue = false;
                }
            }

            if (response.OTHER_SIDE_SCAN === 'Y' && !$scope.scannedBackImage) {
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
                // if guest has already added signature, set signature
                if (guestInfo.signature && guestInfo.signature.length > 1 && guestInfo.signature[1].length > 0) {
                    $("#signature").jSignature("setData", "data:" + guestInfo.signature.join(","));
                } else {
                    $scope.clearSignature();
                }
            }
            $timeout(function() {
                // scroller setup
                refreshScroller();
            }, 100);
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

        var demoModeScanCount = 0; // for debuging
        $scope.scan = function() {
            $log.info('$scope.selectedReservation: ', $scope.selectedReservation);


            $scope.mode = 'SCANNING_IN_PROGRESS';
            $scope.resetTime();

            // debugging
            if ($scope.inDemoMode()) {
                demoModeScanCount++;

                var options = {
                    params: {
                        demoModeScanCount: demoModeScanCount
                    },
                    successCallBack: function(response) {
                        $scope.$emit('PASSPORT_SCAN_SUCCESS', response);
                    }
                };

                $scope.callAPI(zsCheckinSrv.getSampleIdFrontSideData, options);

            } else {
                samsoTechScanPassport();
            }

        };

        $scope.scanBack = function(skip) {
            $scope.resetTime();
            $scope.scanningBackImage = true;
            // debugging
            if ($scope.inDemoMode() || skip) {
                if (skip) {
                    $scope.$emit('PASSPORT_SCAN_SUCCESS', { 'skipScan': true });
                } else {
                    $scope.mode = 'SCANNING_IN_PROGRESS';

                    var options = {
                        params: {},
                        successCallBack: function(response) {
                            $scope.$emit('PASSPORT_SCAN_SUCCESS', response);
                        }
                    };

                    $scope.callAPI(zsCheckinSrv.getSampleIdBackSideData, options);
                }

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

            if ($scope.inDemoMode()) {
                onSuccess({ 'status': 'success' });
            } else {
                $scope.input.inputTextValue = '';
                $scope.callAPI(zsGeneralSrv.validate_staff, options);
            }

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
                $scope.currentPage = 1;

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
                        $scope.mode = 'RESERVATION_DETAILS';
                        $scope.runDigestCycle();
                        showReservationDetails();
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
        $scope.selectedReservation.guest_details = [{
            'last_name': 'Sample',
            'first_name': $stateParams.first_name ? $stateParams.first_name : 'Guest',
            'full_name': 'Guest Sample',
            'docID': '1234567',

            'dob': '14-02-2014',
            'docExpiry': '03/2010',
            'nationality': 'USA',
            'city': 'Montgomery',

            'img_path': 'sample_passport.png',
            'id': 1232,
            'passport_reviewed_status': $filter('translate')('GID_STAFF_REVIEW_ACCEPTED'),
            'passport_scan_status': $filter('translate')('GID_SCAN_PASSPORT_SUCCESS')
        }];

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
            $log.warn('on fail admin review passport');
            $scope.trackSessionActivity('CheckIn', 'Error Saving Passport', 'R' + $stateParams.reservation_id, $scope.mode, true);
            $scope.$emit('GENERAL_ERROR');
        };

        var savePassportToAPI = function(selectedPassportInfo) {
            var options = {
                params: {
                    'front_image_data': selectedPassportInfo.img_path,
                    'reservation_id': $stateParams.reservation_id,
                    'document_type': selectedPassportInfo.docType,
                    'document_number': selectedPassportInfo.docID,
                    'expiration_date': selectedPassportInfo.docExpiry,
                    'full_name': selectedPassportInfo.scanned_full_name,
                    'first_name': selectedPassportInfo.scanned_first_name,
                    'last_name': selectedPassportInfo.scanned_last_name,
                    'nationality': selectedPassportInfo.nationality,
                    'guest_id': selectedPassportInfo.id,
                    'date_of_birth': selectedPassportInfo.dob,
                    'signature': $("#signature").jSignature("getData")
                },
                successCallBack: function() {
                    validatePassportsView();
                    $scope.selectedPassport = false;
                    // on guest details is saved successfully, save the signature
                    var guestDetails = _.find($scope.selectedReservation.guest_details, function(guest) {
                        return guest.id === selectedPassportInfo.id;
                    });

                    if (guestDetails) {
                        guestDetails.signature = $("#signature").jSignature("getData", "base30");
                    }
                    $scope.mode = 'ADMIN_VERIFY_PASSPORTS';
                },
                failureCallBack: function() {
                    $log.warn('failed to save');
                    $log.warn(arguments);
                    $scope.$emit('GENERAL_ERROR');
                }
            };

            // Also save the back image data if there was front+back to the document scan
            // 
            if (selectedPassportInfo.back_img_path) {
                options.params['back_image_data'] = selectedPassportInfo.back_img_path;
            }

            // in demo mode or rejected passport
            // go back to verify passports screen where admin can continue the flow
            if ($scope.inDemoMode() || !$scope.acceptedPassport) {
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
                    'passport_accepted': $scope.acceptedPassport,
                    'reservation_id': $stateParams.reservation_id
                },
                successCallBack: onSuccessAdminReview,
                failureCallBack: onFailAdminReview
            };

            if ($scope.inDemoMode()) {
                onSuccessAdminReview();
            } else {
                $scope.callAPI(zsCheckinSrv.acceptPassport, options);
            }
        };

        $scope.rejectPassport = function() {
            $scope.acceptedPassport = false;
            var options = {
                params: {
                    'passport_accepted': $scope.acceptedPassport,
                    'reservation_id': $stateParams.reservation_id
                },
                successCallBack: onSuccessAdminReview,
                failureCallBack: onFailAdminReview
            };

            if ($scope.inDemoMode()) {
                onSuccessAdminReview();
            } else {
                $scope.callAPI(zsCheckinSrv.acceptPassport, options);
            }
        };

        /* 
         *  To setup scroll
         */
        $scope.setScroller('passport-validate', {
            disablePointer: true, // important to disable the pointer events that causes the issues
            disableTouch: false, // false if you want the slider to be usable with touch devices
            disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
            preventDefaultException: { className: /(^|\s)signature-pad-layout(\s|$)/ }
        });

        var refreshScroller = function() {
            $scope.refreshScroller('passport-validate');

            var scroller = $scope.getScroller('passport-validate');

            $timeout(function() {
                scroller.scrollTo(0, 0, 300);
            }, 0);

        };

        var setGuestType = function(guest) {
            for (var x in $scope.selectedReservation.guest_details) {
                if (guest.id === $scope.selectedReservation.guest_details[x].id) {
                    $scope.selectedReservation.guest_details[x].guest_type = guest.guest_type;
                }
            }
        };

        $scope.totalGuests = 1;
        $scope.totalPages = 1;
        $scope.viewPage = 1;
        $scope.perPage = 3; // view 4 guests per page, select next to view more
        $scope.currentPage = 1;

        $scope.showGuest = function(index) {
            var guestNumber = index + 1;

            var guestOnPage = Math.ceil(guestNumber / $scope.perPage);

            return guestOnPage === $scope.currentPage;
        };

        $scope.viewPreviousPage = function() {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
            }

        };

        $scope.viewNextPage = function() {
            if ($scope.currentPage < $scope.totalPages) {
                $scope.currentPage++;
            }
        };

        var fetchGuestDetails = function() {
            var onSuccess = function(response) {
                $log.log(response);
                $scope.totalGuests = 1 + response.accompanying_guests_details.length;
                $scope.viewPage = 1;
                $scope.totalPages = Math.ceil($scope.totalGuests / $scope.perPage);

                $scope.accompanying_guests_details = response.accompanying_guests_details;

                for (var i in response.accompanying_guests_details) {
                    setGuestType(response.accompanying_guests_details[i]);
                }
            };
            var onFail = function(response) {
                $log.log(response);
                $scope.trackSessionActivity('CheckIn-PP', 'FailedFetching Guest Tab Details', 'R' + $stateParams.reservation_id, $scope.mode);
                $scope.$emit('GENERAL_ERROR');
            };

            var options = {
                params: {
                    'reservation_id': $stateParams.reservation_id
                },
                successCallBack: onSuccess,
                failureCallBack: onFail
            };

            $scope.callAPI(zsCheckinSrv.getGuestTabDetails, options);
        };

        var fetchGuestIdType = function() {
            var onSuccess = function(response) {
                $log.log(response);
                $scope.trackSessionActivity('CheckIn', 'SuccessFetching Passport Setting', '', $scope.mode);
                $scope.scanning.is_double_sided_required = response.data.is_double_sided;
            };
            var onFail = function(response) {
                $log.log(response);
                $scope.trackSessionActivity('CheckIn', 'FailedFetching Passport Setting', '', $scope.mode);
                $scope.scanning.is_double_sided_required = true; // allows user to skip if this only if API says double_sided not required
            };

            var options = {
                params: {
                    'reservation_id': $stateParams.reservation_id
                },
                successCallBack: onSuccess,
                failureCallBack: onFail
            };

            $scope.callAPI(zsCheckinSrv.checkIDType, options);
        };

        /**
         * [initializeMe description]
         */
        var initializeMe = (function() {
            $scope.scanning.is_double_sided_required = true; // initial ID type is passport, for Yotel singapore they will do double-sided

            if ($stateParams.isQuickJump !== 'true') {
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

            $scope.results = []; // scan results is the array of guests + status of passport (scanned/verified, etc)
            $scope.allPassportsScanned = false;
            $scope.allPassportReviewed = false;

            $scope.setScreenIcon('checkin'); // yotel only

            if ($stateParams.isQuickJump === 'true') {
                $scope.mode = $stateParams.quickJumpMode;
            } else {
                $scope.mode = 'SCAN_RESULTS';
            }

            $scope.fromPickupKeyPassportScan = $stateParams.from_pickup_key === 'true';

            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);

            fetchGuestIdType();
            fetchGuestDetails();

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

            var isV1 = $scope.zestStationData.v1GuestIDScanning,
                details;


            if (isV1) {
                if (!response.PR_DFE_FRONT_IMAGE ||
                    !response.PR_DF_BIRTH_DATE ||
                    !response.PR_DF_DOCTYPE ||
                    !response.PR_DF_DOCUMENT_NUMBER ||
                    !response.PR_DF_EXPIRY_DATE ||
                    !response.PR_DF_ISSUE_COUNTRY ||
                    !response.PR_DF_NATIONALITY ||
                    !response.PR_DF_TYPE // TYPE = PP (passport)
                    // !response.PR_DF_GIVENNAME ||
                    // !response.PR_DF_NAME ||
                    //  !response.PR_DF_SEX ||
                    //  !response.PR_DF_SURNAME ||
                ) {
                    return false;
                }
            } else {
                if (response.status && response.status.toLowerCase() === 'success') {
                    // assume v2 and check fields
                    // 
                    // v2 notes:
                    //  details.nationality_code2 | may link directly with our country_code.json structure
                    // 
                    // 
                    details = response.gDetails[0];

                    if (!details.lastName || // may only have lastName and not first name, which has full name in some countries
                        !details.dateOfBirth ||
                        !details.documentType ||
                        !details.documentNumber ||
                        !details.expiryDate ||
                        // !details.PR_DF_ISSUE_COUNTRY ||
                        !details.nationality_code2 ||
                        !details.nationality_fullname
                    ) {
                        return false;
                    }
                }
            }

            return true;
        };


        var getResponseMappings = function(mapping) {
            var docDetails;

            // v1
            if (mapping.PR_DF_TYPE && mapping.PR_DF_DOCUMENT_NUMBER) {
                if (!mapping.PR_DF_GIVENNAME && mapping.PR_DF_NAME) {
                    mapping.PR_DF_GIVENNAME = mapping.PR_DF_NAME;
                }

                return {
                    'FRONT_IMAGE': mapping.PR_DFE_FRONT_IMAGE,

                    // 'BIRTH_DATE':  returnUnformatedDateObj(mapping.PR_DF_BIRTH_DATE, 'MM-DD-YYYY'),
                    'BIRTH_DATE': mapping.PR_DF_BIRTH_DATE,
                    'LAST_NAME': mapping.PR_DF_SURNAME,
                    'FIRST_NAME': mapping.PR_DF_GIVENNAME,
                    'NATIONALITY': mapping.PR_DF_NATIONALITY,
                    'SEX': mapping.PR_DF_SEX,
                    'FULL_NAME': mapping.PR_DF_NAME,

                    'DOC_TYPE': mapping.PR_DF_DOCTYPE,
                    'DOCUMENT_NUMBER': mapping.PR_DF_DOCUMENT_NUMBER,
                    'EXPIRY_DATE': mapping.PR_DF_EXPIRY_DATE,
                    'ID_ISSUE_COUNTRY': mapping.PR_DF_ISSUE_COUNTRY,
                    'ID_TYPE': mapping.PR_DF_TYPE,
                    'NATIONALITY_FULL_NAME':  mapping.PR_DF_NATIONALITY
                };
            } 
            if (!mapping.lastName && mapping.doc) {
                docDetails = mapping.doc;
                // if first name and last name are not present, assign full name as last name
                if (!docDetails.lastName && !docDetails.firstName) {
                    docDetails.lastName = docDetails.fullName;
                }
            }
            // v2
            return {
                    /*
                        details.lastName || // may only have lastName and not first name, which has full name in some countries
                     */
                'FRONT_IMAGE': docDetails.docImge ? docDetails.docImge : docDetails.docImage1,

                    // 'BIRTH_DATE':  returnUnformatedDateObj(mapping.PR_DF_BIRTH_DATE, 'MM-DD-YYYY'),
                'BIRTH_DATE': docDetails.dateOfBirth,
                'LAST_NAME': docDetails.lastName,
                 // FIRST_NAME, in partials it will show only last name if first&last are the same
                'FIRST_NAME': docDetails.firstName,
                'NATIONALITY': docDetails.nationality_code2,
                'NATIONALITY_FULL_NAME': docDetails.nationality_fullname,
                'SEX': docDetails.gender,
                'FULL_NAME': docDetails.fullName,

                'DOC_TYPE': docDetails.documentType,
                'DOCUMENT_NUMBER': docDetails.documentNumber,
                'EXPIRY_DATE': docDetails.expiryDate,
                'ID_ISSUE_COUNTRY': docDetails.issueCountry_fullname,
                'ID_TYPE': docDetails.documentType,
                'OTHER_SIDE_SCAN': mapping.otherside
            };

        };

        $scope.$on('PASSPORT_SCAN_SUCCESS', function(evt, response) {
            $log.log('PASSPORT_SCAN_SUCCESS: ', response);
            $log.log('returnedAllRequiredFields(response): ', returnedAllRequiredFields(response), ': $scope.scanningBackImage: ', $scope.scanningBackImage);

            if (returnedAllRequiredFields(response) && !$scope.scanningBackImage) {
                // set local params, to map to different documents/versions of samsotech devices
                // if any updates/changes in response format, adjust here
                
                // 
                // If given name (first name) is not available, map to first name instead
                // 
              
                var mappedResponse = getResponseMappings(response);

                onPassportScanSuccess(mappedResponse);

            } else if ($scope.scanningBackImage && ((response.PR_DFE_FRONT_IMAGE  || !$scope.zestStationData.v1GuestIDScanning) || $scope.inDemoMode() || response.skipScan)) {
                // if scanning the back of a document, the only requirement is that an image is returned
                // the only failure would be if this ('PR_DFE_FRONT_IMAGE') was not returned from samsotech
                // CICO-41398

                $scope.scanningBackImage = false;
                $scope.scannedBackImage = true;
                if ($scope.zestStationData.v1GuestIDScanning) {
                    mappedResponse = {
                        'BACK_IMAGE': response.PR_DFE_FRONT_IMAGE ? response.PR_DFE_FRONT_IMAGE : ''
                    };
                } else {
                    mappedResponse = getResponseMappings(response);
                    mappedResponse.BACK_IMAGE = response.doc ? response.doc.docImge : '';
                }
               

                onPassportScanSuccess(mappedResponse);

            } else {
                onPassportScanFailure();

            }
        });

        $scope.$on('PASSPORT_SCAN_FAILURE', function() {
            onPassportScanFailure();
        });

        // Show Reservation details after scaninng

        function showReservationDetails() {
            $scope.setScroller('res-details');

            var refreshScroller = function() {
                $scope.refreshScroller('res-details');
            };

            var setSelectedReservation = function() {
                zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
            };

            var fetchReservationDetails = function() {
                var onSuccessFetchReservationDetails = function(data) {
                    if (data.data) {
                        // Store the reservation_details which had temperory datas like accepted_terms_and_conditions in a variable and
                        // set it back after the reservation_details is replaced from the API response
                        var acceptedTermsAndConditions = $scope.selectedReservation.reservation_details.accepted_terms_and_conditions;

                        $scope.selectedReservation.reservation_details = data.data.reservation_card;
                        $scope.selectedReservation.reservation_details.accepted_terms_and_conditions = acceptedTermsAndConditions;
                        $scope.zestStationData.selectedReservation = $scope.selectedReservation;
                        if ($scope.isRateSuppressed()) {
                            $scope.selectedReservation.reservation_details.balance = 0;
                        }
                        fetchAddons();
                        setDisplayContentHeight(); // utils function
                        refreshScroller();
                    } else {
                        // else some error occurred
                        $log.warn('failed to fech Reservation details');
                        $log.warn(arguments);
                        $scope.$emit('GENERAL_ERROR');
                    }
                };


                $scope.callAPI(zsCheckinSrv.fetchReservationInfo, {
                    params: {
                        'id': $scope.selectedReservation.id
                    },
                    'successCallBack': onSuccessFetchReservationDetails,
                    'failureCallBack': onSuccessFetchReservationDetails
                });
            };

            var fetchAddons = function() {
                var fetchCompleted = function(data) {
                    $scope.selectedReservation.addons = data.existing_packages;
                    setSelectedReservation();
                    setDisplayContentHeight();
                    refreshScroller();
                    $scope.isReservationDetailsFetched = true;
                };


                $scope.callAPI(zsCheckinSrv.fetchAddonDetails, {
                    params: {
                        'id': $scope.selectedReservation.reservation_details.reservation_id
                    },
                    'successCallBack': fetchCompleted,
                    'failureCallBack': fetchCompleted
                });


            };

            $scope.isRateSuppressed = function() {
                if (typeof $scope.selectedReservation === 'undefined') {
                    return false;
                }
                // need to wait for api to update
                // this is used in HTML to hide things
                if (typeof $scope.selectedReservation.reservation_details !== 'undefined') {
                    if ($scope.selectedReservation.reservation_details.is_rates_suppressed === 'true') {
                        return true;
                    }
                }
                return false;
            };

            var checkIfEmailIsBlackListedOrValid = function() {
                // from some states mail is sent as guest_email and some email
                var email = $stateParams.guest_email ? $stateParams.guest_email : $stateParams.email;
                email = (!email) ? '' : email;

                return email.length > 0 && !($stateParams.guest_email_blacklisted === 'true') && zsUtilitySrv.isValidEmail(email);
            };

            var afterGuestCheckinCallback = function() {
                $scope.checkinInProgress = false;
                // if email is valid and is not blacklisted
                var haveValidGuestEmail = checkIfEmailIsBlackListedOrValid(),
                    collectNationalityEnabled = $scope.zestStationData.check_in_collect_nationality;

                $log.warn('afterGuestCheckinCallback :: current state params: ', $stateParams);

                var stateParams = {
                    'guest_id': $stateParams.guest_id,
                    'reservation_id': $stateParams.reservation_id,
                    'room_no': $stateParams.room_no,
                    'first_name': $stateParams.first_name,
                    'email': $stateParams.email
                };

                if ($scope.zestStationData.is_kiosk_ows_messages_active) {
                    $scope.setScreenIcon('checkin');
                    $state.go('zest_station.checkinSuccess', stateParams);
                }
                // if collectiing nationality after email, but email is already valid
                else if (collectNationalityEnabled && haveValidGuestEmail) {
                    $state.go('zest_station.collectNationality', stateParams);
                } else if (haveValidGuestEmail) {
                    $state.go('zest_station.checkinKeyDispense', stateParams);
                } else {
                    // if email is invalid, collect email
                    $log.warn('to email collection: ', stateParams);
                    $state.go('zest_station.checkInEmailCollection', stateParams);
                }
            };

            $scope.onNextFromDetails = function() {
                var checkinParams = {
                    'reservation_id': $stateParams.reservation_id,
                    'workstation_id': $scope.zestStationData.set_workstation_id,
                    'authorize_credit_card': false,
                    'do_not_cc_auth': false,
                    'is_promotions_and_email_set': false,
                    'is_kiosk': true,
                    'signature': $stateParams.signature
                };
                var options = {
                    params: checkinParams,
                    successCallBack: afterGuestCheckinCallback,
                    failureCallBack: function() {
                        var stateParams = {
                            'message': 'Checkin Failed.'
                        };
                        $state.go('zest_station.speakToStaff', stateParams);
                        $scope.checkinInProgress = false;
                    }
                };
                // disable further click actions based on this flag
                $scope.checkinInProgress = true;
                if ($scope.inDemoMode()) {
                    afterGuestCheckinCallback();
                } else {
                    $scope.callAPI(zsCheckinSrv.checkInGuest, options);
                }
            };

            $scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
            fetchReservationDetails();
        }
         
       
    }
]);
