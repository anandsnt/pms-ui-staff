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
                    listeners = {};

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
                        srvParams.start_date = moment(tzIndependentDate($stateParams.start_date)).subtract(1, 'days')
                            .format($rootScope.momentFormatForAPI);
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
                        isEditReservationMode: false,
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

                    if ($scope.diaryData.isAssignRoomViewActive) {
                        var roomTypeId = $scope.diaryData.availableSlotsForAssignRooms.roomTypeId;

                        postData.selected_room_type_ids = [roomTypeId];
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

                // Method to fetch Unassigned reservations list.
                var fetchUnassignedReservationList = function () {
                    var successCallBackFetchList = function (data) {
                        $scope.errorMessage = '';
                        $scope.diaryData.unassignedReservationList = data;
                    },
                        postData = {
                            'start_date': $scope.diaryData.fromDate,
                            'no_of_days': $scope.diaryData.numberOfDays,
                            'businessDate': $rootScope.businessDate
                        },
                        options = {
                            params: postData,
                            successCallBack: successCallBackFetchList
                        };

                    $scope.callAPI(RVNightlyDiarySrv.fetchUnassignedRoomList, options);
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
                    var srvParams = {};

                    $scope.diaryData.showSaveChangeButtonAfterShortenOrExtent.show = false;

                    if (!$scope.diaryData.isEditReservationMode) {
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
                        if (!isFromStayCard) {
                            $scope.$apply();
                        } else {
                            // To fix issue point 3 - QA failed comment - CICO-34410
                            srvParams = RVNightlyDiarySrv.getCache();
                            // Selection not showing top bar after unassigning reservation from room assignment
                            if (srvParams.currentSelectedReservationId === '') {
                                $scope.$apply();
                            }
                        }
                    }
                };

                var resetUnassignedList = function () {
                    $scope.diaryData.isAssignRoomViewActive = false;
                    $scope.$broadcast('RESET_UNASSIGNED_LIST_SELECTION');
                    $scope.diaryData.availableSlotsForAssignRooms = {};
                };

                /*
                 * Handle ASSIGN button click.
                 * @param roomDetails - Current selected room details
                 * @param reservationDetails - Current selected reservation details
                 * @return {}
                 */
                var unAssignedRoomSelect = (roomDetails, reservationDetails) => {
                    var successCallBackAssignRoom = function () {
                        $scope.errorMessage = '';
                        $scope.$broadcast('SUCCESS_ROOM_ASSIGNMENT', roomDetails);
                    },
                        postData = {
                            "reservation_id": reservationDetails.reservationId,
                            "room_number": roomDetails.room_number,
                            "without_rate_change": true,
                            "is_preassigned": false,
                            "forcefully_assign_room": false
                        },
                        options = {
                            params: postData,
                            successCallBack: successCallBackAssignRoom
                        };

                    $scope.callAPI(RVNightlyDiarySrv.assignRoom, options);
                };

                // Handle book room button actions.
                var clickedBookRoom = (roomId, date, roomsList) => {
                    var roomTypeId = _.where(roomsList, { id: roomId })[0].room_type_id,
                        roomNo = _.where(roomsList, { id: roomId })[0].room_no;

                    $state.go('rover.reservation.search', {
                        selectedArrivalDate: date,
                        selectedRoomTypeId: roomTypeId,
                        selectedRoomId: roomId,
                        selectedRoomNo: roomNo,
                        startDate: $scope.diaryData.startDate,
                        fromState: 'NIGHTLY_DIARY'
                    });
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
                var checkReservationAvailability = (arrivalDate, DepartureDate) => {
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
                            openMessagePopupForValidationStayChanges();
                        }

                        if (proceedSave) {
                            $scope.extendShortenReservationDetails = {
                                'arrival_date': moment(arrivalDate, $rootScope.dateFormat.toUpperCase())
                                    .format('YYYY-MM-DD'),
                                'dep_date': moment(DepartureDate, $rootScope.dateFormat.toUpperCase())
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
                            'new_dep_date': moment(DepartureDate, $rootScope.dateFormat.toUpperCase())
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
                * Show messages
                */
                var openMessagePopup = function () {
                    ngDialog.open({
                        template: '/assets/partials/nightlyDiary/rvNightlyDiaryMessages.html',
                        scope: $scope,
                        closeByDocument: true
                    });
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
                listeners['CANCEL_RESERVATION_EDITING'] = $scope.$on("CANCEL_RESERVATION_EDITING", function () {
                    cancelReservationEditing();
                });
                /*
                 * Save button click edit bar
                 */
                listeners['SAVE_RESERVATION_EDITING'] = $scope.$on("SAVE_RESERVATION_EDITING", function () {
                    saveReservationEditing();
                    console.log("save and close popup");
                    if (!!$scope.popupData && !$scope.popupData.disableOverBookingButton) {
                        ngDialog.close();                        
                    }
                });

                /* Handle event emitted from child controllers.
                 * To update diary data - rooms & reservations according to changed date constraints.
                 * @param {Number} RoomId - selected room id from search filters.
                */
                listeners['UPDATE_RESERVATIONLIST'] = $scope.$on('UPDATE_RESERVATIONLIST', function (event, roomId) {
                    if (!!roomId) {
                        $scope.$broadcast('RESET_RIGHT_FILTER_BAR');
                    }
                    cancelReservationEditing();
                    fetchRoomListDataAndReservationListData(roomId);
                });

                listeners['UPDATE_UNASSIGNED_RESERVATIONLIST'] = $scope.$on('UPDATE_UNASSIGNED_RESERVATIONLIST', function () {
                    resetUnassignedList();
                    fetchUnassignedReservationList();
                    $scope.$broadcast('RESET_UNASSIGNED_LIST_SELECTION');
                });

                /* Handle event emitted from child controllers.
                 * To refresh diary data - rooms & reservations.
                 * @param {Number} RoomId - selected room id from search filters.
                */
                listeners['REFRESH_DIARY_ROOMS_AND_RESERVATIONS'] = $scope.$on('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', function (event, roomId) {
                    $scope.$broadcast('RESET_RIGHT_FILTER_BAR');
                    cancelReservationEditing();
                    fetchRoomListDataAndReservationListData(roomId);
                });

                /*
                 * Handle event emitted from child controller.
                 * To refresh diary data - rooms and reservations after applying filter.
                 */
                listeners['REFRESH_DIARY_SCREEN'] = $scope.$on('REFRESH_DIARY_SCREEN', function () {
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
                listeners['RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY'] = $scope.$on('RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY', function () {
                    if ( $scope.diaryData.selectedRoomTypes.length > 0 || $scope.diaryData.selectedFloors.length > 0 ) {
                        resetUnassignedList();
                        $scope.$broadcast('RESET_RIGHT_FILTER_BAR');
                        $scope.diaryData.paginationData.page = 1;
                        fetchRoomListDataAndReservationListData();
                        cancelReservationEditing();
                    }
                });

                /* Handle event emitted from child controllers.
                 * To toggle unassigned list and filter.
                 */
                listeners['SHOW_AVALAILABLE_ROOM_SLOTS'] = $scope.$on('SHOW_AVALAILABLE_ROOM_SLOTS', function (event, newData, shouldHide) {
                    $scope.diaryData.isAssignRoomViewActive = true;
                    if (shouldHide) {
                        $scope.diaryData.isAssignRoomViewActive = false;
                    }
                    $scope.diaryData.availableSlotsForAssignRooms = newData;
                    fetchRoomListDataAndReservationListData();
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
                listeners['TOGGLE_BOOKED_AVAIALBLE'] = $scope.$on('TOGGLE_BOOKED_AVAIALBLE', callbackForBookedOrAvailableListner);

                // destroying listeners
                angular.forEach(listeners, function (listener) {
                    $scope.$on('$destroy', listener);
                });

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
                        unAssignedRoomSelect,
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
