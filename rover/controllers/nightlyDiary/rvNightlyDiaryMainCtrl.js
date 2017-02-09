angular.module('sntRover')
.controller('rvNightlyDiaryMainController',
    [   '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$filter',
        'roomsList',
        'datesList',
        'ngDialog',
        'reservationsList',
        'RVNightlyDiarySrv',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $filter,
            roomsList,
            datesList,
            ngDialog,
            reservationsList,
            RVNightlyDiarySrv
        ) {


            BaseCtrl.call(this, $scope);
            // CICO-36654 fix for touch events not getting detected iPad.
            document.removeEventListener('touchmove', window.touchmovepreventdefault, false);
            document.removeEventListener('touchmove', window.touchmovestoppropogate, false);
            $scope.$on('$destroy', function() {
                document.addEventListener('touchmove', window.touchmovepreventdefault, false);
                document.addEventListener('touchmove', window.touchmovestoppropogate, false);
            });
            /*
             * utility method Initiate controller
             * @return {}
             */
            var initiateBasicConfig = function() {
                $scope.heading = $filter('translate')('MENU_ROOM_DIARY');
                $scope.setTitle($filter('translate')('MENU_ROOM_DIARY'));
                $scope.$emit('updateRoverLeftMenu', 'nightlyDiaryReservation');

                var srvParams = {};

                if ($stateParams.isFromStayCard) {
                    srvParams = RVNightlyDiarySrv.getCache();
                }
                else {
                    srvParams.start_date = $rootScope.businessDate;
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
                    roomFilterCount: 0,
                    filterCount: 0,
                    paginationData: { perPage: 50,
                                        page: srvParams.page,
                                        totalCount: roomsList.total_count
                                    },
                    hasMultipleMonth: false,
                    firstMonthDateList: [],
                    secondMonthDateList: [],
                    reservationsList: reservationsList,
                    hasOverlay: false,
                    isEditReservationMode: false
                };
                $scope.currentSelectedReservation = {};
                $scope.currentSelectedRoom = {};
            };

            initiateBasicConfig();
            /**
             * method to get Pagination parametrs
             * @return {Object} with pagination params
             */
            var getPaginationParams = function() {
                return {
                    per_page: $scope.diaryData.paginationData.perPage,
                    page: $scope.diaryData.paginationData.page,
                    total_count: $scope.diaryData.paginationData.totalCount
                };
            };

            /**
             * method to update Pagination parametrs
             */
            var handlePaginationData = function(data) {
                $scope.diaryData.paginationData.totalCount = data.roomList.total_count;
                $scope.diaryData.paginationData.page = data.roomList.page_number;
            };

            // Method to update room list data.
            var fetchRoomListDataAndReservationListData = function(roomId) {
                var successCallBackFetchRoomList = function(data) {
                        $scope.$emit('hideLoader');
                        $scope.errorMessage = '';
                        $scope.diaryData.diaryRoomsList = data.roomList.rooms;
                        $scope.diaryData.reservationsList = data.reservationList;
                        handlePaginationData(data);
                        $scope.diaryData.datesGridData = data.dateList;
                        $scope.$broadcast('FETCH_COMPLETED_DATE_LIST_DATA');
                        updateDiaryView();
                        if (roomId) {
                            $scope.$broadcast('CLOSE_SEARCH_RESULT');
                        }
                    },
                    postData = {
                        ...getPaginationParams(),
                        'start_date': $scope.diaryData.fromDate,
                        'no_of_days': $scope.diaryData.numberOfDays
                    };

                if (roomId) {
                    postData.room_id = roomId;
                    $scope.diaryData.selectedRoomId = roomId;
                } else {
                    $scope.diaryData.selectedRoomId = null;
                }
                $scope.invokeApi(RVNightlyDiarySrv.fetchRoomsListAndReservationList, postData, successCallBackFetchRoomList);
            };

            /*
             * Handle Next Button in Dairy.
             * @return {}
             */
            var goToPrevPage = () => {
                cancelReservationEditing();
                $scope.diaryData.paginationData.page--;
                fetchRoomListDataAndReservationListData();
            };

            /*
             * Handle Prev Button in Dairy.
             * @return {}
             */
            var goToNextPage = () => {
                cancelReservationEditing();
                $scope.diaryData.paginationData.page++;
                fetchRoomListDataAndReservationListData();
            };
            /*
             * Show selected reservation highlighted and enable edit bar
             * @param reservation - Current selected reservation
             */
            var selectReservation = (e, reservation, room) => {
                if (!$scope.diaryData.isEditReservationMode) {
                    $scope.diaryData.isEditReservationMode = true;
                    $scope.currentSelectedReservation = reservation;
                    $scope.currentSelectedRoom = room;
                    showReservationSelected();
                    if (!$stateParams.isFromStayCard) {
                        $scope.$apply();
                    } else {
                        // To fix issue point 3 - QA failed comment - CICO-34410
                        $stateParams.isFromStayCard = false;
                    }
                }

            };

            /*
             * Function to check room availability.
             */
            var checkReservationAvailability = (arrivalDate, DepartureDate) => {
                let params = {
                        'arrival_date': moment(arrivalDate, $rootScope.dateFormat.toUpperCase())
                                            .format('YYYY-MM-DD'),
                        'dep_date': moment(DepartureDate, $rootScope.dateFormat.toUpperCase())
                                            .format('YYYY-MM-DD'),
                        'reservation_id': $scope.currentSelectedReservation.id
                    },
                    successCallBack = function(response) {
                        $scope.$emit('hideLoader');
                        if (response.status === 'failure') {
                            $scope.messages = response.errors;
                            openMessagePopup();
                        } else {                      
                            if (response.data.availability_status === 'room_available') {                            
                                $scope.extendShortenReservationDetails = params;
                            } else {
                                switch (response.data.availability_status) {
                                case 'to_be_unassigned' : $scope.messages = ['PREASSIGNED'];
                                    break;
                                case 'maintenance' : $scope.messages = ['MAINTENANCE'];
                                    break;
                                case 'do_not_move' : $scope.messages = ['ROOM_CANNOT_UNASSIGN'];
                                    break;
                                case 'room_ooo' : $scope.messages = ['ROOM_OOO'];
                                    break;
                                default : $scope.messages = ["Room Can't Move"];
                                }                    
                                openMessagePopup();
                            }
                        }                                                
                    };

                $scope.invokeApi(RVNightlyDiarySrv.checkUpdateAvaibale, 
                    params,
                    successCallBack);
            };
            /*
             * Function to cancel message popup.
             */
            $scope.closeDialog = function() {
                cancelReservationEditing();
                ngDialog.close();
            };
            /*
             * Function to save editing of a reservation
             */
            var saveReservationEditing = function() {
                let successCallBack = function() {
                    fetchRoomListDataAndReservationListData();
                    cancelReservationEditing();
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
            var openMessagePopup = function() {
                ngDialog.open({
                    template: '/assets/partials/nightlyDiary/rvNightlyDiaryMessages.html',                   
                    scope: $scope
                });
            };


            /*
             * Function to cancel editing of a reservation
             */
            var cancelReservationEditing = function() {
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
             * Cancel button click edit bar
             */
            $scope.$on("CANCEL_RESERVATION_EDITING", function() {
                cancelReservationEditing();
            });
            /*
             * Save button click edit bar
             */
            $scope.$on("SAVE_RESERVATION_EDITING", function() {
                saveReservationEditing();
            });
            /* Handle event emitted from child controllers.
             * To refresh diary data - rooms & reservations.
             * @param {Number} RoomId - selected room id from search filters.
            */
            $scope.$on('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', function( event, roomId ) {
                cancelReservationEditing();
                fetchRoomListDataAndReservationListData(roomId);
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
                    checkReservationAvailability
                };
            };

            if ($stateParams.isFromStayCard) {
                var params = RVNightlyDiarySrv.getCache();
                $scope.currentSelectedReservationId = params.currentSelectedReservationId;
                $scope.diaryData.selectedRoomId = params.currentSelectedRoomId;
                $scope.currentSelectedReservation = params.currentSelectedReservation;
            }

            // Initial State
            var initialState = {
                roomsList: roomsList.rooms,
                reservationsList: reservationsList.rooms,
                diaryInitialDayOfDateGrid: $scope.diaryData.fromDate,
                numberOfDays: $scope.diaryData.numberOfDays,
                currentBusinessDate: $rootScope.businessDate,
                callBackFromAngular: getTheCallbacksFromAngularToReact(),
                paginationData: $scope.diaryData.paginationData,
                selectedReservationId: $scope.currentSelectedReservationId,
                selectedRoomId: $scope.diaryData.selectedRoomId,
                isFromStayCard: $stateParams.isFromStayCard,
                currentSelectedReservation: $scope.currentSelectedReservation,
                dateFormat: $rootScope.dateFormat
            };
            const store = configureStore(initialState);
            const {render} = ReactDOM;
            const {Provider} = ReactRedux;

            // angular method to update diary view via react dispatch method.
            var updateDiaryView = function() {
                var dispatchData = {
                    type: 'DIARY_VIEW_CHANGED',
                    numberOfDays: $scope.diaryData.numberOfDays,
                    reservationsList: $scope.diaryData.reservationsList.rooms,
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
            var showReservationSelected = function() {
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
             * to render the grid view
             */
            var renderDiaryView = () => render(
                <Provider store={store}>
                    <NightlyDiaryRootContainer/>
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

