admin.controller('ADCheckinEmailSettingsCtrl', ['$scope', 'ADCheckinEmailSettingsSrv', 'ngTableParams',
	function($scope, ADCheckinEmailSettingsSrv, ngTableParams) {

		BaseCtrl.call(this, $scope);
		ADBaseTableCtrl.call(this, $scope, ngTableParams);

		var selectedRoomIdsList = [];
		var unSelectedRoomIdsList = [];

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
				};
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

		/**
		 * [toggleAvailableRooms tab actions]
		 * @return {[type]} [description]
		 */
		$scope.toggleAvailableRooms = function() {
			$scope.roomSelection.activeTab = $scope.roomSelection.activeTab === "UNSELECTED" ? "SELECTED" : "UNSELECTED";
			$scope.reloadTable();
		};

		/**
		 * [processSelectedRooms remove the unselected item]
		 * @param  {[type]} roomIds [description]
		 * @return {[type]}         [description]
		 */
		var processSelectedRooms = function(roomIds) {

			var selectedRooms = _.where($scope.data, {
					isSelected: true
			}),currentPageRoomIds = _.pluck(selectedRooms, 'id');

			roomIds = _.union(roomIds, currentPageRoomIds);

			_.each($scope.data, function(room) {
				_.each(roomIds, function(roomId, key) {
					if (room.id === roomId && !room.isSelected) {
						roomIds.splice(key, 1);
					}
				});
			});
			return  roomIds;
		};

		/**
		 * [handleCurrentSelectedPage on page change, mark already selected item as selected]
		 * @param  {[type]} alreadyChosenRoomIds [description]
		 * @return {[type]}                      [description]
		 */
		var handleCurrentSelectedPage = function(alreadyChosenRoomIds) {
			_.each($scope.data, function(room) {
				_.each(alreadyChosenRoomIds, function(roomId, key) {
					if (room.id === roomId) {
						room.isSelected = true;
					}
				});
			});
		};

		$scope.fetchTableData = function($defer, params) {
			var getParams = $scope.calculateGetParams(params),
				fetchSuccessOfItemList = function(data) {
					$scope.$emit('hideLoader');
					$scope.currentClickedElement = -1;
					$scope.totalCount = data.total_count;
					$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
					$scope.data = data.rooms;
					if ($scope.roomSelection.activeTab === "SELECTED") {
						handleCurrentSelectedPage(selectedRoomIdsList);
						$scope.roomSelection.noOfRoomsSelected = data.total_count;
					}else{
						handleCurrentSelectedPage(unSelectedRoomIdsList);
					}
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
			
			if ($scope.roomSelection.activeTab === "SELECTED") {
				selectedRoomIdsList = processSelectedRooms(selectedRoomIdsList);
				console.log(selectedRoomIdsList);
			} else {
				unSelectedRoomIdsList = processSelectedRooms(unSelectedRoomIdsList);
				console.log(unSelectedRoomIdsList);
			}
		};

		initController();
	}
]);