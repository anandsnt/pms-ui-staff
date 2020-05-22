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
                $scope.selectedReservations = filterReservationIDs();
            }, filterReservationIDs = function() {
                var reservationIDs = [];

                if ($scope.selectedRoomTypes.length === 0) {
                    reservationIDs = _.pluck(_.reject($scope.diaryData.unassignedReservationList.reservations, {is_hourly: true}), 'reservation_id');
                } else {
                    var reservations = [];

                    $scope.selectedRoomTypes.forEach(function(roomTypeId) {
                        reservations.push(..._.filter($scope.diaryData.unassignedReservationList.reservations, {room_type_id: roomTypeId}))
                    });
                    reservations = _.reject(reservations, {is_hourly: true});
                    reservationIDs = _.pluck(reservations, 'reservation_id');
                }
                return reservationIDs;
            };

            $scope.roomTypeSelected = function(roomType) {
                roomType.selected = !roomType.selected;
                $scope.selectedRoomTypes = _.pluck(_.where($scope.diaryData.filterList.roomType, {selected: true}), 'id');
                $scope.selectedReservations = filterReservationIDs();
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
                    'reservation_ids': $scope.selectedReservations,
                    'room_type_ids': $scope.selectedRoomTypes,
                    'floor_ids': $scope.selectedFloors,
                    'apply_room_preferences': true
                };

                RVNightlyDiarySrv.initiateAutoAssignRooms(data).then(function(response) {
                    $scope.$emit('REFRESH_AUTO_ASSIGN_STATUS', response);
                    $timeout($scope.refreshAutoAssignStatus(), 500);
                });
            };

            $scope.refreshAutoAssignStatus = function() {
                RVNightlyDiarySrv.fetchAutoAssignStatus().then(function(response) {
                    $scope.$emit('REFRESH_AUTO_ASSIGN_STATUS', response)
                });
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