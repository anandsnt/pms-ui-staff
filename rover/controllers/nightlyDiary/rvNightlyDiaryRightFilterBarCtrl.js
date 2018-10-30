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
				if (_.isEmpty($scope.diaryData.filterList)) {
					var successCallBackFetchRoomTypeAndFloorList = function(data) {

						$scope.$emit('hideLoader');
						$scope.diaryData.selectedRoomCount = 0;
						$scope.diaryData.selectedFloorCount = 0;
						$scope.diaryData.filterList.roomType = data.rooms;
						$scope.diaryData.filterList.floorList = data.floors;
					};

					$scope.invokeApi(RVNightlyDiaryRightFilterBarSrv.fetchRoomTypeAndFloorList, {}, successCallBackFetchRoomTypeAndFloorList);
				}
			};

			/*
			 * To toggle room selection
			 */
			$scope.toggleRoomSelection = function(index) {
				$scope.diaryData.filterList.roomType[index].isSelected = !$scope.diaryData.filterList.roomType[index].isSelected;
				if ($scope.diaryData.filterList.roomType[index].isSelected) {
					$scope.diaryData.selectedRoomCount++;
				} else {
					$scope.diaryData.selectedRoomCount--;
				}
			};

			/*
			 * To toggle floor selection
			 */
			$scope.toggleFloorSelection = function(index) {
				$scope.diaryData.filterList.floorList[index].isSelected = !$scope.diaryData.filterList.floorList[index].isSelected;
				if ($scope.diaryData.filterList.floorList[index].isSelected) {
					$scope.diaryData.selectedFloorCount++;
				} else {
					$scope.diaryData.selectedFloorCount--;
				}
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
						if (roomtype.isSelected) {
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
						if (floor.isSelected) {
							selectedFloors.push(floor.id);
						}
					});
					return selectedFloors;
				};

				$scope.diaryData.selectedRoomTypes = getSelectedRoomTypes($scope.diaryData.filterList.roomType);
				$scope.diaryData.selectedFloors = getSelectedFloors($scope.diaryData.filterList.floorList);
				$scope.$emit('REFRESH_DIARY_SCREEN');
			};

			/*
			 *	Method to reset room type, floor filters
			 */
			var resetFilters = function() {
				var roomTypes = $scope.diaryData.filterList.roomType,
					floorList = $scope.diaryData.filterList.floorList;

				if (roomTypes && roomTypes.length > 0) {
					roomTypes.forEach(function(roomtype) {
						roomtype.isSelected = false;
					});
				}

				if (floorList && floorList.length > 0) {
					floorList.forEach(function(floor) {
						floor.isSelected = false;
					});
				}

				$scope.diaryData.selectedRoomTypes = [];
				$scope.diaryData.selectedFloors = [];
				$scope.diaryData.selectedFloorCount = 0;
				$scope.diaryData.selectedRoomCount = 0;
			};

			var listener = $scope.$on('RESET_RIGHT_FILTER_BAR', function() {
				resetFilters();
			});

			initiate();
			
			// destroying listener
			$scope.$on('$destroy', listener);
}]);
