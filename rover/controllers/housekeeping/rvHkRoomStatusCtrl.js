sntRover.controller('RVHkRoomStatusCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'RVHkRoomStatusSrv',
	'roomList',
	'employees',
	'workTypes',
	'roomTypes',
	'floors',
	'$window',
	'$timeout',
	'$filter',
	function(
		$scope,
		$rootScope,
		$state,
		RVHkRoomStatusSrv,
		roomList,
		employees,
		workTypes,
		roomTypes,
		floors,
		$window,
		$timeout,
		$filter
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
		$scope.currentFilters = RVHkRoomStatusSrv.currentFilters;

		// The filters should be re initialized if we are navigating from dashborad to search
		// In back navigation (From room details to search), we would retain the filters.
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if ((fromState.name === 'rover.housekeeping.roomDetails'
				&& toState.name !== 'rover.housekeeping.roomStatus')
				|| (fromState.name === 'rover.housekeeping.roomStatus' && toState.name !== 'rover.housekeeping.roomDetails')) {

				RVHkRoomStatusSrv.currentFilters = RVHkRoomStatusSrv.initFilters();
				$scope.currentFilters = RVHkRoomStatusSrv.currentFilters;
				localStorage.removeItem( 'roomListScrollTopPos' );
			};
		});	



		/* ***** ***** ***** ***** ***** */



		var $_roomList        = {},
			$_defaultWorkType = '',
			$_defaultEmp      = '';

		var $_page            = 1,
			$_perPage         = $window.innerWidth < 599 ? 25 : 50;

		var $_roomsEl         = document.getElementById( 'rooms' ),
			$_filterRoomsEl   = document.getElementById( 'filter-rooms' );

		$scope.resultFrom         = $_page,
		$scope.resultUpto         = $_perPage,
		$scope.totalCount         = 0;
		$scope.disablePrevBtn     = true;
		$scope.disableNextBtn     = true;

		$scope.filterOpen         = false;
		$scope.query              = '';
		$scope.noResultsFound     = 0;

		$scope.isStandAlone       = $rootScope.isStandAlone;
		$scope.isMaintenanceStaff = $rootScope.isMaintenanceStaff;
		$scope.hasActiveWorkSheet = false;

		$scope.roomTypes          = roomTypes;
		$scope.floors             = floors;



		/* ***** ***** ***** ***** ***** */



		$_fetchRoomListCallback();



		/* ***** ***** ***** ***** ***** */



		$scope.loadNextPage = function() {
			if ( $scope.disableNextBtn ) {
				return;
			};

			$_page++;
			$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomList, {
				key: !!$scope.query ? $scope.query : '',
				businessDate: $rootScope.businessDate,
				page: $_page,
				perPage: $_perPage
			}, $_fetchRoomListCallback);
		};

		$scope.loadPrevPage = function() {
			if ($scope.disablePrevBtn) {
				return;
			};

			$_page--;
			$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomList, {
				key: !!$scope.query ? $scope.query : '',
				businessDate: $rootScope.businessDate,
				page: $_page,
				perPage: $_perPage
			}, $_fetchRoomListCallback);
		};

		// store the current room list scroll position
		$scope.roomListItemClicked = function(room) {
			localStorage.setItem( 'roomListScrollTopPos', roomsEl.scrollTop );
		};

		$scope.filterDoneButtonPressed = function() {
			$scope.filterOpen = false;
			$scope.$emit( 'showLoader' );
			$timeout(function() {
				$scope.rooms = [];
				$_postProcessRooms();
			}, 100);

			// save the current edited filter to RVHkRoomStatusSrv
			// so that they can exist even after HKSearchCtrl init
			RVHkRoomStatusSrv.currentFilters = $scope.currentFilters;
			RVHkRoomStatusSrv.roomTypes = $scope.roomTypes;
		};

		// when user changes the employee filter
		$scope.applyWorkTypefilter = function() {
			$scope.currentFilters.filterByWorkType = $scope.topFilter.byWorkType;

			// if work type is null reset filter by employee
			if ( !$scope.currentFilters.filterByWorkType ) {
				$scope.topFilter.byEmployee = '';
				$scope.applyEmpfilter();
			} else {
				// call caluculate filter in else since
				// resetting filterByEmployee will call applyEmpfilter 
				// which in turn will call calculateFilters
				$scope.filterDoneButtonPressed();
			}
		};

		// when user changes the employee filter
		$scope.applyEmpfilter = function() {
			$scope.currentFilters.filterByEmployee = $scope.topFilter.byEmployee;
			$scope.filterDoneButtonPressed();
		};

		$scope.filterByQuery = function() {
			var unMatched = 0,
				len = 0,
				i = 0,
				timer = null,
				delayedRequest = function() {
					if ( !!timer ) {
						$timeout.cancel(timer);
						timer = null;
					}

					if ( $scope.query !== $_lastQuery ) {
						$_lastQuery = $scope.query;

						$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomList, {
							key: $scope.query,
							businessDate: $rootScope.businessDate,
							page: $_page,
							perPage: $_perPage
						}, function(data) {
							RVHkRoomStatusSrv.currentFilters = RVHkRoomStatusSrv.initFilters();
							$scope.currentFilters = RVHkRoomStatusSrv.currentFilters;
							localStorage.removeItem('roomListScrollTopPos');

							$_fetchRoomListCallback(data);
						});
					};
				};

			$_refreshScroll();
			for (len = $scope.rooms.length; i < len; i++) {
				var room = $scope.rooms[i]
				var roomNo = room.room_no.toUpperCase();

				// user cleared search
				if (!$scope.query) {
					$_postProcessRooms();
					break;
					return;
				};

				// show all rooms
				room.display_room = true;

				if ((roomNo).indexOf($scope.query.toUpperCase()) === 0) {
					room.display_room = true;
					unMatched--;
				} else {
					room.display_room = false;
					unMatched++;

					if ( unMatched === len ) {
						$_page = 1;

						// search in server
						if ( !!timer ) {
							$timeout.cancel(timer);
							timer = null;
							timer = $timeout(delayedRequest, 1000);
						} else {
							timer = $timeout(delayedRequest, 1000);
						};
					};
				};
			};
		};

		$scope.clearSearch = function() {
			$scope.query = '';

			// call the filter again maually
			// can't help it
			$scope.filterByQuery();
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

		$scope.isAnyFilterTrue = function(filterArray) {
			var ret = false;

			for (var i = 0, j = filterArray.length; i < j; i++) {
				if ($scope.currentFilters[filterArray[i]] === true) {
					ret = true;
					break;
				}
			};

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
					$_defaultWorkType = $scope.workTypes.length ? $scope.workTypes[0].id : {};
					$_defaultEmp = ($scope.topFilter.byEmployee !== -1) ? $scope.topFilter.byEmployee : $rootScope.userId;

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
			var _roomCopy = {};

			if (!!$_roomList && !!$_roomList.rooms && $_roomList.rooms.length) {
				// load first 13 a small delay (necessary) - for filters to work properly
				$timeout(function() {
					$_calculateFilters();

					// empty all
					$scope.rooms = [];

					// load first 13;
					for (var i = 0; i < 13; i++) {
						_roomCopy = angular.copy( $_roomList.rooms[i] );
						$scope.rooms.push( _roomCopy );
					};
				}, 10);

				// load the rest after a small delay - DOM can process it all
				$timeout(function() {

					// load the rest
					for (var i = 13, j = $_roomList.rooms.length; i < j; i++) {
						_roomCopy = angular.copy( $_roomList.rooms[i] );
						$scope.rooms.push( _roomCopy );
					};

					// scroll to the previous room list scroll position
					$_refreshScroll( localStorage.getItem('roomListScrollTopPos') );

					$scope.$emit( 'hideLoader' );
				}, 30);
			} else {
				$scope.rooms = [];
				$scope.$emit( 'hideLoader' );
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



		function $_calculateFilters() {

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
					$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomList, {
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

				// a minor hack since we have a rooms injection throtel
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