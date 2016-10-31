admin.controller('ADCheckinEmailSettingsCtrl', ['$scope', '$controller', 'ADEmailSettingsSrv', 'ngTableParams',
	function($scope, $controller, ADEmailSettingsSrv, ngTableParams) {

		$controller('ADBaseEmailRoomExclusionFilterCtrl', {
			$scope: $scope
		});

		/**
		 * [toggleAvailableRooms tab actions]
		 * @return {[type]} [description]
		 */
		$scope.toggleAvailableRooms = function() {
			$scope.roomSelection.activeTab = $scope.roomSelection.activeTab === "UNSELECTED" ? "SELECTED" : "UNSELECTED";
			$scope.reloadTable();
		};

		$scope.fetchTableData = function($defer, params) {
			var getParams = $scope.calculateGetParams(params);
			var fetchSuccessOfItemList = function(data) {
				$scope.$emit('hideLoader');
				$scope.currentClickedElement = -1;
				$scope.totalCount = data.total_count;
				$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
				$scope.data = data.rooms;
				if ($scope.roomSelection.activeTab === "SELECTED") {
					//set the isSelected Flag for rooms if in already
					//selected list
					$scope.data = ADEmailSettingsSrv.handleCurrentSelectedPage($scope.selectedRoomIdsList, $scope.data);
					$scope.roomSelection.noOfRoomsSelected = data.total_count;
				} else {
					$scope.data = ADEmailSettingsSrv.handleCurrentSelectedPage($scope.unSelectedRoomIdsList, $scope.data);
				}
				$scope.currentPage = params.page();
				params.total(data.total_count);
				$defer.resolve($scope.data);
				$scope.updateSelectedList();
			};
			if ($scope.roomSelection.activeTab === "UNSELECTED") {
				$scope.invokeApi(ADEmailSettingsSrv.fetchUnselectedCheckinRoomExclusionList, getParams, fetchSuccessOfItemList);
			} else {
				$scope.invokeApi(ADEmailSettingsSrv.fetchSelectedCheckinRoomExclusionList, getParams, fetchSuccessOfItemList);
			}
		};


		$scope.loadTable = function() {
			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: $scope.displyCount, // count per page
				sorting: {
					room_no: 'asc' // initial sorting
				}
			}, {
				total: 0, // length of data
				getData: $scope.fetchTableData
			});
		};


		$scope.onSaveChanges = function() {
			$scope.updateDataSet();
		};

		$scope.loadTable();
	}
]);