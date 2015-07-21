sntRover.controller('RVHkRoomStatusCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$state',
	'$filter',
	'$window',
	'RVHkRoomStatusSrv',
	'fetchPayload',
	'employees',
	'roomTypes',
	'floors',
	'hkStatusList',
	'allRoomIDs',
	'ngDialog',
	'RVWorkManagementSrv',
	function(
		$scope,
		$rootScope,
		$timeout,
		$state,
		$filter,
		$window,
		RVHkRoomStatusSrv,
		fetchPayload,
		employees,
		roomTypes,
		floors,
		hkStatusList,
		allRoomIDs,
		ngDialog,
		RVWorkManagementSrv
	) {
		// hook it up with base ctrl
		BaseCtrl.call( this, $scope );

		// set the previous state
		$rootScope.setPrevState = {
			title: $filter( 'translate' )( 'DASHBOARD' ),
			name: 'rover.dashboard'
		}

		// set title in header
		$scope.setTitle($filter( 'translate')('ROOM_STATUS'));
		$scope.heading = $filter( 'translate')('ROOM_STATUS');
		$scope.$emit( 'updateRoverLeftMenu' , 'roomStatus' );
		
		// set the scroller
		$scope.setScroller('room-status-filter');



		/* ***** ***** ***** ***** ***** */



		// reset all the filters
		if ( RVHkRoomStatusSrv.currentFilters.page < 1 ) {
			RVHkRoomStatusSrv.currentFilters.page = 1;
		};
		$scope.currentFilters = angular.copy( RVHkRoomStatusSrv.currentFilters );

		// The filters should be re initialized if we are navigating from dashborad to search
		// In back navigation (From room details to search), we would retain the filters.
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if ((fromState.name === 'rover.housekeeping.roomDetails' && toState.name !== 'rover.housekeeping.roomStatus')
				|| (fromState.name === 'rover.housekeeping.roomStatus' && toState.name !== 'rover.housekeeping.roomDetails')) {
				
				RVHkRoomStatusSrv.currentFilters = RVHkRoomStatusSrv.initFilters();
				RVHkRoomStatusSrv.resetRoomTypes();

				localStorage.removeItem( 'roomListScrollTopPos' );
			};
		});



		/* ***** ***** ***** ***** ***** */



		var $_roomList        = {},
			$_defaultWorkType = '',
			$_defaultEmp      = '';

		var $_page            = $scope.currentFilters.page,
			$_perPage         = $scope.currentFilters.perPage,
			$_defaultPage     = 1,
			$_defaultPerPage  = $window.innerWidth < 599 ? 25 : 50;

		var $_roomsEl         = document.getElementById( 'rooms' ),
			$_filterRoomsEl   = document.getElementById( 'filter-rooms' );

		var $_activeWorksheetData = [],
			$_tobeAssignedRoom    = {};

		var $_lastQuery = '';

		var $_oldFilterValues = angular.copy( RVHkRoomStatusSrv.currentFilters );
			$_oldRoomTypes    = angular.copy( roomTypes );

		$scope.resultFrom         = $_page,
		$scope.resultUpto         = $_perPage,
		$scope.netTotalCount      = 0;
		$scope.uiTotalCount       = 0;
		$scope.disablePrevBtn     = true;
		$scope.disableNextBtn     = true;

		$scope.filterOpen         = false;
		$scope.query              = $scope.currentFilters.query;
		$scope.noResultsFound     = 0;

		$scope.isStandAlone         = $rootScope.isStandAlone;
		$scope.isMaintenanceStaff   = $rootScope.isMaintenanceStaff;
		$scope.isMaintenanceManager = $rootScope.isMaintenanceManager
		$scope.hasActiveWorkSheet   = false;

		$scope.roomTypes          = roomTypes;
		$scope.floors             = floors;

		$scope.workTypes          = [];
		$scope.employees          = [];

		$scope.assignRoom         = {};

		$scope.currentView = 'rooms';
		$scope.changeView = function(view) {
			$scope.currentView = view;
		};

		// multiple room status change DS
		$scope.multiRoomAction = {
			rooms      : [],
			indexes    : {},
			anyChosen  : false,
			allChosen  : false,
			hkStatusId : ''
		};
		$scope.hkStatusList = hkStatusList;
		$scope.allRoomIDs   = allRoomIDs;


		/* ***** ***** ***** ***** ***** */



		// true represent that this is a fetchPayload call
		// and the worktypes and assignments has already be fetched
		$_fetchRoomListCallback(fetchPayload.roomList, true);



		/* ***** ***** ***** ***** ***** */



		$scope.loadNextPage = function(e) {
			if ( $scope.disableNextBtn ) {
				return;
			};

			$_page++;
			$_updateFilters('page', $_page);

			$_callRoomsApi();
		};

		$scope.loadPrevPage = function(e) {
			if ($scope.disablePrevBtn) {
				return;
			};

			$_page--;
			$_updateFilters('page', $_page);

			$_callRoomsApi();
		};

		// store the current room list scroll position
		$scope.roomListItemClicked = function(room) {
			localStorage.setItem( 'roomListScrollTopPos', $_roomsEl.scrollTop );
		};

		$scope.showFilters = function() {
			$scope.filterOpen = true;
			setTimeout(function(){ $scope.refreshScroller('room-status-filter'); }, 1500);
		};

		$scope.refreshData = function() {
			$_callRoomsApi();
		};

		$scope.filterDoneButtonPressed = function() {
			var _hasFilterChanged   = false,
				_hasRoomTypeChanged = false;

			var _makeCall = function() {
				$scope.filterOpen = false;
				$scope.$emit( 'showLoader' );

				$_resetPageCounts();

				RVHkRoomStatusSrv.currentFilters = angular.copy( $scope.currentFilters );
				$_oldFilterValues                = angular.copy( $scope.currentFilters );

				RVHkRoomStatusSrv.roomTypes = angular.copy( $scope.roomTypes );
				$_oldRoomTypes              = angular.copy( $scope.roomTypes );

				$timeout(function() {
					$_callRoomsApi();
				}, 100);
			};

			// if other than page number any other filter has changed
			for (key in $scope.currentFilters) {
				if ( $scope.currentFilters.hasOwnProperty(key) ) {
					if ( key == 'page' ) {
						continue;
					} else if ( $scope.currentFilters[key] != $_oldFilterValues[key] ) {
						_hasFilterChanged = true;
						break;
					};
				};
			};

			// if any room types has changed
			if ( $scope.roomTypes.length ) {
				for (var i = 0, j = $scope.roomTypes.length; i < j; i++) {
					if ( $scope.roomTypes[i]['isSelected'] != $_oldRoomTypes[i]['isSelected'] ) {
						_hasRoomTypeChanged = true;
						break;
					};
				};
			};

			if ( _hasFilterChanged || _hasRoomTypeChanged ) {
				$timeout(_makeCall, 100);
			} else {
				$scope.filterOpen = false;
			};
		};

		// when user changes the employee filter
		$scope.applyWorkTypefilter = function() {
			$scope.currentFilters.filterByWorkType = $scope.topFilter.byWorkType;

			// if work type is null reset filter by employee
			if ( !$scope.currentFilters.filterByWorkType ) {
				$scope.topFilter.byEmployee = '';
				$scope.applyEmpfilter();
			} else {
				$scope.filterDoneButtonPressed();
			}
		};

		// when user changes the employee filter
		$scope.applyEmpfilter = function() {
			$scope.currentFilters.filterByEmployeeName = $scope.topFilter.byEmployee;
			$scope.filterDoneButtonPressed();
		};

		var $_filterByQuery = function(forced) {
			var _makeCall = function() {
					$_updateFilters('query', $scope.query);

					$_resetPageCounts();

					$timeout(function() {
						$_callRoomsApi();
						$_lastQuery = $scope.query;
					}, 10);
				};

			if ( $rootScope.isSingleDigitSearch ) {
				if (forced || $scope.query != $_lastQuery) {
					_makeCall();
				};
			} else {
				if ( forced ||
						($scope.query.length <= 2 && $scope.query.length < $_lastQuery.length) ||
						($scope.query.length > 2 && $scope.query != $_lastQuery)
				) {
					_makeCall();
				};
			};
		};

		$scope.filterByQuery = _.throttle($_filterByQuery, 1000, { leading: false });

		$scope.clearSearch = function() {
			$scope.query = '';
			$_filterByQuery('forced');
		};

		$scope.isFilterChcked = function() {
			var key, ret;
			for (key in $scope.currentFilters) {
				if ( key != 'showAllFloors' && !!$scope.currentFilters[key] ) {
					ret = true;
					break;
				} else {
					ret = false;
				}
			}
			return ret;
		};

		$scope.clearFilters = function() {
			$scope.roomTypes = RVHkRoomStatusSrv.resetRoomTypes();

			$scope.currentFilters = RVHkRoomStatusSrv.initFilters();
			if ( $scope.isStandAlone ) {
				$scope.currentFilters.filterByWorkType = $scope.topFilter.byWorkType;
				$scope.currentFilters.filterByEmployeeName = $scope.topFilter.byEmployee;
			};
			RVHkRoomStatusSrv.currentFilters = angular.copy( $scope.currentFilters );

			$_refreshScroll();
		};

		$scope.validateFloorSelection = function(type) {
			if (type == 'SINGLE_FLOOR') {
				$scope.currentFilters.floorFilterStart = '';
				$scope.currentFilters.floorFilterEnd = '';

			}

			if (type == 'FROM_FLOOR' || type == 'TO_FLOOR') {
				$scope.currentFilters.floorFilterSingle = '';
			}
		};

		$scope.allFloorsClicked = function() {
			$scope.currentFilters.showAllFloors = !$scope.currentFilters.showAllFloors;
			$scope.currentFilters.floorFilterStart = '';
			$scope.currentFilters.floorFilterEnd = '';
			$scope.currentFilters.floorFilterSingle = '';
		};

		$scope.closeDialog = function() {
		    $scope.errorMessage = "";
		    ngDialog.close();
		}

		var $_findEmpAry = function() {
			var workid = $scope.assignRoom.work_type_id || $scope.topFilter.byWorkType,
				ret    =  _.find($_activeWorksheetData, function(item) {
					return item.id === workid;
				});

			return !!ret ? ret.employees : [];
		};

		$scope.openAssignRoomModal = function(room) {
			$_tobeAssignedRoom = room;

			$scope.assignRoom.rooms = [$_tobeAssignedRoom.id];
			$scope.assignRoom.work_type_id = $scope.topFilter.byWorkType;
			$scope.activeWorksheetEmp = [];

			var _onError = function() {
				$scope.$emit('hideLoader');
			};

			var _onActiveWorksheetEmpSuccess = function(response) {
				$scope.$emit('hideLoader');

				$_activeWorksheetData = response.data;
				$scope.activeWorksheetEmp = $_findEmpAry();
				ngDialog.open({
				    template: '/assets/partials/housekeeping/rvAssignRoomModal.html',
				    className: 'ngdialog-theme-default',
				    closeByDocument: true,
				    scope: $scope,
				    data: []
				});
				
			};

			var _onCheckRoomSucess = function(response) {
				var staff = response.data.rooms[0].assignee_maid;

				if ( !!staff && !staff.id ) {
					$scope.invokeApi(RVHkRoomStatusSrv.fetchActiveWorksheetEmp, {}, _onActiveWorksheetEmpSuccess, _onError);
				} else {
					$scope.$emit('hideLoader');
					$_tobeAssignedRoom.assignee_maid = angular.copy( staff );
					$_tobeAssignedRoom.assigned_staff = RVHkRoomStatusSrv.calculateAssignedStaff( $_tobeAssignedRoom );
				};
			};

			$scope.invokeApi(RVHkRoomStatusSrv.checkRoomAssigned, {
				'query': $_tobeAssignedRoom.room_no,
				'date' : $rootScope.businessDate
			}, _onCheckRoomSucess, _onError);
		};

		$scope.assignRoomWorkTypeChanged = function() {
			$scope.activeWorksheetEmp = $_findEmpAry();
		};

		$scope.submitAssignRoom = function() {
		    $scope.errorMessage = "";
		    if (!$scope.assignRoom.work_type_id) {
		        $scope.errorMessage = ['Please select a work type.'];
		        return false;
		    }
		    if (!$scope.assignRoom.user_id) {
		        $scope.errorMessage = ['Please select an employele.'];
		        return false;
		    }
		    var _onAssignSuccess = function(data) {
		            $scope.$emit('hideLoader');
		            
		            var assignee = _.find($scope.activeWorksheetEmp, function(emp) {
		            	return emp.id === $scope.assignRoom.user_id
		            });
		            $_tobeAssignedRoom.canAssign = false;
		            $_tobeAssignedRoom.assigned_staff = {
		            	'name': assignee.name,
		            	'class': 'assigned'
		            };

		            $scope.assignRoom = {};

		            $scope.closeDialog();
		        },
		        _onAssignFailure = function(errorMessage) {
		            $scope.$emit('hideLoader');
		            $scope.errorMessage = errorMessage;
		        },
		        _data = {
			        "date": $rootScope.businessDate,
			        "task_id": $scope.assignRoom.work_type_id,
			        "order": "",
			        "assignments": [{
			            "assignee_id": $scope.assignRoom.user_id,
			            "room_ids": $scope.assignRoom.rooms,
			            "work_sheet_id": "",
			            "from_search": true
			        }]
			    };

		    $scope.invokeApi(RVWorkManagementSrv.saveWorkSheet, _data, _onAssignSuccess, _onAssignFailure);
		};

		$scope.singleRoomTypeFiltered = function() {
			_.each($scope.roomTypes, function(item) {
				if ( item.id == $scope.currentFilters.singleRoomType ) {
					item.isSelected = true;
				} else {
					item.isSelected = false;
				};
			});
		};


		$scope.printData = function() {
			$scope.returnToPage = $_page;

			$_updateFilters('page', 1);
			$_updateFilters('perPage', 1000);

			function callback (data) {
				$_fetchRoomListCallback(data);
				printList();
			};

			$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomListPost, {}, callback);
		};



		$scope.roomSelectChange = function(item, i) {
			var _value = item.selected,
				_key   = i + '';
			
			// double to make sure its a truthy value
			if ( !! _value ) {
				$scope.multiRoomAction.anyChosen = true;

				// if this room has not added yet, add it
				if ( ! $scope.multiRoomAction.indexes.hasOwnProperty(_key) ) {
					$scope.multiRoomAction.rooms.push( $scope.rooms[i].id );
					$scope.multiRoomAction.indexes[_key] = i;
				};
			} else {
				if ( _.has($scope.multiRoomAction.indexes, _key) ) {
					// remove from array
					$scope.multiRoomAction.rooms.splice(i, 1);

					// remove keyMirror
					$scope.multiRoomAction.indexes[_key] = undefined;
					delete $scope.multiRoomAction.indexes[_key];
				};

				if ( !$scope.multiRoomAction.rooms.length ) {
					$scope.multiRoomAction.anyChosen = false;
				};
			};

			// check if all rooms have been selected to make the 'All Selected' enabled in filters
			if ( $scope.uiTotalCount == $scope.multiRoomAction.rooms.length ) {
				$scope.multiRoomAction.allChosen = true;
			} else {
				$scope.multiRoomAction.allChosen = false;
			};
		};

		$scope.toggleRoomSelection = function() {
			var _selection,
				_ithRoom,
				_key;

			var i, j;

			if ( $scope.multiRoomAction.allChosen ) {
				_selection = true;
			} else {
				_selection = false;
			};

			if ( $scope.multiRoomAction.anyChosen ) {
				_selection = false;
			};

			$scope.multiRoomAction.anyChosen = _selection;
			$scope.multiRoomAction.allChosen = _selection;

			// make all selected, push ids and track the indexes
			if ( _selection ) {
				$scope.multiRoomAction.rooms = [];
				$scope.multiRoomAction.indexes = {};

				for (i = 0, j = $scope.uiTotalCount; i < j; i++) {
					$scope.rooms[i]['selected'] = true;

					$scope.multiRoomAction.rooms.push( $scope.rooms[i]['id'] );
					$scope.multiRoomAction.indexes[i] = i;
				};
			}

			// loop the indexes to remove the chosen rooms
			// rather than loop in the entire array of rooms
			else {
				for ( _key in $scope.multiRoomAction.indexes ) {
					if ( ! $scope.multiRoomAction.indexes.hasOwnProperty(_key) ) {
					    continue;
					};

					_ithRoom = $scope.rooms[ $scope.multiRoomAction.indexes[_key] ];

					// remove selection
					if ( !! _ithRoom ) {
						_ithRoom['selected'] = false;
					};
				};

				$scope.multiRoomAction.rooms = [];
				$scope.multiRoomAction.indexes = {};
			};
		};

		$scope.openChangeHkStatusModal = function() {
			ngDialog.open({
			    template: '/assets/partials/housekeeping/rvChangeHkStatusModal.html',
			    className: 'ngdialog-theme-default',
			    closeByDocument: true,
			    scope: $scope
			});
		};

		$scope.resetMultiRoomAction = function() {

			// we are looping the 'keyMirror' rather than the
			// entire rooms array, nice!
			var i, _ithRoom;
			for (i in $scope.multiRoomAction.indexes) {
				if ( ! $scope.multiRoomAction.indexes.hasOwnProperty(i) ) {
				    continue;
				};

				_ithRoom = $scope.rooms[ $scope.multiRoomAction.indexes[i] ];

				// remove selection
				if ( !! _ithRoom ) {
					_ithRoom['selected'] = false;
				}
			};

			// F%$K that, cant update them all togther
			$scope.multiRoomAction.rooms       = [];
			$scope.multiRoomAction.indexes     = {};
			$scope.multiRoomAction.anyChosen   = false;
			$scope.multiRoomAction.allChosen   = false;
			$scope.multiRoomAction.hkStatusId  = '';
		};

		$scope.closeHkStatusDialog = function() {
			$scope.resetMultiRoomAction();
			$scope.closeDialog();
		};

		$scope.submitHkStatusChange = function() {
			var _payload,
				_resetParams,
				_callback,
				_onError;

			// no need to send anything
			if ( ! $scope.multiRoomAction.rooms.length ) {
				return;
			};

			_payload = {
				'room_ids'     : $scope.multiRoomAction.allChosen ? $scope.allRoomIDs : $scope.multiRoomAction.rooms,
				'hk_status_id' : $scope.multiRoomAction.hkStatusId
			};

			_callback = function(data) {
				$scope.$emit( 'hideLoader' );

				// get the selected hk status obj
				var hkStatusObj = _.find($scope.hkStatusList, function(item) {
					return item.id == $scope.multiRoomAction.hkStatusId;
				});

				// we are looping the 'keyMirror' rather than the
				// entire rooms array, nice!
				var i, ithSelectedRoom;
				for (i in $scope.multiRoomAction.indexes) {
					if ( ! $scope.multiRoomAction.indexes.hasOwnProperty(i) ) {
					    continue;
					};

					ithSelectedRoom = $scope.rooms[ $scope.multiRoomAction.indexes[i] ];

					// 1. update room description
					ithSelectedRoom['description'] = hkStatusObj['description'];

					// 2. update 'hk_status' of this room
					angular.extend(ithSelectedRoom['hk_status'], {
						description: hkStatusObj['description'],
						value: hkStatusObj['value']
					});

					// 3. now call the status class update
					RVHkRoomStatusSrv.setRoomStatusClass( ithSelectedRoom );
				};

				$scope.closeHkStatusDialog();
			};

			_onError = function(response) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = response;
			};

			$scope.invokeApi(RVHkRoomStatusSrv.putHkStatusChange, _payload, _callback, _onError);
		};




		/* ***** ***** ***** ***** ***** */



		function printList () {
			var domRoomInsertDelay = 400;

			// add the orientation
			$( 'head' ).append( "<style id='print-orientation'>@page { size: landscape; }</style>" );

			$scope.$emit('hideLoader');

			/*
			*	=====[ READY TO PRINT ]=====
			*/
		
			// this will show the popup with full report
		    $timeout(function() {

		    	/*
		    	*	=====[ PRINTING!! JS EXECUTION IS PAUSED ]=====
		    	*/

		        $window.print();
		        if ( sntapp.cordovaLoaded ) {
		            cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
		        };
		    }, domRoomInsertDelay);

		    /*
		    *	=====[ PRINTING COMPLETE/CANCELLED. JS EXECUTION WILL UNPAUSE ]=====
		    */

		    // in background we need to keep the report with its original state
		    $timeout(function() {
		    	// remove the orientation
				$( '#print-orientation' ).remove();

				// reset params to what it was before printing
				$_page = $scope.returnToPage;
				$_updateFilters('page', $_page);
				$_updateFilters('perPage', $window.innerWidth < 599 ? 25 : 50);

				$_callRoomsApi();
		    }, domRoomInsertDelay);
		};



		function $_fetchRoomListCallback(data, alreadyFetched) {
			if ( !!_.size(data) ) {
				$_roomList = angular.copy( data );
			} else {
				$_roomList = {};
			};

			// clear old results and update total counts
			$scope.rooms              = [];
			$scope.netTotalCount = $_roomList.total_count;
			$scope.uiTotalCount  = !!$_roomList && !!$_roomList.rooms ? $_roomList.rooms.length : 0;

			if ( $_page === 1 ) {
				$scope.resultFrom = 1;
				$scope.resultUpto = $scope.netTotalCount < $_perPage ? $scope.netTotalCount : $_perPage;
				$scope.disablePrevBtn = true;
				$scope.disableNextBtn = $scope.netTotalCount > $_perPage ? false : true;
			} else {
				$scope.resultFrom = $_perPage * ($_page - 1) + 1;
				$scope.resultUpto = ($scope.resultFrom + $_perPage - 1) < $scope.netTotalCount ? ($scope.resultFrom + $_perPage - 1) : $scope.netTotalCount;
				$scope.disablePrevBtn = false;
				$scope.disableNextBtn = $scope.resultUpto === $scope.netTotalCount ? true : false;
			}

			// filter stuff
			$scope.showPickup = $_roomList.use_pickup || false;
			$scope.showInspected = $_roomList.use_inspected || false;
			$scope.showQueued = $_roomList.is_queue_rooms_on || false;

			// need to work extra for standalone PMS
			if ( $rootScope.isStandAlone ) {
				if ( !$scope.workTypes.length ) {
					$scope.workTypes = fetchPayload.workTypes;
				};
				if ( !$scope.employees.length ) {
					$scope.employees = employees;
				};

				var _setUpWorkTypeEmployees = function() {
					$_defaultWorkType = $scope.currentFilters.filterByWorkType;
					$_defaultEmp      = $scope.currentFilters.filterByEmployeeName;

					// time to decide if this is an employee
					// who has an active work sheets
					if ( !!$scope.currentFilters.filterByWorkType && !!$scope.currentFilters.filterByEmployeeName ) {
						$_checkHasActiveWorkSheet(alreadyFetched);
					} else {
						// need delay, just need it
						$timeout(function() {
							$_postProcessRooms();
						}, 10);
					};
				};

				if ( (!!$scope.workTypes && $scope.workTypes.length) && (!!$scope.employees && $scope.employees.length) ) {
					_setUpWorkTypeEmployees();
				} else {
					$scope.invokeApi(RVHkRoomStatusSrv.fetchWorkTypes, {}, function(data) {
						$scope.workTypes = data;
						$scope.invokeApi(RVHkRoomStatusSrv.fetchHKEmps, {}, function(data) {
							$scope.employees = data;
							_setUpWorkTypeEmployees();
						});
					});
				};
			}
			// connected PMS, just process the roomList
			else {
				$timeout(function() {
					$_postProcessRooms();
				}, 10);
			};

			$_updateFilters('page', $_page);
		};



		/* ***** ***** ***** ***** ***** */



		function $_checkHasActiveWorkSheet(alreadyFetched) {
			var _params = {
					'date': $rootScope.businessDate,
					'employee_ids': [$_defaultEmp || $rootScope.userId], // Chances are that the $_defaultEmp may read as null while coming back to page from other pages
					'work_type_id': $_defaultWorkType
				},
				_callback = function(data) {
					$scope.hasActiveWorkSheet = !!data.work_sheets && !!data.work_sheets.length && !!data.work_sheets[0].work_assignments && !!data.work_sheets[0].work_assignments.length;

					$scope.topFilter.byWorkType = $_defaultWorkType;
					$scope.topFilter.byEmployee = $_defaultEmp;

					// set an active user in filterByEmployee, set the mobile tab to to summary
					if ( !!$scope.hasActiveWorkSheet ) {
						$scope.currentView = 'summary';
						$_caluculateCounts(data.work_sheets[0].work_assignments);
					} else {
						$scope.currentView = 'rooms';
					};

					// need delay, just need it
					$timeout(function() {
						$_postProcessRooms();
					}, 10);
				},
				// it will fail if returning from admin to room status
				// directly, since the flags in $rootScope may not be ready
				// no worries since a person with active worksheet may not have access to admin screens
				_failed = function() {
					$scope.topFilter.byWorkType = '';
					$scope.topFilter.byEmployee = '';

					$scope.hasActiveWorkSheet = false;
					$scope.currentView = 'rooms';

					$timeout(function() {
						$_postProcessRooms();
					}, 10);
				};

			// reset before fetch/process
			// $scope.hasActiveWorkSheet = false;
			// $scope.currentView        = 'rooms';

			// if the assignements has been loaded
			// as part of the inital load, just process it
			if ( alreadyFetched ) {
				_callback.call(null, fetchPayload.assignments);
			} else {
				$scope.invokeApi(RVHkRoomStatusSrv.fetchWorkAssignments, _params, _callback, _failed);
			};
		};



		/* ***** ***** ***** ***** ***** */


		function $_caluculateCounts(assignments) {
			$scope.counts = {
				allocated: 0,
				departures: 0,
				stayover: 0,
				completed: 0,
				total: 0
			}

			var totalHH = totalMM = hh = mm = i = 0;
			for ($scope.counts.total = assignments.length; i < $scope.counts.total; i++) {
				var room = assignments[i].room;

				totalHH += parseInt(room.time_allocated.split(':')[0]),
				totalMM += parseInt(room.time_allocated.split(':')[1]);

				if (room.reservation_status.indexOf("Arrived") >= 0) {
					$scope.counts.departures++;
				};
				if (room.reservation_status.indexOf("Stayover") >= 0) {
					$scope.counts.stayover++;
				};
				if (room.hk_complete) {
					$scope.counts.completed++;
				};
			};

			hh = totalHH + Math.floor(totalMM / 60);
			mm = (totalMM % 60) < 10 ? '0' + (totalMM % 60) : (totalMM % 60);
			$scope.counts.allocated = hh + ':' + mm;
		};



		/* ***** ***** ***** ***** ***** */



		function $_postProcessRooms() {
			var _processCount = 0,
				_minCount     = 13,
				i             = 0;

			// if   : results -> load 0 to '_processCount' after a small delay
			// else : empty and hide loader
			if ( $scope.uiTotalCount ) {
				_processCount = Math.min( $scope.uiTotalCount, _minCount );
				_firstInsert();
			} else {
				$scope.rooms = [];
				_hideLoader();
			};

			function _firstInsert () {
				for ( i = 0; i < _processCount; i++ ) {
					$scope.rooms.push( $_roomList.rooms[i] );
				};

				// if   : more than '_minCount' results -> load '_processCount' to last
				// else : hide loader
				if ( $scope.uiTotalCount > _minCount ) {
					$timeout(_secondInsert, 50);
				} else {
					_hideLoader();
				};
			};

			function _secondInsert () {
				for ( i = _processCount; i < $scope.uiTotalCount; i++ ) {
					$scope.rooms.push( $_roomList.rooms[i] );
				};

				_hideLoader();
			};

			function _hideLoader () {
				$_roomList = {};
				$_refreshScroll( localStorage.getItem('roomListScrollTopPos') );
				$scope.$emit( 'hideLoader' );
			};
		};



		/* ***** ***** ***** ***** ***** */



		function $_refreshScroll(toPos) {
			if ( $_roomsEl.scrollTop === toPos ) {
				return;
			};

			if ( isNaN(parseInt(toPos)) ) {
				var toPos = 0;
			} else {
				localStorage.removeItem( 'roomListScrollTopPos' );
			}

			// must delay untill DOM is ready to jump
			$timeout(function() {
				$_roomsEl.scrollTop = toPos;
			}, 10);
		};



		/* ***** ***** ***** ***** ***** */



		function $_callRoomsApi() {
			$scope.hasActiveWorkSheet = false;
			$scope.currentView        = 'rooms';
			$scope.rooms              = [];

			// reset any multi room action related data
			$scope.resetMultiRoomAction();

			$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomListPost, {}, $_fetchRoomListCallback);
		};

		function $_updateFilters (key, value) {
			$scope.currentFilters[key]       = value;
			RVHkRoomStatusSrv.currentFilters = angular.copy( $scope.currentFilters );
		};

		function $_resetPageCounts () {
			$_page = $_defaultPage;
			$_updateFilters('page', $_defaultPage);
		};



		/* ***** ***** ***** ***** ***** */



		var $_pullUpDownModule = function() {

			// caching DOM nodes invloved
			var $rooms        = document.getElementById( 'rooms' ),
				$roomsList    = $rooms.children[0];
				$refresh      = document.getElementById( 'pull-refresh-page' ),
				$refreshArrow = document.getElementById( 'refresh-icon' ),
				$refreshTxt   = document.getElementById( 'refresh-text' ),
				$load         = document.getElementById( 'pull-load-next' ),
				$loadArrow    = document.getElementById( 'load-icon' ),
				$loadTxt      = document.getElementById( 'load-text' );

			// flags and variables necessary
			var touching       = false,
				pulling        = false,
				startY         = 0,
				nowY           = 0,
				trigger        = 110,
				scrollBarOnTop = 0,
				scrollBarOnBot = $roomsList.clientHeight - $rooms.clientHeight,
				abs            = Math.abs,
				ngScope        = $scope;

			// translate const.
			var PULL_REFRESH      = $filter( 'translate' )( 'PULL_REFRESH' ),
				RELEASE_REFRESH   = $filter( 'translate' )( 'RELEASE_REFRESH' ),
				PULL_LOAD_NEXT    = $filter( 'translate' )( 'PULL_LOAD_NEXT' ),
				RELEASE_LOAD_NEXT = $filter( 'translate' )( 'RELEASE_LOAD_NEXT' ),
				PULL_LOAD_PREV    = $filter( 'translate' )( 'PULL_LOAD_PREV' ),
				RELEASE_LOAD_PREV = $filter( 'translate' )( 'RELEASE_LOAD_PREV' );

			// methods to modify the $refreshText and rotate $refreshArrow
			var notifyPullDownAction = function(diff) {
				if ( !diff ) {
					$refreshArrow.className = '';
					$refreshTxt.innerHTML = ngScope.disablePrevBtn ? PULL_REFRESH : PULL_LOAD_PREV;
					return;
				};

				if ( diff > trigger - 40 ) {
					$refreshArrow.className = 'rotate';
				} else {
					$refreshArrow.className = '';
				}

				if ( diff > trigger - 30 ) {
					$refreshTxt.innerHTML = ngScope.disablePrevBtn ? RELEASE_REFRESH : RELEASE_LOAD_PREV;
				} else {
					$refreshTxt.innerHTML = ngScope.disablePrevBtn ? PULL_REFRESH : PULL_LOAD_PREV;
				}
			};

			var notifyPullUpAction = function(diff) {
				if ( !diff ) {
					$loadArrow.className = '';
					$loadTxt.innerHTML = PULL_LOAD_NEXT;
					return;
				};

				if ( abs(diff) > trigger - 40 ) {
					$loadArrow.className = 'rotate';
				} else {
					$loadArrow.className = '';
				}

				if ( abs(diff) > trigger - 30 ) {
					$loadTxt.innerHTML = RELEASE_LOAD_NEXT;
				} else {
					$loadTxt.innerHTML = PULL_LOAD_NEXT;
				}
			};

			var callPulldownAction = function() {
				if ( ngScope.disablePrevBtn ) {
					$_resetPageCounts();
					$_callRoomsApi();
				} else {
					ngScope.loadPrevPage();
				};
			};

			var callPullUpAction = function() {
				ngScope.loadNextPage();
			};

			var genTranslate = function(x, y, z) {
				var x = (x || 0) + 'px',
					y = (y || 0) + 'px',
					z = (z || 0) + 'px';

				return 'translate3d(' + x + ', ' + y + ', ' + z + ')';
			};

			var hideNremove = function() {

			};

			// set of excutions to be executed when
			// the user is swiping across the screen
			var touchMoveHandler = function(e) {
				e.stopPropagation();

				var touch         = e.touches ? e.touches[0] : e,
					diff          = 0,
					translateZero = genTranslate(),
					translateDiff = '';

				var commonEx = function() {
					e.preventDefault();

					pulling       = true;
					diff          = (nowY - startY);
					translateDiff = genTranslate(0, diff, 0);

					$rooms.style.WebkitTransition = '';
					$rooms.style.webkitTransform  = translateDiff;
				};

				var resetIndicators = function() {
					$rooms.style.webkitTransform   = translateZero;
					$refresh.style.webkitTransform = translateZero;
					$load.style.webkitTransform    = translateZero;

					$timeout(function() {
						$refresh.classList.remove('show');
						$load.classList.remove('show');
					}, 320);
				};

				// if not touching or we are not on top or bottom of scroll area
				if (!touching && this.scrollTop !== scrollBarOnTop && this.scrollTop !== scrollBarOnBot) {
					return;
				};

				nowY = touch.y || touch.pageY;

				// if: pull down on page start, else: pull up on page end
				if ( nowY > startY && this.scrollTop === scrollBarOnTop ) {
					commonEx();
					$refresh.classList.add('show');

					$refresh.style.WebkitTransition = '';
					$refresh.style.webkitTransform  = translateDiff;

					notifyPullDownAction(diff);
				} else if ( !ngScope.disableNextBtn && nowY < startY && this.scrollTop === scrollBarOnBot ) {
					commonEx();
					$load.classList.add('show');

					$load.style.WebkitTransition = '';
					$load.style.webkitTransform  = translateDiff;

					notifyPullUpAction(diff);
				} else {
					pulling = false;
					return;
				};

				// sometimes the user may manually scrol to it original state
				if ( nowY - startY == 0 ) {
					resetIndicators();
				};
			};

			// set of excutions to be executed when
			// the user stops touching the screen
			// TODO: need to bind very similar for 'touchcancel' event
			var touchEndHandler = function(e) {
				var touch         = e.touches ? e.touches[0] : e,
					diff          = 0,
					addTransition = '-webkit-transform 0.3s',
					translateZero = genTranslate();

				var commonEx = function() {
					if ( pulling ) {
						e.preventDefault();
					};

					diff     = (nowY - startY);
					touching = false;
					pulling  = false;

					$rooms.style.WebkitTransition = addTransition;
					$rooms.style.webkitTransform  = translateZero;

					$rooms.removeEventListener(touchMoveHandler);
				};

				var resetIndicators = function() {
					$rooms.style.WebkitTransition = addTransition;
					$rooms.style.webkitTransform  = translateZero;

					$refresh.style.WebkitTransition = addTransition;
					$refresh.style.webkitTransform  = translateZero;

					$load.style.WebkitTransition = addTransition;
					$load.style.webkitTransform  = translateZero;

					$rooms.removeEventListener(touchMoveHandler);

					$timeout(function() {
						$refresh.classList.remove('show');
						$load.classList.remove('show');
						if ( abs(diff) > trigger ) {
							$_refreshScroll();
						}
					}, 320);
				};

				nowY = touch ? (touch.y || touch.pageY) : nowY;

				// if: pull down on page start, else: pull up on page end
				if ( nowY > startY && this.scrollTop === scrollBarOnTop ) {
					commonEx();

					if ( abs(diff) > trigger ) {
						callPulldownAction();
					};

					notifyPullDownAction();
					resetIndicators();
				} else if ( !ngScope.disableNextBtn && nowY < startY && this.scrollTop === scrollBarOnBot ) {
					commonEx();

					if ( abs(diff) > trigger ) {
						callPullUpAction();
					};

					notifyPullUpAction();
					resetIndicators();
				} else {
					resetIndicators();
					return;
				};
			};

			// set of excutions to be executed when
			// the user touch the screen
			var touchStartHandler = function(e) {
				var touch = e.touches ? e.touches[0] : e;

				// a minor hack since we have a rooms injection throttle
				scrollBarOnBot = $roomsList.clientHeight - $rooms.clientHeight;

				touching = true;
				pulling = false;
				startY = touch.y || touch.pageY;

				$rooms.style.WebkitTransition = '';

				// if: pull down on page start, else: pull up on page end
				if ( this.scrollTop === scrollBarOnTop ) {
					$refresh.style.WebkitTransition = '';
					$refresh.classList.add('show');
					/***/
					$load.style.WebkitTransition = '';
					$load.classList.remove('show');
				} else if ( this.scrollTop === scrollBarOnBot ) {
					$load.style.WebkitTransition = '';
					$load.classList.add('show');
					/***/
					$refresh.style.WebkitTransition = '';
					$refresh.classList.remove('show');
				};

				// only bind 'touchmove' when required
				$rooms.addEventListener('touchmove', touchMoveHandler, false);
			};

			// bind the 'touchstart' handler
			$rooms.addEventListener('touchstart', touchStartHandler, false);

			// bind the 'touchstart' handler
			$rooms.addEventListener('touchend', touchEndHandler, false);

			// bind the 'touchstart' handler
			$rooms.addEventListener('touchcancel', touchEndHandler, false);

			// remove the DOM binds when this scope is distroyed
			ngScope.$on('$destroy', function() {
				!!$rooms.length && $rooms.removeEventListener('touchstart');
				!!$rooms.length && $rooms.removeEventListener('touchend');
				!!$rooms.length && $rooms.removeEventListener('touchcancel');
			});
		};

		// initiate $_pullUpDownModule
		// dont move these codes outside this controller
		// DOM node will be reported missing
		if ( $window.innerWidth < 599 ) {
			$_pullUpDownModule();
		};
		



		/* ***** ***** ***** ***** ***** */



		// stop browser bounce while swiping on rooms element
		angular.element( $_roomsEl )
			.on('touchmove', function(e) {
				e.stopPropagation();
			});

		// stop browser bounce while swiping on filter-options element
		angular.element( $_filterRoomsEl )
			.on('touchmove', function(e) {
				// e.stopPropagation(); - CICO-13434 Changed to iscroll from native scroll.
			});

		// There are a lot of bindings that need to cleared
		$scope.$on('$destroy', function() {
			angular.element( $_roomsEl ).off('ontouchmove');
			angular.element( $_filterRoomsEl ).off('ontouchmove');
		});
	}
]);