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

        /**
         * utility method Initiate controller
         * @return {}
         */
        var initiateBasicConfig = function() {
            $scope.heading = $filter('translate')('MENU_ROOM_DIARY');
            $scope.setTitle($filter('translate')('MENU_ROOM_DIARY'));
            $scope.$emit("updateRoverLeftMenu", "nightlyDiaryReservation");
            // data set for diary used for Angular code.
            $scope.diaryData = {
                datesGridData: datesList,
                businessDate: $rootScope.businessDate,
                diaryRoomsList: roomsList,
                reservationList: [],
                numberOfDays: 7,
                fromDate: '',
                toDate: '',
                roomFilterCount: 0,
                filterCount: 0,
                paginationData: { perPage: 50,
                                    page: 1,
                                    totalCount: roomsList.total_count
                                },
                hasMultipleMonth: false,
                firstMonthDateList: [],
                secondMonthDateList: [],
                reservationsList: reservationsList.reservationsList,
                hasOverlay: false
            };
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

        // Method to update 7/21 time line data.
        var fetchTimelineListData = function() {
            var successCallBackFetchDatesList = function(data) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = "";
                $scope.diaryData.datesGridData = [];
                $scope.diaryData.datesGridData = data;
                $scope.$broadcast('FETCH_COMPLETED_DATE_LIST_DATA');
            },
            postData = {
                "start_date": $scope.diaryData.fromDate,
                "no_of_days": $scope.diaryData.numberOfDays
            };
            $scope.invokeApi(RVNightlyDiarySrv.fetchDatesList, postData, successCallBackFetchDatesList);
        };

        // Method to update room list data.
        var fetchRoomListDataAndReservationListData = function() {
            var successCallBackFetchRoomList = function(data) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = "";
                $scope.diaryData.diaryRoomsList = data.roomList.rooms;
                $scope.diaryData.reservationsList = data.reservationList;
                $scope.diaryData.paginationData.totalCount = data.roomList.total_count;
                updateDiaryView();
            },
            postData = {
                ...getPaginationParams(),
                "start_date": $scope.diaryData.fromDate,
                "no_of_days": $scope.diaryData.numberOfDays
            };
            $scope.invokeApi(RVNightlyDiarySrv.fetchRoomsListAndReservationList, postData, successCallBackFetchRoomList);
        };

        /**
         * Handle Next Button in Dairy.
         * @return {}
         */
        var goToPrevPage = () => {
            $scope.diaryData.paginationData.page--;
            fetchRoomListDataAndReservationListData();
        };

        /**
         * Handle Prev Button in Dairy.
         * @return {}
         */
        var goToNextPage = ()=>{
            $scope.diaryData.paginationData.page++;
            fetchRoomListDataAndReservationListData();
        };
        /**
         * utility method to pass callbacks from
         * @return {Object} with callbacks
         */
        const getTheCallbacksFromAngularToReact = () => {
            return {
                goToPrevPage,
                goToNextPage
            };
        };

        // Initial State
        var initialState = {
            roomsList: roomsList.rooms,
            reservationsList: reservationsList.rooms,
            initialDayOfDateGrid: $rootScope.businessDate,
            numberOfDays: 7,
            currentBusinessDate: $rootScope.businessDate,
            callbackFromAngular: getTheCallbacksFromAngularToReact(),
            paginationData: getPaginationParams()
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
                initialDayOfDateGrid: $scope.diaryData.fromDate,
                currentBusinessDate: $rootScope.businessDate,
                callbackFromAngular: getTheCallbacksFromAngularToReact(),
                paginationData: getPaginationParams()
            };
            store.dispatch(dispatchData);
        };
        // Handle event emitted from child - rvNightlyDiaryFiltersController
        // To refresh diary data - rooms & reservations.
        $scope.$on('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', function() {
            fetchRoomListDataAndReservationListData();
        });
        // To refresh timeline data
        $scope.$on('REFRESH_DIARY_TIMELINE', function() {
            fetchTimelineListData();
        });
        /**
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
