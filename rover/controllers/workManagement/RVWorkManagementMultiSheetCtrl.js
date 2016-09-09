angular.module('sntRover').controller('RVWorkManagementMultiSheetCtrl', ['$rootScope', '$scope', 'ngDialog', 'RVWorkManagementSrv', '$state', '$stateParams', '$timeout', 'allUnassigned', 'fetchHKStaffs', 'payload', '$window',
	function($rootScope, $scope, ngDialog, RVWorkManagementSrv, $state, $stateParams, $timeout, allUnassigned, fetchHKStaffs, payload, $window) {
		BaseCtrl.call(this, $scope);

		// saving in local variable, since it will be updated when user changes the date
		var $_allUnassigned = allUnassigned;

		// flag to know if we interrupted the state change
		var $_stateChangeInterrupted = false,
			$_afterSave = null;

		// Updated when employee selections change
		var selectionHistory = [],
			employeeIndexHash = {};

		// auto save the sheet when moving away
		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
			if ('rover.workManagement.multiSheet' === fromState.name && $scope.workSheetChanged) {
				e.preventDefault();
				$scope.$emit("hideLoader");
				$_stateChangeInterrupted = true;

				$_afterSave = function() {
					$scope.closeDialog();
					$scope.workSheetChanged = false;
					$_stateChangeInterrupted = false;
					$state.go(toState, toParams);
				};

				openSaveConfirmationPopup();
			};
		});

		$scope.closeSaveConfirmationDialog = function(options) {
			if ($_stateChangeInterrupted) {
				$_stateChangeInterrupted = false;
				$_afterSave && $_afterSave();
			} else {
				options && options.callNextMethod && $scope[options.callNextMethod] && $scope[options.callNextMethod]();
				$scope.closeDialog();
			}

		};

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
		$scope.selectEmployee = function() {
			// no op
			return;
		};

		$scope.onEmployeeListOpen = function() {
			$scope.multiSheetState.dndEnabled = false;
		};

		/**
		 * UPDATE the view IFF the list has been changed
		 */
		$scope.onEmployeeListClosed = function() {
			$scope.multiSheetState.dndEnabled = true;

			var currIds = _.where($scope.employeeList, { ticked: true });
			currIds     = _.pluck(currIds, 'id');

			// if there is any changes made by user
			if ( _.difference(currIds, $scope.multiSheetState._lastSelectedIds) ) {
				// Since we are changing selectedEmployees while doing drag drop,
				// we need to put back the changed object to assigned list.
				_.each($scope.multiSheetState._selectedIndexMap, function(valueAsAsssignIndex, keyAsSelectedIndex) {
					$scope.multiSheetState.assigned[valueAsAsssignIndex] = $scope.multiSheetState.selectedEmployees[keyAsSelectedIndex];
				});

				// reinit Employee list
				reInitEmployeesList();

				// refresh scrollers and update summary
				refreshView();
			};
		};


		$scope.filterUnassigned = function() {
			$scope.filterUnassignedRooms($scope.filters, $scope.multiSheetState.unassigned, $scope.multiSheetState.allRooms);
			$scope.multiSheetState.unassignedFiltered = $scope.multiSheetState.unassigned;
			refreshView();
			$scope.closeDialog();

			// DO NOTHING FOR NOW!
			// $scope.$emit('showLoader');
			// $timeout(function() {
			// 	$scope.multiSheetState.unassignedFiltered = $scope.filterUnassignedRooms($scope.filters, $scope.multiSheetState.unassigned, $_allUnassigned, $scope.multiSheetState.assignments);
			// 	refreshView();
			// 	$scope.closeDialog();
			// 	$scope.$emit('hideLoader');
			// }, 10);
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

		/**
		 * Assign room to the respective maid on drop
		 * @param  {Event} event
		 * @param  {Draggable} dropped  Dropped room draggable
		 */
		$scope.dropToAssign = function(event, dropped) {
			// "event" has info of the column to which it is dropped to
			// "dropped" has info of what has been dragged
			// yeah, the wording is totally confusing :S

			var dragged = $(dropped.draggable).attr('id'),
				fromEmpIndex = dragged.split('-')[1],
				fromRoomIndex = parseInt( dragged.split('-')[2] ),
				fromTaskIndex = parseInt( dragged.split('-')[3] );

			var source, fromEmp;

			var draggedRoom, draggedTask;

			if ( 'UA' === fromEmpIndex ) {
				source = $scope.multiSheetState.unassignedFiltered;
				draggedRoom = source[fromRoomIndex];
				draggedTask = draggedRoom['room_tasks'][fromTaskIndex];
			} else {
				source = $scope.multiSheetState.selectedEmployees;
				fromEmp = source[fromEmpIndex];
				draggedRoom = fromEmp['rooms'][fromRoomIndex];
				draggedTask = draggedRoom['room_tasks'][fromTaskIndex];
			};

			var dropped  = $(event.target).attr('id'),
				toEmpIndex = parseInt( dropped.split('-')[0] ),
				toEmp = $scope.multiSheetState.selectedEmployees[toEmpIndex];

			var hasRoom = _.find(toEmp.rooms, { 'room_id': draggedRoom.room_id });
			var hasRoomIndex = _.findIndex(toEmp.rooms, { 'room_id': draggedRoom.room_id });
			var roomCopy = [];

			function move(array, from, to) {
				if( to === from ) return;

				var target = array[from];                         
				var increment = to < from ? -1 : 1;

				for(var k = from; k != to; k += increment){
				array[k] = array[k + increment];
				}
				array[to] = target;
				return array;
			}

			if ( !! hasRoom ) {
				roomCopy = angular.copy(toEmp.rooms);
				
				// only insert if this task doesnt exist already
				if ( ! _.find(hasRoom.room_tasks, { 'id': draggedTask.id }) ) {
					roomCopy[hasRoomIndex].room_tasks.push( draggedTask );
				}

				if ( hasRoomIndex > $scope.dropIndex ) {
					move(roomCopy, hasRoomIndex, $scope.dropIndex);
				} else {
					if ( $scope.dropIndex === 0 ) {
						move(roomCopy, hasRoomIndex, $scope.dropIndex)
					} else {
						move(roomCopy, hasRoomIndex, $scope.dropIndex - 1);
					}
				}

				toEmp.rooms = roomCopy;
			} else {
				if ( $scope.dropIndex === 0 ) {
					toEmp.rooms.unshift({
						'room_id': draggedRoom.room_id,
						'room_index': draggedRoom.room_index,
						'room_tasks': [draggedTask]
					})
				} else if ( $scope.dropIndex === toEmp.rooms - 1 ) {
					toEmp.rooms.push({
						'room_id': draggedRoom.room_id,
						'room_index': draggedRoom.room_index,
						'room_tasks': [draggedTask]
					})
				} else {
					toEmp.rooms = [].concat(
							toEmp.rooms.slice( 0, $scope.dropIndex ),
							{
								'room_id': draggedRoom.room_id,
								'room_index': draggedRoom.room_index,
								'room_tasks': [draggedTask]
							},
							toEmp.rooms.slice( $scope.dropIndex )
						)
				}
			}

			if ( parseInt(fromEmpIndex) !== toEmpIndex ) {
				// add the task to "only_tasks" and work_type_id to "touched_work_types"
				toEmp.only_tasks.push(draggedTask);
				toEmp.touched_work_types.push( draggedTask.work_type_id );
				toEmp.touched_work_types = _.uniq( _.flatten(toEmp.touched_work_types) );

				// if task removed from an toEmp =>
				// remove the task from "only_tasks"
				// and if the "work_type_id" in the removed task is not avail
				// on toEmp's "room_tasks" anymore then remove it from "touched_work_types"
				var inOnlyTask, hasOtherTaskWithSameWtid;
				if ( 'UA' !== fromEmpIndex ) {
					// that task with matches the id and room id of dragged task
					inOnlyTask = _.findIndex(fromEmp.only_tasks, function(task) {
						return task.id === draggedTask.id && task.room_id === draggedTask.room_id
					});

					if ( inOnlyTask > -1 ) {
						fromEmp.only_tasks.splice(inOnlyTask, 1);
					};

					hasOtherTaskWithSameWtid = _.find(fromEmp.only_tasks, { work_type_id: draggedTask.work_type_id });
					if ( ! hasOtherTaskWithSameWtid ) {
						fromEmp.touched_work_types = _.without(fromEmp.touched_work_types, draggedTask.work_type_id);
					};
				};


				// remove task from draggedRoom
				draggedRoom['room_tasks'].splice(fromTaskIndex, 1);

				// if the room was dragged off an fromEmp and
				// if there are no more tasks in the room's room_tasks
				// remove the room iself!
				if ( 'UA' !== fromEmpIndex && ! draggedRoom['room_tasks'].length ) {
					fromEmp['rooms'].splice(fromRoomIndex, 1);
				};
			}

			// THE ABOVE CODE COULD BETTER BE HIDDEN IN SERVICE

			// Refresh the scrollers and summary
			$scope.workSheetChanged = true;
			refreshView();
		};

		/**
		 * Unassign room to the respective maid on drop
		 * @param  {Event} event
		 * @param  {Draggable} dropped  Dropped room draggable
		 */
		$scope.dropToUnassign = function(event, dropped) {
			// "event" has info of the column to which it is dropped to
			// "dropped" has info of what has been dragged
			// yeah, the wording is totally confusing :S

			var dragged = $(dropped.draggable).attr('id'),
				draggedIndex = dragged.split('-')[1],
				roomIndex = parseInt( dragged.split('-')[2] ),
				taskIndex = parseInt( dragged.split('-')[3] );

			var source      = $scope.multiSheetState.selectedEmployees,
				destination = $scope.multiSheetState.unassignedFiltered;

			var thatEmpl = source[draggedIndex],
				draggedRoom = thatEmpl['rooms'][roomIndex],
				draggedTask = draggedRoom['room_tasks'][taskIndex];

			var destinationHasRoom = _.find(destination, { 'room_id': draggedTask.room_id });

			if ( !! destinationHasRoom ) {
				destinationHasRoom
					.room_tasks
					.push( draggedTask );
			} else {
				destination.push({
					'room_id': draggedRoom.room_id,
					'room_index': draggedRoom.room_index,
					'room_tasks': [draggedTask],
					'show': true
				});
			};

			$scope.filterUnassigned();

			// if task removed from an employee =>
			// remove the task from "only_tasks"
			// and if the "work_type_id" in the removed task is not avail
			// on employee's "room_tasks" anymore then remove it from "touched_work_types"
			var inOnlyTask, hasOtherTaskWithSameWtid;
			// that task with matches the id and room id of dragged task
			inOnlyTask = _.findIndex(thatEmpl.only_tasks, function(task) {
				return task.id === draggedTask.id && task.room_id === draggedTask.room_id
			});
			if ( inOnlyTask > -1 ) {
				thatEmpl.only_tasks.splice(inOnlyTask, 1);
			};

			hasOtherTaskWithSameWtid = _.find(thatEmpl.only_tasks, { work_type_id: draggedTask.work_type_id });
			if ( ! hasOtherTaskWithSameWtid ) {
				thatEmpl.touched_work_types = _.without(thatEmpl.touched_work_types, draggedTask.work_type_id);
			};


			// remove task from draggedRoom
			draggedRoom['room_tasks'].splice(taskIndex, 1);

			// if the room was dragged off an employee and
			// if there are no more tasks in the room's room_tasks
			// remove the room iself!
			if ( ! draggedRoom['room_tasks'].length ) {
				thatEmpl['rooms'].splice(roomIndex, 1);
			};

			// THE ABOVE CODE COULD BETTER BE HIDDEN IN SERVICE

			// Refresh the scrollers and summary
			$scope.workSheetChanged = true;
			refreshView();
		};

		$scope.onDateChanged = function() {

			// Ask for save confirmation if unchanged changes are there.
			if ($scope.workSheetChanged) {
				openSaveConfirmationPopup({
					date: $scope.dateSelected,
					callNextMethod: 'updateView'
				});
			} else {
				updateView(true);
			}

			$scope.dateSelected = $scope.multiSheetState.selectedDate;

		};

		$scope.onWorkTypeChanged = function() {
			$scope.workTypeSelected = $scope.multiSheetState.header.work_type_id;
			refreshView();
		};

		$scope.refreshSheet = function() {
			$scope.saveMultiSheet({
				callNextMethod: 'updateView'
			});
		};

		var openSaveConfirmationPopup = function(options) {
			ngDialog.open({
				template: '/assets/partials/workManagement/popups/rvWorkManagementSaveConfirmationPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false,
				data: JSON.stringify(options)
			});
		};

		var lastSaveConfig = null;
		/**
		 * Function to delegate calling custom call back function,
		 * after save api call is completed.
		 * @return {Undefiend}
		 */
		var afterSaveAPIcall = function() {
			// delay are for avoiding collisions
			if (!$_stateChangeInterrupted && lastSaveConfig && $scope[lastSaveConfig.callNextMethod]) {
				$timeout($scope[lastSaveConfig.callNextMethod].bind(null, lastSaveConfig.nexMethodArgs), 50);
			};
			if ($_stateChangeInterrupted && !!$_afterSave) {
				$timeout($_afterSave, 60);
			};
			lastSaveConfig = null;
		};

		/**
		 * Success callback of save api.
		 * @param {Object} API response
		 * @return {Undefined}
		 */
		var saveMultiSheetSuccessCallBack = function(data) {
			$scope.$emit("hideLoader");
			$scope.clearErrorMessage();
			$scope.workSheetChanged = false;
			afterSaveAPIcall();
		};

		/**
		 * Failure callback of save api.
		 * @param {Object} Error messages
		 * @return {Undefined}
		 */
		var saveMultiSheetFailureCallBack = function(error) {
			$scope.errorMessage = error;
			$scope.$emit("hideLoader");
			afterSaveAPIcall();
		};

		/**
		 * Saves the current state of the Multi sheet view
		 * @param {Object} options
		 * @return {Undefined}
		 */
		$scope.saveMultiSheet = function(config) {

			// Since we are changing selectedEmployees while doing drag drop,
			// we need to put back the changed object to assigned list.
			_.each($scope.multiSheetState._selectedIndexMap, function(valueAsAsssignIndex, keyAsSelectedIndex) {
				$scope.multiSheetState.assigned[valueAsAsssignIndex] = $scope.multiSheetState.selectedEmployees[keyAsSelectedIndex];
			});

			lastSaveConfig = config || null;
			if ($scope.multiSheetState.selectedEmployees.length) {

				// apply order key as is the rooms array index
				_.each($scope.multiSheetState.assigned, function(item) {
					_.each(item.rooms, function(room, index) {
						room.order = index + 1;
					})
				});

				var options = {
					successCallBack: saveMultiSheetSuccessCallBack,
					failureCallBack: saveMultiSheetFailureCallBack,
					params: {
						assignedRoomTasks: $scope.multiSheetState.assigned,
						date: (config && config.date) || $scope.multiSheetState.selectedDate
					}
				}

				$scope.callAPI(RVWorkManagementSrv.saveWorkSheets, options);

			} else {
				afterSaveAPIcall(config);
			};
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




		var employeeListBackup = null;

		/**
		 * Opens a popup to select the configurations to print the worksheet.
		 * @return {undefined}
		 */
		$scope.openPrintWorkSheetPopup = function() {
			employeeListBackup = angular.copy($scope.employeeList);

			ngDialog.open({
				template: '/assets/partials/workManagement/popups/rvWorkManagementPrintOptionsPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false,
			});
		};

		$scope.cancelPopupDialog = function() {
			$scope.employeeList = angular.copy(employeeListBackup);
			$scope.onEmployeeListClosed();

			ngDialog.close();
		};

		/**
		 * Transform data model for printing.
		 */
		var configureMultisheetForPrinting = function(options) {
			var multiSheetState 		= $scope.multiSheetState;
			multiSheetState.selectedEmployees = RVWorkManagementSrv.sortAssigned(multiSheetState.selectedEmployees,
										multiSheetState.allRooms,
										multiSheetState.allTasks,
										options);

			// Add an event to fire when the next digest cycle completes.
			var listner = $rootScope.$watch(function() {
				listner();
				$timeout(startPrinting, 0);
			});
			runDigestCycle();
		};

		var startPrinting = function() {
			/*
			*	======[ READY TO PRINT ]======
			*/
			/*
			*	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
			*/
			$scope.$emit('hideLoader');
			$timeout(function() {
				$window.print();
				if ( sntapp.cordovaLoaded ) {
					cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
				};

				/*
				*	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
				*/
			}, 100);
			// remove the orientation after similar delay
			$timeout(function() {
				removePrintOrientation();

				$scope.multiSheetState = angular.copy(multiSheetStateBackup);
				$scope.employeeList = angular.copy(employeeListBackup);
				$scope.onEmployeeListClosed();

				multiSheetStateBackup = null;
				runDigestCycle();
			}, 150);

		};

		var multiSheetStateBackup = null;

		/**
		 * Prints the worksheet according to options configured in the $scope.printSettings.
		 * @return {undefined}
		 */
		$scope.printWorkSheet = function() {
			$scope.closeDialog();
			$scope.$emit('showLoader');

			multiSheetStateBackup = angular.copy($scope.multiSheetState);

			// set the sheet according to print settings.
			configureMultisheetForPrinting($scope.printSettings);

			// reset scroll bars to top
			var i;
			for (i = $scope.multiSheetState.selectedEmployees.length - 1; i >= 0; i--) {
				$scope.$parent.myScroll[ 'assignedRoomList-' + i ].scrollTo(0, 0);
			}

			// add the orientation
			addPrintOrientation();

		};

		/**
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
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

		var hoz;

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
			$scope.setScroller("multiSelectWorkSheet", commonScrollerOptions);
			$scope.setScroller("multiSelectPrintPopup", commonScrollerOptions);
			$scope.setScroller("worksheetHorizontal", horizontal);

			for (var i = $scope.multiSheetState.selectedEmployees.length - 1; i >= 0; i--) {
				$scope.setScroller('assignedRoomList-'+i, vertical);
			};
		};

		var refreshScrollers = function() {
			$scope.refreshScroller('unAssignedRoomList');
			$scope.refreshScroller('worksheetHorizontal');
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
					$scope.onWorkTypeChanged();
				};
			});
		};


		// common computation part of below 2 functions
		var initingEmpList = function(emp) {
			var foundIndex, key;

			foundIndex = _.findIndex($scope.multiSheetState.assigned, function(assign) {
				return assign.id == emp.id;
			});

			if ( foundIndex > -1 ) {
				// push employee from assigned to selected
				$scope.multiSheetState.selectedEmployees.push( $scope.multiSheetState.assigned[foundIndex] );

				// add the index mapping to '_selectedIndexMap'
				key = $scope.multiSheetState.selectedEmployees.length - 1;
				$scope.multiSheetState._selectedIndexMap[key] = foundIndex;

				// push employee id into '_lastSelectedIds'
				$scope.multiSheetState._lastSelectedIds.push( $scope.multiSheetState.assigned[foundIndex]['id'] );
			};
		};

		/**
		 * Auto select employees based on daily worksheet employee data
		 */
		var initializeEmployeesList = function() {
			var foundIndex, key;

			$scope.multiSheetState.selectedEmployees = [];
			$scope.multiSheetState._selectedIndexMap = {};
			$scope.multiSheetState._lastSelectedIds  = [];

			_.each($scope.employeeList, function(emp) {
				emp.ticked = true;
				initingEmpList(emp);
			});
		};

		var reInitEmployeesList = function() {
			var foundIndex, key;

			$scope.multiSheetState.selectedEmployees = [];
			$scope.multiSheetState._selectedIndexMap = {};
			$scope.multiSheetState._lastSelectedIds  = [];

			_.each($scope.employeeList, function(emp) {
				if ( emp.ticked ) {
					initingEmpList(emp);
				};
			});
		};

		var fetchWorkSheetPayloadSuccess = function(data) {
			$scope.$emit('hideLoader');
			payload = data;
			$scope.workSheetChanged = false;
			initializeMultiSheetDataModel();
			initializeEmployeesList();
			$scope.filterUnassigned();
			refreshView();
		};

		var fetchWorkSheetPayloadFailure = function(error) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = error;
		};

		/**
		 * Fetch payload once again and re init data models to refresh view completely.
		 * To Do: ask for save if dirty.
		 * @return {Undefined}
		 */
		var updateView = function() {
			$scope.$emit("showLoader");

            var unassignedRoomsParam = {
                date: $scope.multiSheetState.selectedDate
            };

            var assignedRoomsParam = {
                date: $scope.multiSheetState.selectedDate,
                employee_ids: fetchHKStaffs.emp_ids
            };

            RVWorkManagementSrv.processedPayload(unassignedRoomsParam, assignedRoomsParam)
            	.then(fetchWorkSheetPayloadSuccess, fetchWorkSheetPayloadFailure);
		};

		/**
		 * Call to refresh view, scrollers and employee summary
		 * @return {Undefined}
		 */
		var refreshView = function() {
			updateSummary();
			runDigestCycle();
			setScroller();
			refreshScrollers();
		};

		/**
		 * Utility function to calculate the work summary of and employee based on
		 * assigned tasks
		 * @param {Object} details of employee from payload
		 * @return {Object} object containing summary data
		 */
		var calculateSummary = function(employee) {
			var summaryModel = {
				tasksAssigned: 0,
				tasksCompleted: 0,
				timeAllocated: "00:00",
				shiftLength: "00:00"
			};

			var allTasks,
				completed,
				totalTime,
				doneTime,
				time,
				shift;

				/* Shift length to be calculated from api/shifts. need shift_id for that.
				   Displaying full shift length for now.*/
				//shift = _.findWhere($scope.shifts, { id: employee.shift_id });
				shift = _.findWhere($scope.shifts, { name: "Full Shift" });
				summaryModel.shiftLength    = (shift && shift.time) || "08:00";
				// Shift length must be corrected in future

			var i;

			for ( i = employee.rooms.length - 1; i >= 0; i-- ) {
				allTasks  = employee.rooms[i].room_tasks;

				completed = _.where(allTasks, { is_completed: true }) || [];

				totalTime = _.reduce(allTasks, function(s, task) {
					time = task.time_allocated;
					return $scope.addDuration(s, time.hh + ":" + time.mm);
				}, "0:0");

				summaryModel.tasksAssigned  += allTasks.length;
				summaryModel.tasksCompleted += completed.length;
				summaryModel.timeAllocated  = $scope.addDuration(summaryModel.timeAllocated, totalTime);
			}

			return summaryModel;
		};

		/**
		 * Creates a data structure to show employee work assignments summary.
		 * Updates all employee summary if param not given.
		 * @param {Number} employee id (optional)
		 * @return {Undefined}
		 */
		var	updateSummary = function(employeeId) {
			var refData 	 = $scope.multiSheetState;

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

			$scope.multiSheetState = $.extend(
					{}, {
						'unassigned' : payload.unassignedRoomTasks,
						'assigned'   : payload.assignedRoomTasks,
						'allTasks'   : payload.allTasks,
						'allRooms'   : payload.allRooms,
					}, {
						'unassignedFiltered' : [],
						'_unassignIndexMap'  : {},
					}, {
						'selectedEmployees' : [],
						'_selectedIndexMap' : {},
						'_lastSelectedIds'  : []
					}, {
						'dndEnabled': true,
						'selectedDate': $scope.dateSelected || $stateParams.date || $rootScope.businessDate,
						'summary': {},
						'header': {
							work_type_id: $scope.workTypeSelected || ""
						},
					}
				);

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

		var initializeVariables = function() {
			$scope.dateSelected = $scope.multiSheetState.selectedDate;
			$scope.workTypeSelected = $scope.multiSheetState.header.work_type_id;
			$scope.workSheetChanged = false;

			// print options
			$scope.printSettings = {
				grouping: 'room',
				sort: 'asc',
				employees: 1
			};
		};

		var callRefreshScroll = function() {
			refreshScrollers();
		};
		var handler = $scope.$on( 'ALL_RENDER_COMPLETE', callRefreshScroll );
		$scope.$on( '$destroy', handler );

		$scope.getReservationStatusClass = function(room) {
			switch (room.reservation_status) {
				case 'Due out':
				case 'Arrived / Day use / Due out':
				case 'Arrived / Day use / Due out / Departed':
				case 'Due out / Arrival':
				case 'Due out / Departed':
				case 'Arrived / Departed':
				case 'Departed':
					return 'guest red'

				case 'Stayover':
					return 'guest blue';

				case 'Arrival':
				case 'Arrived':
					return 'guest green';

				case 'Not Reserved':
					return 'guest gray';

				default:
					return 'guest';
			}
		};

		$scope.getReservationStatusValue = function(room) {
			switch (room.reservation_status) {
				case 'Due out / Departed':
				case 'Arrived / Day use / Due out / Departed':
				case 'Arrived / Departed':
				case 'Departed':
					return 'OUT';

				case 'Due out':
				case 'Arrived / Day use / Due out':
				case 'Due out / Arrival':
					return room.checkout_time;

				case 'Stayover':
					return 'STAYOVER';

				case 'Arrived':
					return 'IN';

				case 'Arrival':
					return room.checkin_time;

				default:
					return 'default';
			}
		};

		$scope.getCurrentStatusClass = function(room) {
			switch (room.current_status) {
				case 'DIRTY':
					return 'room red'

				case 'PICKUP':
					return 'room orange';

				case 'CLEAN':
				case 'INSPECTED':
					return 'room green';

				default:
					return 'room';
			}
		}

		var setUpAutoScroller = function() {
			var LEFT  = 'LEFT',
				RIGHT = 'RIGHT',
				TOP = 'TOP',
				BOTTOM = 'BOTTOM',
				UNDEF = undefined;

			var dragDir    = UNDEF,
				timer      = UNDEF,
				dimX       = UNDEF,
				dimY       = UNDEF;

			// to drop the room/task based on the order
			var orderState = (function() {
				var dragReducer = function() {
					var isDragging = false;
					return {
						isDragging: function() {
							return isDragging;
						},
						startDragging: function() {
							isDragging = true;
						},
						stopDragging: function() {
							isDragging: false;
						}
					}
				}

				var scrollReducer = function() {
					var isDragging = false;
					return {
						isScrolling: function() {
							return isScrolling;
						},
						startScrolling: function() {
							isScrolling = true;
						},
						stopScrolling: function() {
							isScrolling = false;
						}
					}
				}

				var clientYReducer = function() {
					var clientX = 0,
						clientY = 0;
					return {
						getClientPos: function() {
							return {
								x: clientX,
								y: clientY
							};
						},
						updateClientPos: function(x, y) {
							clientX = x;
							clientY = y;
						}
					}
				}

				var totalHeightReducer = function() {
					var totalHeight = 0;
					return {
						getTotalHeight: function() {
							return totalHeight;
						},
						setTotalHeight: function(value) {
							totalHeight = value;
						},
						resetTotalHeight: function() {
							this.setTotalHeight(0);
						}
					}
				}

				var base = $.extend(
					{},
					dragReducer(),
					scrollReducer(),
					clientYReducer(),
					totalHeightReducer()
				);

				base.removePlaceholder = function() {
					var $placeholder;

					if ( !! this.$empNode ) {
						$placeholder = this.$empNode.find('.placeholder');
						$placeholder.remove();
					}
				}.bind(base);

				base.findCurrEmpCol = function() {
					var clientx = this.getClientPos().x;

					var scrollInst = $scope.$parent.myScroll['worksheetHorizontal'];
					var scrollInstX = scrollInst.x;

					var LEFT_OFFSET = 20;
					var COL_WIDTH   = 220;

					var currX = clientx - (LEFT_OFFSET + scrollInstX);
					var colIndex;
					var selectedEmp;
					var $placeholder;

					this.removePlaceholder();

					if ( currX < 0 ) {
						this.$empNode = undefined;
					} else {
						colIndex = Math.floor(currX / COL_WIDTH);
						colIndex = colIndex !== 0 ? colIndex - 1 : colIndex;

						selectedEmp = $scope.multiSheetState.selectedEmployees[colIndex];
						this.$empNode = $( '#' + colIndex + '-' + selectedEmp.id );
					}

					return this.$empNode;
				}.bind(base);

				base.checkOnOver = function(room, index) {
					var $thisRoom, $nextRoom, nextIndex;

					var TOP_OFFSET = 280, ROOM_MARGIN = 20;

					var roomHeight, prevHeight, top, mid, bot, clienty;

					var retObj;

					$thisRoom = $(room);
					$nextRoom = $thisRoom.next('.worksheet-room');
					nextIndex = index + 1;
					if ( $nextRoom.hasClass('.placeholder')  ) {
						$nextRoom = $thisRoom.next('.worksheet-room').next('.worksheet-room')
					}

					roomHeight = $thisRoom.height();
					prevHeight = this.getTotalHeight();
					/**/
					if ( index === 0 ) {
						top = TOP_OFFSET + prevHeight;
					} else {
						top = prevHeight;
					}
					mid = top + roomHeight / 2;
					bot = top + roomHeight + ROOM_MARGIN;
					/**/
					this.setTotalHeight( prevHeight + roomHeight );

					clienty = this.getClientPos().y;

					if ( clienty < top ) {
						return {
							method: 'BEFORE',
							node: $thisRoom,
							index: index
						}
					} else if ( clienty > bot ) {
						if ( $nextRoom.length ) {
							return this.checkOnOver( $nextRoom, nextIndex );
						} else {
							return {
								method: 'AFTER',
								node: $thisRoom,
								index: nextIndex
							}
						}
					} else {
						if ( clienty < mid ) {
							return {
								method: 'BEFORE',
								node: $thisRoom,
								index: index
							}
						} else {
							return {
								method: 'AFTER',
								node: $thisRoom,
								index: nextIndex
							}
						}
					}
				}.bind(base);

				base.addPlaceholder = function() {
					var $col = this.findCurrEmpCol(),
						firstRoom,
						index = 0,
						returnIndex = 0;

					var $placeholder = $('<div class="worksheet-room placeholder">Drop Here</div>');

					if ( $col === undefined ) {
						return;
					}

					this.resetTotalHeight();
					this.removePlaceholder();

					firstRoom = $col.find('.worksheet-room')[0];

					if ( firstRoom === undefined ) {
						returnIndex = 0;
						$col.find('.wrapper')
							.append( $placeholder );
					} else {
						var onOverData = this.checkOnOver(firstRoom, index);

						switch( onOverData.method ) {
							case 'BEFORE':
								$placeholder.insertBefore( onOverData.node  );
								break;

							case 'AFTER':
								$placeholder.insertAfter( onOverData.node );
								break;

							default:
								$col.find('.wrapper')
									.append( $placeholder );
								break;
						};

						returnIndex = onOverData.index;
					}

					$scope.dropIndex = returnIndex;
					return returnIndex;
				}.bind(base);

				return base;
			})();


			// get the dimentions for horizontal related calculations
			var getXdimentions = function() {
				var LEFT_OFFSET = 200,
					COL_WIDTH   = 220,
					TASK_OFFSET = 110;

				var winWidth = $(window).width();

				var scrollableX = ($scope.multiSheetState.selectedEmployees.length * COL_WIDTH) - (winWidth - LEFT_OFFSET);

				return {
					screenStart : LEFT_OFFSET + TASK_OFFSET,
					screenEnd   : winWidth - LEFT_OFFSET,
					scrollStart : LEFT_OFFSET + TASK_OFFSET,
					scrollEnd   : -scrollableX,
				};
			};

			// get the dimentions for vertical related calculations
			// to be depricated, need to salvage few things from this
			var getYdimentions = function() {
				var TOP_OFFSET = 280,
					TASK_HEIGHT = 115;	// This is highly relative

				var winHeight = $(window).height();

				var scrollableY = ($scope.multiSheetState.selectedEmployees.length * COL_WIDTH) - (winWidth - LEFT_OFFSET);

				return {
					screenStart : LEFT_OFFSET + TASK_OFFSET,
					screenEnd   : winWidth - LEFT_OFFSET,
					scrollStart : LEFT_OFFSET + TASK_OFFSET,
					scrollEnd   : -scrollableX,
				};
			};

			// setup dimX and update on screen change, also remove listener when scope dies 
			dimX = getXdimentions();
			window.addEventListener( 'resize', function() {
				dimX = getXdimentions();
			}, false );
			$scope.$on('$destroy', function() {
				window.removeEventListener('resize');
			});

			// call this method when we need to scroll the tm screen
			// horzontally while the user is dragging a task outside
			// the visible screen
			var checkHozScrollBy = function() {
				var scrollInst = $scope.$parent.myScroll['worksheetHorizontal'];

				if ( dragDir === LEFT && scrollInst.x !== 0 && scrollInst.x < dimX.scrollStart ) {
					scrollInst.scrollBy(10, 0, 1);
					orderState.startScrolling();
					return;
				};

				if ( dragDir === RIGHT && scrollInst.x > dimX.scrollEnd ) {
					scrollInst.scrollBy(-10, 0, 1);
					orderState.startScrolling();
					return;
				};

				orderState.stopScrolling();
			};

			// call this method when we need to scroll a particular
			// employee column vertically when user is dragging a 
			// task outside the visible screen
			var callVerScrollBy = function(index) {
				var scrollInst = $scope.$parent.myScroll['assignedRoomList-' + index];

				if ( dragDir === TOP && scrollInst.y !== 0 && scrollInst.y < dimX.scrollXStart ) {
					scrollInst.scrollBy(0, 10, 1);
				};

				if ( dragDir === BOTTOM && scrollInst.y > dimX.scrollXEnd ) {
					scrollInst.scrollBy(0, -10, 1);
				};
			};

			// once the user starts dragging 
			$scope.dragStart = function() {
				orderState.startDragging();
				timer = setInterval( checkHozScrollBy, 1 );
				$scope.dropIndex = undefined;
			};

			$scope.dragDrop = function() {
				orderState.stopDragging();
				orderState.removePlaceholder();

				if ( !! timer ) {
					window.clearInterval(timer);
					timer = UNDEF;
				};
			};

			var addPlaceholderDebounced = _.throttle(orderState.addPlaceholder, 500);
			$scope.userDragging = function(e) {
				if ( e.clientX > dimX.screenEnd ) {
				    if ( dragDir !== RIGHT ) {
				        dragDir = RIGHT;
				    };
				} else if ( e.clientX < dimX.screenStart ) {
				    if ( dragDir !== LEFT ) {
				        dragDir = LEFT;
				    };
				} else {
				    if ( dragDir !== UNDEF ) {
				        dragDir = UNDEF;
				    };
				};

				orderState.updateClientPos(e.clientX, e.clientY);
				addPlaceholderDebounced();
			};
		};

		var checkAutoScroll = function() {
			if (!!$scope.getScroller('worksheetHorizontal')) {
				setUpAutoScroller();
			} else {
				setTimeout(checkAutoScroll, 100);
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

			initializeVariables();

			// Add scrollers and listners
			refreshView();

			// check for scroll instance and setup auto scroll
			checkAutoScroll();
		};

		init();
	}
]);
