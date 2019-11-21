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

        $scope.saveChanges = function() {
            $scope.$emit("saveContactInformation", {
                'hotel_info_changed_from_popup': true,
                'other_hotels_info': $scope.hotelCommissionDetails
            });
        };

        /*
        * Initialization method
        */
        var init = function () {
            // Create deep copy for elimintaing the outside click event which checks for changes in the model
            $scope.hotelCommissionDetails = angular.copy($scope.contactInformation.commission_details.other_hotels_info);
            $scope.setScroller('rvTACardPropertiesCommissionsScroll', scrollerOptions);
            $timeout(function () {
                $scope.refreshScroller('rvTACardPropertiesCommissionsScroll');
            }, 2000);
        };

        init();

    }
]);
