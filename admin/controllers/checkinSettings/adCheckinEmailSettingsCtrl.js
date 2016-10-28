admin.controller('ADCheckinEmailSettingsCtrl', ['$scope', 'ADCheckinEmailSettingsSrv', 'ngTableParams',
	function($scope, ADCheckinEmailSettingsSrv, ngTableParams) {

		BaseCtrl.call(this, $scope);
		ADBaseTableCtrl.call(this, $scope, ngTableParams);

		var initController = function() {
			$scope.roomSelection = {
				activeTab: "SELECTED",
				currentSelectedCount: 0,
				areAllRoomsSelected: false,
				areSomeRoomsSelected: false,
				noOfRoomsSelected: 0
			};
			$scope.loadTable(),
				updateSelectedList = function() {
					$scope.roomSelection.currentSelectedCount = _.where($scope.data, {
						isSelected: true
					}).length;

					$scope.roomSelection.areAllRoomsSelected = $scope.data.length > 0 && $scope.roomSelection.currentSelectedCount === $scope.data.length;
					$scope.roomSelection.areSomeRoomsSelected = $scope.roomSelection.currentSelectedCount > 0 && !$scope.roomSelection.areAllRoomsSelected;
				},
				onSaveSuccess = function() {
					$scope.reloadTable();
					$scope.$emit("ASSIGNMENT_CHANGED");
					updateSelectedList();
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

		$scope.toggleAvailableRooms = function() {
			$scope.roomSelection.activeTab = $scope.roomSelection.activeTab === "UNSELECTED" ? "SELECTED" : "UNSELECTED";
			$scope.reloadTable();
		};

		$scope.fetchTableData = function($defer, params) {
			var getParams = $scope.calculateGetParams(params),
				fetchSuccessOfItemList = function(data) {
					$scope.$emit('hideLoader');
					$scope.currentClickedElement = -1;
					$scope.totalCount = data.total_count;
					$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
					$scope.roomSelection.noOfRoomsSelected =
						($scope.roomSelection.activeTab === "SELECTED") ? data.total_count : $scope.roomSelection.noOfRoomsSelected;
					$scope.data = data.rooms;
					$scope.currentPage = params.page();
					params.total(data.total_count);
					$defer.resolve($scope.data);
					updateSelectedList();
				};
			if ($scope.roomSelection.activeTab === "UNSELECTED") {
				$scope.invokeApi(ADCheckinEmailSettingsSrv.fetchUnselectedRoomList, getParams, fetchSuccessOfItemList);
			} else {
				$scope.invokeApi(ADCheckinEmailSettingsSrv.fetchSelectedRoomList, getParams, fetchSuccessOfItemList);
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

		$scope.toggleSelectAllRooms = function() {
			$scope.roomSelection.areAllRoomsSelected = !$scope.roomSelection.areAllRoomsSelected;
			_.each($scope.data, function(room) {
				room.isSelected = $scope.roomSelection.areAllRoomsSelected;
			});
			updateSelectedList();
		};

		$scope.toggleSelectRoom = function(room) {
			room.isSelected = !room.isSelected;
			updateSelectedList();
		};

		$scope.onSaveChanges = function() {
			var selectedRooms = _.where($scope.data, {
					isSelected: true
				}),
				params = {
					room_ids: _.pluck(selectedRooms, 'id')
				};
			console.log(params.room_ids);
			// if ($scope.roomSelection.activeTab === "AVAILABLE") {
			// 	$scope.invokeApi(ADFloorSetupSrv.assignRooms, params, onSaveSuccess);
			// } else {
			// 	$scope.invokeApi(ADFloorSetupSrv.unAssignRooms, params, onSaveSuccess);
			// }
		};

		initController();
	}
]);