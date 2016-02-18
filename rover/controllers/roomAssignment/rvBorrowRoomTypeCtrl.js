sntRover.controller('rvBorrowRoomTypeCtrl',[
    '$scope',
    function($scope) {

    // BaseCtrl.call(this, $scope);

    console.log(">>>>>>>>>>");
    console.log($scope)
    console.log("=======")
    console.log($scope.passingParams)
    $scope.selectedUpgrade = {};

    _.extend($scope.selectedUpgrade,
        {
            room_id         : $scope.assignedRoom.room_id,
            room_no         : $scope.assignedRoom.room_number,
         //   room_type_name  : $scope.assignedRoom.upgrade_room_type_name,
            room_type_code  : $scope.assignedRoom.room_type_code,
          //  room_type_level : parseInt(selectedListItem.room_type_level)
        });
    $scope.clickedBorrowButton = function(){
        var params = {};


        //CICO-17082
        params.forcefully_assign_room   = true;

        params.reservation_id   = $scope.reservationData.reservation_card.reservation_id;
        params.upsell_amount = $scope.passingParams.upsell_amount;
        params.room_no          = $scope.assignedRoom.room_number;
        console.log(params)

    };



}]);