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

        /*
        * Initialization method
        */
        var init = function () {
            $timeout(function () {
                $scope.setScroller('rvCompanyCardActivityLogScroll', scrollerOptions);
            }, 500);
            $timeout(function () {
                $scope.refreshScroller('rvCompanyCardActivityLogScroll');
            }, 2000);
        };

        init();

    }
]);
