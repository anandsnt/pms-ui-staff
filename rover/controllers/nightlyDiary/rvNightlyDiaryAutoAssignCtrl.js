angular.module('sntRover')
.controller('nightlyDiaryAutoAssignController',
    [
        '$scope',
        'RVNightlyDiarySrv',
        '$timeout',
        function(
            $scope,
            RVNightlyDiarySrv,
            $timeout
        ) {
            BaseCtrl.call(this, $scope);
            var initVariables = function() {
                $scope.selectedRoomTypes = [];
                $scope.selectedFloors = [];
            }, setAutoAssignStatus = function(response) {
                $scope.diaryData.autoAssign.status = response.auto_room_assignment_status;
                switch (response.auto_room_assignment_status) {
                    case 'pending':
                        $scope.diaryData.autoAssign.statusText = 'Diary is locked until process is completed';
                        $scope.diaryData.autoAssign.statusClass = '';
                        break;
                    case 'failed':
                        $scope.diaryData.autoAssign.statusText = '0 Rooms Assigned';
                        $scope.diaryData.autoAssign.statusClass = 'failed';
                        break;
                    case 'partial':
                        $scope.diaryData.autoAssign.statusText = 'Some Reservations Remain Unassigned';
                        $scope.diaryData.autoAssign.statusClass = 'semi-completed';
                        break;
                    case 'completed':
                        $scope.diaryData.autoAssign.statusText = 'Rooms Assigned to All Reservations';
                        $scope.diaryData.autoAssign.statusClass = 'completed';
                        break;
                }
            };

            $scope.roomTypeSelected = function(roomType) {
                roomType.selected = !roomType.selected;
                $scope.selectedRoomTypes = _.pluck(_.where($scope.diaryData.filterList.roomType, {selected: true}), 'id');
            };

            $scope.floorSelected = function(floor) {
                floor.selected = !floor.selected;
                $scope.selectedFloors = _.pluck(_.where($scope.diaryData.filterList.floorList, {selected: true}), 'id');
            };

            $scope.cancelAutoAssign = function() {
                initVariables();
                $scope.$emit('CLOSE_AUTO_ASSIGN_OVERLAY');
            };

            $scope.autoAssignRooms = function() {
                var data = {
                    'reservation_ids': _.pluck($scope.diaryData.unassignedReservationList.reservations, 'reservation_id'),
                    'room_type_ids': $scope.selectedRoomTypes,
                    'floor_ids': $scope.selectedFloors,
                    'apply_room_preferences': true
                };

                RVNightlyDiarySrv.initiateAutoAssignRooms(data).then(function(response) {
                    setAutoAssignStatus(response);
                    $timeout($scope.refreshAutoAssignStatus(), 500);
                });
            };

            $scope.refreshAutoAssignStatus = function() {
                RVNightlyDiarySrv.fetchAutoAssignStatus().then(setAutoAssignStatus);
            };

            $scope.unlockRoomDiary = function() {
                RVNightlyDiarySrv.unlockRoomDiary().then(function(response) {
                    if (!response.is_diary_locked) {
                        $scope.cancelAutoAssign();
                    }
                });
            };

            initVariables();
        }
    ]
);