admin.controller('ADBaseEmailRoomExclusionFilterCtrl', ['$scope', 'ADEmailSettingsSrv', 'ngTableParams',
	function($scope, ADEmailSettingsSrv, ngTableParams) {

		BaseCtrl.call(this, $scope);
		ADBaseTableCtrl.call(this, $scope, ngTableParams);

		$scope.selectedRoomIdsList = [];
		$scope.unSelectedRoomIdsList = [];
		$scope.data  = {};

		$scope.roomSelection = {
			activeTab: "SELECTED",
			currentSelectedCount: 0,
			areAllRoomsSelected: false,
			areSomeRoomsSelected: false,
			noOfRoomsSelected: 0
		};

		$scope.updateSelectedList = function() {
			$scope.roomSelection.currentSelectedCount = _.where($scope.data, {
				isSelected: true
			}).length;

			$scope.roomSelection.areAllRoomsSelected = $scope.data.length > 0 && $scope.roomSelection.currentSelectedCount === $scope.data.length;
			$scope.roomSelection.areSomeRoomsSelected = $scope.roomSelection.currentSelectedCount > 0 && !$scope.roomSelection.areAllRoomsSelected;
		};

		/**
		 * [updateDataSet update the list of items that needs to be saved to sever]
		 * @return {[type]} [description]
		 */
		$scope.updateDataSet = function() {
			if ($scope.roomSelection.activeTab === "SELECTED") {
				$scope.selectedRoomIdsList = ADEmailSettingsSrv.processSelectedRooms($scope.selectedRoomIdsList,$scope.data);
				console.log($scope.selectedRoomIdsList);
			} else {
				$scope.unSelectedRoomIdsList = ADEmailSettingsSrv.processSelectedRooms($scope.unSelectedRoomIdsList,$scope.data);
				console.log($scope.unSelectedRoomIdsList);
			}
		};

		/**
		 * [toggleSelectAllRooms choose All/ unselect All]
		 * @return {[type]} [description]
		 */
		$scope.toggleSelectAllRooms = function() {
			$scope.roomSelection.areAllRoomsSelected = !$scope.roomSelection.areAllRoomsSelected;
			_.each($scope.data, function(room) {
				room.isSelected = $scope.roomSelection.areAllRoomsSelected;
			});
			$scope.updateSelectedList();
		};

		$scope.toggleSelectRoom = function(room) {
			room.isSelected = !room.isSelected;
			if (!room.isSelected) {
				//if unselected delete the Item in the list
				$scope.updateDataSet();
			}
			$scope.updateSelectedList();
		};

	}
]);