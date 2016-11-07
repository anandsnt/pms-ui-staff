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
            isSevenSelected : true,
            datesGridData   : datesList.dates,
            diaryRoomsList  : roomsList,
            numberOfDays    : 7
        };

        // To toogle 7/21 button.
        $scope.toggleSwitchMode = function(){
            $scope.diaryData.isSevenSelected = !$scope.diaryData.isSevenSelected;
            $scope.renderDiaryScreen();
        }
        //Initial State
        var initialState = {
            roomsList : roomsList.rooms
        };
        const store = configureStore(initialState);

        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

        // angular method to update diary view via react dispatch method.
        $scope.updateDiaryView = function(){
            var dispatchData = {
                type: 'DIARY_VIEW_CHANGED',
                number_of_days: $scope.diaryData.numberOfDays,
                diaryRoomsListData : $scope.diaryData.diaryRoomsList
            };
            store.dispatch(dispatchData);
        };



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
