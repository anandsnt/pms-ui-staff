sntRover.controller('rvBorrowRoomTypeCtrl',[
    '$scope',
    'RVUpgradesSrv',
    'ngDialog',
    function($scope, RVUpgradesSrv, ngDialog) {

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
    $scope.clickedBorrowButton = function(){
        var params = {};


        //CICO-25067
        params.forcefully_assign_room   = true;

        params.reservation_id   = $scope.reservationData.reservation_card.reservation_id;
        params.upsell_amount = $scope.passingParams.upsell_amount;
        params.room_no          = $scope.assignedRoom.room_number;

        var options = {
            params          : params,
            successCallBack : successCallbackselectUpgrade

        };
        $scope.callAPI(RVUpgradesSrv.selectUpgrade, options);

    };



}]);