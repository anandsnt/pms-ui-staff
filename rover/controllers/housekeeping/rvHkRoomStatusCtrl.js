sntRover.controller('RVHkRoomStatusCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$state',
	'$filter',
	'$window',
	'RVHkRoomStatusSrv',
	'roomList',
	'employees',
	'workTypes',
	'roomTypes',
	'floors',
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
		roomList,
		employees,
		workTypes,
		roomTypes,
		floors,
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
		


		/* ***** ***** ***** ***** ***** */



		// reset all the filters
		if ( RVHkRoomStatusSrv.currentFilters.page < 1 ) {
			RVHkRoomStatusSrv.currentFilters.page = 1;
		};
		$scope.currentFilters = angular.copy(RVHkRoomStatusSrv.currentFilters);

		// The filters should be re initialized if we are navigating from dashborad to search
		// In back navigation (From room details to search), we would retain the filters.
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if ((fromState.name === 'rover.housekeeping.roomDetails' && toState.name !== 'rover.housekeeping.roomStatus')
				|| (fromState.name === 'rover.housekeeping.roomStatus' && toState.name !== 'rover.housekeeping.roomDetails')) {
				
				RVHkRoomStatusSrv.currentFilters = RVHkRoomStatusSrv.initFilters();
				$scope.currentFilters = angular.copy(RVHkRoomStatusSrv.currentFilters);

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
			$_defaultPerPage  = $window.innerWidth < 599 ? 25 : 50,
			$_oldFilterValues = {};

		var $_roomsEl         = document.getElementById( 'rooms' ),
			$_filterRoomsEl   = document.getElementById( 'filter-rooms' );

		var $_activeWorksheetData = [],
			$_tobeAssignedRoom    = {};

		var $_lastQuery = '';

		$scope.resultFrom         = $_page,
		$scope.resultUpto         = $_perPage,
		$scope.totalCount         = 0;
		$scope.disablePrevBtn     = true;
		$scope.disableNextBtn     = true;

		$scope.filterOpen         = false;
		$scope.query              = $scope.currentFilters.query;
		$scope.noResultsFound     = 0;

		$scope.isStandAlone       = $rootScope.isStandAlone;
		$scope.isMaintenanceStaff = $rootScope.isMaintenanceStaff;
		$scope.hasActiveWorkSheet = false;

		$scope.roomTypes          = roomTypes;
		$scope.floors             = floors;

		$scope.assignRoom = {};



		/* ***** ***** ***** ***** ***** */



		$_fetchRoomListCallback(roomList);



		/* ***** ***** ***** ***** ***** */



		$scope.loadNextPage = function() {
			if ( $scope.disableNextBtn ) {
				return;
			};

			$_page++;
			$_updateFilters('page', $_page);

			$_callRoomsApi();
		};

		$scope.loadPrevPage = function() {
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
		};

		$scope.filterDoneButtonPressed = function() {
			var _hasFilterChanged = _.find(RVHkRoomStatusSrv.currentFilters, function(value, key) {
				return $_oldFilterValues[key] != value;
			});

			var _makeCall = function() {
				$scope.filterOpen = false;
				$scope.$emit( 'showLoader' );

				RVHkRoomStatusSrv.currentFilters = angular.copy($scope.currentFilters);
				RVHkRoomStatusSrv.roomTypes = angular.copy($scope.roomTypes);

				// copy new filter settings
				$_oldFilterValues = angular.copy( RVHkRoomStatusSrv.currentFilters );

				$timeout(function() {
					$_callRoomsApi();
				}, 100);
			};

			// reset page details if filter changes
			if ( _hasFilterChanged ) {
				$_resetPageCounts();
			};

			_makeCall();
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
			_.each($scope.currentFilters, function(value, key, list) {
				list[key] = false;
			});

			angular.forEach($scope.roomTypes, function(roomType, id) {
				roomType.isSelected = false;
			});

			// this is the default state
			$scope.currentFilters['showAllFloors'] = true;

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

			var _onSuccess = function(response) {
					$scope.$emit('hideLoader');

					$_activeWorksheetData = response.data;
					$scope.activeWorksheetEmp = $_findEmpAry();
					ngDialog.open({
					    template: '/assets/partials/housekeeping/rvAssignRoomPopup.html',
					    className: 'ngdialog-theme-default',
					    closeByDocument: true,
					    scope: $scope,
					    data: []
					});
					
				},
				_onError = function() {
					$scope.$emit('hideLoader');
				};

			$scope.invokeApi(RVHkRoomStatusSrv.fetchActiveWorksheetEmp, {}, _onSuccess, _onError);
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
		            	'name': angular.copy(assignee.name),
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



		/* ***** ***** ***** ***** ***** */



		function $_fetchRoomListCallback(data) {
			if ( !!data ) {
				$_roomList = data;
			};

			$scope.totalCount = $_roomList.total_count;

			if ( $_page === 1 ) {
				$scope.resultFrom = 1;
				$scope.resultUpto = $scope.totalCount < $_perPage ? $scope.totalCount : $_perPage;
				$scope.disablePrevBtn = true;
				$scope.disableNextBtn = $scope.totalCount > $_perPage ? false : true;
			} else {
				$scope.resultFrom = $_perPage * ($_page - 1) + 1;
				$scope.resultUpto = ($scope.resultFrom + $_perPage - 1) < $scope.totalCount ? ($scope.resultFrom + $_perPage - 1) : $scope.totalCount;
				$scope.disablePrevBtn = false;
				$scope.disableNextBtn = $scope.resultUpto === $scope.totalCount ? true : false;
			}

			// filter stuff
			$scope.showPickup = $_roomList.use_pickup || false;
			$scope.showInspected = $_roomList.use_inspected || false;
			$scope.showQueued = $_roomList.is_queue_rooms_on || false;

			// need to work extra for standalone PMS
			if ($rootScope.isStandAlone) {
				$scope.workTypes = workTypes;
				$scope.employees = employees;

				// for mobile view spilt
				$scope.currentView = 'rooms';
				$scope.changeView = function(view) {
					$scope.currentView = view;
				};

				var _setUpWorkTypeEmployees = function() {
					$_defaultWorkType = $scope.currentFilters.filterByWorkType;
					$_defaultEmp      = ($scope.topFilter.byEmployee !== -1) ? $scope.topFilter.byEmployee : $rootScope.userId;

					// time to decide if this is an employee
					// who has an active work sheets
					$_checkHasActiveWorkSheet();
				}

				if ( workTypes.length && employees.length ) {
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



		function $_checkHasActiveWorkSheet() {
			var _params = {
					'date': $rootScope.businessDate,
					'employee_ids': [$_defaultEmp || $rootScope.userId], // Chances are that the $_defaultEmp may read as null while coming back to page from other pages
					'work_type_id': $_defaultWorkType
				},
				_callback = function(data) {
					$scope.topFilter.byWorkType = $_defaultWorkType;
					$scope.currentFilters.filterByWorkType = $scope.topFilter.byWorkType;

					$scope.hasActiveWorkSheet = !!data.work_sheets.length && !!data.work_sheets[0].work_assignments && !!data.work_sheets[0].work_assignments.length;

					// set an active user in filterByEmployee, set the mobile tab to to summary
					if ($scope.hasActiveWorkSheet) {
						$scope.topFilter.byEmployee = $_defaultEmp;
						$scope.currentFilters.filterByEmployee = $scope.topFilter.byEmployee;

						$_caluculateCounts(data.work_sheets[0].work_assignments);
						$scope.currentView = 'summary';
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
					$timeout(function() {
						$_postProcessRooms();
					}, 10);
				};

			$scope.invokeApi(RVHkRoomStatusSrv.fetchWorkAssignments, _params, _callback, _failed);
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
			var _roomCopy     = {},
				_totalLen     = !!$_roomList && !!$_roomList.rooms ? $_roomList.rooms.length : 0,
				_processCount = 0,
				_minCount     = 13;

			var _hideLoader = function() {
					$_refreshScroll( localStorage.getItem('roomListScrollTopPos') );
					$scope.$emit( 'hideLoader' );
				},
				_firstInsert = function(count) {
					for (var i = 0; i < count; i++) {
						_roomCopy = angular.copy( $_roomList.rooms[i] );
						$scope.rooms.push( _roomCopy );
					};

					if ( _totalLen < _minCount ) {
						_hideLoader();
					};
				},
				_secondInsert = function(startCount) {
					for (var i = startCount; i < _totalLen; i++) {
						_roomCopy = angular.copy( $_roomList.rooms[i] );
						$scope.rooms.push( _roomCopy );
					};

					_hideLoader();
				};

			$scope.rooms = [];

			if ( _totalLen ) {
				_processCount = Math.min(_totalLen, _minCount);

				// load first 13 a small delay (necessary) - for filters to work properly
				$timeout(_firstInsert.bind(null, _processCount), 10);

				// load the rest after a small delay - DOM can process it all
				if ( _totalLen > _minCount ) {
					$timeout(_secondInsert.bind(null, _processCount), 30);
				};
			} else {
				_hideLoader();
			}
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
			$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomListPost, {
				businessDate : $rootScope.businessDate,
			}, $_fetchRoomListCallback);
		};

		function $_updateFilters (key, value) {
			$scope.currentFilters[key]       = value;
			RVHkRoomStatusSrv.currentFilters = angular.copy($scope.currentFilters);
		};

		function $_resetPageCounts () {
			$_page = $_defaultPage;
			$_updateFilters('page', $_defaultPage);
		};



		/* ***** ***** ***** ***** ***** */



		var $_pullUpDownModule = function() {

			// YOU SHALL NOT BOUNCE!
			document.addEventListener('touchmove', function(e) {
				e.stopPropagation();
			});

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
				abs = Math.abs;

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
					$refreshTxt.innerHTML = $scope.disablePrevBtn ? PULL_REFRESH : PULL_LOAD_PREV;
					return;
				};

				if ( diff > trigger - 40 ) {
					$refreshArrow.className = 'rotate';
				} else {
					$refreshArrow.className = '';
				}

				if ( diff > trigger - 30 ) {
					$refreshTxt.innerHTML = $scope.disablePrevBtn ? RELEASE_REFRESH : RELEASE_LOAD_PREV;
				} else {
					$refreshTxt.innerHTML = $scope.disablePrevBtn ? PULL_REFRESH : PULL_LOAD_PREV;
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
				if ( !$scope.disablePrevBtn ) {
					$scope.loadPrevPage();
				} else {
					$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomListPost, {
						businessDate: $rootScope.businessDate,
						page: $_page,
						perPage: $_perPage
					}, $_fetchRoomListCallback);
				};
			};

			var callPullUpAction = function() {
				$scope.loadNextPage();
			};

			// set of excutions to be executed when
			// the user is swiping across the screen
			var touchMoveHandler = function(e) {
				e.stopPropagation();
				var touch = e.touches ? e.touches[0] : e,
					diff = 0,
					translateDiff = '',
					commonEx = function() {
						pulling = true;
						e.preventDefault();
						diff = (nowY - startY);
						translateDiff = 'translate3d(0, ' + diff + 'px, 0)';
						$rooms.style.WebkitTransition = '';
						$rooms.style.webkitTransform = translateDiff;
					};

				// if not touching or we are not on top or bottom of scroll area
				if (!touching && this.scrollTop !== scrollBarOnTop && this.scrollTop !== scrollBarOnBot) {
					return;
				};

				nowY = touch.y || touch.pageY;

				// if: user swiped more than 20 pixels
				if ( abs(nowY - startY) > 20 ) {
					// if: pull down on page start, else: pull up on page end
					if ( nowY > startY && this.scrollTop === scrollBarOnTop ) {
						commonEx();
						$refresh.classList.add('show');
						$refresh.style.WebkitTransition = '';
						$refresh.style.webkitTransform = translateDiff;
						notifyPullDownAction(diff);
					} else if ( !$scope.disableNextBtn && nowY < startY && this.scrollTop === scrollBarOnBot ) {
						commonEx();
						$load.classList.add('show');
						$load.style.WebkitTransition = '';
						$load.style.webkitTransform = translateDiff;
						notifyPullUpAction(diff);
					} else {
						pulling = false;
						return;
					};
				};
			};

			// set of excutions to be executed when
			// the user stops touching the screen
			// TODO: need to bind very similar for 'touchcancel' event
			var touchEndHandler = function(e) {
				var touch = e.touches ? e.touches[0] : e, 
					diff = 0,
					addTransition = '-webkit-transform 0.3s',
					translateZero = 'translate3d(0, 0, 0)',
					commonEx = function() {
						if (pulling) {
							e.preventDefault();
						};
						diff = (nowY - startY);
						$rooms.style.WebkitTransition = addTransition;
						$rooms.style.webkitTransform = translateZero;
						$rooms.removeEventListener(touchMoveHandler);

						touching = false;
						pulling = false;
					};

				nowY = touch ? (touch.y || touch.pageY) : nowY;

				// if: pull down on page start, else: pull up on page end
				if ( nowY > startY && this.scrollTop === scrollBarOnTop ) {
					commonEx();
					if ( abs(diff) > trigger ) {
						callPulldownAction();
					}
					$refresh.style.WebkitTransition = addTransition;
					$refresh.style.webkitTransform = translateZero;
					notifyPullDownAction();
					$timeout(function() {
						$refresh.classList.remove('show');
						if ( abs(diff) > trigger ) {
							$_refreshScroll();
						}
					}, 320);
				} else if ( !$scope.disableNextBtn && nowY < startY && this.scrollTop === scrollBarOnBot ) {
					commonEx();
					if ( abs(diff) > trigger ) {
						callPullUpAction();
					}
					$load.style.WebkitTransition = addTransition;
					$load.style.webkitTransform = translateZero;
					notifyPullUpAction();
					$timeout(function() {
						$load.classList.remove('show');
						if ( abs(diff) > trigger ) {
							$_refreshScroll();
						}
					}, 320);
				} else {
					$rooms.removeEventListener(touchMoveHandler);
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
				} else if ( this.scrollTop === scrollBarOnBot ) {
					$load.style.WebkitTransition = '';
					$load.classList.add('show');
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
			$scope.$on('$destroy', function() {
				!!$rooms.length && $rooms.removeEventListener('touchstart');
				!!$rooms.length && $rooms.removeEventListener('touchend');
				!!$rooms.length && $rooms.removeEventListener('touchcancel');
			});
		};

		// initiate $_pullUpDownModule
		// dont move these codes outside this controller
		// DOM node will be reported missing
		$_pullUpDownModule();



		/* ***** ***** ***** ***** ***** */



		// stop browser bounce while swiping on rooms element
		angular.element( $_roomsEl )
			.on('touchmove', function(e) {
				e.stopPropagation();
			});

		// stop browser bounce while swiping on filter-options element
		angular.element( $_filterRoomsEl )
			.on('touchmove', function(e) {
				e.stopPropagation();
			});

		// There are a lot of bindings that need to cleared
		$scope.$on('$destroy', function() {
			angular.element( $_roomsEl ).off('ontouchmove');
			angular.element( $_filterRoomsEl ).off('ontouchmove');
		});
	}
]);