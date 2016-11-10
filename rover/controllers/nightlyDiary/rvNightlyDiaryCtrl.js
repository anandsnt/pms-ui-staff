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
        $scope.heading = $filter('translate')('MENU_ROOM_DIARY');
        $scope.setTitle($filter('translate')('MENU_ROOM_DIARY'));
        $scope.$emit("updateRoverLeftMenu", "nightlyDiaryReservation");

        // data set for diary used for Angular code.
        $scope.diaryData = {
            isSevenSelected : true,
            datesGridData   : datesList,
            businessDate    : $rootScope.businessDate,
            diaryRoomsList  : roomsList,
            numberOfDays    : 7,
            fromDate        : '',
            toDate          : '',
            roomFilterCount : 0,
            filterCount     : 0,
            hasMultipleMonth : false
        };

        // Method to update 7/21 time line data.
        var fetchTimelineListData = function(){
            var successCallBackFetchDatesList = function(data){
                $scope.$emit('hideLoader');
                $scope.errorMessage = "";
                $scope.diaryData.datesGridData = [];
                $scope.diaryData.datesGridData = data;
                $scope.broadcast('FETCH_COMPLETED_DATE_LIST_DATA');
            };
            var postData = {
                "start_date": $scope.diaryData.fromDate,
                "no_of_days": $scope.diaryData.numberOfDays
            };
            $scope.invokeApi(RVNightlyDiarySrv.fetchDatesList, postData, successCallBackFetchDatesList);
        };

        //Initial State
        var initialState = {
            roomsList : roomsList.rooms
        };

        const store = configureStore(initialState);
        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

        // angular method to update diary view via react dispatch method.
        var updateDiaryView = function(){
            var dispatchData = {
                type: 'DIARY_VIEW_CHANGED',
                number_of_days: $scope.diaryData.numberOfDays,
                diaryRoomsListData : $scope.diaryData.diaryRoomsList
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
