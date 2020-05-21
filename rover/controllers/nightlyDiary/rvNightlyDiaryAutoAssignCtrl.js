angular.module('sntRover')
.controller('nightlyDiaryAutoAssignController',
    [
        '$scope',
        'RVNightlyDiarySrv',
        function(
            $scope,
            RVNightlyDiarySrv,
        ) {
            BaseCtrl.call(this, $scope);
            $scope.selectedRoomTypes = [];
            $scope.selectedFloors = [];

            $scope.roomTypeSelected = function(roomType) {
                roomType.selected = !roomType.selected;
                $scope.selectedRoomTypes = _.pluck(_.where($scope.diaryData.filterList.roomType, {selected: true}), 'id');
            };

            $scope.floorSelected = function(floor) {
                floor.selected = !floor.selected;
                $scope.selectedFloors = _.pluck(_.where($scope.diaryData.filterList.floorList, {selected: true}), 'id');
            };

            $scope.cancelAutoAssign = function() {
                $scope.$emit('CLOSE_AUTO_ASSIGN_OVERLAY');
            };

            $scope.autoAssignRooms = function() {
                var postAutoAssignIntiationCallback = function(response) {
                    $scope.diaryData.autoAssign.status = response.auto_room_assignment_status;
                }, data = {
                        'reservation_ids': _.pluck($scope.diaryData.unassignedReservationList.reservations, 'reservation_id'),
                        'room_type_ids': $scope.selectedRoomTypes,
                        'floor_ids': $scope.selectedFloors,
                        'apply_room_preferences': true
                }, options = {
                    data: params,
                    successCallBack: postAutoAssignIntiationCallback
                };

                RVNightlyDiarySrv.unlockRoomDiary(options).then(function(response) {
                })
            };

            $scope.refreshAutoAssignStatus = function() {
                RVNightlyDiarySrv.fetchAutoAssignStatus().then(function(response) {
                    $scope.diaryData.autoAssign.status = response.auto_room_assignment_status;
                });
            };

            $scope.unlockRoomDiary = function() {
                RVNightlyDiarySrv.unlockRoomDiary().then(function(response) {
                    if (!response.is_diary_locked) {
                        $scope.$emit('CLOSE_AUTO_ASSIGN_OVERLAY');
                    }
                });
            };
        }
    ]
);