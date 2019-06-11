sntZestStation.controller('zsCheckinfindReservationFromIdCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$controller',
    'zsEventConstants',
    'zsCheckinSrv',
    'zsUtilitySrv',
    '$timeout',
    'zsGeneralSrv',
    function($scope, $stateParams, $state, $controller, zsEventConstants, zsCheckinSrv, zsUtilitySrv, $timeout, zsGeneralSrv) {

        BaseCtrl.call(this, $scope);

        var reservationId;

        $controller('sntIDCollectionBaseCtrl', {
            $scope: $scope
        });
        $controller('zsScanIdBaseCtrl', {
            $scope: $scope
        });

        $scope.searchByName = function() {
            $state.go('zest_station.checkInReservationSearch');
        };
        /** *************** External camera actions ****** **/

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

        $scope.$on('START_FINDING_RESERVATION', function() {
            $scope.screenData.scanMode = 'FINDING_RESERVATION';
            searchReservationByLastName();
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
                staffVerified: false,
                screenType: 'FIND_RESERVATION'
            };
            $scope.setScroller('confirm-images');

            var idCaptureConfig = processCameraConfigs($scope.zestStationData.iOSCameraEnabled, $scope.zestStationData.connectedCameras, $scope.zestStationData.featuresSupportedInIosApp);

            $scope.setConfigurations(idCaptureConfig);
        })();
    }
]);