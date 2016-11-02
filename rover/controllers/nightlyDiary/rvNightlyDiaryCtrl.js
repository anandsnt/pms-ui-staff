angular.module('sntRover')
.controller('rvNightlyDiaryController',
    [   '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$filter',
        'roomsList',
        'datesList',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $filter,
            roomsList,
            datesList
        ){

        BaseCtrl.call(this, $scope);
        $scope.$parent.heading = $filter('translate')('MENU_ROOM_DIARY');
        $scope.setTitle($filter('translate')('MENU_ROOM_DIARY'));

        const diaryRoomsList = roomsList;

        const datesGridData =  datesList;
        
        //var 7thDay = tzIndependentDate($rootScope.businessDate);
        //7thDay.setDate(7thDay.getDate()+7);

        //var 21stDay = tzIndependentDate($rootScope.businessDate);
        //21stDay.setDate(21stDay.getDate()+21);

        $scope.diaryData = {
            isSevenMode     : true,
            datesGridData   : datesList.dates
            //startDate       : tzIndependentDate($rootScope.businessDate)
            //endDate         : 7thDay
        };

        $scope.toggleSwitchMode = function(){
            $scope.diaryData.isSevenMode = !$scope.diaryData.isSevenMode;
            $scope.renderDiaryScreen();
        }

        var initialState = {};
        const store = configureStore(initialState);

        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

        $scope.renderDiaryScreen = function(){
            var initialDispatchData = {
                type: ($scope.diaryData.isSevenMode) ? '7_DAYS': '21_DAYS',
                mode: ($scope.diaryData.isSevenMode) ? '7_DAYS_MODE': '21_DAYS_MODE',
                diaryRoomsListData : diaryRoomsList,
                datesGridData: datesGridData
            };
            store.dispatch(initialDispatchData);
        };

        $scope.renderDiaryScreen();

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
