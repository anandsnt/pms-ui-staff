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
        
        // data set for diary used for Angular code.
        $scope.diaryData = {
            isSevenMode     : true,
            datesGridData   : datesList.dates,
            fromDate        : '',
            toDate          : '',
            roomFilterCount : 0,
            filterCount     : 0
        };

        var initialState = {};
        const store = configureStore(initialState);

        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

        // angular method to render diary screen via react dispatch method.
        $scope.renderDiaryScreen = function(){
            console.log("renderDiaryScreen");
            var initialDispatchData = {
                type: ($scope.diaryData.isSevenMode) ? '7_DAYS': '21_DAYS',
                mode: ($scope.diaryData.isSevenMode) ? '7_DAYS_MODE': '21_DAYS_MODE',
                diaryRoomsListData : diaryRoomsList
            };
            console.log(initialDispatchData);
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
