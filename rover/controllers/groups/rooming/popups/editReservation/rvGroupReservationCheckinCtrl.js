sntRover.controller('rvGroupReservationCheckinCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    'RVBillCardSrv',
    '$state',
    function ($rootScope,
            $scope,
            $timeout,
            RVBillCardSrv,
            $state) {

    var completeCheckinSuccessCallback = function(data) {
        //calling initially required APIs
        $scope.$emit("REFRESH_GROUP_ROOMING_LIST_DATA");
        $timeout(function() {
            $scope.closeDialog();
        }, 700);
    };

    var completeCheckinFailureCallback = function(error) {

    };

    /**
     * Checks the selected reservation out. fires when user confirms checkout action.
     */
    $scope.completeCheckIn = function(reservation) {
        $timeout(function() {
            var params = {
                "reservation_id" : selectedReservation.confirm_no
            };

            $scope.invokeApi(RVBillCardSrv.completeCheckin,
                             params,
                             completeCheckoutSuccessCallback,
                             completeCheckoutFailureCallback );
        }, 800);
    };

}]);