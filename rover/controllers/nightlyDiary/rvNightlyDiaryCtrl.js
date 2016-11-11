angular.module('sntRover')
.controller('rvNightlyDiaryController',
    [   '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$filter',
        'roomsList',
        'datesList',
        'RVNightlyDiarySrv',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $filter,
            roomsList,
            datesList,
            RVNightlyDiarySrv
        ){

        BaseCtrl.call(this, $scope);
        var initiateBasicConfig = function(){
            $scope.heading = $filter('translate')('MENU_ROOM_DIARY');
            $scope.setTitle($filter('translate')('MENU_ROOM_DIARY'));
            $scope.$emit("updateRoverLeftMenu", "nightlyDiaryReservation");
            // data set for diary used for Angular code.
            $scope.diaryData = {
                isSevenSelected : true,
                datesGridData   : datesList,
                businessDate    : $rootScope.businessDate,
                diaryRoomsList  : roomsList,
                reservationList : [],
                numberOfDays    : 7,
                fromDate        : '',
                toDate          : '',
                roomFilterCount : 0,
                filterCount     : 0,
                paginationData  : { perPage : 50,
                                    page : 1,
                                    totalCount : roomsList.total_count
                                },
                hasMultipleMonth    : false,
                firstMonthDateList  : [],
                secondMonthDateList : []
            };
        }();

        var getPaginationParams = function(){
            return {
                per_page    : $scope.diaryData.paginationData.perPage,
                page        : $scope.diaryData.paginationData.page,
                total_count : $scope.diaryData.paginationData.totalCount
            };
        };

        // Method to update 7/21 time line data.
        var fetchTimelineListData = function(){
            var successCallBackFetchDatesList = function(data){
                $scope.$emit('hideLoader');
                $scope.errorMessage = "";
                $scope.diaryData.datesGridData = [];
                $scope.diaryData.datesGridData = data;
                $scope.$broadcast('FETCH_COMPLETED_DATE_LIST_DATA');
            },postData = {
                "start_date": $scope.diaryData.fromDate,
                "no_of_days": $scope.diaryData.numberOfDays
            };
            $scope.invokeApi(RVNightlyDiarySrv.fetchDatesList, postData, successCallBackFetchDatesList);
        };

        // Method to update room list data.
        var fetchRoomListDataAndReservationListData = function(){
            var successCallBackFetchRoomList = function(data){
                $scope.$emit('hideLoader');
                $scope.errorMessage = "";
                $scope.diaryData.diaryRoomsList = data.roomList.rooms;
                $scope.diaryData.paginationData.totalCount = data.roomList.total_count;
            },postData = {
                    ...getPaginationParams(),
                "per_page": $scope.diaryData.paginationData.perPage,
                
            };
            $scope.invokeApi(RVNightlyDiarySrv.fetchRoomsListAndReservationList, postData, successCallBackFetchRoomList);
        };
        
        
        var goToPrevPage = ()=>{
            console.log("Implement Prev button action")
            $scope.diaryData.paginationData.page--;
            fetchRoomListDataAndReservationListData(); 
        };

        var goToNextPage = ()=>{
            $scope.diaryData.paginationData.page++;
            console.log("Implement Next button action");
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
            }
        };

        //Initial State
        var initialState = {
            roomsList : roomsList.rooms,
            callbackFromAngular : getTheCallbacksFromAngularToReact(),
            paginationData : getPaginationParams()
        };
        const store = configureStore(initialState);
        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

        // angular method to update diary view via react dispatch method.
        var updateDiaryView = function(){
            var dispatchData = {
                type                : 'DIARY_VIEW_CHANGED',
                number_of_days      : $scope.diaryData.numberOfDays,
                diaryRoomsListData  : $scope.diaryData.diaryRoomsList,
                callbackFromAngular : getTheCallbacksFromAngularToReact(),
                paginationData      : getPaginationParams()
            };
            store.dispatch(dispatchData);
        };
        // Handle event emitted from child - rvNightlyDiaryFiltersController
        // To refresh diary data - rooms & reservations.
        $scope.$on('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', function(event){
            updateDiaryView();
        });
        // To refresh timeline data
        $scope.$on('REFRESH_DIARY_TIMELINE', function(event){
            fetchTimelineListData();
        });
        /**
         * to render the grid view
         */
        var renderDiaryView = () => render(
            <Provider store={store}>
                <NightlyDiaryRootComponent/>
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
