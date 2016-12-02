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
            };

            // Scroller options for search-results view.
            var scrollerOptions = {
                tap: true,
                preventDefault: false,
                deceleration: 0.0001,
                shrinkScrollbars: 'clip'
            };
            // refresh scroller.
            var refreshScroller = function() {
                $scope.refreshScroller('roomSearchResultList');
            };

            $scope.setScroller('roomSearchResultList', scrollerOptions);

            // Catch refresh event from sibling controller (RoomNumberSearchCtrl) after getting room results
            $scope.$on('REFRESH_ROOM_SEARCH_RESULT', function() {
                refreshScroller();
            });

        }]);