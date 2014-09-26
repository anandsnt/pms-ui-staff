sntRover.controller('RVWorkManagementSingleSheetCtrl', ['$rootScope', '$scope', '$stateParams', 'wmWorkSheet', 'RVWorkManagementSrv', '$timeout', '$state',
	function($rootScope, $scope, $stateParams, wmWorkSheet, RVWorkManagementSrv, $timeout, $state) {
		BaseCtrl.call(this, $scope);
		$scope.singleState = {
			workSheet: {
				user_id: wmWorkSheet.maid_id === null ? "" : wmWorkSheet.maid_id,
				work_type_id: wmWorkSheet.work_type_id === null ? "" : wmWorkSheet.work_type_id,
				shift_id: !wmWorkSheet.shift_id ? "" : wmWorkSheet.shift_id,
			},
			unassigned: [],
			unassignedFiltered: [],
			assigned: [],
			summary: {
				timeAllocated: "00:00",
				departures: 0,
				stayovers: 0,
				completed: 0
			},
			filters: {
				selectedFloor: "",
				selectedStatus: ""
			}
		};


		var refreshView = function() {
				$scope.refreshScroller("workSheetUnassigned");
				$scope.refreshScroller("workSheetAssigned");
			},
			init = function() {
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
						$scope.filterRooms();
						summarizeAssignment();
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
			},
			summarizeAssignment = function() {
				$scope.singleState.summary = {
					timeAllocated: "00:00",
					departures: 0,
					stayovers: 0,
					completed: 0
				}
				_.each($scope.singleState.assigned, function(room) {
					if ($scope.departureClass[room.reservation_status] == "check-out") {
						$scope.singleState.summary.departures++;
					} else if ($scope.departureClass[room.reservation_status] == "in-house") {
						$scope.singleState.summary.stayovers++;
					}
					if (room.current_status == "CLEAN" || room.current_status == "INSPECTED") {
						$scope.singleState.summary.completed++;
					}
					// Add up the allocated time
					var existing = $scope.singleState.summary.timeAllocated.split(":"),
						current = room.time_allocated.split(":"),
						sumMinutes = parseInt(existing[1]) + parseInt(current[1]),
						sumHours = (parseInt(existing[0]) + parseInt(current[0]) + parseInt(sumMinutes / 60)).toString();

					$scope.singleState.summary.timeAllocated = (sumHours.length < 2 ? "0" + sumHours : sumHours) +
						":" +
						((sumMinutes % 60).toString().length < 2 ? "0" + (sumMinutes % 60).toString() : (sumMinutes % 60).toString());
				});
			};


		$scope.setHeading("Work Sheet No." + wmWorkSheet.sheet_number + ", " + $stateParams.date);

		$rootScope.setPrevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start'
		};

		$scope.setScroller("workSheetUnassigned");
		$scope.setScroller("workSheetAssigned");

		$scope.assignRoom = function(room) {
			$scope.singleState.unassigned.splice(_.indexOf($scope.singleState.unassigned, _.find($scope.singleState.unassigned, function(item) {
				return item.room_no === room.room_no;
			})), 1);
			$scope.singleState.assigned.push(room);
			summarizeAssignment();
			refreshView();
		}

		$scope.unAssignRoom = function(room) {
			$scope.singleState.assigned.splice(_.indexOf($scope.singleState.assigned, _.find($scope.singleState.assigned, function(item) {
				return item.room_no === room.room_no;
			})), 1);
			$scope.singleState.unassigned.push(room);
			summarizeAssignment();
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
					"shift_id": $scope.singleState.workSheet.shift_id,
					"assignee_id": $scope.singleState.workSheet.user_id,
					"room_ids": assignedRooms,
					"work_sheet_id": $stateParams.id
				}]
			}, onSaveSuccess, onSaveFailure);
		}

		$scope.startLoader = function() {
			$scope.$emit('showLoader');
		}

		$scope.filterRooms = function() {
			$scope.singleState.unassignedFiltered = [];
			if (!$scope.singleState.filters.selectedStatus && !$scope.singleState.filters.selectedFloor) {
				$scope.singleState.unassignedFiltered = $scope.singleState.unassigned;

			} else if (!$scope.singleState.filters.selectedStatus) {
				$scope.singleState.unassignedFiltered = _.where($scope.singleState.unassigned, {
					floor_number: $scope.singleState.filters.selectedFloor
				});
			} else if (!$scope.singleState.filters.selectedFloor) {
				$scope.singleState.unassignedFiltered = _.where($scope.singleState.unassigned, {
					current_status: $scope.singleState.filters.selectedStatus
				});
			} else { //Both Filters
				$scope.singleState.unassignedFiltered = _.where($scope.singleState.unassigned, {
					current_status: $scope.singleState.filters.selectedStatus,
					floor_number: $scope.singleState.filters.selectedFloor
				});
			}
			refreshView();
			$scope.$emit('hideLoader');
		}

		$scope.onWorkTypeChange = function() {
			init();
		}

		init();
	}

]);