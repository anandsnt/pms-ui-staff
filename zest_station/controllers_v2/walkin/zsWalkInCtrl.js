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
    '$filter',
    function($scope, $stateParams, $state, $controller, zsEventConstants, zsCheckinSrv, zsUtilitySrv, $timeout, zsGeneralSrv, $filter) {

        BaseCtrl.call(this, $scope);

        var reservationId,
            arrivalDate;
        $scope.availabileRoomList = [];

        $scope.newReservation = {};

        $controller('sntIDCollectionBaseCtrl', {
            $scope: $scope
        });
        $controller('zsScanIdBaseCtrl', {
            $scope: $scope
        });

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
            // searchReservationByLastName();
        });

        var createReservationFailed = function() {
            $scope.screenData.scanMode = 'RESERVATION_CREATION_FAILED';
        };

        var roomTypeNotAvailableActions = function() {
            $scope.screenData.scanMode = 'ROOMS_NOT_AVAILABLE';
        };

        var showReservationSummaryScreen = function() {
            $scope.screenData.scanMode = "RESERVATION_CONFIRMATION";
            $scope.screenData.roomSelectionMode = 'MINIMUM_ADR';
            $scope.refreshScroller('room-info');
        };

        $scope.continueBooking = function() {
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            $scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
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
                    response.results[0].skipRoomUpsell = true;
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
                    
                    $state.go('zest_station.checkInReservationDetails', {
                        'previousState': 'WALKIN'
                    });
                } else {
                    reservationSearchFailed();
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
                // loader: 'none',
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

        $scope.createReservation = function() {
            var departureDate = moment(arrivalDate, "YYYY-MM-DD").
            add($scope.idScanData.noOfDays, 'd').
            format("YYYY-MM-DD");

            var params = {
                "arrival_date": arrivalDate,
                "departure_date": departureDate,
                "adults_count": $scope.idScanData.noOfAdults,
                "children_count": $scope.idScanData.noOfChildren,
                "infants_count": $scope.idScanData.noOfInfants,
                "room_type_id": $scope.idScanData.selectedRoomType.id,
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

        var setPageNumberDetails = function() {
            $scope.$emit('hideLoader');
            var itemsPerPage = 3;

            $scope.pageData = zsGeneralSrv.proceesPaginationDetails($scope.availabileRoomList, itemsPerPage, $scope.pageData.pageNumber);
            // once the addons list is set, reset height of the container
            $('#upgrades').css({
                "height": "calc(100% - 230px)"
            });
        };

        $scope.paginationAction = function(disableButtonFlag, isNextPage) {
            disableButtonFlag = true;
            $scope.$emit('showLoader');
            $timeout(function() {
                $scope.pageData.pageNumber = isNextPage ? ++$scope.pageData.pageNumber : --$scope.pageData.pageNumber;
                setPageNumberDetails();
            }, 200);
        };

        var fetchRoomUpsellSuccess = function(response) {

            _.each($scope.availabileRoomList, function(roomType) {
                _.each(response.upsell_amounts, function(upsellData) {
                    if (
                        (($scope.idScanData.selectedRoomType.roomLevel === 1 && parseInt(upsellData.level_from) === 1) ||
                            ($scope.idScanData.selectedRoomType.roomLevel === 2 && parseInt(upsellData.level_from) === 2)) &&
                        ((parseInt(upsellData.level_to) === 2 && roomType.roomLevel === 2) ||
                            (parseInt(upsellData.level_to) === 3 && roomType.roomLevel === 3))
                    ) {
                        roomType.upsellAmount = upsellData.amount;
                    }
                });
            });
        };

        var fetchRoomTypes = function() {
            var fetchRoomtypesSuccess = function(response) {
                var roomTypeList = response.results;

                if (roomTypeList && roomTypeList.length === 0) {
                    roomTypeNotAvailableActions();
                } else {
                    _.each(roomTypeList, function(roomType) {
                        _.each($scope.availabileRoomList, function(availableRoomType) {
                            if (roomType.id === availableRoomType.id) {
                                availableRoomType.desc = roomType.name + ' :   ' + availableRoomType.description;
                                availableRoomType.roomTypeName = roomType.name;
                                availableRoomType.room_type_image = roomType.room_type_image;
                                availableRoomType.description = roomType.description;
                                availableRoomType.roomLevel = roomType.level;
                            }
                        });
                    });
                    if ($scope.zestStationData.kiosk_walkin_flow === 'upsell_oriented') {
                        var minimumAdrRoomType = _.min($scope.availabileRoomList, function(roomType) {
                            return parseFloat(roomType.adr);
                        });

                        $scope.idScanData.selectedRoomType = angular.copy(minimumAdrRoomType);
                        $scope.availabileRoomList = _.filter($scope.availabileRoomList, function(roomType) {
                            return $scope.idScanData.selectedRoomType.id !== roomType.id &&
                                roomType.roomLevel &&
                                roomType.roomLevel > $scope.idScanData.selectedRoomType.roomLevel;
                        });
                    }
                    showReservationSummaryScreen();
                    if ($scope.zestStationData.kiosk_walkin_flow === 'traditional') {
                        setPageNumberDetails();
                    } else {
                        var options = {
                            params: {},
                            successCallBack: fetchRoomUpsellSuccess,
                            failureCallBack: roomTypeNotAvailableActions
                        };
                        $scope.callAPI(zsCheckinSrv.getRoomUpsellSettings, options);
                    }
                    // $scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
                }
            };
            var options = {
                params: {},
                successCallBack: fetchRoomtypesSuccess,
                failureCallBack: roomTypeNotAvailableActions
            };

            $scope.callAPI(zsGeneralSrv.getRoomTypes, options);
        };

        $scope.checkRoomAvailability = function() {
            var departureDate = moment(arrivalDate, "YYYY-MM-DD").
            add($scope.idScanData.noOfDays, 'd').
            format("YYYY-MM-DD");
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
                    var availabileRoomTypes = _.filter(response.results, function(roomType) {
                        return roomType.availability > 0;
                    });

                    if (availabileRoomTypes.length === 0) {
                        roomTypeNotAvailableActions();
                        return;
                    }
                    _.each(availabileRoomTypes, function(roomType) {
                        roomType.adr_details = roomType.adr ? $scope.zestStationData.currencySymbol + $filter('number')(roomType.adr, 2) : '';
                    });
                    $scope.availabileRoomList = _.sortBy(availabileRoomTypes, function(roomType) {
                        return parseFloat(roomType.adr);
                    });
                    fetchRoomTypes();
                }
            };
            var options = {
                params: params,
                successCallBack: fetchAvailabilitySuccess,
                failureCallBack: createReservationFailed
            };

            $scope.callAPI(zsGeneralSrv.getAvailableRatesForTheDay, options);
        };

        $scope.$on('START_CREATING_RESERVATION', $scope.createReservation);

        $scope.acceptID = function() {
            if ($scope.idScanData.verificationMethod === 'FR') {
                $scope.$emit('START_FACIAL_RECOGNITION');
            } else {
                // showReservationSummaryScreen();
                $scope.createReservation();
            }
        };

        $scope.rejectID = function() {
            $scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
            $scope.screenData.imageSide = 0;
            $scope.idScanData.selectedGuest.front_image_data = "";
            $scope.idScanData.selectedGuest.back_image_data = "";
        };

        var fetchHotelBussinessDate = function() {
            var options = {
                params: {},
                successCallBack: function(response) {
                    arrivalDate = response.business_date;
                },
                failureCallBack: createReservationFailed
            };

            $scope.callAPI(zsGeneralSrv.fetchHotelBusinessDate, options);
        };

        $scope.selectRoom = function(roomType) {
            $scope.idScanData.roomDetails = roomType;
            $scope.idScanData.showRoomDetailsPopup = true;
            $scope.refreshScroller('room-details');
        };

        $scope.closeRoomSelection = function() {
            $scope.idScanData.showRoomDetailsPopup = false;
        };

        $scope.roomTypeSelected = function(roomDetails) {
            $scope.idScanData.selectedRoomType = roomDetails;
            $scope.idScanData.showRoomDetailsPopup = false;
        };

        $scope.upgradeSelected = function(roomDetails) {
            $scope.roomTypeSelected(roomDetails);
            $scope.continueBooking();
        };

        $scope.continueFromMinimumAdrRoomType = function() {
            // if there are available rooms in next level proceed to room upsell
            if ($scope.availabileRoomList.length > 0) {
                $scope.screenData.roomSelectionMode = 'ROOM_UPSELL';
                setPageNumberDetails();
            } else {
                // if no upsell is available, just continue with booking reservation
                $scope.continueBooking();
            }
        };

        $scope.continueWithRoomUpsell = function() {
            if ($scope.idScanData.selectedRoomType === $scope.idScanData.roomDetails) {
                $scope.continueBooking();
            }
        };

        $scope.showRoomDetails = function(roomType){
            $scope.idScanData.roomDetails = roomType;
            $scope.screenData.roomSelectionMode = 'ROOM_UPSELL_DETAILS';
            $scope.refreshScroller('upsell-details');
        };

        var onBackButtonClicked = function() {
            if ($scope.screenData.scanMode === 'SELECT_STAY_DETAILS') {
                $scope.navToHome();
            } else if ($scope.screenData.scanMode === 'RESERVATION_CONFIRMATION') {
                if ($scope.zestStationData.kiosk_walkin_flow !== 'traditional' || $scope.availabileRoomList.length == 1) {
                    if ($scope.screenData.roomSelectionMode === 'MINIMUM_ADR') {
                        $scope.screenData.scanMode = 'SELECT_STAY_DETAILS';
                    } else if ($scope.screenData.roomSelectionMode === 'ROOM_UPSELL') {
                        $scope.screenData.roomSelectionMode = 'MINIMUM_ADR';
                    } else if ($scope.screenData.roomSelectionMode === 'ROOM_UPSELL_DETAILS') {
                        $scope.screenData.roomSelectionMode = 'ROOM_UPSELL';
                    }
                } else {
                    $scope.screenData.scanMode = 'SELECT_STAY_DETAILS';
                    $scope.idScanData.selectedRoomType = {};
                }
            }
        };

        (function() {
            zsCheckinSrv.setCurrentReservationIdDetails({});
            // $scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
            $scope.screenData.scanMode = 'SELECT_STAY_DETAILS';
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);
            $scope.idScanData = {
                mode: '',
                selectedGuest: {},
                verificationMethod: zsUtilitySrv.retriveIdScanVerificationMethod($scope.zestStationData.kiosk_scan_mode),
                staffVerified: false,
                screenType: 'WALKIN_RESERVATION',
                noOfNightArray: _.range(1, 6),
                adultsCountArray: _.range(1, 6),
                guestCountArray: _.range(0, 6),
                noOfDays: 1,
                noOfAdults: 1,
                noOfChildren: 0,
                selectedRoomType: {},
                showRoomDetailsPopup: false,
                roomDetails: {}
            };
            $scope.setScroller('confirm-images');
            $scope.setScroller('passport-validate');
            $scope.setScroller('stay-details-validate');
            $scope.setScroller('room-details');
            $scope.setScroller('upsell-details');

            var idCaptureConfig = processCameraConfigs($scope.zestStationData.iOSCameraEnabled, $scope.zestStationData.connectedCameras, $scope.zestStationData.featuresSupportedInIosApp);

            $scope.setScroller('room-info');
            $scope.setConfigurations(idCaptureConfig);
            fetchHotelBussinessDate();
            $scope.pageData = zsGeneralSrv.retrievePaginationStartingData();
            setPageNumberDetails();
        })();
    }
]);