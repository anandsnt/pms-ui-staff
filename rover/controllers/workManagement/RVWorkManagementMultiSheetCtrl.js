sntRover.controller('RVWorkManagementMultiSheetCtrl', ['$rootScope', '$scope', 'ngDialog', 'RVWorkManagementSrv', '$state', '$stateParams', '$timeout', 'allUnassigned', 'activeWorksheetEmp', 'payload', '$window',
	function($rootScope, $scope, ngDialog, RVWorkManagementSrv, $state, $stateParams, $timeout, allUnassigned, activeWorksheetEmp, payload, $window) {
		BaseCtrl.call(this, $scope);

		// saving in local variable, since it will be updated when user changes the date
		var $_allUnassigned = allUnassigned;

		// flag to know if we interrupted the state change
		var $_shouldSaveFirst = true,
			$_afterSave = null;

		// Updated when employee selections change
		var selectionHistory = [];

		console.log( payload );

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
				callNextMethod: 'fetchWorkSheetData'
			});
		};



		/**
		 * Saves the current state of the Multi sheet view
		 * @param {Object} options
		 * @return {Undefined}
		 */
		$scope.saveMultiSheet = function(options) {
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
			// TO DO set scroller based on number of employees selected
			$scope.setScroller('unAssignedRoomList');
			$scope.setScroller("multiSelectEmployees");
			$scope.setScroller('assignedRoomList-1');
			$scope.setScroller('assignedRoomList-2');
			$scope.setScroller('assignedRoomList-3');
			$scope.setScroller('assignedRoomList-4');
			$scope.setScroller('assignedRoomList-5');
			$scope.setScroller('assignedRoomList-0');
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
			var dailyWTemp = (!!activeWorksheetEmp.data[0] && activeWorksheetEmp.data[0].employees) || [],
				activeEmps = [],
				foundMatch = undefined;

			if (dailyWTemp.length) {
				_.each($scope.employeeList, function(item) {
					item.ticked = false;

					foundMatch = _.find(dailyWTemp, function(emp) {
						return emp.id === item.id;
					});

					if (foundMatch) {
						item.ticked = true;
					};
				});
			};

			$scope.multiSheetState.selectedEmployees = [];
			_.each($scope.employeeList, function(employee) {
				if (employee.ticked) {
					$scope.multiSheetState.selectedEmployees.push(employee);
				}
			});
		};

		var fetchWorkSheetData = function() {

		};

		var refreshView = function() {
				fetchWorkSheetData();
				setScroller();
				refreshScrollers();
		};

		var	updateSummary = function(employeeId) {
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
		$scope.updateView = fetchWorkSheetData;

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
				unassigned: [],
				unassignedFiltered: [],
				assigned: [],
				header: {
					work_type_id: null
				},
				assignments: {}
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
			setScroller();

			//updateSummary();

			refreshView();
		};

		init();
	}
]);