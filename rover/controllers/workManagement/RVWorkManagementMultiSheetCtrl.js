sntRover.controller('RVWorkManagementMultiSheetCtrl', ['$rootScope', '$scope', 'ngDialog', 'RVWorkManagementSrv', '$state', '$stateParams', '$timeout',
	function($rootScope, $scope, ngDialog, RVWorkManagementSrv, $state, $stateParams, $timeout) {
		BaseCtrl.call(this, $scope);
		$scope.setHeading("Work Management");

		$rootScope.setPrevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start'
		};

		$scope.setScroller('unAssignedRoomList');
		$scope.setScroller("multiSelectEmployees");
		$scope.setScroller('assignedRoomList-1');
		$scope.setScroller('assignedRoomList-2');
		$scope.setScroller('assignedRoomList-3');
		$scope.setScroller('assignedRoomList-4');
		$scope.setScroller('assignedRoomList-5');
		$scope.setScroller('assignedRoomList-0');

		var selectionHistory = [],
			updateView = function(reset) {
				var onFetchSuccess = function(data) {
						$scope.multiSheetState.unassigned = data.unassigned;
						$scope.filterUnassigned();
						// $scope.multiSheetState.assignments = {};
						_.each(data.work_sheets, function(worksheet) {
							if (!$scope.multiSheetState.assignments[worksheet.employee_id] || reset) {
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
								};
								$scope.multiSheetState.assignments[worksheet.employee_id].worksheetId = worksheet.work_sheet_id;
								var assignmentDetails = $scope.multiSheetState.assignments[worksheet.employee_id];
								_.each(worksheet.work_assignments, function(workAssignment) {
									if (workAssignment.room) {
										if ($scope.departureClass[workAssignment.room.reservation_status] === "check-out") {
											assignmentDetails.summary.departures.total++;
											if (workAssignment.room.hk_complete) {
												assignmentDetails.summary.departures.completed++;
											}
										} else if ($scope.departureClass[workAssignment.room.reservation_status] == "inhouse") {
											assignmentDetails.summary.stayovers.total++;
											if (workAssignment.room.hk_complete) {
												assignmentDetails.summary.stayovers.completed++;
											}
										}
										assignmentDetails.summary.shift.completed = $scope.addDuration(assignmentDetails.summary.shift.completed, workAssignment.room.time_allocated);
										assignmentDetails.rooms.push(workAssignment.room);
									}
								});
							}
						});

						_.each($scope.multiSheetState.selectedEmployees, function(employee) {
							var employee = employee.id;
							if (!$scope.multiSheetState.assignments[employee] || reset) {
								$scope.multiSheetState.assignments[employee] = {};
								$scope.multiSheetState.assignments[employee].rooms = [];
								$scope.multiSheetState.assignments[employee].summary = {
									shift: {
										completed: "00:00",
										total: "00:00"
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
							}
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

				$scope.multiSheetState.placeHolders = _.range($scope.multiSheetState.maxColumns - selectedEmployees.length);

				$scope.invokeApi(RVWorkManagementSrv.fetchWorkSheetDetails, {
					"date": $scope.multiSheetState.selectedDate,
					"employee_ids": selectedEmployees,
					"work_type_id": $scope.multiSheetState.header.work_type_id
				}, onFetchSuccess, onFetchFailure);
			},
			init = function() {
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
				$scope.refreshScroller('unAssignedRoomList');
				for (var list = 0; list < $scope.multiSheetState.selectedEmployees.length; list++) {
					$scope.refreshScroller('assignedRoomList-' + list);
				}
			},
			updateSummary = function(employeeId) {
				var assignmentDetails = $scope.multiSheetState.assignments[employeeId];
				assignmentDetails.summary.shift.completed = "00:00";
				assignmentDetails.summary.stayovers = {
					total: 0,
					completed: 0
				};
				assignmentDetails.summary.departures = {
					total: 0,
					completed: 0
				};

				_.each(assignmentDetails.rooms, function(room) {
					if ($scope.departureClass[room.reservation_status] === "check-out") {
						assignmentDetails.summary.departures.total++;
						if (room.hk_complete) {
							assignmentDetails.summary.departures.completed++;
						}
					} else if ($scope.departureClass[room.reservation_status] == "inhouse") {
						assignmentDetails.summary.stayovers.total++;
						if (room.hk_complete) {
							assignmentDetails.summary.stayovers.completed++;
						}
					}
					assignmentDetails.summary.shift.completed = $scope.addDuration(assignmentDetails.summary.shift.completed, room.time_allocated);
				});
				refreshView();
			};

		/**
		 * Object holding all scope variables
		 * @type {Object}
		 */
		$scope.multiSheetState = {
			selectedDate: $stateParams.date || $rootScope.businessDate,
			maxColumns: 6, // Hardcoded to 6 for now ==> Max no of worksheets that are loaded at an instance
			selectedEmployees: [],
			unassigned: [],
			unassignedFiltered: [],
			header: {
				work_type_id: $scope.workTypes[0].id
			},
			assignments: {}
		}

		$scope.filters = {
			selectedFloor: "",
			selectedReservationStatus: "",
			selectedFOStatus: "",
			vipsOnly: false,
			checkin: {
				after: {
					hh: "",
					mm: "",
					am: "AM"
				},
				before: {
					hh: "",
					mm: "",
					am: "AM"
				}
			},
			checkout: {
				after: {
					hh: "",
					mm: "",
					am: "AM"
				},
				before: {
					hh: "",
					mm: "",
					am: "AM"
				}
			}
		}

		$scope.closeDialog = function() {
			$scope.errorMessage = "";
			ngDialog.close();
		}

		/**
		 * Handles RESTRICTING selected employees not to exceed $scope.multiSheetState.maxColumns
		 */
		$scope.selectEmployee = function(data) {
			$scope.multiSheetState.selectedEmployees = _.where($scope.employeeList, {
				ticked: true
			});
			$scope.multiSheetState.placeHolders = _.range($scope.multiSheetState.maxColumns - $scope.multiSheetState.selectedEmployees.length);

			/**
			 * Need to disable selection of more than "$scope.multiSheetState.maxColumns" employees
			 */
			if ($scope.multiSheetState.selectedEmployees.length >= $scope.multiSheetState.maxColumns) {
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
		};

		$scope.filterUnassigned = function() {		
			$scope.multiSheetState.unassignedFiltered = $scope.filterUnassignedRooms($scope.filters, $scope.multiSheetState.unassigned);
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
					id: id,
					from: 'multiple'
				});
			}
		}

		/**
		 * Assign room to the respective maid on drop
		 * @param  {Event} event
		 * @param  {Draggable} dropped  Dropped room draggable
		 */
		$scope.dropToAssign = function(event, dropped) {
			var indexOfDropped = parseInt($(dropped.draggable).attr('id').split('-')[2]);
			var assignee = $(dropped.draggable).attr('id').split('-')[1];
			var assignTo = parseInt($(event.target).attr('id'));
			if (parseInt(assignee) !== assignTo) {
				if (assignee == "UA") {
					//remove from 'unassigned','unassignedFiltered' and push to 'assignTo'
					var droppedRoom = $scope.multiSheetState.unassignedFiltered[indexOfDropped];
					$scope.multiSheetState.assignments[assignTo].rooms.push(droppedRoom);
					$scope.multiSheetState.unassigned.splice(_.indexOf($scope.multiSheetState.unassigned, _.find($scope.multiSheetState.unassigned, function(item) {
						return item === droppedRoom;
					})), 1);
					$scope.filterUnassigned();
					updateSummary(assignTo);
				} else { //==Shuffling Assigned
					//remove from 'assignee' and push to 'assignTo'
					var roomList = $scope.multiSheetState.assignments[assignee].rooms;
					var droppedRoom = roomList[indexOfDropped];
					$scope.multiSheetState.assignments[assignTo].rooms.push(droppedRoom);
					roomList.splice(_.indexOf(roomList, _.find(roomList, function(item) {
						return item === droppedRoom;
					})), 1);
					updateSummary(assignTo);
					updateSummary(assignee);
				}
			}
		}

		/**
		 * Unassign room to the respective maid on drop
		 * @param  {Event} event
		 * @param  {Draggable} dropped  Dropped room draggable
		 */
		$scope.dropToUnassign = function(event, dropped) {
			var indexOfDropped = parseInt($(dropped.draggable).attr('id').split('-')[2]);
			var assignee = $(dropped.draggable).attr('id').split('-')[1];
			//remove from "assignee" and add "unassigned"
			var roomList = $scope.multiSheetState.assignments[assignee].rooms;
			var droppedRoom = roomList[indexOfDropped];
			$scope.multiSheetState.unassigned.push(droppedRoom);
			roomList.splice(indexOfDropped, 1);
			$scope.filterUnassigned();
			updateSummary(assignee);
		}

		$scope.onDateChanged = function() {
			updateView(true);
		}

		$scope.onWorkTypeChanged = function() {
			updateView(true);
		}

		/**
		 * UPDATE the view IFF the list has been changed
		 */
		$scope.onEmployeeListClosed = function() {
			var x = [];
			_.each($scope.employeeList, function(employee) {
				if (employee.ticked) x.push(employee.id);
			})
			if ($(x).not(selectionHistory).length !== 0 || $(selectionHistory).not(x).length !== 0) {
				updateView();
			}
			selectionHistory = [];
			_.each($scope.employeeList, function(employee) {
				if (employee.ticked) selectionHistory.push(employee.id);
			})
		}

		/**
		 * Saves the current state of the Multi sheet view
		 */
		$scope.saveMultiSheet = function() {
			var assignedRooms = [],
				onSaveSuccess = function(data) {
					$scope.$emit("hideLoader");
					//Update worksheet Ids
					if (data.touched_work_sheets && data.touched_work_sheets.length) {
						_.each(data.touched_work_sheets, function(wS) {
							$scope.multiSheetState.assignments[wS.assignee_id].worksheetId = wS.work_sheet_id;
						})
					}
					$scope.clearErrorMessage();
				},
				onSaveFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
					$scope.$emit("hideLoader");
				};

			var assignments = [];
			_.each($scope.multiSheetState.selectedEmployees, function(employee) {
				var assignment = {};
				assignment.assignee_id = employee.id;
				assignment.work_sheet_id = $scope.multiSheetState.assignments[employee.id].worksheetId;
				assignment.room_ids = [];
				_.each($scope.multiSheetState.assignments[employee.id].rooms, function(room) {
					assignment.room_ids.push(room.id);
				})
				assignments.push(assignment);
			});

			$scope.invokeApi(RVWorkManagementSrv.saveWorkSheet, {
				"date": $scope.multiSheetState.selectedDate,
				"task_id": $scope.multiSheetState.header.work_type_id,
				"order": "",
				"assignments": assignments
			}, onSaveSuccess, onSaveFailure);
		}

		init();
	}
]);