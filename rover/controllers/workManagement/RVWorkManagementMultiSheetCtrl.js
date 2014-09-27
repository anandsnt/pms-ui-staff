sntRover.controller('RVWorkManagementMultiSheetCtrl', ['$rootScope', '$scope', 'ngDialog', 'RVWorkManagementSrv', '$state', '$stateParams', '$timeout',
	function($rootScope, $scope, ngDialog, RVWorkManagementSrv, $state, $stateParams, $timeout) {
		$scope.setHeading("Work Management");

		$rootScope.setPrevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start',
		}

		var init = function() {
				$scope.setScroller('unAssignedRoomList');

				$scope.multiSheetState.selectedEmployees = [];
				_.each($scope.employeeList, function(employee) {
					if (employee.ticked) {
						$scope.multiSheetState.selectedEmployees.push(employee);
					}
				});
				updateView();
				$scope.filterUnassigned();
				refreshView();
			},
			refreshView = function() {
				$timeout(function() {
					$scope.refreshScroller('unAssignedRoomList');
				}, 1000);
			},
			updateView = function() {
				var onFetchSuccess = function(data) {
						$scope.multiSheetState.unassigned = data.unassigned;
						$scope.filterUnassigned();
						$scope.multiSheetState.assignments = {};
						_.each(data.work_sheets, function(worksheet) {
							if (!$scope.multiSheetState.assignments[worksheet.employee_id]) {
								$scope.multiSheetState.assignments[worksheet.employee_id] = {};
								$scope.multiSheetState.assignments[worksheet.employee_id].rooms = [];
								$scope.multiSheetState.assignments[worksheet.employee_id].summary = {
									shift: {
										completed: "00:00",
										total: worksheet.shift
									},
									stayovers: {
										total: 0,
										completed: 0
									},
									departures: {
										total: 0,
										completed: 0
									}
								}
								$scope.multiSheetState.assignments[worksheet.employee_id].worksheetId = worksheet.work_sheet_id;
							}

							var assignmentDetails = $scope.multiSheetState.assignments[worksheet.employee_id];

							_.each(worksheet.work_assignments, function(workAssignment) {
								if (workAssignment.room) {
									if ($scope.departureClass[workAssignment.room.reservation_status] == "check-out") {
										assignmentDetails.summary.departures.total++;
										if (workAssignment.room.current_status == "CLEAN" || workAssignment.room.current_status == "INSPECTED") {
											assignmentDetails.summary.departures.completed++;
										}
									} else if ($scope.departureClass[workAssignment.room.reservation_status] == "in-house") {
										assignmentDetails.summary.stayovers.total++;
										if (workAssignment.room.current_status == "CLEAN" || workAssignment.room.current_status == "INSPECTED") {
											assignmentDetails.summary.stayovers.completed++;
										}
									}
									assignmentDetails.summary.shift.completed = $scope.addDuration(assignmentDetails.summary.shift.completed, workAssignment.room.time_allocated);
									assignmentDetails.rooms.push(workAssignment.room);
								}
							})

						});
						refreshView();
						$scope.$emit('hideLoader');
					},
					onFetchFailure = function(errorMessage) {
						$scope.errorMessage = errorMessage;
						$scope.$emit('hideLoader');
					};

				var selectedEmployees = [];
				_.each($scope.employeeList, function(employee) {
					if (employee.ticked) {
						selectedEmployees.push(employee.id);
					}
				});

				$scope.invokeApi(RVWorkManagementSrv.fetchWorkSheetDetails, {
					"date": $scope.multiSheetState.selectedDate,
					"employee_ids": selectedEmployees,
					"work_type_id": $scope.multiSheetState.header.work_type_id
				}, onFetchSuccess, onFetchFailure);
			};

		$scope.multiSheetState = {
			selectedDate: $stateParams.date || $rootScope.businessDate,
			selectedEmployees: [],
			unassigned: [],
			unassignedFiltered: [],
			header: {
				work_type_id: $scope.workTypes[0].id
			},
			filters: {
				selectedFloor: "",
				selectedStatus: ""
			},
			assignments: {}
		}

		$scope.closeDialog = function() {
			$scope.errorMessage = "";
			ngDialog.close();
		}

		$scope.selectEmployee = function(data) {
			$scope.multiSheetState.selectedEmployees = _.where($scope.employeeList, {
				ticked: true
			});
			$scope.multiSheetState.placeHolders = _.range(6 - $scope.multiSheetState.selectedEmployees.length);;

			/**
			 * Need to disable selection of more than 6 employees
			 */
			if ($scope.multiSheetState.selectedEmployees.length > 5) {
				var notTicked = _.where($scope.employeeList, {
					ticked: false
				});
				_.each(notTicked, function(d) {
					d.checkboxDisabled = true;
				})
			} else {
				var disabledEntries = _.where($scope.employeeList, {
					checkboxDisabled: true
				});
				_.each(disabledEntries, function(d) {
					d.checkboxDisabled = false;
				})
			}

			updateView();
		};

		$scope.filterUnassigned = function() {
			$scope.multiSheetState.unassignedFiltered = [];
			if (!$scope.multiSheetState.filters.selectedStatus && !$scope.multiSheetState.filters.selectedFloor) {
				$scope.multiSheetState.unassignedFiltered = $scope.multiSheetState.unassigned;

			} else if (!$scope.multiSheetState.filters.selectedStatus) {
				$scope.multiSheetState.unassignedFiltered = _.where($scope.multiSheetState.unassigned, {
					floor_number: $scope.multiSheetState.filters.selectedFloor
				});
			} else if (!$scope.multiSheetState.filters.selectedFloor) {
				$scope.multiSheetState.unassignedFiltered = _.where($scope.multiSheetState.unassigned, {
					current_status: $scope.multiSheetState.filters.selectedStatus
				});
			} else { //Both Filters
				$scope.multiSheetState.unassignedFiltered = _.where($scope.multiSheetState.unassigned, {
					current_status: $scope.multiSheetState.filters.selectedStatus,
					floor_number: $scope.multiSheetState.filters.selectedFloor
				});
			}
			refreshView();
			$scope.closeDialog();
		}

		$scope.showCalendar = function(controller) {
			ngDialog.open({
				template: '/assets/partials/workManagement/popups/rvWorkManagementMultiDateFilter.html',
				controller: controller,
				className: 'ngdialog-theme-default single-date-picker',
				closeByDocument: true,
				scope: $scope
			});
		}

		$scope.showFilter = function() {
			ngDialog.open({
				template: '/assets/partials/workManagement/popups/rvWorkManagementFilterRoomsPopup.html',
				className: 'ngdialog-theme-default',
				closeByDocument: true,
				scope: $scope
			});
		}

		$scope.onCancel = function() {
			$state.go('rover.workManagement.start');
		}

		$scope.navigateToIndvl = function(id) {
			if (id) {
				$state.go('rover.workManagement.singleSheet', {
					date: $scope.multiSheetState.selectedDate,
					id: id
				});
			}
		}

		$scope.dropToAssign = function(event, dropped) {
			var assigned = parseInt($(dropped.draggable).attr('id').split('-')[0]);
			var assignedTo = parseInt($(dropped.draggable).attr('id').split('-')[1]);
			var indexOfDropped = parseInt($(dropped.draggable).attr('id').split('-')[2]);
			console.log({
				assigned: assigned,
				assignedTo: assignedTo,
				indexOfDropped: indexOfDropped
			});

		}

		$scope.onDateChanged = function() {
			updateView();
		}

		init();
	}
]);