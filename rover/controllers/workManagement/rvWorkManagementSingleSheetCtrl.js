sntRover.controller('RVWorkManagementSingleSheetCtrl', ['$rootScope', '$scope', '$stateParams', 'wmWorkSheet', 'RVWorkManagementSrv', '$timeout', '$state', 'ngDialog', '$filter', 'allUnassigned',
	function($rootScope, $scope, $stateParams, wmWorkSheet, RVWorkManagementSrv, $timeout, $state, ngDialog, $filter, allUnassigned) {
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
			},
			dimensions: {
				unassigned: $("#worksheet-unassigned-rooms").width() - 40,
				assigned: $("#worksheet-assigned-rooms").width() - 40
			}
		};






		// flag to know if we interrupted the state change
		var $_shouldSaveFirst = true,
			$_afterSave = null;

		// auto save the sheet when moving away
		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
			if ( 'rover.workManagement.singleSheet' === fromState.name && $_shouldSaveFirst) {
				e.preventDefault();

				$_afterSave = function() {
					$_shouldSaveFirst = false;
					$state.go(toState, toParams);
				};

				$scope.saveWorkSheet();
			};
		});






		$scope.dropToUnassign = function(event, dropped) {
			var indexOfDropped = parseInt($(dropped.draggable).attr('id').split('-')[1]);
			$scope.unAssignRoom($scope.singleState.assigned[indexOfDropped]);
		}

		$scope.dropToAssign = function(event, dropped) {
			var indexOfDropped = parseInt($(dropped.draggable).attr('id').split('-')[1]);
			$scope.assignRoom($scope.singleState.unassigned[indexOfDropped]);
		}

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
						$scope.filterUnassigned();
						summarizeAssignment();
						refreshView();
						$scope.$emit('hideLoader');
					},
					onFetchFailure = function(errorMessage) {
						$scope.errorMessage = errorMessage;
						$scope.$emit('hideLoader');
					}
				$scope.invokeApi(RVWorkManagementSrv.fetchWorkSheetDetails, {
					"date": $stateParams.date || $rootScope.businessDate,
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
					} else if ($scope.departureClass[room.reservation_status] == "inhouse") {
						$scope.singleState.summary.stayovers++;
					}
					if (room.hk_complete) {
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


		$scope.setHeading("Work Sheet No." + wmWorkSheet.sheet_number + ", " + $filter('date')($stateParams.date, $rootScope.dateFormat));

		var prevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start'
		}
		if ($stateParams.from == 'multiple') {
			prevState = {
				title: ('Manage Worksheets'),
				name: 'rover.workManagement.multiSheet'
			}
		} else if (!!parseInt($stateParams.from)) {
			prevState = {
				title: ('Room Details'),
				name: 'rover.housekeeping.roomDetails',
				param: {
					id: parseInt($stateParams.from)
				}
			}
		}

		$rootScope.setPrevState = prevState;

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


		$scope.printWorkSheet = function() {
			$scope.saveWorkSheet({
				callNextMethod: 'printAfterSave'
			});
		};

		$scope.printAfterSave = function() {
			if ($scope.$parent.myScroll['workSheetAssigned'] && $scope.$parent.myScroll['workSheetAssigned'].scrollTo)
				$scope.$parent.myScroll['workSheetAssigned'].scrollTo(0, 0);
			window.print();
		};


		$scope.deletWorkSheet = function() {
			var onDeleteSuccess = function(data) {
					//$state.go('rover.workManagement.start');
					$scope.$emit("hideLoader");
					$timeout( function() {
						$state.go('rover.workManagement.start');
					}, 20 );
				},
				onDeleteFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
					$scope.$emit("hideLoader");
				};
			$scope.invokeApi(RVWorkManagementSrv.deleteWorkSheet, {
				"id": $stateParams.id
			}, onDeleteSuccess, onDeleteFailure);
		}





		// for all unassigned rooms
		// we are gonna mark each rooms with
		// its associated work_type_id
		// this way while saving we can determine
		// how many different work type has been touched
		// and how many save request must be created
		var wtid = '';
		_.each(allUnassigned, function(item) {
			wtid = item.id;
			_.each(item.unassigned, function(room) {
				room.work_type_id = wtid;
			});
		});

		$scope.saveWorkSheet = function(options) {
			var assignedRooms = [],
				saveCount     = 0,
				worktypesSet  = {};

			var afterAPIcall  = function() {
					// delay are for avoiding collisions
					if ( options && $scope[options.callNextMethod] ) {
						$timeout($scope[options.callNextMethod], 50);
					};
					if ( $_shouldSaveFirst && !!$_afterSave ) {
						$timeout($_afterSave, 60);
					};
				},
				onSaveSuccess = function(data) {
					saveCount--;
					if ( saveCount == 0 ) {
						$scope.$emit("hideLoader");
						$scope.clearErrorMessage();

						afterAPIcall();
					};
				},
				onSaveFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;

					saveCount--;
					if ( saveCount == 0 ) {
						$scope.$emit("hideLoader");
						afterAPIcall();
					};
				};

			if (!$scope.singleState.workSheet.work_type_id) {
				$scope.errorMessage = ['Please select a work type.'];
				return false;
			}
			if (!$scope.singleState.workSheet.user_id) {
				$scope.errorMessage = ['Please select an employee.'];
				return false;
			}

			// lets create a set of worktypes that will hold 
			// rooms under each worktype id name - e.g:
			// {
			//		'4'  : [ array of rooms ],
			//		'20' : [ array of rooms ]
			// }
			worktypesSet = {};

			// use the worktype list to initiate
			// each worktype array that will hold
			// corresponding rooms
			_.each($scope.workTypes, function(type) {
				worktypesSet[type.id.toString()] = [];
			});

			// if a room in assigned has prop 'work_type_id' (read line #217)
			// assign it to the corresponding array
			// else assign to the array corresponding the active work type
			if ( $scope.singleState.assigned.length ) {
				_.each($scope.singleState.assigned, function(room) {
					if ( room.hasOwnProperty('work_type_id') ) {
						worktypesSet[room.work_type_id.toString()].push(room);
					} else {
						worktypesSet[$scope.singleState.workSheet.work_type_id.toString()].push(room);
					};
				});

				// loop each worktypeSet
				// we only need to save it
				// if it has any room in it
				_.each(worktypesSet, function(set, key) {
					if ( set.length ) {
						_.each(set, function(room) {
							assignedRooms.push(room.room_id || room.id);
						});

						$scope.invokeApi(RVWorkManagementSrv.saveWorkSheet, {
							"date"        : $stateParams.date,
							"task_id"     : parseInt(key),
							"order"       : "",
							"assignments" : [{
								"shift_id"      : $scope.singleState.workSheet.shift_id,
								"assignee_id"   : $scope.singleState.workSheet.user_id,
								"room_ids"      : assignedRooms,
								"work_sheet_id" : ""
							}]
						}, onSaveSuccess, onSaveFailure);

						// must reset after API call
						assignedRooms = [];

						// increment API call count
						saveCount++;
					};
				});
			} else {
				afterAPIcall();
			};
		};
			




		$scope.startLoader = function() {
			$scope.$emit('showLoader');
		}

		$scope.filterUnassigned = function() {
			$scope.$emit('showLoader');

			$timeout(function() {
				$scope.singleState.unassignedFiltered = $scope.filterUnassignedRooms($scope.filters, $scope.singleState.unassigned, allUnassigned);
				refreshView();
				$scope.closeDialog();
				$scope.$emit('hideLoader');
			}, 10);
		}

		$scope.onWorkTypeChange = function() {
			init();
		}

		$scope.onAssignmentDragStart = function() {
			$scope.$parent.myScroll["workSheetUnassigned"].disable();
		}

		$scope.onAssignmentDragStop = function() {
			$scope.$parent.myScroll["workSheetUnassigned"].enable();
		}

		$scope.onUnassignmentDragStart = function() {
			$scope.$parent.myScroll["workSheetAssigned"].disable();
		}

		$scope.onUnassignmentDragStop = function() {
			$scope.$parent.myScroll["workSheetAssigned"].enable();
		}

		$scope.showFilter = function() {
			ngDialog.open({
				template: '/assets/partials/workManagement/popups/rvWorkManagementFilterRoomsPopup.html',
				className: 'ngdialog-theme-default',
				closeByDocument: true,
				scope: $scope
			});
		}

		init();
	}

]);