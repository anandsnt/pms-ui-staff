sntRover.controller('rvBorrowRoomTypeCtrl',[
    '$scope',
    function($scope) {

    // BaseCtrl.call(this, $scope);

    console.log(">>>>>>>>>>");
    console.log($scope.reservationData)
    console.log("=======")
    console.log($scope.passingParams)
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