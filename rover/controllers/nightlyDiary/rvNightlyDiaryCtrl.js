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
        $scope.heading = $filter('translate')('MENU_ROOM_DIARY');
        $scope.setTitle($filter('translate')('MENU_ROOM_DIARY'));



        // data set for diary used for Angular code.
        $scope.diaryData = {
            isSevenMode     : true,
            datesGridData   : datesList.dates,
            diaryRoomsList  : roomsList
        };

        // To toogle 7/21 button.
        $scope.toggleSwitchMode = function(){
            $scope.diaryData.isSevenMode = !$scope.diaryData.isSevenMode;
            $scope.renderDiaryScreen();
        }
        //Nothing to be there in initial state
        // $scope.updateDiaryView - used for every actions in top bar filters
        //During initial nvaigation too we are using the same common method to view screen and dispatch data
        var initialState = {};
        const store = configureStore(initialState);

        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

        // angular method to update diary view via react dispatch method.
        $scope.updateDiaryView = function(){
            var dispatchData = {
                type: 'DIARY_VIEW_CHANGED',
                mode: ($scope.diaryData.isSevenMode) ? '7_DAYS_MODE': '21_DAYS_MODE',
                diaryRoomsListData : $scope.diaryData.diaryRoomsList
            };
            store.dispatch(dispatchData);
        };

        $scope.updateDiaryView();

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
