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
        $scope.$emit("updateRoverLeftMenu", "nightlyDiaryReservation");

        // data set for diary used for Angular code.
        $scope.diaryData = {
            isSevenSelected : true,
            datesGridData   : datesList,
            businessDate    : $rootScope.businessDate,
            diaryRoomsList  : roomsList,
            numberOfDays    : 7
        };
        var goToPrevPage = ()=>{
        console.log("Implement Prev button action")
        };

        var goToNextPage = ()=>{
        console.log("Implement Next button action");
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

        // To toogle 7/21 button.
        $scope.toggleSwitchMode = function(){
            $scope.diaryData.isSevenSelected = !$scope.diaryData.isSevenSelected;
            $scope.renderDiaryScreen();
        }
        //Initial State
        var initialState = {
            roomsList : roomsList.rooms,
            callbackFromAngular : getTheCallbacksFromAngularToReact()
        };
        const store = configureStore(initialState);

        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

        // angular method to update diary view via react dispatch method.
        $scope.updateDiaryView = function(){
            var dispatchData = {
                type: 'DIARY_VIEW_CHANGED',
                number_of_days: $scope.diaryData.numberOfDays,
                diaryRoomsListData : $scope.diaryData.diaryRoomsList,
                callbackFromAngular : getTheCallbacksFromAngularToReact()
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
