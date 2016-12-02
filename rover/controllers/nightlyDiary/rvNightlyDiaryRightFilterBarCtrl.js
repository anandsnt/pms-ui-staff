angular.module('sntRover')
.controller('rvNightlyDiaryRightFilterBarController',
    [   '$scope',
        'RVNightlyDiaryRightFilterBarSrv',
        function(
            $scope,
            RVNightlyDiaryRightFilterBarSrv
        ) {

        BaseCtrl.call(this, $scope);

            /*
             * Initiate controller
             */
            var initiate = function() {
                var postData = {};
                var successCallBackFetchFilterList = function(data) {
                    $scope.$emit('hideLoader');
                    $scope.diaryData.filterList = data;
                    $scope.selectedRoomCount = initCount(data.room_type);
                    $scope.selectedFloorCount = initCount(data.floor_list);
                }
                $scope.invokeApi(RVNightlyDiaryRightFilterBarSrv.fetchFilterList, postData, successCallBackFetchFilterList);
            };

            /*
             * Initialise count of selected objects in filter list
             */
            var initCount = function(arr) {
                var count = 0;
                arr.forEach(function (arr) {
                    if(arr.is_selected) {
                        count++;
                    }
                });
                return count;
            };

            initiate();       
}]);
