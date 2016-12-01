angular.module('sntRover')
.controller('rvNightlyDiaryMainController',
    [   '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$filter',
        'roomsList',
        'datesList',
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
            reservationsList,
            RVNightlyDiarySrv
        ) {


            BaseCtrl.call(this, $scope);

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
                    $scope.diaryData.paginationData.selectedRoomId = roomId;
                } else {
                    $scope.diaryData.paginationData.selectedRoomId = null;
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
            var selectReservation = (e, reservation) => {
                $scope.diaryData.isEditReservationMode = true;
                $scope.currentSelectedReservation = reservation;

                if(!$stateParams.isFromStayCard) {
                    $scope.$apply();

                }
                showReservationSelected();
            };

            /*
             * Function to cancel editing of a reservation
             */
            var cancelReservationEditing = function() {
                $scope.diaryData.isEditReservationMode = false;
                $scope.currentSelectedReservation = {};
            };
            /*
             * Cancel button click edit bar
             *
             */
            $scope.$on("CANCEL_RESERVATION", function() {
                cancelReservationEditing();
            });
            /**
             * utility method to pass callbacks from
             * @return {Object} with callbacks
             */
            const getTheCallbacksFromAngularToReact = () => {
                return {
                    goToPrevPage,
                    goToNextPage,
                    selectReservation
                };
            };

            if ($stateParams.isFromStayCard) {
                var params = RVNightlyDiarySrv.getCache();
                $scope.currentSelectedReservation = params.currentSelectedReservation;
            }
            // Initial State
            var initialState = {
                roomsList: roomsList.rooms,
                reservationsList: reservationsList.rooms,
                diaryInitialDayOfDateGrid: $rootScope.businessDate,
                numberOfDays: 7,
                currentBusinessDate: $rootScope.businessDate,
                callBackFromAngular: getTheCallbacksFromAngularToReact(),
                paginationData: $scope.diaryData.paginationData,
                selectReservationId: $scope.currentSelectedReservation.id
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
                    selectReservationId: $scope.currentSelectedReservation.id
                };
                store.dispatch(dispatchData);
            };
            var showReservationSelected = function() {
                var dispatchData = {
                    type: 'RESERVATION_SELECTED',
                    selectReservationId: $scope.currentSelectedReservation.id,
                    reservationsList: $scope.diaryData.reservationsList.rooms
                };
                store.dispatch(dispatchData);
            };

            /* Handle event emitted from child controllers.
             * To refresh diary data - rooms & reservations.
             * @param {Number} RoomId - selected room id from search filters.
            */
            $scope.$on('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', function( event, roomId ) {
                cancelReservationEditing();
                fetchRoomListDataAndReservationListData(roomId);
            });

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
                if ($stateParams.isFromStayCard) {
                    var params = RVNightlyDiarySrv.getCache();
                    $scope.currentSelectedReservation = params.currentSelectedReservation;
                    updateDiaryView();
                    selectReservation("", $scope.currentSelectedReservation);
                }
            })();
}]);

