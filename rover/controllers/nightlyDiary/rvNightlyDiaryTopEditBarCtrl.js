angular.module('sntRover')
.controller('rvNightlyDiaryTopEditBarController',
    [   '$scope',
        '$state',
        'RVNightlyDiarySrv',
        function(
            $scope, $state, RVNightlyDiarySrv
        ) {

            BaseCtrl.call(this, $scope);

            $scope.cancelEditReservation = function() {
                $scope.$emit('CANCEL_RESERVATION_EDITING');
            };

            $scope.saveEditedReservation = function() {
                $scope.$emit('SAVE_RESERVATION_EDITING');
            };

            $scope.goToStayCard = function(currentSelectedReservation, currentSelectedRoom) {

                var params = RVNightlyDiarySrv.getCache();

                params.currentSelectedReservationId = currentSelectedReservation.id;
                params.currentSelectedRoomId = currentSelectedRoom.id;
                params.currentSelectedReservation = currentSelectedReservation;
                params.filterList = $scope.diaryData.filterList;
                params.selectedRoomCount = $scope.diaryData.selectedRoomCount;
                params.selectedFloorCount = $scope.diaryData.selectedFloorCount;
                params.hideRoomType = $scope.diaryData.hideRoomType;
                params.hideFloorList = $scope.diaryData.hideFloorList;
                params.selected_floor_ids = $scope.diaryData.selectedFloors;
                params.selected_room_type_ids = $scope.diaryData.selectedRoomTypes;

                RVNightlyDiarySrv.updateCache(params);

                $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                    id: currentSelectedReservation.id,
                    confirmationId: currentSelectedReservation.confirm_no,
                    isrefresh: true
                });
            };
}]);