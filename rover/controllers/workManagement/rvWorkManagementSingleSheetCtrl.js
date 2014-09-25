sntRover.controller('RVWorkManagementSingleSheetCtrl', ['$rootScope', '$scope', '$stateParams', 'wmWorkSheet', 'RVWorkManagementSrv', '$timeout', '$state',
	function($rootScope, $scope, $stateParams, wmWorkSheet, RVWorkManagementSrv, $timeout, $state) {
		BaseCtrl.call(this, $scope);
		$scope.setHeading("Work Sheet No." + $stateParams.id + ", " + $stateParams.date);
		$rootScope.setPrevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start'
		};

		$scope.setScroller("workSheetUnassigned");
		$scope.setScroller("workSheetAssigned");

		$scope.singleState = {
			workSheet: {
				user_id: wmWorkSheet.maid_id === null ? "" : wmWorkSheet.maid_id,
				work_type_id: wmWorkSheet.work_type_id === null ? "" : wmWorkSheet.work_type_id,
				shift_id: 1
			},
			unassigned: [],
			assigned: [],
			summary: {
				timeAllocated: "00:00",
				departures: 0,
				stayovers: 0,
				completed: 0
			},
			filters: {
				selectedFloor: ""
			}
		};

		var refreshView = function() {
			$scope.refreshScroller("workSheetUnassigned");
			$scope.refreshScroller("workSheetAssigned");
		}

		$scope.assignRoom = function(room) {
			$scope.singleState.unassigned.splice(_.indexOf($scope.singleState.unassigned, _.find($scope.singleState.unassigned, function(item) {
				return item.room_no === room.room_no;
			})), 1);
			$scope.singleState.assigned.push(room);
			refreshView();
		}

		$scope.unAssignRoom = function(room) {
			$scope.singleState.assigned.splice(_.indexOf($scope.singleState.assigned, _.find($scope.singleState.assigned, function(item) {
				return item.room_no === room.room_no;
			})), 1);
			$scope.singleState.unassigned.push(room);
			refreshView();
		}

		$scope.deletWorkSheet = function() {
			var onDeleteSuccess = function(data) {
					$state.go('rover.workManagement.start');
					$scope.$emit("hideLoader");
				},
				onDeleteFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
					$scope.$emit("hideLoader");
				};
			$scope.invokeApi(RVWorkManagementSrv.deleteWorkSheet, {
				"id": $stateParams.id
			}, onDeleteSuccess, onDeleteFailure);
		}

		$scope.saveWorkSheet = function() {
			if (!$scope.singleState.workSheet.work_type_id) {
				$scope.errorMessage = ['Please select a work type.'];
				return false;
			}
			if (!$scope.singleState.workSheet.user_id) {
				$scope.errorMessage = ['Please select a employee.'];
				return false;
			}
			var assignedRooms = [],
				onSaveSuccess = function(data) {
					$scope.$emit("hideLoader");
					$scope.clearErrorMessage();
				},
				onSaveFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
					$scope.$emit("hideLoader");
				};

			_.each($scope.singleState.assigned, function(room) {
				assignedRooms.push(room.room_id || room.id);
			});

			$scope.invokeApi(RVWorkManagementSrv.saveWorkSheet, {
				"date": $stateParams.date,
				"task_id": $scope.singleState.workSheet.work_type_id,
				"order": "",
				"assignments": [{
					"assignee_id": $scope.singleState.workSheet.user_id,
					"room_ids": assignedRooms,
					"work_sheet_id": $stateParams.id
				}]
			}, onSaveSuccess, onSaveFailure);
		}

		var init = function() {
			if (true) {
				var onFetchSuccess = function(data) {
						$scope.singleState.unassigned = data.unassigned;
						var assignedRooms = [],
							worksheets = _.where(data.work_sheets, {
								work_sheet_id: parseInt($stateParams.id)
							});

						if (worksheets.length > 0) {
							_.each(worksheets[0].work_assignments, function(room) {
								assignedRooms.push(room.room);
							});
						}

						$scope.singleState.assigned = assignedRooms;
						refreshView();
						$scope.$emit('hideLoader');
					},
					onFetchFailure = function(errorMessage) {
						$scope.errorMessage = errorMessage;
						$scope.$emit('hideLoader');
					}
				$scope.invokeApi(RVWorkManagementSrv.fetchWorkSheetDetails, {
					"date": $stateParams.date,
					"employee_ids": [$scope.singleState.workSheet.user_id],
					"work_type_id": $scope.singleState.workSheet.work_type_id
				}, onFetchSuccess, onFetchFailure);
			}
		}
		init();
	}
]);