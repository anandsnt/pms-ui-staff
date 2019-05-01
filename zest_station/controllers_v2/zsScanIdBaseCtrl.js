sntZestStation.controller('zsScanIdBaseCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$controller',
    'zsEventConstants',
    'zsCheckinSrv',
    '$timeout',
    'sntIDCollectionSrv',
    function($scope, $stateParams, $state, $controller, zsEventConstants, zsCheckinSrv, $timeout, sntIDCollectionSrv) {

        BaseCtrl.call(this, $scope);
        if (!sntIDCollectionSrv.isInDevEnv && $scope.zestStationData.hotelSettings.id_collection) {
            sntIDCollectionSrv.setAcuantCredentialsForProduction($scope.zestStationData.hotelSettings.id_collection.acuant_credentials);
        }

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

        var setDataToCheckinSrv = function(data) {
            // if ID scan is not enabled for KIOSK don't store ID details for future reference
            if (!$scope.zestStationData.id_scan_enabled) {
                return;
            }
            data.front_image_data = $scope.idScanData.selectedGuest.front_image_data;
            data.back_image_data = $scope.idScanData.selectedGuest.back_image_data;
            zsCheckinSrv.setCurrentReservationIdDetails(data);
        };

        var proceedWithScanedDetails = function() {
            if ($scope.idScanData.screenType === 'FIND_RESERVATION') {
                $scope.$emit('START_FINDING_RESERVATION');
            } else {
                $scope.$emit('SHOW_ID_RESULTS');
            }
        };

        var facialRecogntionActions = function() {
            $scope.screenData.facialRecognitionInProgress = false;
            $scope.screenData.scanMode = 'FACIAL_RECOGNITION_MODE';

            // TODO: Uncomment while integrating external desktop cameras
            // if ($scope.deviceConfig.useExtCamForFR) {
            //     $scope.startFacialRecognitionUsingExtCamera();
            // }
        };

        $scope.$on('START_FACIAL_RECOGNITION', function() {
            facialRecogntionActions();
        });

        $scope.$on('FINAL_RESULTS', function(evt, data) {
            if (data.expirationStatus === 'Expired') {
                $scope.screenData.scanMode = 'ID_DATA_EXPIRED';
            } else if (!data.document_number) {
                $scope.screenData.scanMode = 'ANALYSING_ID_DATA_FAILED';
            } else if ($scope.idScanData.verificationMethod === 'FR') {
                //TO: Handle FR for walkin later
                $scope.idScanData.selectedGuest.scannedDetails = data;
                setDataToCheckinSrv(data);
                if ($scope.idScanData.screenType === 'WALKIN_RESERVATION') {
                    proceedWithScanedDetails();
                }
            } else {
                $scope.idScanData.selectedGuest.scannedDetails = data;
                setDataToCheckinSrv(data);
                proceedWithScanedDetails();
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
            if ($scope.idScanData.screenType === 'WALKIN_RESERVATION') {
                $scope.$emit('START_CREATING_RESERVATION');
            } else {
                proceedWithScanedDetails();
            }
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

        (function() {})();
    }
]);

       // TODO: Uncomment and add to top while integrating external desktop cameras

        // $scope.$on('FRONT_SIDE_SCANNING_STARTED', function() {
        //     $scope.$emit('showLoader');
        //     $scope.startExtCameraCapture('front-image');
        // });
        // $scope.$on('FRONT_IMAGE_CONFIRMED', function() {
        //     if ($scope.screenData.scanMode === 'UPLOAD_BACK_IMAGE' && $scope.deviceConfig.useExtCamera) {
        //         $scope.$emit('showLoader');
        //         $scope.startExtCameraCapture('back-image');
        //     }
        // });

        // $scope.$on('IMAGE_ANALYSIS_STARTED', function() {
        //     $scope.screenData.scanMode = 'ANALYSING_ID_DATA';
        // });

        // $scope.$on('EXT_CAMERA_STARTED', function() {
        //     $timeout(function() {
        //         $scope.$emit('hideLoader');
        //     }, 3000);
        // });
        // $scope.$on('EXT_CAMERA_FAILED', function() {
        //     $scope.$emit('hideLoader');
        // });
        // $scope.$on('FR_CAMERA_STARTING', function() {
        //     $scope.$emit('showLoader');
        // });