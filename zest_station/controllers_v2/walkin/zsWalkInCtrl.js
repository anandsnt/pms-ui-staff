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
    'bussinessDateData',
    '$filter',
    function($scope, $stateParams, $state, $controller, zsEventConstants, zsCheckinSrv, zsUtilitySrv, $timeout, zsGeneralSrv, bussinessDateData, $filter) {

        BaseCtrl.call(this, $scope);

        var reservationId,
            minimumAdrRoomType,
            arrivalDate = bussinessDateData.business_date,
            // searchingReservationInProgress = false,
            // searchingReservationFailed = false;

        $scope.newReservation = {};

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

        var createReservationFailed = function() {
            $scope.screenData.scanMode = 'RESERVATION_CREATION_FAILED';
        };

        var roomTypeNotAvailableActions = function() {
            $scope.screenData.scanMode = 'ROOMS_NOT_AVAILABLE';
        };

        // $scope.proceedToCheckin = function() {
        //     // if the reservation search for the reservation just created is still goin on,
        //     // show loader and recheck status every second
        //     if (searchingReservationInProgress) {
        //         $scope.$emit('showLoader');
        //         $timeout(function() {
        //             $scope.proceedToCheckin();
        //         }, 1000);
        //         return;
        //     } else if(searchingReservationFailed){
        //         var stateParams = {
        //             'message': $filter('translate')('RESERVATION_CREATED_BUT_UNABLE_TO_RETRIEVE')
        //         };

        //         $state.go('zest_station.speakToStaff', stateParams);
        //         return;
        //     }
        //     $scope.$emit('hideLoader');
        //     $state.go('zest_station.checkInReservationDetails');
        // };

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
                    // searchingReservationInProgress = false;
                    $state.go('zest_station.checkInReservationDetails');
                }
            };

            var params = {
                is_kiosk: true,
                due_in: true,
                last_name: $scope.idScanData.selectedGuest.scannedDetails.last_name,
                alt_confirmation_number: $scope.newReservation.confirm_no
            };
            var options = {
                params: params,
                successCallBack: reservationSearchSuccess,
                //loader: 'none',
                failureCallBack: function() {
                    // searchingReservationFailed = true;
                    var stateParams = {
                        'message': $filter('translate')('RESERVATION_CREATED_BUT_UNABLE_TO_RETRIEVE')
                    };

                    $state.go('zest_station.speakToStaff', stateParams);
                }
            };
            // searchingReservationInProgress = true;
            $scope.callAPI(zsCheckinSrv.fetchReservations, options);
        };

        var createReservationUsingRoomTypeId = function(roomTypeId) {
            var departureDate = moment(arrivalDate, "YYYY-MM-DD").add($scope.idScanData.noOfDays, 'd').format("YYYY-MM-DD");

            var params = {
                "arrival_date": arrivalDate,
                "departure_date": departureDate,
                "adults_count": $scope.idScanData.noOfAdults,
                "children_count": $scope.idScanData.noOfChildren,
                "infants_count": $scope.idScanData.noOfInfants,
                "room_type_id": roomTypeId,
                "rate_id": $scope.zestStationData.kiosk_walk_in_rate_id,
                "new_guest_details": [{
                    "is_primary": true,
                    "first_name": $scope.idScanData.selectedGuest.scannedDetails.first_name,
                    "last_name": $scope.idScanData.selectedGuest.scannedDetails.last_name,
                    "id_number": $scope.idScanData.selectedGuest.scannedDetails.document_number,
                    "address": {
                        "city": $scope.idScanData.selectedGuest.scannedDetails.id_scan_info.address_city,
                        "state": $scope.idScanData.selectedGuest.scannedDetails.id_scan_info.address_state,
                        "street": $scope.idScanData.selectedGuest.scannedDetails.id_scan_info.address_line_1,
                        "street2": $scope.idScanData.selectedGuest.scannedDetails.id_scan_info.address_line_2
                    },
                    "nationality": $scope.idScanData.selectedGuest.scannedDetails.nationality
                }],
                "source_id": $scope.zestStationData.kiosk_walk_in_source_id,
                "market_segment_id": $scope.zestStationData.kiosk_walk_in_market_id,
                "booking_origin_id": $scope.zestStationData.kiosk_walk_in_origin_id
            };
            var createReservationSuccess = function(response) {
                // $scope.screenData.scanMode = 'RESERVATION_CREATION_SUCCESS';
                $scope.newReservation = response && response.reservations.length > 0 ? response.reservations[0] : {};
                // As soon as reservation is created, in background (w/o loader), find the reservation 
                // and gather data to proceed with checkin flow
                searchReservationByLastName();
            };
            var options = {
                params: params,
                successCallBack: createReservationSuccess,
                failureCallBack: createReservationFailed
            };

            $scope.callAPI(zsGeneralSrv.createReservation, options);
        };

        $scope.startCreatingReservation = function() {
            var departureDate = moment(arrivalDate, "YYYY-MM-DD").add($scope.idScanData.noOfDays, 'd').format("YYYY-MM-DD");
            var params = {
                "from_date": arrivalDate,
                "to_date": departureDate,
                "rate_id": $scope.zestStationData.kiosk_walk_in_rate_id,
                "adults": $scope.idScanData.noOfAdults,
                "children": $scope.idScanData.noOfChildren,
                "order": "LOW_TO_HIGH"
            };
            var fetchAvailabilitySuccess = function(response) {
                if (response.results && response.results.length === 0) {
                    roomTypeNotAvailableActions();
                } else {
                    // accept only if availablity is > 0
                    var availabilityList = _.filter(response.results, function(roomType) {
                        return roomType.availability > 0;
                    });
                    if (availabilityList.length === 0) {
                        roomTypeNotAvailableActions();
                        return;
                    }
                    minimumAdrRoomType = _.min(availabilityList, function(roomType) {
                        return roomType.adr;
                    });
                    createReservationUsingRoomTypeId(minimumAdrRoomType.id);
                }
            };
            var options = {
                params: params,
                successCallBack: fetchAvailabilitySuccess,
                failureCallBack: createReservationFailed
            };

            $scope.callAPI(zsGeneralSrv.getAvailableRatesForTheDay, options);
        };

        var showStayDetailsScreen = function() {
            $scope.screenData.scanMode = 'SELECT_STAY_DETAILS';
        };

        $scope.$on('START_CREATING_RESERVATION', showStayDetailsScreen);

        $scope.acceptID = function() {
            if ($scope.idScanData.verificationMethod === 'FR') {
                $scope.$emit('START_FACIAL_RECOGNITION');
            } else {
                showStayDetailsScreen();
            }
        };

        $scope.rejectID = function() {
            $scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
            $scope.screenData.imageSide = 0;
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
                screenType: 'WALKIN_RESERVATION',
                noOfNightArray: _.range(1, 11),
                guestCountArray: _.range(1, 6),
                noOfDays: "",
                noOfAdults: "",
                noOfChildren: "",
                noOfInfants: ""
            };
            $scope.setScroller('confirm-images');
            $scope.setScroller('passport-validate');

            var idCaptureConfig = processCameraConfigs($scope.zestStationData.iOSCameraEnabled, $scope.zestStationData.connectedCameras, $scope.zestStationData.featuresSupportedInIosApp);

            $scope.setConfigurations(idCaptureConfig);
        })();
    }
]);