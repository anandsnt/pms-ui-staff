angular.module('sntRover')
.controller('rvNightlyDiaryRoomNumberSearchResultController', 
    [   '$scope',
        '$filter',
        function(
            $scope,
            $filter
        ) {
            BaseCtrl.call(this, $scope);
            /* Fetch diary data - rooms & reservations.
             * @param {Number} RoomId - selected room id from search filters.
            */
            $scope.gotoSelectedRoom = function(room) {
                $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', room.id);
                $scope.diaryData.reservationSearchResults = [];
            };

        }]);