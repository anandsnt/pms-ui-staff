sntRover.controller('rvBorrowRoomTypeCtrl',[
    '$scope',
    'RVUpgradesSrv',
    'ngDialog',
    'RVRoomAssignmentSrv',
    function($scope, RVUpgradesSrv, ngDialog, RVRoomAssignmentSrv) {

    // BaseCtrl.call(this, $scope);
    $scope.selectedUpgrade = {};

    _.extend($scope.selectedUpgrade,
        {
            room_id         : $scope.assignedRoom.room_id,
            room_no         : $scope.assignedRoom.room_number,
            room_type_name  : $scope.assignedRoom.room_type_name,
            room_type_code  : $scope.assignedRoom.room_type_code,
          //  room_type_level : parseInt(selectedListItem.room_type_level)
        });
    var successCallbackselectUpgrade = function(data) {
        $scope.closeDialog();
        $scope.$emit('upgradeSelected', $scope.selectedUpgrade);
    };

    var failureCallbackselectUpgrade = function(error) {
        $scope.$emit('hideLoader');
        $scope.$parent.errorMessage = error;
        $scope.closeDialog();
    };

    $scope.clickedBorrowButton = function(){
        var resData     = $scope.reservationData.reservation_card,
            resStatus   = resData.reservation_status,
            apiToCall   = RVUpgradesSrv.selectUpgrade,
            params      = {};


        //CICO-25067
        params.forcefully_assign_room   = true;
        params.reservation_id   = resData.reservation_id;
        params.upsell_amount    = $scope.passingParams.upsell_amount;
        params.room_no          = $scope.assignedRoom.room_number;

        // CICO-27661
        if (resStatus === "CHECKEDIN" && $scope.roomTransfer) {
            params.without_rate_change  = $scope.roomTransfer.withoutRateChange;
            params.new_rate_amount = $scope.roomTransfer.newRoomRateChange;
            params.room_number = $scope.assignedRoom.room_number;
            apiToCall = RVRoomAssignmentSrv.assignRoom;
        }

        var options = {
            params          : params,
            successCallBack : successCallbackselectUpgrade,
            failureCallBack : failureCallbackselectUpgrade

        };
        $scope.callAPI(apiToCall, options);

    };



}]);