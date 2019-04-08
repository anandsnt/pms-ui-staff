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
    function($scope, $stateParams, $state, $controller, zsEventConstants, zsCheckinSrv, zsUtilitySrv, $timeout, sntIDCollectionSrv) {

        BaseCtrl.call(this, $scope);
        if (!sntIDCollectionSrv.isInDevEnv && $scope.zestStationData.hotelSettings.id_collection) {
            sntIDCollectionSrv.setAcuantCredentialsForProduction($scope.zestStationData.hotelSettings.id_collection.acuant_credentials);
        }

        $controller('sntIDCollectionBaseCtrl', {
            $scope: $scope
        });

        $scope.searchByName = function() {
            $state.go('zest_station.checkInReservationSearch');
        };

        $scope.scanId = function() {
            $scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
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
            $scope.idScanData.selectedGuest.faceImage = response;
        });

        var recordIDScanActions = function(actionType, key, value) {
            value = value ? value : $scope.idScanData.selectedGuest.first_name + ' ' + $scope.idScanData.selectedGuest.last_name;
            var params = {
                "id": stateParams.reservation_id,
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

        var refreshConfrimImagesScroller = function() {
            $scope.refreshScroller('confirm-images');

            var scroller = $scope.getScroller('confirm-images');

            $timeout(function() {
                scroller.scrollTo(0, 0, 300);
            }, 0);
        };

        var searchReservationByLastName = function() {
            var reservationSearchFailed = function() {
                $scope.screenData.scanMode = 'FINDING_RESERVATION_FAILED';
            };
            var reservationSearchSuccess = function(response) {
                if (response.results && response.results.length === 1) {
                    zsCheckinSrv.setSelectedCheckInReservation(response.results);
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
            }
            var options = {
                params: params,
                successCallBack: reservationSearchSuccess,
                failureCallBack: reservationSearchFailed
            };
            $scope.callAPI(zsCheckinSrv.fetchReservations, options);
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
                if ($scope.deviceConfig.useExtCamForFR) {
                    $scope.startFacialRecognitionUsingExtCamera();
                }
            } else {
                $scope.idScanData.selectedGuest.scannedDetails = data;
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
        $scope.$on('FR_FAILED', function() {
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
            $scope.setConfigurations({
                useiOSAppCamera: $scope.zestStationData.iOSCameraEnabled,
                useExtCamera: $scope.zestStationData.connectedCameras.length > 0,
                useExtCamForFR: $scope.zestStationData.connectedCameras.length > 0
            });
        })();
    }
]);