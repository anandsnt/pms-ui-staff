angular.module('sntRover')
    .controller('rvNightlyDiaryMainController',
        ['$scope',
            '$rootScope',
            '$state',
            '$stateParams',
            '$filter',
            'roomsList',
            'datesList',
            'ngDialog',
            '$timeout',
            'reservationsList',
            'RVNightlyDiarySrv',
            'unassignedReservationList',
            function (
                $scope,
                $rootScope,
                $state,
                $stateParams,
                $filter,
                roomsList,
                datesList,
                ngDialog,
                $timeout,
                reservationsList,
                RVNightlyDiarySrv,
                unassignedReservationList
            ) {

                BaseCtrl.call(this, $scope);
                // CICO-36654 fix for touch events not getting detected iPad.
                document.removeEventListener('touchmove', window.touchmovepreventdefault, false);
                document.removeEventListener('touchmove', window.touchmovestoppropogate, false);
                $scope.$on('$destroy', function () {
                    document.addEventListener('touchmove', window.touchmovepreventdefault, false);
                    document.addEventListener('touchmove', window.touchmovestoppropogate, false);
                });
                var isFromStayCard = $stateParams.origin === 'STAYCARD',
                    MAX_NO_OF_DAYS = 21;

                /*
                 * utility method Initiate controller
                 * @return {}
                 */
                var initiateBasicConfig = function () {
                    $scope.heading = $filter('translate')('MENU_ROOM_DIARY');
                    $scope.setTitle($filter('translate')('MENU_ROOM_DIARY'));
                    $scope.$emit('updateRoverLeftMenu', 'nightlyDiaryReservation');

                    var srvParams = {};

                    if (isFromStayCard) {
                        srvParams = RVNightlyDiarySrv.getCache();
                    }
                    else {
                        if ($stateParams.start_date) {
                            srvParams.start_date = moment(tzIndependentDate($stateParams.start_date))
                                .format($rootScope.momentFormatForAPI);
                        }
                        else {
                            srvParams.start_date = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days')
                                .format($rootScope.momentFormatForAPI);
                        }
                        srvParams.no_of_days = 7;
                        srvParams.page = 1;
                        srvParams.per_page = 50;
                    }

                    // data set for diary used for Angular code.
                    $scope.diaryData = {
                        datesGridData: datesList,
                        businessDate: $rootScope.businessDate,
                        diaryRoomsList: roomsList.rooms,
                        numberOfDays: srvParams.no_of_days,
                        fromDate: srvParams.start_date,
                        arrivalDate: $rootScope.businessDate,
                        toDate: '',
                        paginationData: {
                            perPage: 50,
                            page: srvParams.page,
                            totalCount: roomsList.total_count
                        },
                        hasMultipleMonth: false,
                        firstMonthDateList: [],
                        secondMonthDateList: [],
                        reservationsList: reservationsList,
                        unassignedReservationList: unassignedReservationList,
                        hasOverlay: false,
                        isEditReservationMode: isFromStayCard,
                        hideMoveButton: false,
                        showUnassignedPanel: false,
                        showUnassignedReservations: false,
                        innerWidth: screen.width,
                        selectedRoomTypes: [],
                        selectedFloors: [],
                        isFromStayCard: false,
                        filterList: {},
                        hideRoomType: true,
                        hideFloorList: true,
                        isBookRoomViewActive: false,
                        availableSlotsForBookRooms: [],
                        isAssignRoomViewActive: false,
                        isMoveRoomViewActive: false,
                        showSaveChangeButtonAfterShortenOrExtent: {
                            arrivalChanged: false,
                            departureChanged: false,
                            show: false
                        },
                        availableSlotsForAssignRooms: {
                            availableRoomList: [],
                            fromDate: null,
                            nights: null
                        }
                    };
                    $scope.currentSelectedReservation = {};
                    $scope.currentSelectedRoom = {};
                };

                initiateBasicConfig();
                /**
                 * method to get Pagination parametrs
                 * @return {Object} with pagination params
                 */
                var getPaginationParams = function (offset) {
                    return {
                        per_page: $scope.diaryData.paginationData.perPage,
                        page: offset ? $scope.diaryData.paginationData.page + offset : $scope.diaryData.paginationData.page,
                        total_count: $scope.diaryData.paginationData.totalCount
                    };
                };

                /**
                 * method to update Pagination parametrs
                 */
                var handlePaginationData = function (data) {
                    $scope.diaryData.paginationData.totalCount = data.roomList.total_count;
                    $scope.diaryData.paginationData.page = data.roomList.page_number;
                };

                // Method to update room list data.
                var fetchRoomListDataAndReservationListData = function (roomId, offset) {
                    var successCallBackFetchRoomList = function (data) {
                        $scope.diaryData.diaryRoomsList = data.roomList.rooms;
                        $scope.diaryData.reservationsList = data.reservationList;
                        handlePaginationData(data);
                        $scope.diaryData.datesGridData = data.dateList;
                        $scope.$broadcast('FETCH_COMPLETED_DATE_LIST_DATA');
                        if ($scope.diaryData.isBookRoomViewActive) {
                            callbackForBookedOrAvailableListner();
                        }
                        else {
                            updateDiaryView();
                        }
                        if (roomId) {
                            $scope.$broadcast('CLOSE_SEARCH_RESULT');
                        }
                    },
                        postData = {
                            ...getPaginationParams(offset),
                            'start_date': $scope.diaryData.fromDate,
                            'no_of_days': $scope.diaryData.numberOfDays,
                            'selected_room_type_ids': $scope.diaryData.selectedRoomTypes,
                            'selected_floor_ids': $scope.diaryData.selectedFloors
                        };

                    if ($scope.diaryData.isAssignRoomViewActive || $scope.diaryData.isMoveRoomViewActive) {
                        var roomTypeId = $scope.diaryData.availableSlotsForAssignRooms.roomTypeId;

                        postData.selected_room_type_ids = [roomTypeId];
                        postData.page = 1;
                    }

                    if (roomId) {
                        postData.room_id = roomId;
                        $scope.diaryData.selectedRoomId = roomId;
                    }

                    var options = {
                        params: postData,
                        successCallBack: successCallBackFetchRoomList
                    };

                    $scope.callAPI(RVNightlyDiarySrv.fetchRoomsListAndReservationList, options);
                };

                /*
                 * Handle Next Button in Dairy.
                 * @return {}
                 */
                var goToPrevPage = () => {
                    cancelReservationEditing();
                    fetchRoomListDataAndReservationListData(null, -1);
                };

                /*
                 * Handle Prev Button in Dairy.
                 * @return {}
                 */
                var goToNextPage = () => {
                    cancelReservationEditing();
                    fetchRoomListDataAndReservationListData(null, 1);
                };

                var showReservationSelected = function () {
                    var dispatchData = {
                        type: 'RESERVATION_SELECTED',
                        selectedReservationId: $scope.currentSelectedReservation.id,
                        reservationsList: $scope.diaryData.reservationsList.rooms,
                        selectedRoomId: $scope.diaryData.selectedRoomId,
                        currentSelectedReservation: $scope.currentSelectedReservation
                    };

                    store.dispatch(dispatchData);
                };

                /*
                 * Show selected reservation highlighted and enable edit bar
                 * @param reservation - Current selected reservation
                 */
                var selectReservation = (e, reservation, room) => {
                    $scope.diaryData.showSaveChangeButtonAfterShortenOrExtent.show = false;
                    $scope.diaryData.hideMoveButton = reservation.no_room_move;
                    $scope.diaryData.hideUnassignRoomButton = reservation.status === 'CHECKEDIN' || reservation.status === 'CHECKEDOUT';
                    $scope.diaryData.isEditReservationMode = true;
                    $scope.currentSelectedReservation = reservation;
                    $scope.currentSelectedRoom = room;
                    $scope.diaryData.selectedRoomId = room.id;
                    $scope.extendShortenReservationDetails = {
                        'arrival_date': reservation.arrival_date,
                        'dep_date': reservation.dept_date,
                        'reservation_id': reservation.id,
                        'room_number': (_.findWhere($scope.diaryData.diaryRoomsList, { id: room.id })).room_no
                    };

                    showReservationSelected();
                    $timeout(function () {
                        $scope.$apply();
                    }, 10);
                };

                var resetUnassignedList = function () {
                    $scope.diaryData.isAssignRoomViewActive = false;
                    $scope.$broadcast('RESET_UNASSIGNED_LIST_SELECTION');
                    $scope.diaryData.availableSlotsForAssignRooms = {};
                };

                var hideAssignOrMoveRoomSlots = function() {
                    $scope.diaryData.isMoveRoomViewActive = false;
                    $scope.diaryData.availableSlotsForAssignRooms = {};
                    cancelReservationEditing();
                    fetchRoomListDataAndReservationListData();
                };

                /*
                 *  Handle API call to update reservation MOVE or ASSIGN
                 *  @param {object}  [roomDetails - Current selected room details]
                 *  @param {object}  [reservationDetails - Current selected reservation details]
                 *  @param {string}  [type - 'MOVE' or 'ASSIGN']
                 *  @return {}
                 */
                var callAPIforAssignOrMoveRoom = function( roomDetails, reservationDetails, type, timeObj) {
                    var successCallBackAssignRoom = function () {
                        $scope.errorMessage = '';
                        if (type === 'ASSIGN') {
                            $scope.$broadcast('SUCCESS_ROOM_ASSIGNMENT', roomDetails);
                        }
                        else if (type === 'MOVE') {
                            hideAssignOrMoveRoomSlots();
                        }
                        if (timeObj) {
                            ngDialog.close();
                        }
                    },
                    postData = {
                        "reservation_id": reservationDetails.reservationId,
                        "room_number": roomDetails.room_number,
                        "without_rate_change": true,
                        "is_preassigned": true,
                        "forcefully_assign_room": false,
                        "is_from_nightly_diary": true
                    };

                    if (timeObj) {
                        postData.arrival_time = timeObj.arrival_time;
                        postData.departure_time = timeObj.departure_time;
                    }

                    var options = {
                        params: postData,
                        successCallBack: successCallBackAssignRoom
                    };

                    $scope.callAPI(RVNightlyDiarySrv.assignRoom, options);
                };

                /*
                 *  Show DiarySetTimePopup.
                 *  @param {object} [roomDetails - Current selected room details]
                 *  @param {object} [reservationDetails - Current selected reservation details]
                 *  @param {string}  [type - 'MOVE' or 'ASSIGN']
                 *  @return {}
                 */
                var showDiarySetTimePopup = function(roomDetails, reservationDetails, type) {

                    $scope.setTimePopupData = {
                        type: type,
                        roomDetails: roomDetails,
                        reservationDetails: reservationDetails,
                        data: {},
                        processData: [],
                        isContinueBookPopup: false
                    };

                    var triggerSetTimePopup = function() {
                        ngDialog.open({
                            template: '/assets/partials/nightlyDiary/rvNightlyDiarySetTimePopup.html',
                            scope: $scope,
                            className: '',
                            closeByDocument: false,
                            closeByEscape: false,
                            controller: 'rvNightlyDiarySetTimePopupCtrl'
                        });
                    },
                    showPopupForReservationWithUnassignedRoom = function() {
                        ngDialog.open({
                            template: '/assets/partials/nightlyDiary/rvNightlyDiaryReservationWithUnassignedRoom.html',
                            scope: $scope,
                            className: '',
                            closeByDocument: false,
                            closeByEscape: false
                        });
                    };

                    var successCallBackFetchAvailableTimeSlots = function (data) {
                        $scope.setTimePopupData.data = data;
                        var isNightlyHotel = !$rootScope.hotelDiaryConfig.hourlyRatesForDayUseEnabled,
                            diaryMode = $rootScope.hotelDiaryConfig.mode;

                        if (type === 'BOOK' && isNightlyHotel) {
                            // Navigation directly to Reservation Creation Screen if Nightly diary.
                            $state.go('rover.reservation.search', {
                                selectedArrivalDate: $scope.setTimePopupData.reservationDetails.fromDate,
                                selectedRoomTypeId: $scope.setTimePopupData.roomDetails.roomTypeId,
                                selectedRoomId: $scope.setTimePopupData.roomDetails.room_id,
                                selectedRoomNo: $scope.setTimePopupData.roomDetails.roomNo,
                                startDate: $scope.diaryData.startDate,
                                fromState: 'NIGHTLY_DIARY'
                            });
                        }
                        else if (type === 'BOOK' && (diaryMode === 'FULL' || diaryMode === 'LIMITED')) {
                            if (data.is_unassigned_reservations_exist && data.room_type_availability <= 0) {
                                // There are reservations with unassigned Rooms.
                                showPopupForReservationWithUnassignedRoom();
                            }
                            else if (data.is_unassigned_reservations_exist) {
                                $scope.setTimePopupData.isContinueBookPopup = true;
                                triggerSetTimePopup();
                            }
                            else {
                                $scope.setTimePopupData.isContinueBookPopup = false;
                                triggerSetTimePopup();
                            }
                        }

                        // Handle ASSIGN/MOVE button click handle.
                        if ((type === 'ASSIGN' || type === 'MOVE') && data.is_overlapping_reservations_exists) {
                            triggerSetTimePopup();
                        }
                        else if ((type === 'ASSIGN' || type === 'MOVE') && !data.is_overlapping_reservations_exists) {
                            callAPIforAssignOrMoveRoom(roomDetails, reservationDetails, type);
                        }
                    },
                    postData = {
                        "room_id": roomDetails.room_id,
                        "start_date": reservationDetails.fromDate,
                        "no_of_days": MAX_NO_OF_DAYS
                    };

                    if (type === 'ASSIGN' || type === 'MOVE') {
                        postData.reservation_id = reservationDetails.reservationId;
                        postData.no_of_days = reservationDetails.nights;
                    }

                    var options = {
                        params: postData,
                        successCallBack: successCallBackFetchAvailableTimeSlots
                    };

                    // API call to get available slots.
                    $scope.callAPI(RVNightlyDiarySrv.fetchAvailableTimeSlots, options);
                };

                /*
                 *  Handle ASSIGN button click.
                 *  @param {object} [roomDetails - Current selected room details]
                 *  @param {object} [reservationDetails - Current selected reservation details]
                 *  @return {}
                 */
                var clickedAssignRoom = (roomDetails, reservationDetails) => {
                    showDiarySetTimePopup(roomDetails, reservationDetails, 'ASSIGN');
                };

                /*
                 * Set time from rvNightlyDiarySetTimePopup.
                 */
                $scope.addListener('SET_TIME_AND_SAVE', function ( e, timeObj) {
                    if ($scope.setTimePopupData.type === 'BOOK') {
                        ngDialog.close();
                        // Navigation to Reservation Creation Screen.
                        $state.go('rover.reservation.search', {
                            selectedArrivalDate: $scope.setTimePopupData.reservationDetails.fromDate,
                            selectedRoomTypeId: $scope.setTimePopupData.roomDetails.roomTypeId,
                            selectedRoomId: $scope.setTimePopupData.roomDetails.room_id,
                            selectedRoomNo: $scope.setTimePopupData.roomDetails.roomNo,
                            startDate: $scope.diaryData.startDate,
                            fromState: 'NIGHTLY_DIARY',
                            selectedArrivalTime: timeObj.arrival_time,
                            selectedDepartureTime: timeObj.departure_time,
                            numNights: timeObj.numNights
                        });
                    }
                    else {
                        callAPIforAssignOrMoveRoom($scope.setTimePopupData.roomDetails, $scope.setTimePopupData.reservationDetails, $scope.setTimePopupData.type, timeObj);
                    }
                });

                /*
                 *  Handle MOVE TO button click.
                 *  @param {object} [roomDetails - Current selected room details]
                 *  @param {object} [reservationDetails - Current selected reservation details]
                 *  @return {}
                 */
                var clickedMoveRoom = (roomDetails, reservationDetails) => {
                    showDiarySetTimePopup(roomDetails, reservationDetails, 'MOVE');
                };

                // Handle book room button actions.
                var clickedBookRoom = (roomId, date, roomsList) => {
                    var roomTypeId = _.where(roomsList, { id: roomId })[0].room_type_id,
                        roomNo = _.where(roomsList, { id: roomId })[0].room_no;

                    var roomDetails = {
                        room_id: roomId,
                        roomNo: roomNo,
                        roomTypeId: roomTypeId
                    },
                    reservationDetails = {
                        fromDate: date
                    };

                    showDiarySetTimePopup(roomDetails, reservationDetails, 'BOOK');
                };

                /*
                 * Show Stay Changes validation popup.
                 */
                var openMessagePopupForValidationStayChanges = function () {
                    ngDialog.open({
                        template: '/assets/partials/nightlyDiary/rvNightlyDiaryValidateStayChanges.html',
                        scope: $scope,
                        className: '',
                        closeByDocument: false,
                        closeByEscape: false,
                        controller: 'rvNightlyDiaryValidationStayCtrl'
                    });
                };

                /*
                 * Function to check room availability.
                 */
                var checkReservationAvailability = (arrivalDate, departureDate) => {
                    let successCallBackStayChanges = function (response) {

                        $scope.popupData = {
                            data: response,
                            showOverBookingButton: false,
                            message: ''
                        };
                        let proceedSave = false;

                        if (response.is_room_available && response.message === '') {
                            // Proceed without any popup, save changes and updated.
                            proceedSave = true;
                        }
                        else if (!response.is_room_available || !response.is_no_restrictions_exist || (response.is_group_reservation && !response.is_group_available) || !response.is_rate_available) {
                            // Show popup
                            // Show message
                            // No overbooking button
                            $scope.popupData.message = response.message;
                            openMessagePopupForValidationStayChanges();
                        }
                        else {
                            // Show popup
                            // Show message
                            // overbooking button
                            $scope.popupData.message = response.message;
                            $scope.popupData.showOverBookingButton = true;
                            proceedSave = true;
                            openMessagePopupForValidationStayChanges();
                        }

                        if (proceedSave) {
                            $scope.extendShortenReservationDetails = {
                                'arrival_date': moment(arrivalDate, $rootScope.dateFormat.toUpperCase())
                                    .format('YYYY-MM-DD'),
                                'dep_date': moment(departureDate, $rootScope.dateFormat.toUpperCase())
                                    .format('YYYY-MM-DD'),
                                'reservation_id': $scope.currentSelectedReservation.id,
                                'room_number': $scope.currentSelectedReservation.room_no
                            };
                        }
                    };

                    let options = {
                        params: {
                            'new_arrival_date': moment(arrivalDate, $rootScope.dateFormat.toUpperCase())
                                .format('YYYY-MM-DD'),
                            'new_dep_date': moment(departureDate, $rootScope.dateFormat.toUpperCase())
                                .format('YYYY-MM-DD'),
                            'reservation_id': $scope.currentSelectedReservation.id,
                            'room_id': $scope.currentSelectedRoom.id
                        },
                        successCallBack: successCallBackStayChanges
                    };

                    $scope.callAPI(RVNightlyDiarySrv.validateStayChanges, options);
                };

                /*
                 * Function to cancel message popup.
                 */
                $scope.closeDialog = function () {
                    cancelReservationEditing();
                    ngDialog.close();
                };
                /*
                 * Function to save editing of a reservation
                 */
                var saveReservationEditing = function () {
                    let successCallBack = function () {
                        cancelReservationEditing();
                        $timeout(function () {
                            fetchRoomListDataAndReservationListData();
                        }, 700);
                    };

                    $scope.invokeApi(RVNightlyDiarySrv.confirmUpdates,
                        $scope.extendShortenReservationDetails,
                        successCallBack);
                };

                /*
                 * Show selected reservation highlighted and enable edit bar
                 * @param reservation - Current selected reservation
                 */
                var extendShortenReservation = (newArrivalPosition, newDeparturePosition) => {

                    var dispatchData = {
                        type: 'EXTEND_SHORTEN_RESERVATION',
                        newArrivalPosition: newArrivalPosition,
                        newDeparturePosition: newDeparturePosition
                    };

                    store.dispatch(dispatchData);
                };

                /*
                 * Function to cancel editing of a reservation
                 */
                var cancelReservationEditing = function () {
                    if ($scope.diaryData.isEditReservationMode) {
                        $scope.diaryData.isEditReservationMode = false;
                        $scope.currentSelectedReservation = {};
                        var dispatchData = {
                            type: 'CANCEL_RESERVATION_EDITING',
                            reservationsList: $scope.diaryData.reservationsList.rooms,
                            paginationData: angular.copy($scope.diaryData.paginationData),
                            currentSelectedReservation: $scope.currentSelectedReservation
                        };

                        store.dispatch(dispatchData);
                    }
                };

                /*
                 * Function to show/hide change save after extend/shorten reservation
                 */
                var showOrHideSaveChangesButton = function (bool, isArrival) {
                    if (isArrival) {
                        $scope.diaryData.showSaveChangeButtonAfterShortenOrExtent.arrivalChanged = bool;
                    }
                    else {
                        $scope.diaryData.showSaveChangeButtonAfterShortenOrExtent.departureChanged = bool;
                    }
                    if ( $scope.diaryData.showSaveChangeButtonAfterShortenOrExtent.arrivalChanged || $scope.diaryData.showSaveChangeButtonAfterShortenOrExtent.departureChanged) {
                        $scope.diaryData.showSaveChangeButtonAfterShortenOrExtent.show = true;
                    }
                    else {
                        $scope.diaryData.showSaveChangeButtonAfterShortenOrExtent.show = false;
                    }
                };

                /*
                 * Cancel button click edit bar
                 */
                $scope.addListener('CANCEL_RESERVATION_EDITING', function () {
                    cancelReservationEditing();
                });
                /*
                 * Save button click edit bar
                 */
                $scope.addListener('SAVE_RESERVATION_EDITING', function () {
                    saveReservationEditing();
                    if (!!$scope.popupData && !$scope.popupData.disableOverBookingButton) {
                        ngDialog.close();                        
                    }
                });

                /* Handle event emitted from child controllers.
                 * To update diary data - rooms & reservations according to changed date constraints.
                 * @param {Number} RoomId - selected room id from search filters.
                */
                $scope.addListener('UPDATE_RESERVATIONLIST', function (event, roomId) {
                    if (!!roomId) {
                        $scope.$broadcast('RESET_RIGHT_FILTER_BAR');
                    }
                    cancelReservationEditing();
                    fetchRoomListDataAndReservationListData(roomId);
                });

                $scope.addListener('UPDATE_UNASSIGNED_RESERVATIONLIST', function (event, action) {
                    resetUnassignedList();
                    if (action !== 'REFRESH') {
                        $scope.diaryData.arrivalDate = ($scope.diaryData.fromDate <= $rootScope.businessDate || action === 'RESET') ? $rootScope.businessDate : $scope.diaryData.fromDate;
                    }
                    $scope.$broadcast('FETCH_UNASSIGNED_LIST_DATA');
                    $scope.$broadcast('RESET_UNASSIGNED_LIST_SELECTION');
                });

                /* Handle event emitted from child controllers.
                 * To refresh diary data - rooms & reservations.
                 * @param {Number} RoomId - selected room id from search filters.
                */
                $scope.addListener('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', function (event, roomId) {
                    $scope.$broadcast('RESET_RIGHT_FILTER_BAR');
                    cancelReservationEditing();
                    fetchRoomListDataAndReservationListData(roomId);
                });

                /*
                 * Handle event emitted from child controller.
                 * To refresh diary data - rooms and reservations after applying filter.
                 */
                $scope.addListener('REFRESH_DIARY_SCREEN', function () {
                    $scope.diaryData.paginationData.page = 1;
                    fetchRoomListDataAndReservationListData();
                    cancelReservationEditing();
                });

                /*
                 *  Handle event emitted from child controller.
                 *  When clicking Unassigned filter button.
                 *  Reset filter selections and,
                 *  Refresh diary data - rooms and reservations after applying filter.
                 */
                $scope.addListener('RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY', function () {
                    resetUnassignedList();
                    $scope.$broadcast('RESET_RIGHT_FILTER_BAR');
                    $scope.diaryData.paginationData.page = 1;
                    fetchRoomListDataAndReservationListData();
                    cancelReservationEditing();
                });

                /* 
                 *  To Show 'ASSIGN' or 'MOVE' room button in Diary.
                 *  {object} [event]
                 *  {object} [avaialble slots for ASSIGN/MOVE - data object]
                 */
                $scope.addListener('SHOW_ASSIGN_ROOM_SLOTS', function (event, newData) {
                    if (newData.type === 'MOVE_ROOM') {
                        $scope.diaryData.isMoveRoomViewActive = true;
                    }
                    else if (newData.type === 'ASSIGN_ROOM') {
                        $scope.diaryData.isAssignRoomViewActive = true;
                    }
                    $scope.diaryData.availableSlotsForAssignRooms = newData;
                    fetchRoomListDataAndReservationListData();
                });

                /*  
                 *  To Hide 'ASSIGN' or 'MOVE' room button in Diary.
                 */
                $scope.addListener('HIDE_ASSIGN_ROOM_SLOTS', function () {
                    $scope.diaryData.isAssignRoomViewActive = false;
                    $scope.diaryData.isMoveRoomViewActive = false;
                    $scope.diaryData.availableSlotsForAssignRooms = {};
                    fetchRoomListDataAndReservationListData();
                });
                /*  
                 *  To Hide 'ASSIGN' or 'MOVE' room button in Diary.
                 */
                $scope.addListener('SHOW_ERROR_MESSAGE', function (event, errorMessage) {
                    ngDialog.open({
                        template: '/assets/partials/nightlyDiary/rvNightlyDiaryErrorMessage.html',
                        scope: $scope,
                        className: '',
                        closeByDocument: false,
                        closeByEscape: false,
                        data: {
                            errorMessage: errorMessage
                        }
                    });
                });
                /**
                 * utility method to call available slots API
                 */
                var callbackForBookedOrAvailableListner = function () {
                    if ($scope.diaryData.isBookRoomViewActive) {
                        $scope.diaryData.rightFilter = 'RESERVATION_FILTER';
                        var successCallBackFunction = function (response) {
                            $scope.errorMessage = '';
                            $scope.diaryData.availableSlotsForBookRooms = response;
                            if ($scope.diaryData.availableSlotsForAssignRooms.hasOwnProperty('reservationId')) {
                                // Reset unassigned reservation list selection.
                                resetUnassignedList();
                                // fetch full data (res,room lists) as before it was filtered with room type id
                                fetchRoomListDataAndReservationListData();
                            }
                            else {
                                updateDiaryView();
                            }
                        };

                        let options = {
                            params: {
                                start_date: $scope.diaryData.fromDate,
                                no_of_days: $scope.diaryData.numberOfDays,
                                page: $scope.diaryData.paginationData.page,
                                per_page: $scope.diaryData.paginationData.perPage,
                                selected_room_type_ids: $scope.diaryData.selectedRoomTypes,
                                selected_floor_ids: $scope.diaryData.selectedFloors
                            },
                            successCallBack: successCallBackFunction
                        };

                        $scope.callAPI(RVNightlyDiarySrv.retrieveAvailableFreeSlots, options);
                    }
                    else {
                        fetchRoomListDataAndReservationListData();
                    }
                };

                /* Handle event emitted from child controllers.
                 * To toggle available and booked.
                 */
                $scope.addListener('TOGGLE_BOOKED_AVAIALBLE', callbackForBookedOrAvailableListner);

                /**
                 * utility method to pass callbacks from
                 * @return {Object} with callbacks
                 */
                const getTheCallbacksFromAngularToReact = () => {
                    return {
                        goToPrevPage,
                        goToNextPage,
                        selectReservation,
                        extendShortenReservation,
                        checkReservationAvailability,
                        clickedAssignRoom,
                        clickedMoveRoom,
                        clickedBookRoom,
                        showOrHideSaveChangesButton
                    };
                };

                var mapCachedDataFromSrv = function () {
                    var params = RVNightlyDiarySrv.getCache();

                    $scope.currentSelectedReservationId = params.currentSelectedReservationId;
                    $scope.diaryData.selectedRoomId = params.currentSelectedRoomId;
                    $scope.currentSelectedReservation = params.currentSelectedReservation;
                    if ((!!params.selected_floor_ids && params.selected_floor_ids.length > 0) || (!!params.selected_room_type_ids && params.selected_room_type_ids.length > 0)) {
                        $scope.diaryData.isFromStayCard = true;
                        $scope.diaryData.filterList = params.filterList;
                        $scope.diaryData.selectedRoomCount = params.selectedRoomCount;
                        $scope.diaryData.selectedFloorCount = params.selectedFloorCount;
                        $scope.diaryData.hideRoomType = params.hideRoomType;
                        $scope.diaryData.hideFloorList = params.hideFloorList;
                    }
                };

                if (isFromStayCard) {
                    mapCachedDataFromSrv();
                }

                // CICO-59170 : When coming back from RESERVATION_BASE_SEARCH screen
                // Enable Avaialble Book slot mode.
                if ($stateParams.origin === 'RESERVATION_BASE_SEARCH') {
                    $scope.diaryData.isBookRoomViewActive = true;
                    callbackForBookedOrAvailableListner();
                }

                // Initial State
                var initialState = {
                    roomsList: roomsList.rooms,
                    reservationsList: reservationsList.rooms,
                    availableSlotsForAssignRooms: {},
                    isAssignRoomViewActive: false,
                    isMoveRoomViewActive: false,
                    diaryInitialDayOfDateGrid: $scope.diaryData.fromDate,
                    numberOfDays: $scope.diaryData.numberOfDays,
                    currentBusinessDate: $rootScope.businessDate,
                    callBackFromAngular: getTheCallbacksFromAngularToReact(),
                    paginationData: $scope.diaryData.paginationData,
                    selectedReservationId: $scope.currentSelectedReservationId,
                    selectedRoomId: $scope.diaryData.selectedRoomId,
                    isFromStayCard: isFromStayCard,
                    currentSelectedReservation: $scope.currentSelectedReservation,
                    dateFormat: $rootScope.dateFormat,
                    isPmsProductionEnvironment: $rootScope.isPmsProductionEnv
                };

                const store = configureStore(initialState);
                const { render } = ReactDOM;
                const { Provider } = ReactRedux;

                // angular method to update diary view via react dispatch method.
                var updateDiaryView = function () {
                    var dispatchData = {
                        type: 'DIARY_VIEW_CHANGED',
                        numberOfDays: $scope.diaryData.numberOfDays,
                        reservationsList: $scope.diaryData.reservationsList.rooms,
                        isAssignRoomViewActive: $scope.diaryData.isAssignRoomViewActive,
                        isMoveRoomViewActive: $scope.diaryData.isMoveRoomViewActive,
                        availableSlotsForAssignRooms: $scope.diaryData.availableSlotsForAssignRooms,
                        isBookRoomViewActive: $scope.diaryData.isBookRoomViewActive,
                        availableSlotsForBookRooms: $scope.diaryData.availableSlotsForBookRooms,
                        roomsList: $scope.diaryData.diaryRoomsList,
                        diaryInitialDayOfDateGrid: $scope.diaryData.fromDate,
                        currentBusinessDate: $rootScope.businessDate,
                        callBackFromAngular: getTheCallbacksFromAngularToReact(),
                        paginationData: $scope.diaryData.paginationData,
                        selectedReservationId: $scope.currentSelectedReservation.id,
                        selectedRoomId: $scope.diaryData.selectedRoomId
                    };

                    store.dispatch(dispatchData);
                };

                /*
                 * to render the grid view
                 */
                var renderDiaryView = () => render(
                    <Provider store={store}>
                        <NightlyDiaryRootContainer />
                    </Provider>,
                    document.querySelector('#nightlyDiaryMain')
                );

                /**
                 * initialisation function
                 */
                (() => {
                    renderDiaryView();
                })();
            }]);
