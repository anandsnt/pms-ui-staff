sntZestStation.controller('zsReservationBillDetailsCtrl', [
    '$scope',
    '$state',
    'zsCheckoutSrv', 'zsEventConstants', '$stateParams', 'zsModeConstants', '$window', '$timeout', 'zsUtilitySrv', '$log', 'zsPaymentSrv', 'zsStateHelperSrv',
    function ($scope, $state, zsCheckoutSrv, zsEventConstants, $stateParams, zsModeConstants, $window, $timeout, zsUtilitySrv, $log, zsPaymentSrv, zsStateHelperSrv) {

        BaseCtrl.call(this, $scope);

        /**
         * [clickedOnCloseButton description]
         * @return {[type]} [description]
         */
        $scope.clickedOnCloseButton = function () {
            // if key card was inserted we need to eject that
            $scope.$emit('EJECT_KEYCARD');
            $state.go('zest_station.home');
        };

        /* 
         *  To setup scroll
         */
        $scope.setScroller('charge-list');

        var refreshScroller = function () {
            $scope.refreshScroller('charge-list');
        };

        var fetchItemsFailure = function () {
            // if key card was inserted we need to eject that
            // $state.go('zest_station.speakToStaff');
        };

        var fetchItemsSuccess = function (response) {
            console.log(response)
            setDisplayContentHeight(); // utils function
            refreshScroller();
        };

        $scope.getChargeItems = function () {
            var options = {
                successCallBack: fetchItemsSuccess,
                failureCallBack: fetchItemsFailure
            };

            $scope.callAPI(zsCheckoutSrv.fetchChargeItems, options);
        };

        /**
         * [initializeMe description]
         * @return {[type]} [description]
         */
        (function () {
            // show back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

            $scope.getChargeItems();
        }());
    }
]);
