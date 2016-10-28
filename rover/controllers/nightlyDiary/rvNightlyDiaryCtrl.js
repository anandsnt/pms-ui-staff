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

        const diaryRenderData = {
            "rooms_list": [{
                "room_no": "112",
                "room_type": "Deluxe Twin",
                "room_status": "clean"
            }, {
                "room_no": "113",
                "room_type": "Deluxe King",
                "room_status": "dirty"
            }, {
                "room_no": "114",
                "room_type": "Loft XL",
                "room_status": "clean"
            }],
            "reservations": [{
                "room_no": "2323",
                "reservations": [{
                    "reservatio_start_date": 2222,
                    "reservatio_end_date": 245345,
                    "reservation_status": "in-house",
                    "number_of_days": "3",
                    "is_locked": true
                }, {
                    "reservatio_start_date": 2222,
                    "reservatio_end_date": 245345,
                    "reservation_status": "in-house",
                    "number_of_days": "5",
                    "is_locked": false
                }]
            }, {
                "room_no": "113",
                "reservations": [{
                    "reservatio_start_date": 2222,
                    "reservatio_end_date": 245345,
                    "reservation_status": "in-house",
                    "number_of_days": "3",
                    "is_locked": true
                }, {
                    "reservatio_start_date": 2222,
                    "reservatio_end_date": 245345,
                    "reservation_status": "in-house",
                    "number_of_days": "5",
                    "is_locked": false
                }]
            }]

        }

        var initialState = {
            mode: NIGHTLY_DIARY_SEVEN_MODE
        };
        const store = configureStore(initialState);

        const {render} = ReactDOM;
        const {Provider} = ReactRedux;


        /**
         * to render the grid view
         */
        var renderDiaryView = () => render(
            <Provider store={store}>
                <NightlyDiaryRootComponent/>
            </Provider>,
            document.querySelector('#diary-nightly')
        );
        var initialDispatchData = {
            type: 'INITIAL_RENDERING',
            diaryRenderData : diaryRenderData
        };
        store.dispatch(initialDispatchData);
        /**
         * initialisation function
         */
        (() => {
            renderDiaryView();
        })();


}]);
