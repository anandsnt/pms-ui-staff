angular.module('sntRover')
.controller('rvNightlyDiaryController',
    [   '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams
        ) {

       // $scope.$emit('showLoader');

        BaseCtrl.call(this, $scope);

        const roomsList = [{"id": 1, "room_number": 22, "room_type": "Deluxe KIng"}]

        var initialState = {
            mode: NIGHTLY_DIARY_SEVEN_MODE
        };

        //const store = configureStore(initialState);

        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

       // import { render } from 'react-dom' // ← Main react library
        // import { Provider } from 'react-redux' //← Bridge React and Redux
        // import { createStore } from 'redux'
        // import NightlyDiary from '../react/nightlyDiary/components/NightlyDiary'

        /**
         * to render the grid view
         */
        var renderDiaryView = () => render(
            <Provider >
                <NightlyDiaryRootComponent/>
            </Provider>,
            document.querySelector('#nightlyDiaryMain')
        );

        /**
         * initialisation function
         */
        (() => {
            console.log("Just reached now second")
            renderDiaryView();
        })();


}]);
