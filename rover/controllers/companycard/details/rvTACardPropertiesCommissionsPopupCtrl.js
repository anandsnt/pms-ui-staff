sntRover.controller('rvTACardPropertiesCommissionsPopupCtrl', [
    '$scope',
    '$rootScope',
    '$filter',
    '$timeout',
    'rvUtilSrv',
    'ngDialog',
    function ($scope, $rootScope, $filter, $timeout, util, ngDialog) {
        BaseCtrl.call(this, $scope);
        var scrollerOptions = {
            tap: true,
            preventDefault: false,
            showScrollbar: true
        };

        $scope.clickedCancel = function () {
            ngDialog.close();
        };

        $scope.saveChanges = function () {
            console.log('save');
        };

        $scope.clickedOnPopup = function (ev) {
            ev.stopImmediatePropagation();
            ev.stopPropagation();
        };

        /*
        * Initialization method
        */
        var init = function () {
            $scope.setScroller('rvTACardPropertiesCommissionsScroll', scrollerOptions);
            $timeout(function () {
                $scope.refreshScroller('rvTACardPropertiesCommissionsScroll');
            }, 2000);
        };

        init();

    }
]);
