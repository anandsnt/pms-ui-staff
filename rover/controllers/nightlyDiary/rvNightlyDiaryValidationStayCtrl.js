sntRover.controller('rvNightlyDiaryValidationStayCtrl', ['$scope', 'rvPermissionSrv', 'ngDialog', function($scope, rvPermissionSrv, ngDialog) {

	console.log($scope.popupData);

    /**
     * if the user has enough permission to over book House
     * @return {Boolean}
     */
    var hasPermissionToHouseOverBook = function () {
        return rvPermissionSrv.getPermissionValue('OVERBOOK_HOUSE');
    };

    /**
     * if the user has enough permission to over book room type
     * @return {Boolean}
     */
    var hasPermissionToOverBook = function () {
        return rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE');
    };

	/* Utility method to check overbooking status
    * @param {Object} [470 error data with is_house_available ,room_type_available flags ]
    * @return {String} [Overbooking status message]
    */
   var checkOverBooking = function() {
        var isHouseOverbooked       = !$scope.popupData.data.is_house_available,
            isRoomTypeOverbooked    = !$scope.popupData.data.room_type_available,
            canOverbookHouse        = hasPermissionToHouseOverBook(),
            canOverbookRoomType     = hasPermissionToOverBook(),
            canOverBookBoth         = canOverbookHouse && canOverbookRoomType,
            overBookingStatusOutput = '';

        if (isHouseOverbooked && isRoomTypeOverbooked && canOverBookBoth) {
        	overBookingStatusOutput = 'HOUSE_AND_ROOMTYPE_OVERBOOK';
        }
        else if (isRoomTypeOverbooked && canOverbookRoomType && (!isHouseOverbooked || (isHouseOverbooked && canOverbookHouse) )) {
            overBookingStatusOutput = 'ROOMTYPE_OVERBOOK';
        }
        else if (isHouseOverbooked && canOverbookHouse && (!isRoomTypeOverbooked || (isRoomTypeOverbooked && canOverbookRoomType) )) {
            overBookingStatusOutput = 'HOUSE_OVERBOOK';
        }
        else {
            overBookingStatusOutput = 'NO_PERMISSION_TO_OVERBOOK';
        }

       return overBookingStatusOutput;
   };

   // Disable the overBooking button if there is no permission..
   $scope.popupData.disableOverBookingButton = checkOverBooking() === 'NO_PERMISSION_TO_OVERBOOK';


}]);