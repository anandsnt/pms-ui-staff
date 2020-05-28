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
                $scope.showRoomTypes = false;
                $scope.showFloors = false;
                $scope.selectedReservations = filterReservationIDs();
            }, clearFilters = function() {
                if ($scope.selectedRoomTypes.length !== 0) {
                    $scope.selectedRoomTypes.forEach(function(roomTypeId) {
                        _.findWhere($scope.diaryData.filterList.roomType, {id: roomTypeId}).selected = false;
                    });
                }
                if ($scope.selectedFloors.length !== 0) {
                    $scope.selectedFloors.forEach(function(floorId) {
                        _.findWhere($scope.diaryData.filterList.floorList, {id: floorId}).selected = false;
                    });
                }
            }, filterReservationIDs = function() {
                var reservationIDs = [],
                    reservations = [];

                if ($scope.selectedRoomTypes.length === 0) {
                    reservations = angular.copy($scope.diaryData.unassignedReservationList.reservations);
                } else {
                    $scope.selectedRoomTypes.forEach(function(roomTypeId) {
                        reservations.push(..._.filter($scope.diaryData.unassignedReservationList.reservations, {room_type_id: roomTypeId}));
                    });
                }
                reservations = _.reject(reservations, {is_hourly: true});
                reservations = _.reject(reservations, {is_suite_reservation: true});
                reservationIDs = _.pluck(reservations, 'reservation_id');
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
                clearFilters();
                initVariables();
                $scope.diaryData.autoAssign = {
                    showOverlay: false,
                    isLocked: false,
                    status: '',
                    statusText: '',
                    statusDescription: '',
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
                    'apply_room_preferences': true,
                    'process_date': $scope.diaryData.arrivalDate
                },
                options = {
                    params: data,
                    successCallBack: function(response) {
                        $scope.$emit('REFRESH_AUTO_ASSIGN_STATUS', response);
                        $timeout($scope.refreshAutoAssignStatus(), 500);
                    }
                };

                $scope.callAPI(RVNightlyDiarySrv.initiateAutoAssignRooms, options);
            };

            /**
             * Function to fetch the auto assign status and reset the header
             */
            $scope.refreshAutoAssignStatus = function() {
                var options = {
                    successCallBack: function(response) {
                        $scope.$emit('REFRESH_AUTO_ASSIGN_STATUS', response);
                    }
                };

                $scope.callAPI(RVNightlyDiarySrv.fetchAutoAssignStatus, options);
            };

            /**
             * Unlocks room diary after completion of the autoAssign process
             * Then refresh the diary data
             */
            $scope.unlockRoomDiary = function() {
                var options = {
                    successCallBack: function(response) {
                        if (!response.is_diary_locked) {
                            $scope.cancelAutoAssign();
                            $scope.$emit('REFRESH_DIARY_SCREEN');
                            $scope.$emit('UPDATE_UNASSIGNED_RESERVATIONLIST');
                        }
                    }
                };

                $scope.callAPI(RVNightlyDiarySrv.unlockRoomDiary, options);
            };

            $scope.addListener('INITIATE_AUTO_ASSIGN_CTRL', initVariables);
        }
    ]
);