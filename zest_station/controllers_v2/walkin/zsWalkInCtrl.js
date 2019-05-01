sntZestStation.controller('zsWalkInCtrl', [
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

        var refreshIDdetailsScroller = function() {
                $scope.refreshScroller('passport-validate');

                var scroller = $scope.getScroller('passport-validate');

                $timeout(function() {
                    scroller.scrollTo(0, 0, 300);
                }, 0);
            };

        $scope.$on('SHOW_ID_RESULTS', function() {
            $scope.screenData.scanMode = 'FINAL_ID_RESULTS';
            refreshIDdetailsScroller();
            //searchReservationByLastName();
        });

        var createReservationFailed = function(){

        };

        var roomTypeNotAvailableActions = function(){

        };

        var createReservationUsingRoomTypeId = function(roomTypeId){
            var params = {
                "arrival_date": "2018-10-12",
                "departure_date": "2018-10-13",
                "adults_count": 1,
                "children_count": 0,
                "infants_count": 0,
                "room_type_id": roomTypeId,
                "rate_id": $scope.zestStationData.kiosk_walk_in_rate_id,
                "new_guest_details": [{
                    "is_primary": true,
                    "first_name": $scope.idScanData.selectedGuest.scannedDetails.first_name,
                    "last_name": $scope.idScanData.selectedGuest.scannedDetails.last_name,
                    "id_number": $scope.idScanData.selectedGuest.scannedDetails.document_number,
                    "address":{
                        "city":  $scope.idScanData.selectedGuest.scannedDetails.id_scan_info.address_city,
                        "state":  $scope.idScanData.selectedGuest.scannedDetails.id_scan_info.address_state,
                        "street":  $scope.idScanData.selectedGuest.scannedDetails.id_scan_info.address_line_1,
                        "street2":  $scope.idScanData.selectedGuest.scannedDetails.id_scan_info.address_line_2
                    },
                    "nationality": $scope.idScanData.selectedGuest.scannedDetails.nationality
                }],
                "source_id": $scope.zestStationData.kiosk_walk_in_source_id,
                "market_segment_id": $scope.zestStationData.kiosk_walk_in_market_id,
                "booking_origin_id": $scope.zestStationData.kiosk_walk_in_origin_id
            };
            var createReservationSuccess = function(response){

            };
            var options = {
                params: params,
                successCallBack: createReservationSuccess,
                failureCallBack: createReservationFailed
            };

            $scope.callAPI(zsGeneralSrv.createReservation, options);
        };

        var startCreatingReservation = function (){
            var params = {
                "from_date": "2018-10-12",
                "to_date":"2018-10-13",
                "rate_id": $scope.zestStationData.kiosk_walk_in_rate_id,
                "adults": 1,
                "children":0,
                "order": "LOW_TO_HIGH"
            };
            var fetchAvailabilitySuccess = function(response){
                if(response.results && response.results.length === 0 ) {
                    roomTypeNotAvailableActions();
                } else{
                    // accept only if availablity is > 0
                    var availabilityList = _.filter(response.results, function(roomType){
                        return roomType.availability > 0;
                    });
                    if(availabilityList.length === 0){
                        roomTypeNotAvailableActions();
                        return;
                    }
                    var minimumAdrRoomType = _.min(availabilityList, function(roomType){
                        return roomType.adr;
                    });

                    createReservationUsingRoomTypeId(minimumAdrRoomType.id);

                    console.log(availabilityList);
                }
            };
            var options = {
                params: params,
                successCallBack: fetchAvailabilitySuccess,
                failureCallBack: createReservationFailed
            };

            $scope.callAPI(zsGeneralSrv.getAvailableRatesForTheDay, options);
            console.log("creating reservation");
        };

        $scope.$on('START_CREATING_RESERVATION', startCreatingReservation);

        $scope.acceptID = function(){
            if($scope.idScanData.verificationMethod === 'FR'){
                $scope.$emit('START_FACIAL_RECOGNITION');
            } else{
                startCreatingReservation();
            }
        };

        $scope.rejectID = function() {
            $scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
        };

        (function() {
            zsCheckinSrv.setCurrentReservationIdDetails({});
            $scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.idScanData = {
                mode: '',
                selectedGuest: {},
                verificationMethod: zsUtilitySrv.retriveIdScanVerificationMethod($scope.zestStationData.kiosk_scan_mode),
                staffVerified: false,
                screenType: 'WALKIN_RESERVATION'
            };
            $scope.setScroller('confirm-images');
            $scope.setScroller('passport-validate');

            var idCaptureConfig = processCameraConfigs($scope.zestStationData.iOSCameraEnabled, $scope.zestStationData.connectedCameras, $scope.zestStationData.featuresSupportedInIosApp);

            $scope.setConfigurations(idCaptureConfig);
        })();
    }
]);