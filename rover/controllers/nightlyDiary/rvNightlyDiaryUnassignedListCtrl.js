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
        $scope.selectedResId = null;
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
                        reservationId: selectedItem.reservation_id
                    };

                    $scope.selectedResId = selectedItem.reservation_id;
                    $scope.$emit('SHOW_AVALAILABLE_ROOM_SLOTS', newData );
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
                'room_type_ids': [selectedItem.room_type_id],
                'is_from_diary': true
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

        var listener = $scope.$on('RESET_UNASSIGNED_LIST_SELECTION', function() {
            $scope.selectedResId = null;
            
        });

        $scope.$on('$destroy', listener);
}]);