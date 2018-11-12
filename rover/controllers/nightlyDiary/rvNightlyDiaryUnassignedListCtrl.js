angular.module('sntRover')
.controller('rvNightlyDiaryUnassignedListController',
    [   '$scope',
        '$rootScope',
        'RVNightlyDiarySrv',
        '$state',
        '$stateParams',
        '$filter',
        'ngDialog',
        function(
            $scope,
            $rootScope,
            RVNightlyDiarySrv,
            $state,
            $stateParams,
            $filter,
            ngDialog
        ) {

        BaseCtrl.call(this, $scope);
        
        var retrieveAvailableRooms = function( selectedItem ) {
            var successCallBack = function(data) {
                $scope.errorMessage = '';
                var roomCount = data.rooms.length;

                if ( roomCount === 0 ) {
                    console.log("NO ROOMS AVAIALBLE");
                }
                else {
                    var newData = {
                        availableRoomList: data.rooms,
                        fromDate: selectedItem.arrival_date,
                        nights: selectedItem.number_of_nights
                    };

                    $scope.$emit('SHOW_AVALAILABLE_ROOM_SLOTS', newData );
                }
            },
            failureCallBackMethod = function(errorMessage) {
                $scope.errorMessage = errorMessage;
                console.log(errorMessage);
                if (errorMessage[0] === "Suite Room Type Assigned") {
                    console.log("Suite Room Type Assigned");
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

        $scope.clickedUnassignedItem = function( index ) {
            var item = $scope.diaryData.unassignedReservationList.reservations[index];
            console.log(item);
            retrieveAvailableRooms(item);
        };
}]);