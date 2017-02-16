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
				$scope.hideRoomType = true;
				$scope.hideFloorList = true;
				$scope.diaryData.filterList = {};
				var postData = {};
				
				var successCallBackFetchRoomType = function(data) {
					$scope.$emit('hideLoader');
					$scope.selectedRoomCount = 0;
					$scope.diaryData.filterList.room_type = data.results;
				}
				$scope.invokeApi(RVNightlyDiaryRightFilterBarSrv.fetchRoomType, postData, successCallBackFetchRoomType);

				var successCallBackFetchFloorList = function(data) {
					$scope.$emit('hideLoader');
					$scope.selectedFloorCount = 0;
					$scope.diaryData.filterList.floor_list = data.floors;
				}
				$scope.invokeApi(RVNightlyDiaryRightFilterBarSrv.fetchFloorList, postData, successCallBackFetchFloorList);
			};

			/*
			 * To toggle room selection
			 */
			$scope.toggleRoomSelection = function(index) {
				$scope.diaryData.filterList.room_type[index].is_selected = !$scope.diaryData.filterList.room_type[index].is_selected;
				$scope.diaryData.filterList.room_type[index].is_selected === true ? $scope.selectedRoomCount++ : $scope.selectedRoomCount--;
			};

			/*
			 * To toggle floor selection
			 */
			$scope.toggleFloorSelection = function(index) {
				$scope.diaryData.filterList.floor_list[index].is_selected = !$scope.diaryData.filterList.floor_list[index].is_selected;
				$scope.diaryData.filterList.floor_list[index].is_selected === true ? $scope.selectedFloorCount++ : $scope.selectedFloorCount--;
			};

			/*
			 * Method to apply filter
			 */
			$scope.applyFilter = function() {
				var selectedRoomTypes = [],
					selectedFloors = [];

				/*
				 * Creating an array of selected room types to apply filter.
				 */
				var getSelectedRoomTypes = function(roomTypes) {
					roomTypes.forEach(function(roomtype) {
						if(roomtype.is_selected) {
							selectedRoomTypes.push(roomtype.id);
						}
					});
					return selectedRoomTypes;
				};

				/*
				 * Creating an array of selected floors to apply filter.
				 */
				var getSelectedFloors = function(floorList) {
					floorList.forEach(function(floor) {
						if(floor.is_selected) {
							selectedFloors.push(floor.id);
						}
					});
					return selectedFloors;
				};

				$scope.diaryData.selectedRoomTypes = getSelectedRoomTypes($scope.diaryData.filterList.room_type);
				$scope.diaryData.selectedFloors = getSelectedFloors($scope.diaryData.filterList.floor_list);
				$scope.$emit('REFRESH_DIARY_SCREEN');
			};

			initiate();
}]);
