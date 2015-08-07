sntRover.controller('RVWorkManagementMultiSheetCtrl', ['$rootScope', '$scope', 'ngDialog', 'RVWorkManagementSrv', '$state', '$stateParams', '$timeout', 'allUnassigned', 'activeWorksheetEmp', '$window',
	function($rootScope, $scope, ngDialog, RVWorkManagementSrv, $state, $stateParams, $timeout, allUnassigned, activeWorksheetEmp, $window) {
		BaseCtrl.call(this, $scope);
		$scope.setHeading("Work Management");

		$rootScope.setPrevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start'
		};

		// saving in local variable, since it will be updated when user changes the date
		var $_allUnassigned = allUnassigned;



		// flag to know if we interrupted the state change
		var $_shouldSaveFirst = true,
			$_afterSave = null;

		// auto save the sheet when moving away
		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
			if ('rover.workManagement.multiSheet' === fromState.name && $_shouldSaveFirst) {
				e.preventDefault();

				$_afterSave = function() {
					$_shouldSaveFirst = false;
					$state.go(toState, toParams);
				};

				$scope.saveMultiSheet();
			};
		});

		$scope.$watch('multiSheetState.header.work_type_id', function(newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.saveMultiSheet({
					work_type_id: oldVal,
					callNextMethod: 'onWorkTypeChanged'
				});
			};
		});

		$scope.$watch('multiSheetState.selectedDate', function(newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.saveMultiSheet({
					callNextMethod: 'fetchAllUnassigned',
					nexMethodArgs: {
						date: newVal
					}
				});
			};
		});



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

						_.each(data.work_sheets, function(worksheet) {

							// create, clear old entries
							$scope.multiSheetState.assignments[worksheet.employee_id] = {};

							// add empty rooms array
							$scope.multiSheetState.assignments[worksheet.employee_id]['rooms'] = [];

							// add empty summary object
							$scope.multiSheetState.assignments[worksheet.employee_id]['summary'] = {
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

							// add work sheet id
							$scope.multiSheetState.assignments[worksheet.employee_id]['worksheetId'] = worksheet.work_sheet_id;

							// push each room into each employee
							_.each(worksheet.work_assignments, function(assignments) {
								if (!!assignments.room) {
									$scope.multiSheetState.assignments[worksheet.employee_id]['rooms'].push(assignments.room)
								};
							});
						});

						_.each($scope.multiSheetState.selectedEmployees, function(employee) {
							updateSummary(employee.id);
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
				var dailyWTemp = (!!activeWorksheetEmp.data[0] && activeWorksheetEmp.data[0].employees) || [],
					activeEmps = [],
					foundMatch = undefined;

				if (dailyWTemp.length) {
					_.each($scope.employeeList, function(item) {
						item.ticked = false;

						foundMatch = _.find(dailyWTemp, function(emp) {
							return emp.id === item.id
						});

						if (foundMatch) {
							item.ticked = true;
						};
					});
				};

				// for all unassigned rooms
				// we are gonna mark each rooms with
				// its associated work_type_id
				// this way while saving we can determine
				// how many different work type has been touched
				// and how many save request must be created
				// this process is repeated (replicated) when date changes
				var wtid = '';
				_.each($_allUnassigned, function(item) {
					wtid = item.id;
					_.each(item.unassigned, function(room) {
						room.work_type_id = wtid;
					});
				});

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
					} else if ($scope.departureClass[room.reservation_status] === "inhouse") {
						assignmentDetails.summary.stayovers.total++;
						if (room.hk_complete) {
							assignmentDetails.summary.stayovers.completed++;
						}
					}
					assignmentDetails.summary.shift.completed = $scope.addDuration(assignmentDetails.summary.shift.completed, room.time_allocated);
				});
				refreshView();
			};

		// keeping a reference in $scope
		$scope.updateView = updateView;

		/**
		 * Object holding all scope variables
		 * @type {Object}
		 */
		$scope.multiSheetState = {
			dndEnabled: true,
			selectedDate: $stateParams.date || $rootScope.businessDate,
			maxColumns: 6, // Hardcoded to 6 for now ===> Max no of worksheets that are loaded at an instance
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
			showAllRooms: false,
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
			$scope.$emit('showLoader');

			$timeout(function() {
				$scope.multiSheetState.unassignedFiltered = $scope.filterUnassignedRooms($scope.filters, $scope.multiSheetState.unassigned, $_allUnassigned, $scope.multiSheetState.assignments);
				refreshView();
				$scope.closeDialog();
				$scope.$emit('hideLoader');
			}, 10);
		}

		$scope.fetchAllUnassigned = function(options) {
			var callback = function(data) {
				$_allUnassigned = data;

				// for all unassigned rooms
				// we are gonna mark each rooms with
				// its associated work_type_id
				// this way while saving we can determine
				// how many different work type has been touched
				// and how many save request must be created
				// this process is repeated (replicated) when date changes
				var wtid = '';
				_.each(allUnassigned, function(item) {
					wtid = item.id;
					_.each(item.unassigned, function(room) {
						room.work_type_id = wtid;
					});
				});

				$scope.filterUnassigned();
			};

			$scope.invokeApi(RVWorkManagementSrv.fetchAllUnassigned, {
				date: options.date
			}, callback);
		};

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

		// turn off 'save first' and state change
		$scope.onCancel = function() {
			$_shouldSaveFirst = false;
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


		// Super awesome method to remove/add rooms from unassigned pool
		// nothing fancy it just shows/hides them
		var $_updatePool = function(room, status) {
			var thatWT = {};
			var match = {};
			if ($scope.filters.showAllRooms) {
				thatWT = _.find($_allUnassigned, function(item) {
					return item.id === room.work_type_id
				});

				match = _.find(thatWT.unassigned, function(item) {
					return item === room;
				});
			} else {
				match = _.find($scope.multiSheetState.unassigned, function(item) {
					return item === room;
				});
			};
			if (match) {
				match.isAssigned = status;
			};
		};

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
				if (assignee === "UA") {
					//remove from 'unassigned','unassignedFiltered' and push to 'assignTo'
					var droppedRoom = $scope.multiSheetState.unassignedFiltered[indexOfDropped];
					$scope.multiSheetState.assignments[assignTo].rooms.push(droppedRoom);
					$scope.multiSheetState.unassigned.splice(_.indexOf($scope.multiSheetState.unassigned, _.find($scope.multiSheetState.unassigned, function(item) {
						return item === droppedRoom;
					})), 1);
					$scope.filterUnassigned();
					updateSummary(assignTo);
				} else { //===Shuffling Assigned
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
				if (employee.ticked) {
					x.push(employee.id);
				}
			})
			if ($(x).not(selectionHistory).length !== 0 || $(selectionHistory).not(x).length !== 0) {
				updateView();
			}
			selectionHistory = [];
			_.each($scope.employeeList, function(employee) {
				if (employee.ticked) {
					selectionHistory.push(employee.id);
				}
			});
			$scope.multiSheetState.dndEnabled = true;
		};

		$scope.refreshSheet = function() {
			$scope.saveMultiSheet({
				callNextMethod: 'updateView'
			});
		};



		/**
		 * Saves the current state of the Multi sheet view
		 */
		$scope.saveMultiSheet = function(options) {
			var assignedRooms = [],
				assignments = [],
				worktypesSet = {},
				saveCount = 0;

			var afterAPIcall = function() {
					// delay are for avoiding collisions
					if (options && $scope[options.callNextMethod]) {
						$timeout($scope[options.callNextMethod].bind(null, options.nexMethodArgs), 50);
					};
					if ($_shouldSaveFirst && !!$_afterSave) {
						$timeout($_afterSave, 60);
					};
				},
				onSaveSuccess = function(data) {
					saveCount--;
					if (saveCount === 0) {
						$scope.$emit("hideLoader");
						//Update worksheet Ids
						if (data.touched_work_sheets && data.touched_work_sheets.length) {
							_.each(data.touched_work_sheets, function(wS) {
								if (!!$scope.multiSheetState.assignments[wS.assignee_id]) {
									$scope.multiSheetState.assignments[wS.assignee_id].worksheetId = wS.work_sheet_id;
								};
							});
						};
						$scope.clearErrorMessage();
						afterAPIcall();
					};
				},
				onSaveFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;

					saveCount--;
					if (saveCount === 0) {
						$scope.$emit("hideLoader");
						afterAPIcall();
					};
				};
			worktypesSet = {};


			// initialize each of the worktype in worktypesSet
			// with the plain object structure
			_.each($scope.workTypes, function(type) {
				worktypesSet[type.id.toString()] = {
					'date': $scope.multiSheetState.selectedDate,
					'task_id': type.id,
					'assignments': []
				};
			});


			// loop each selected employees
			if ($scope.multiSheetState.selectedEmployees.length) {
				_.each($scope.multiSheetState.selectedEmployees, function(emp) {

					// loop each added rooms in assignements for this employee
					if ($scope.multiSheetState.assignments[emp.id] && $scope.multiSheetState.assignments[emp.id].rooms.length) {

						// this is the else case - there are rooms
						_.each($scope.multiSheetState.assignments[emp.id].rooms, function(room) {

							var emp_id = emp.id,
								room = room,
								room_id = room.id;

							var wt_id = '',
								thoseAssignments = [],
								i = 0,
								j = 0,
								found = false;

							// if room has prop 'work_type_id' use that
							// else if its specifically passed in use that
							// else use value from header
							if (room.hasOwnProperty('work_type_id')) {
								wt_id = room['work_type_id'].toString();
							} else if (!!options && options.hasOwnProperty('work_type_id')) {
								wt_id = options['work_type_id'].toString();
							} else {
								wt_id = $scope.multiSheetState.header.work_type_id.toString();
							}

							// use the wt_id to point exact worktype from worktypesSet
							// and access its assignments array
							thoseAssignments = worktypesSet[wt_id]['assignments'];

							// loop assignments array and find the object
							// with matching employee id and push the current room's room_id
							// no _.each() since we need to break out
							for (i = 0, j = thoseAssignments.length; i < j; i++) {
								if (emp_id === thoseAssignments[i]['assignee_id']) {
									thoseAssignments[i]['room_ids'].push(room_id);
									found = true;
									break;
								};
							};

							// if assignments array was empty
							// initate it with the following
							if (!found) {
								thoseAssignments.push({
									'assignee_id': emp_id,
									'room_ids': [room_id]
								});
								found = true;
							};
						});
					} else {
						var wt_id = '',
							thoseAssignments = [];

						// if 'work_type_id' specifically passed in use that
						// else use value from header
						if (!!options && options.hasOwnProperty('work_type_id')) {
							wt_id = options['work_type_id'].toString();
						} else {
							wt_id = $scope.multiSheetState.header.work_type_id.toString();
						};

						thoseAssignments = worktypesSet[wt_id]['assignments'];

						thoseAssignments.push({
							'assignee_id': emp.id,
							'room_ids': []
						});
					}; // inner if '$scope.multiSheetState.assignments[emp.id]' ends
				});

				// rooms have been sorted into different worktype entries
				// lets save those worktypes that have assignments
				_.each(worktypesSet, function(set) {
					if (set.assignments.length) {
						saveCount++;
						$scope.invokeApi(RVWorkManagementSrv.saveWorkSheet, set, onSaveSuccess, onSaveFailure);
					};
				});

				// if we do not have anything to save
				if (saveCount === 0) {
					afterAPIcall();
				};
			} else {
				afterAPIcall();
			};
		};



		// add the print orientation before printing
		var addPrintOrientation = function() {
			$( 'head' ).append( "<style id='print-orientation'>@page { size: landscape; }</style>" );
		};

		// add the print orientation after printing
		var removePrintOrientation = function() {
			$( '#print-orientation' ).remove();
		};

		$scope.printWorkSheet = function() {
			if ($scope.$parent.myScroll['assignedRoomList-0'] && $scope.$parent.myScroll['assignedRoomList-0'].scrollTo) {
				$scope.$parent.myScroll['assignedRoomList-0'].scrollTo(0, 0);
			}
			if ($scope.$parent.myScroll['assignedRoomList-1'] && $scope.$parent.myScroll['assignedRoomList-1'].scrollTo) {
				$scope.$parent.myScroll['assignedRoomList-1'].scrollTo(0, 0);
			}
			if ($scope.$parent.myScroll['assignedRoomList-2'] && $scope.$parent.myScroll['assignedRoomList-2'].scrollTo) {
				$scope.$parent.myScroll['assignedRoomList-2'].scrollTo(0, 0);
			}
			if ($scope.$parent.myScroll['assignedRoomList-3'] && $scope.$parent.myScroll['assignedRoomList-3'].scrollTo) {
				$scope.$parent.myScroll['assignedRoomList-3'].scrollTo(0, 0);
			}
			if ($scope.$parent.myScroll['assignedRoomList-4'] && $scope.$parent.myScroll['assignedRoomList-4'].scrollTo) {
				$scope.$parent.myScroll['assignedRoomList-4'].scrollTo(0, 0);
			}
			if ($scope.$parent.myScroll['assignedRoomList-5'] && $scope.$parent.myScroll['assignedRoomList-5'].scrollTo) {
				$scope.$parent.myScroll['assignedRoomList-5'].scrollTo(0, 0);
			}
			// add the orientation
			addPrintOrientation();

			/*
			*	======[ READY TO PRINT ]======
			*/
			// this will show the popup with full bill
			$timeout(function() {
				/*
				*	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
				*/

				$window.print();
				if ( sntapp.cordovaLoaded ) {
					cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
				};
			}, 100);

			/*
			*	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
			*/

			// remove the orientation after similar delay
			$timeout(removePrintOrientation, 100);
		}

		init();
	}
]);