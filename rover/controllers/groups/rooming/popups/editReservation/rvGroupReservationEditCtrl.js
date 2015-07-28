sntRover.controller('rvGroupReservationEditCtrl', ['$scope', 'rvGroupRoomingListSrv', function ($scope, rvGroupRoomingListSrv) {
  BaseCtrl.call(this, $scope);

  //variables
  var initialPopupData = null;

  /**
   * when we completed the fetching of free rooms available
   * @param  {Object} - free rooms available
   * @return {undefined}
   */
  var successCallBackOfListOfFreeRoomsAvailable = function (data) {
    var roomId = initialPopupData.room_id, assignedRoom = [];

    if (roomId !== null && roomId !== '') {
      assignedRoom = [{
        id: roomId,
        room_number: initialPopupData.room_no
      }];
    }

    //Since we have to include already assigned rooms in the select box, merging with rooms coming from the api
    $scope.ngDialogData.roomsAvailableToAssign = assignedRoom.concat(data.rooms);
  };

  /**
   * when the room type changed from edit reservation popup
   * @param  {Object} ngDialogData [reservation data]
   * @return {undefined}
   */
  $scope.changedReservationRoomType = function () {
    var rData = $scope.ngDialogData;

    var paramsForListOfFreeRooms = {
        reserevation_id: rData.id,
        num_of_rooms_to_fetch: 5,
        room_type_id: rData.room_type_id
      };

    var options = {
        params: paramsForListOfFreeRooms,
        successCallBack: successCallBackOfListOfFreeRoomsAvailable
      };
    $scope.callAPI(rvGroupRoomingListSrv.getFreeAvailableRooms, options);
  };

  /**
   * Initialization of pop
   * @return {[type]} [description]
   */
  (function initilizeMe() {
    _.extend(initialPopupData, $scope.ngDialogData);
    console.log(initialPopupData);
  }());
}]);