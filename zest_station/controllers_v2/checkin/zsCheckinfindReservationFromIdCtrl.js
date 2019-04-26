sntZestStation.controller('zsCheckinfindReservationFromIdCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$controller',
    'zsEventConstants',
    'zsCheckinSrv',
    'zsUtilitySrv',
    '$timeout',
    'sntIDCollectionSrv',
    'zsGeneralSrv',
    function($scope, $stateParams, $state, $controller, zsEventConstants, zsCheckinSrv, zsUtilitySrv, $timeout, sntIDCollectionSrv, zsGeneralSrv) {

        BaseCtrl.call(this, $scope);
        if (!sntIDCollectionSrv.isInDevEnv && $scope.zestStationData.hotelSettings.id_collection) {
            sntIDCollectionSrv.setAcuantCredentialsForProduction($scope.zestStationData.hotelSettings.id_collection.acuant_credentials);
        }
        var reservationId;

        $controller('sntIDCollectionBaseCtrl', {
            $scope: $scope
        });

        $scope.searchByName = function() {
            $state.go('zest_station.checkInReservationSearch');
        };
        /** *************** External camera actions ****** **/

        $scope.$on('FRONT_SIDE_SCANNING_STARTED', function() {
            $scope.$emit('showLoader');
            $scope.startExtCameraCapture('front-image');
        });
        $scope.$on('FRONT_IMAGE_CONFIRMED', function() {
            if ($scope.screenData.scanMode === 'UPLOAD_BACK_IMAGE' && $scope.deviceConfig.useExtCamera) {
                $scope.$emit('showLoader');
                $scope.startExtCameraCapture('back-image');
            }
        });
        $scope.$on('IMAGE_ANALYSIS_STARTED', function() {
            $scope.screenData.scanMode = 'ANALYSING_ID_DATA';
        });

        $scope.$on('EXT_CAMERA_STARTED', function() {
            $timeout(function() {
                $scope.$emit('hideLoader');
            }, 3000);
        });

        $scope.$on('EXT_CAMERA_FAILED', function() {
            $scope.$emit('hideLoader');
        });
        $scope.$on('FR_CAMERA_STARTING', function() {
            $scope.$emit('showLoader');
        });

        $scope.$on('FACE_IMAGE_RETRIEVED', function(event, response) {
            var scannedDetails = zsCheckinSrv.getCurrentReservationIdDetails();

            scannedDetails.faceImage = response;
            setDataToCheckinSrv(scannedDetails);
        });

        var refreshConfrimImagesScroller = function() {
            $scope.refreshScroller('confirm-images');

            var scroller = $scope.getScroller('confirm-images');

            $timeout(function() {
                scroller.scrollTo(0, 0, 300);
            }, 0);
        };

        var recordIDScanActions = function(actionType, key, value) {
            var params = {
                "id": reservationId,
                "application": 'KIOSK',
                "action_type": actionType,
                "details": [{
                    "key": key,
                    "new_value": value
                }]
            };

            var options = {
                params: params,
                loader: 'none',
                failureCallBack: function() {
                    // do nothing
                }
            };

            $scope.callAPI(zsGeneralSrv.recordReservationActions, options);
        };

        var searchReservationByLastName = function() {
            var reservationSearchFailed = function() {
                $scope.screenData.scanMode = 'FINDING_RESERVATION_FAILED';
            };
            var reservationSearchSuccess = function(response) {
                if (response.results && response.results.length === 1) {
                    zsCheckinSrv.setSelectedCheckInReservation(response.results);

                    if (response.results[0].guest_details) {
                        var primaryGuest = _.find(response.results[0].guest_details, function(guest) {
                            return guest.is_primary;
                        });
                        var guestName = primaryGuest.first_name + primaryGuest.last_name;

                        reservationId = response.results[0].id;

                        recordIDScanActions('ID_ANALYZING', 'Success for the guest', guestName);
                        if ($scope.idScanData.verificationMethod === 'FR') {
                            recordIDScanActions('ID_FACIAL_RECOGNITION', 'Success for the guest', guestName);
                        }
                    }
                    $state.go('zest_station.checkInReservationDetails');
                } else if (response.results && response.results.length > 1) {
                    // zsCheckinSrv.setCheckInReservations(response.results);
                    // $state.go('zest_station.selectReservationForCheckIn');
                    $state.go('zest_station.checkInReservationSearch', {
                        'last_name': $scope.idScanData.selectedGuest.scannedDetails.last_name
                    });
                } else {
                    reservationSearchFailed();
                }
            };

            var params = {
                is_kiosk: true,
                due_in: true,
                last_name: $scope.idScanData.selectedGuest.scannedDetails.last_name
            };
            var options = {
                params: params,
                successCallBack: reservationSearchSuccess,
                failureCallBack: reservationSearchFailed
            };

            $scope.callAPI(zsCheckinSrv.fetchReservations, options);
        };

        var setDataToCheckinSrv = function(data) {
            data.front_image_data = $scope.idScanData.selectedGuest.front_image_data;
            data.back_image_data = $scope.idScanData.selectedGuest.back_image_data;
            zsCheckinSrv.setCurrentReservationIdDetails(data);
        };

        $scope.$on('FINAL_RESULTS', function(evt, data) {
            if (data.expirationStatus === 'Expired') {
                $scope.screenData.scanMode = 'ID_DATA_EXPIRED';
            } else if (!data.document_number) {
                $scope.screenData.scanMode = 'ANALYSING_ID_DATA_FAILED';
            } else if ($scope.idScanData.verificationMethod === 'FR') {
                $scope.screenData.facialRecognitionInProgress = false;
                $scope.screenData.scanMode = 'FACIAL_RECOGNITION_MODE';
                $scope.idScanData.selectedGuest.scannedDetails = data;
                setDataToCheckinSrv(data);
                if ($scope.deviceConfig.useExtCamForFR) {
                    $scope.startFacialRecognitionUsingExtCamera();
                }
            } else {
                $scope.idScanData.selectedGuest.scannedDetails = data;
                setDataToCheckinSrv(data);
                $scope.screenData.scanMode = 'FINDING_RESERVATION';
                searchReservationByLastName();
            }
        });

        var resetSscannedData = function() {
            $scope.idScanData.selectedGuest.front_image_data = '';
            $scope.idScanData.selectedGuest.back_image_data = '';
            $scope.idScanData.selectedGuest.scannedDetails = {};
        };


        $scope.$on('CLEAR_PREVIOUS_DATA', resetSscannedData);

        $scope.screenData.facialRecognitionInProgress = false;

        $scope.$on('FR_ANALYSIS_STARTED', function() {
            $scope.screenData.facialRecognitionInProgress = true;
            $scope.$emit('showLoader');
        });
        $scope.$on('FR_FAILED', function(evt, response) {
            $scope.$emit('hideLoader');
            $scope.screenData.facialRecognitionInProgress = false;
            $scope.screenData.scanMode = 'FACIAL_RECOGNTION_FAILED';
            // recordIDScanActions('ID_FACIAL_RECOGNITION', 'Failed for the guest');
        });

        $scope.$on('FR_SUCCESS', function() {
            $scope.$emit('hideLoader');
            searchReservationByLastName();
        });

        $scope.$on('IMAGE_UPDATED', function(evt, data) {
            if (data.isFrontSide) {
                $scope.idScanData.selectedGuest.front_image_data = data.imageData;
            } else {
                $scope.idScanData.selectedGuest.back_image_data = data.imageData;
            }
            refreshConfrimImagesScroller();
        });

        $scope.$on('IMAGE_ANALYSIS_FAILED', function(event, data) {
            var errorMessage = data && Array.isArray(data) ? data[0] + ' for the guest' : 'Failed for the guest';

            // recordIDScanActions('ID_IMAGE_PROCESSING', errorMessage);
        });

        (function() {
            zsCheckinSrv.setCurrentReservationIdDetails({});
            $scope.screenData.scanMode = 'SHOW_FIND_RESERVATION_OPTIONS';
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.idScanData = {
                mode: '',
                selectedGuest: {},
                verificationMethod: zsUtilitySrv.retriveIdScanVerificationMethod($scope.zestStationData.kiosk_scan_mode),
                staffVerified: false
            };
            $scope.setScroller('confirm-images');

            var idCaptureConfig = processCameraConfigs($scope.zestStationData.iOSCameraEnabled, $scope.zestStationData.connectedCameras, $scope.zestStationData.featuresSupportedInIosApp);
            
            $scope.setConfigurations(idCaptureConfig);
        })();
    }
]);