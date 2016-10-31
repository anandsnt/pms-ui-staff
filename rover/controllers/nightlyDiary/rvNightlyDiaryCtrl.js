angular.module('sntRover')
.controller('rvNightlyDiaryController',
    [   '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$filter',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $filter
        ) {

       // $scope.$emit('showLoader');

        BaseCtrl.call(this, $scope);
        $scope.$parent.heading = $filter('translate')('MENU_ROOM_DIARY');
        $scope.setTitle($filter('translate')('MENU_ROOM_DIARY'));

        const diaryRoomsList = {
                                "rooms": [{
                                    "id": "582",
                                    "room_no": "101",
                                    "room_type_name": "Triple Cabin",
                                    "hk_status": "CLEAN",
                                    "service_status": "IN_SERVICE",
                                    "suite_room_details": [{
                                        "id": 555,
                                        "room_no": "777_suite"
                                    }, {
                                        "id": 556,
                                        "room_no": "776_suite"
                                    }]


                                }, {
                                    "id": "582",
                                    "room_no": "102",
                                    "room_type_name": "Deluxe Twin",
                                    "hk_status": "DIRTY",
                                    "service_status": "IN_SERVICE",
                                    "suite_room_details": [{
                                        "id": 555,
                                        "room_no": "777_suite"
                                    }, {
                                        "id": 556,
                                        "room_no": "776_suite"
                                    }]


                                }],
                                "total_count": 1000
                            }

        const datesGridData =   {
                            "dates": ["2015-10-26", "2015-10-27", "2015-10-28", "2015-10-29", "2015-10-30", "2015-10-31", "2015-11-01"]
                        }

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
           // console.log("------");
            //console.log(initialDispatchData);
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
            document.querySelector('#diary-nightly')
        );

        /**
         * initialisation function
         */
        (() => {
            renderDiaryView();
        })();


}]);
