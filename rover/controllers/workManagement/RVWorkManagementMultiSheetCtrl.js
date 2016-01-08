sntRover.controller('RVWorkManagementMultiSheetCtrl', ['$rootScope', '$scope', 'ngDialog', 'RVWorkManagementSrv', '$state', '$stateParams', '$timeout', 'allUnassigned', 'activeWorksheetEmp', 'fetchHKStaffs', 'payload', '$window',
	function($rootScope, $scope, ngDialog, RVWorkManagementSrv, $state, $stateParams, $timeout, allUnassigned, activeWorksheetEmp, fetchHKStaffs, payload, $window) {
		BaseCtrl.call(this, $scope);

		// saving in local variable, since it will be updated when user changes the date
		var $_allUnassigned = allUnassigned;

		// flag to know if we interrupted the state change
		var $_shouldSaveFirst = true,
			$_afterSave = null;

		// Updated when employee selections change
		var selectionHistory = [];

		console.log( payload );
		// To Do: remove this line
		payload.assignedRoomTasks[0].rooms[0].room_tasks[0].is_complete = true;

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

		$scope.closeDialog = function() {
			$scope.errorMessage = "";
			ngDialog.close();
		};

		/**
		 * Utility function to calculate the width of worksheet content
		 * Method: (220 x number of employees show) + 20)px
		 * @return {Integer}
		 */
		$scope.getWidthForWorkSheetContent = function() {
			return ((220 * $scope.multiSheetState.selectedEmployees.length) + 20) + 'px';
		};

		/**
		 * Handles RESTRICTING selected employees not to exceed $scope.multiSheetState.maxColumns
		 */
		$scope.selectEmployee = function(data) {
			var tickedEmployees = _.where($scope.employeeList, {
										ticked: true
									});
			tickedEmployees = _.pluck(tickedEmployees, 'id');
			$scope.multiSheetState.selectedEmployees = [];
			_.each(tickedEmployees, function(empId) {
				var emp = _.findWhere($scope.multiSheetState.assigned, {
					id: empId
				});
				if (emp)
					$scope.multiSheetState.selectedEmployees.push(emp);
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
				});
			} else {
				var disabledEntries = _.where($scope.employeeList, {
					checkboxDisabled: true
				});
				_.each(disabledEntries, function(d) {
					d.checkboxDisabled = false;
				});
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
		};

		$scope.showCalendar = function(controller) {
			ngDialog.open({
				template: '/assets/partials/workManagement/popups/rvWorkManagementMultiDateFilter.html',
				controller: controller,
				className: 'ngdialog-theme-default single-date-picker',
				closeByDocument: true,
				scope: $scope
			});
		};

		$scope.showFilter = function() {
			ngDialog.open({
				template: '/assets/partials/workManagement/popups/rvWorkManagementFilterRoomsPopup.html',
				className: 'ngdialog-theme-default',
				closeByDocument: true,
				scope: $scope
			});
		};

		// turn off 'save first' and state change
		$scope.onCancel = function() {
			$_shouldSaveFirst = false;
			$state.go('rover.workManagement.start');
		};

		$scope.navigateToIndvl = function(id) {
			if (id) {
				$state.go('rover.workManagement.singleSheet', {
					date: $scope.multiSheetState.selectedDate,
					id: id,
					from: 'multiple'
				});
			}
		};


		// Super awesome method to remove/add rooms from unassigned pool
		// nothing fancy it just shows/hides them
		var $_updatePool = function(room, status) {
			var thatWT = {};
			var match = {};
			if ($scope.filters.showAllRooms) {
				thatWT = _.find($_allUnassigned, function(item) {
					return item.id === room.work_type_id;
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

			// "event" has info of the column to which it is dropped to
			// "dropped" has info of what has been dragged

			console.log( $(event.target).attr('id') );
			console.log( $(dropped.draggable).attr('id') );

			var indexOfRoomInUnassigned = parseInt($(dropped.draggable).attr('id').split('-')[2]);

			// if (parseInt(assignee) !== assignTo) {
			// 	if (assignee === "UA") {
			// 		//remove from 'unassigned','unassignedFiltered' and push to 'assignTo'
			// 		var droppedRoom = $scope.multiSheetState.unassignedFiltered[indexOfDropped];
			// 		$scope.multiSheetState.assignments[assignTo].rooms.push(droppedRoom);
			// 		$scope.multiSheetState.unassigned.splice(_.indexOf($scope.multiSheetState.unassigned, _.find($scope.multiSheetState.unassigned, function(item) {
			// 			return item === droppedRoom;
			// 		})), 1);
			// 		$scope.filterUnassigned();
			// 		updateSummary(assignTo);
			// 	} else { //===Shuffling Assigned
			// 		//remove from 'assignee' and push to 'assignTo'
			// 		var roomList = $scope.multiSheetState.assignments[assignee].rooms;
			// 		var droppedRoom = roomList[indexOfDropped];
			// 		$scope.multiSheetState.assignments[assignTo].rooms.push(droppedRoom);
			// 		roomList.splice(_.indexOf(roomList, _.find(roomList, function(item) {
			// 			return item === droppedRoom;
			// 		})), 1);
			// 		updateSummary(assignTo);
			// 		updateSummary(assignee);
			// 	}
			// }
		};

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
		};

		$scope.onDateChanged = function() {
			updateView(true);
		};

		$scope.onWorkTypeChanged = function() {
			updateView(true);
		};

		/**
		 * UPDATE the view IFF the list has been changed
		 */
		$scope.onEmployeeListClosed = function() {
			var x = [];
			_.each($scope.employeeList, function(employee) {
				if (employee.ticked) {
					x.push(employee.id);
				}
			});
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
		 * @param {Object} options
		 * @return {Undefined}
		 */
		$scope.saveMultiSheet = function(options) {
			$_afterSave();
			// To Do: from scratch.
		};


		// Printing related methods and logics
		/**
		 * Utility function to add the print orientation before printing
		 */
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
		};

		/**
		 * Set previous state and heading.
		 */
		var setBackNavAndTitle = function() {
			var title = 'Work Management';

			$rootScope.setPrevState = {
				title: ('Work Management'),
				name: 'rover.workManagement.start'
			};
			$scope.setHeading(title);
		};

		/**
		 * Utility function to set up scrollers
		 */
		var setScroller = function() {
			var commonScrollerOptions = {
				tap: true,
				preventDefault: false,
				probeType: 3
			};
			var horizontal = _.extend({
				scrollX: true,
				scrollY: false
			}, commonScrollerOptions);
			var vertical = _.extend({
				scrollX: false,
				scrollY: true
			}, commonScrollerOptions);
			$scope.setScroller('unAssignedRoomList', vertical);
			$scope.setScroller("multiSelectEmployees", commonScrollerOptions);
			$scope.setScroller("worksheetHorizontal", horizontal);

			for (var i = $scope.multiSheetState.selectedEmployees.length - 1; i >= 0; i--) {
				$scope.setScroller('assignedRoomList-'+i, vertical);
			};
		};

		/**
		 */
		var refreshScrollers = function() {
			$scope.refreshScroller('unAssignedRoomList');
			for (var list = 0; list < $scope.multiSheetState.selectedEmployees.length; list++) {
				$scope.refreshScroller('assignedRoomList-' + list);
			}
		};

		/**
		 * Add all scope watchers here
		 */
		var setupWatchers = function() {
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
		};

		/**
		 * Auto select employees based on daily worksheet employee data
		 */
		var initializeEmployeesList = function() {
			// select all employeed by default
			$scope.multiSheetState.selectedEmployees = [];
			_.each($scope.employeeList, function(employee) {
				employee.ticked = true;
				var emp = _.findWhere($scope.multiSheetState.assigned, {
					id: employee.id
				});
				if (emp)
					$scope.multiSheetState.selectedEmployees.push(emp);
			});
		};

		var fetchWorkSheetPayloadSuccess = function(data) {
			payload = data;
			initializeMultiSheetDataModel();
			initializeEmployeesList();
			$scope.filterUnassigned();
			refreshView();
		};

		var fetchWorkSheetPayloadFailure = function(error) {
			$scope.errorMessage = error;
		};

		var updateView = function() {
			// To Do: ask for save if dirty.

            var unassignedRoomsParam = {
                date: $scope.multiSheetState.selectedDate,
            };
            if ($scope.multiSheetState.header.work_type_id) {
            	_.extend(unassignedRoomsParam, {
            		work_type_id: $scope.multiSheetState.header.work_type_id
            	});
            }

            var assignedRoomsParam = {
                date: $scope.multiSheetState.selectedDate,
                employee_ids: fetchHKStaffs.emp_ids
            };

            RVWorkManagementSrv.processedPayload(unassignedRoomsParam, assignedRoomsParam)
            	.then(fetchWorkSheetPayloadSuccess, fetchWorkSheetPayloadFailure);
		};

		var refreshView = function() {
			updateSummary();
			setScroller();
			refreshScrollers();
		};

		var calculateSummary = function(employee) {
			summaryModel = {
				tasksAssigned: 0,
				tasksCompleted: 0,
				timeAllocated: "00:00",
				shiftLength: "00:00"
			};

			for (var i = employee.rooms.length - 1; i >= 0; i--) {
				var allTasks  = employee.rooms[i].room_tasks,
					completed = _.where(allTasks, { is_complete: true }) || [],
					totalTime = _.reduce(allTasks, function(s, task) {
						var time = task.time_allocated;
						return $scope.addDuration(s, time.hh + ":" + time.mm);
					}, "0:0"),
					doneTime = _.reduce(allTasks, function(s, task) {
						if (!task.is_complete) {
							return s;
						}

						var time = task.time_allocated;
						return $scope.addDuration(s, time.hh + ":" + time.mm);
					}, "0:0");


				summaryModel.tasksAssigned  += allTasks.length;
				summaryModel.tasksCompleted += completed.length;
				summaryModel.timeAllocated  = $scope.addDuration(summaryModel.timeAllocated, totalTime);
				summaryModel.shiftLength    = $scope.addDuration(summaryModel.shiftLength, doneTime);
			}

			return summaryModel;
		};

		var	updateSummary = function(employeeId) {
			var refData 	 = $scope.multiSheetState,
				summaryModel = {
									tasksAssigned: 0,
									tasksCompleted: 0,
									timeAllocated: "00:00",
									shiftLength: "00:00"
								};

			if (typeof employeeId === "number") {
				var employee = _.findWhere(refData.assigned, {id: employeeId});
				refData.summary[employeeId] = calculateSummary(employee);

			} else {
				_.each(refData.assigned, function(employee) {
					refData.summary[employee.id] = calculateSummary(employee);;
				});
			}
		};

		// keeping a reference in $scope
		$scope.updateView = updateView;

		/**
		 * initialize variables for the multi sheet state
		 * @return {Undefined}
		 */
		var initializeMultiSheetDataModel = function() {
			// Object for holding sheet data on scope.
			$scope.multiSheetState = {
				dndEnabled: true,
				selectedDate: $stateParams.date || $rootScope.businessDate,
				maxColumns: undefined, // Hardcoded to 6 for now ===> Max no of worksheets that are loaded at an instance
				selectedEmployees: [],
				unassigned: payload.unassignedRoomTasks,
				unassignedFiltered: [],
				assigned: payload.assignedRoomTasks,
				header: {
					work_type_id: null
				},
				summary: {}
			};

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
			};
		};

		/**
		 * Function to bootstrap multisheet.
		 * @return {Undefined}
		 */
		var init = function() {

			// state settings
			setBackNavAndTitle();

			// scope variable watchers
			setupWatchers();

			// Data model for multisheet state
			initializeMultiSheetDataModel();

			// Update employee selection list
			initializeEmployeesList();

			// Update filters
			$scope.filterUnassigned();

			// Add scrollers and listners
			//setScroller();

			//updateSummary();

			refreshView();
		};

		init();
	}
]);