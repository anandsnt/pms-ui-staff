angular.module('sntRover')
.controller('nightlyDiaryAutoAssignController',
    [
        '$scope',
        '$rootScope',
        'RVNightlyDiarySrv',
        'ngDialog',
        function(
            $scope,
            $rootScope,
            RVNightlyDiarySrv,
            ngDialog
        ) {
            BaseCtrl.call(this, $scope);
            $scope.selectedRoomTypes = [];
            $scope.selectedFloors = [];

            $scope.roomTypeSelected = function(roomType) {
                roomType.selected = !roomType.selected;
                $scope.selectedRoomTypes = _.pluck($scope.diaryData.filterList.roomType, 'id');
            };

            $scope.foorSelected = function(floor) {
                floor.selected = !floor.selected;
                $scope.selectedFloors = _.pluck($scope.diaryData.filterList.floorList, 'id');
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