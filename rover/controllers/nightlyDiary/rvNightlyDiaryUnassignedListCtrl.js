angular.module('sntRover')
.controller('rvNightlyDiaryUnassignedListController',
    [   '$scope',
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
        $scope.selectedItem = {};

        // Handle validation popup close.
        $scope.closeDialog = function() {
            $scope.selectedItem = {};
            $scope.$emit("RESET_RIGHT_FILTER_BAR_AND_REFRESH_DIARY");
            ngDialog.close();
        };

        /**
         *  Retrieve Available Rooms
         *  @param {Object} - [selected reservation Item]
         */
        var retrieveAvailableRooms = function( selectedItem ) {
            $scope.selectedItem = selectedItem;
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
                        type: 'ASSIGN_ROOM'
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
                'include_dueout': true
            },
            options = {
                params: postData,
                successCallBack: successCallBack,
                failureCallBack: failureCallBackMethod
            };

            $scope.callAPI(RVNightlyDiarySrv.retrieveAvailableRooms, options );
        };

        /**
         *  Handle unassigned reservation items
         *  @param {int} - [index value of reservations]
         */
        $scope.clickedUnassignedItem = function( index ) {
            var item = $scope.diaryData.unassignedReservationList.reservations[index];

            retrieveAvailableRooms(item);
        };

        $scope.addListener('SUCCESS_ROOM_ASSIGNMENT', function() {
            var unassignedReservationList = $scope.diaryData.unassignedReservationList.reservations;

            // Update unassigned reservation list...
            unassignedReservationList = _.reject( unassignedReservationList,
                function(obj) {
                    return obj.reservation_id === $scope.selectedItem.reservation_id; 
                }
            );

            $scope.diaryData.unassignedReservationList.reservations = [];
            $scope.diaryData.unassignedReservationList.reservations = unassignedReservationList;
            $scope.selectedItem = {};

            $scope.$emit('HIDE_ASSIGN_ROOM_SLOTS');
        });

        $scope.addListener('RESET_UNASSIGNED_LIST_SELECTION', function() {
             $scope.selectedItem = {};
        });

}]);