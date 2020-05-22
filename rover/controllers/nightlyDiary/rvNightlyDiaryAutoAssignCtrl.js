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
                        reservations.push(..._.filter($scope.diaryData.unassignedReservationList.reservations, {room_type_id: roomTypeId}));
                    });
                    reservations = _.reject(reservations, {is_hourly: true});
                    reservationIDs = _.pluck(reservations, 'reservation_id');
                }
                return reservationIDs;
            };

            /**
             * Collect the selected roomtype ids and reset the reservation ids
             * @params {Object} - roomType
             * @return {undefined}
             */
            $scope.roomTypeSelected = function(roomType) {
                roomType.selected = !roomType.selected;
                $scope.selectedRoomTypes = _.pluck(_.where($scope.diaryData.filterList.roomType, {selected: true}), 'id');
                $scope.selectedReservations = filterReservationIDs();
            };

            /**
             * Function call on selecting a floor from the dropdown
             * @params {Object} - floor
             * @return {undefined}
             */
            $scope.floorSelected = function(floor) {
                floor.selected = !floor.selected;
                $scope.selectedFloors = _.pluck(_.where($scope.diaryData.filterList.floorList, {selected: true}), 'id');
            };

            /**
             * Cancel and/or close the autoAssign overlay template
             */
            $scope.cancelAutoAssign = function() {
                initVariables();
                $scope.diaryData.autoAssign = {
                    showOverlay: false,
                    isLocked: false,
                    status: '',
                    statusText: '',
                    statusClass: ''
                };
            };

            /**
             * Auto assign API caller
             */
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

            /**
             * Function to fetch the auto assign status and reset the header
             */
            $scope.refreshAutoAssignStatus = function() {
                RVNightlyDiarySrv.fetchAutoAssignStatus().then(function(response) {
                    $scope.$emit('REFRESH_AUTO_ASSIGN_STATUS', response)
                });
            };

            /**
             * Unlocks room diary after completion of the autoAssign process
             * Then refresh the diary data
             */
            $scope.unlockRoomDiary = function() {
                RVNightlyDiarySrv.unlockRoomDiary().then(function(response) {
                    if (!response.is_diary_locked) {
                        $scope.cancelAutoAssign();
                        $scope.$emit('RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY');
                    }
                });
            };

            initVariables();
        }
    ]
);