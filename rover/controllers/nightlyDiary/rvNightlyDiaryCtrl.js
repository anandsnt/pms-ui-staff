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
        ) {

       // $scope.$emit('showLoader');

        BaseCtrl.call(this, $scope);
        $scope.$parent.heading = $filter('translate')('MENU_ROOM_DIARY');
        $scope.setTitle($filter('translate')('MENU_ROOM_DIARY'));

        const diaryRoomsList = roomsList;

        const datesGridData =  datesList;
        
        $scope.diaryData = {
            isSevenMode : true,
            datesGridData : datesList
        };

        $scope.isSevenMode = true;
        $scope.switchMode = function(){
            $scope.isSevenMode = !$scope.isSevenMode;
            $scope.renderDiaryScreen();
        }

        var initialState = {};
        const store = configureStore(initialState);

        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

        $scope.renderDiaryScreen = function(){
            var initialDispatchData = {
                type: ($scope.isSevenMode) ? '7_DAYS': '21_DAYS',
                mode: ($scope.isSevenMode) ? '7_DAYS_MODE': '21_DAYS_MODE',
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
