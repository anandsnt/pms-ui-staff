angular.module('sntRover')
.controller('rvNightlyDiaryTopEditBarController',
    [   '$scope',
        '$state',
        'RVNightlyDiarySrv',
        'ngDialog',
        function(
            $scope, $state, RVNightlyDiarySrv, ngDialog
        ) {

            BaseCtrl.call(this, $scope);

            $scope.cancelEditReservation = function() {
                $scope.$emit('CANCEL_RESERVATION_EDITING');
            };

            // Handle validation popup close.
            $scope.closeDialogAndRefresh = function() {
                $scope.$emit('CANCEL_RESERVATION_EDITING');
                ngDialog.close();
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

            /**
             *  Retrieve Available Rooms
             *  @param {Object} - [selected reservation Item]
             */
            var retrieveAvailableRooms = function( selectedItem ) {
                
                var successCallBack = function(data) {
                    $scope.errorMessage = '';
                    var roomCount = data.rooms.length;

                    if ( roomCount === 0 ) {
                        ngDialog.open({
                            template: '/assets/partials/nightlyDiary/rvNightlyDiaryNoAvailableRooms.html',
                            className: '',
                            scope: $scope
                        });
                    }
                    else {
                        var newData = {
                            availableRoomList: data.rooms,
                            fromDate: selectedItem.arrival_date,
                            nights: selectedItem.number_of_nights,
                            reservationId: selectedItem.reservation_id,
                            roomTypeId: selectedItem.room_type_id,
                            type: 'MOVE_ROOM'
                        };

                        $scope.$emit('SHOW_ASSIGN_ROOM_SLOTS', newData );
                    }
                },
                failureCallBackMethod = function(errorMessage) {
                    $scope.errorMessage = errorMessage;
                    if (errorMessage[0] === "Suite Room Type Assigned") {
                        ngDialog.open({
                            template: '/assets/partials/nightlyDiary/rvNightlyDiarySuiteRooms.html',
                            className: '',
                            scope: $scope
                        });
                    }
                },
                postData = {
                    'reservation_id': selectedItem.reservation_id,
                    'selected_room_type_ids': [selectedItem.room_type_id],
                    'include_dueout': true,
                    'include_preassigned': true,
                    'is_from_diary': true
                },
                options = {
                    params: postData,
                    successCallBack: successCallBack,
                    failureCallBack: failureCallBackMethod
                };

                $scope.callAPI(RVNightlyDiarySrv.retrieveAvailableRooms, options );
            };

            // CICO-36015 Handle room move button click.
            $scope.moveRoomButtonClick = function() {
                var selectedItem = {
                    arrival_date: $scope.currentSelectedReservation.arrival_date,
                    number_of_nights: $scope.currentSelectedReservation.number_of_nights,
                    reservation_id: $scope.currentSelectedReservation.id,
                    room_type_id: (_.findWhere($scope.diaryData.diaryRoomsList, { id: $scope.diaryData.selectedRoomId })).room_type_id
                };

                retrieveAvailableRooms(selectedItem);
            };

            // CICO-36015 Handle cancel room move button click.
            $scope.cancelMoveRoomButtonClick = function() {
                $scope.$emit('HIDE_ASSIGN_ROOM_SLOTS');
            };

            // CICO-62103 Handle Unassign Room button click.
            $scope.unAssignRoomButtonClick = function() {
                var successCallBack = function(data) {
                    $scope.$emit('UPDATE_UNASSIGNED_RESERVATIONLIST', 'REFRESH');
                    $scope.$emit('UPDATE_RESERVATIONLIST');
                },
                failureCallBack = function(errorMessage) {
                    $scope.$emit('SHOW_ERROR_MESSAGE', errorMessage[0]);
                },
                postData = {
                    'id': $scope.currentSelectedReservation.id,
                    'is_from_diary': true
                },
                options = {
                    params: postData,
                    successCallBack: successCallBack,
                    failureCallBack: failureCallBack
                };

                $scope.callAPI(RVNightlyDiarySrv.unAssignRoom, options );
            };

        }
]);