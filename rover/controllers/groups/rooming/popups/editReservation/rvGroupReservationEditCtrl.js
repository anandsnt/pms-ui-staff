sntRover.controller('rvGroupReservationEditCtrl', ['$scope', 'rvGroupRoomingListSrv', '$filter', function ($scope, rvGroupRoomingListSrv, $filter) {
  BaseCtrl.call(this, $scope);

  //variables
  var initialPopupData = {};

  /**
   * utility method to get the formmated date for API
   * @param  {String} dateString
   * @return {String} [formatted date]
   */
  var getFormattedDateForAPI = function (dateString) {
      return $filter('date')(tzIndependentDate(dateString), $rootScope.dateFormatForAPI);
  };

  /**
   * we need to update the reservation listing after updation
   */
  var onUpdateReservationSuccess = function(data) {
      $scope.closeDialog();
      $scope.$emit("REFRESH_GROUP_ROOMING_LIST_DATA")
  };

  /**
   * Method to update the reservation
   * @param  {object} reservation
   * @return {undefined}
   */
  $scope.updateReservation = function(reservation) {       
      if (reservation.reservation_status === "CANCELED") {
          return false;
      } 
      else {
          $scope.errorMessage = [];
          _.extend(reservation, {
              group_id: $scope.groupConfigData.summary.group_id,
              arrival_date: getFormattedDateForAPI($scope.roomingListState.editedReservationStart),
              departure_date: getFormattedDateForAPI($scope.roomingListState.editedReservationEnd),
              room_type_id: parseInt(reservation.room_type_id),
              room_id: parseInt(reservation.room_id)
          });
          
          var options = {              
              params: reservation,
              successCallBack: onUpdateReservationSuccess
          };
          $scope.callAPI(rvGroupConfigurationSrv.updateRoomingListItem, options);
      }
  };

  /**
   * when we completed the fetching of free rooms available
   * @param  {Object} - free rooms available
   * @return {undefined}
   */
  var successCallBackOfListOfFreeRoomsAvailable = function (data) {
    var roomId = initialPopupData.room_id, 
      assignedRoom = [],
      isSameRoomType = (initialPopupData.room_type_id === $scope.ngDialogData.room_type_id);

    if (roomId !== null && roomId !== '' && isSameRoomType) {
      assignedRoom = [{
        id: roomId,
        room_number: initialPopupData.room_no
      }];
    }

    //Since we have to include already assigned rooms in the select box, merging with rooms coming from the api
    $scope.ngDialogData.roomsFreeToAssign = assignedRoom.concat(data.rooms);
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
  }());
}]);