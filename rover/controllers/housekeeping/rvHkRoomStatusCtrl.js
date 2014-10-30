sntRover.controller('RVHkRoomStatusCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$state',
	'$filter',
	'RVHkRoomStatusSrv',
	'roomList',
	'employees',
	'workTypes',
	'roomTypes',
	'floors',
	function($scope, $rootScope, $timeout, $state, $filter, RVHkRoomStatusSrv, roomList, employees, workTypes, roomTypes, floors) {

		// hook it up with base ctrl
		BaseCtrl.call(this, $scope);



		// set the previous state
		$rootScope.setPrevState = {
			title: $filter('translate')('DASHBOARD'),
			name: 'rover.dashboard'
		}



		// set title in header
		$scope.setTitle($filter('translate')('ROOM_STATUS'));
		$scope.heading = $filter('translate')('ROOM_STATUS');
		$scope.$emit("updateRoverLeftMenu", "roomStatus");

		var scrollOptions = {
			preventDefaultException: {
				tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|DIV)$/
			},
			preventDefault: false
		};
		$scope.setScroller('filtersection', scrollOptions);

		// reset all the filters
		$scope.currentFilters = RVHkRoomStatusSrv.currentFilters;

		// The filters should be re initialized in we are navigating from dashborad to search
		// In back navigation (From room details to search), we would retain the filters.
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if ((fromState.name === 'rover.housekeeping.roomDetails' && toState.name !== 'rover.housekeeping.roomStatus') || (fromState.name === 'rover.housekeeping.roomStatus' && toState.name !== 'rover.housekeeping.roomDetails')) {
				RVHkRoomStatusSrv.currentFilters = RVHkRoomStatusSrv.initFilters();
				$scope.currentFilters = RVHkRoomStatusSrv.currentFilters;
				localStorage.removeItem('roomListScrollTopPos');
			};
		});



		// internal variables
		var $_defaultWorkType,
			$_defaultEmp,
			$_hasActiveWorkSheet;

		// filter open or close
		$scope.filterOpen = false;

		// filter stuff
		$scope.showPickup = roomList.use_pickup || false;
		$scope.showInspected = roomList.use_inspected || false;
		$scope.showQueued = roomList.is_queue_rooms_on || false;

		// empty the search query
		$scope.query = '';

		// default no results found
		$scope.noResultsFound = 0;


		// default no top filters
		// $scope.topFilter = {};


		// ALL PMS: assign the resolved data to scope
		// common to all typr of PMS 
		$scope.roomTypes = roomTypes;
		$scope.floors = floors;

		// STANALONE PMS: assign the resolved data to scope
		if ($rootScope.isStandAlone) {
			$scope.workTypes = workTypes;
			$scope.employees = employees;

			$_defaultWorkType = $scope.workTypes[0].id;
			/**
			 * CICO-8620
			 * First time  ($scope.topFilter.byEmployee !== -1) default to the logged in user's ID
			 * Rest of the times maintain state in the dropdown!
			 *
			 */
			$_defaultEmp = ($scope.topFilter.byEmployee !== -1) ? $scope.topFilter.byEmployee : $rootScope.userId;

			// when a employee logges in mobile view
			// we introduce another level of tabs to seperate
			// his/her work count status and rooms
			// defaults to rooms tab, but if has active worksheet
			// show summary by default
			$scope.currentView = 'rooms';
			$scope.changeView = function(view) {
				$scope.currentView = view;
			};

			// time to decide if this is an employee
			// who has an active work sheets
			$_checkHasActiveWorkSheet();
		} else {
			// need delay, just need it
			$timeout(function() {
				$_postProcessRooms(roomList);
			}, 10);
		}



		function $_checkHasActiveWorkSheet(argument) {
			var _params = {
					'date': $rootScope.businessDate,
					'employee_ids': [$_defaultEmp || $rootScope.userId], // Chances are that the $_defaultEmp may read as null while coming back to page from other pages
					'work_type_id': $_defaultWorkType
				},
				_callback = function(data) {
					$scope.topFilter.byWorkType = $_defaultWorkType;
					$scope.currentFilters.filterByWorkType = $scope.topFilter.byWorkType;

					// $scope.$emit('hideLoader');
					$_hasActiveWorkSheet = !!data.work_sheets.length && !!data.work_sheets[0].work_assignments && !!data.work_sheets[0].work_assignments.length;

					// set an active user in filterByEmployee, set the mobile tab to to summary
					if ($_hasActiveWorkSheet) {
						$scope.topFilter.byEmployee = $_defaultEmp;
						$scope.currentFilters.filterByEmployee = $scope.topFilter.byEmployee;

						$_caluculateCounts(data.work_sheets[0].work_assignments);
						$scope.currentView = 'summary';
					};

					// need delay, just need it
					$timeout(function() {
						$_postProcessRooms(roomList);
					}, 10);
				};

			$scope.invokeApi(RVHkRoomStatusSrv.fetchWorkAssignments, _params, _callback);
		};

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



		function $_postProcessRooms(data) {
			// apply the filter first
			$_calculateFilters(data.rooms);

			// making unique copies of array
			// slicing same array not good.
			// say thanks to underscore.js
			var smallPart = _.compact(data.rooms);
			var restPart = _.compact(data.rooms);

			// smaller part consisit of enogh rooms
			// that will fill in the screen
			smallPart = smallPart.slice(0, 13);
			restPart = restPart.slice(13);

			// first load the small part
			$scope.rooms = smallPart;

			// load the rest after a small delay
			$timeout(function() {

				// push the rest of the rooms into $scope.rooms
				// remember slicing is only happening on the Ctrl and not on Srv
				$scope.rooms.push.apply($scope.rooms, restPart);

				// scroll to the previous room list scroll position
				var toPos = localStorage.getItem('roomListScrollTopPos');
				$scope.refreshScroll(toPos);

				$scope.$emit('hideLoader');

				// execute this after this much time
				// as the animation is in progress
			}, 700);
		};



		var roomsEl = document.getElementById('rooms');
		var filterOptionsEl = document.getElementById('filter-options');

		// stop browser bounce while swiping on rooms element
		angular.element(roomsEl)
			.on('ontouchmove', function(e) {
				e.stopPropagation();
			});

		// stop browser bounce while swiping on filter-options element
		angular.element(filterOptionsEl)
			.on('ontouchmove', function(e) {
				e.stopPropagation();
			});

		$scope.refreshScroll = function(toPos) {
			if (roomsEl.scrollTop === toPos) {
				return;
			};

			if (isNaN(parseInt(toPos))) {
				var toPos = 0;
			} else {
				localStorage.removeItem('roomListScrollTopPos');
			}

			// must delay untill DOM is ready to jump
			$timeout(function() {
				roomsEl.scrollTop = toPos;
			}, 10);
		};



		// store the current room list scroll position
		$scope.roomListItemClicked = function(room) {
			localStorage.setItem('roomListScrollTopPos', roomsEl.scrollTop);
		}

		/**
		 *  Function to Update the filter service on changing the filter state
		 *  @param {string} name of the filter to be updated
		 */
		$scope.checkboxClicked = function(item) {
			RVHkRoomStatusSrv.toggleFilter(item);
		}

		$scope.showFilters = function() {
			$scope.filterOpen = true;
			$scope.refreshScroller('filtersection');
		};

		/**
		 *  A method to handle the filter done button
		 *  Refresh the room list scroll
		 *  Emits a call to dismiss the filter screen
		 */
		$scope.filterDoneButtonPressed = function() {
			$_calculateFilters();

			$scope.refreshScroll();

			$scope.filterOpen = false;

			// save the current edited filter to RVHkRoomStatusSrv
			// so that they can exist even after HKSearchCtrl init
			RVHkRoomStatusSrv.currentFilters = $scope.currentFilters;
			RVHkRoomStatusSrv.roomTypes = $scope.roomTypes;
		};

		// when user changes the employee filter
		$scope.applyWorkTypefilter = function() {
			$scope.currentFilters.filterByWorkType = $scope.topFilter.byWorkType;

			// if work type is null reset filter by employee
			if (!$scope.currentFilters.filterByWorkType) {
				$scope.topFilter.byEmployee = '';
				$scope.applyEmpfilter();
			} else {
				// call caluculate filter in else since
				// resetting filterByEmployee will call applyEmpfilter 
				// which in turn will call calculateFilters
				$_calculateFilters();
				$scope.refreshScroll();
			}

			// save the current edited filter to RVHkRoomStatusSrv
			// so that they can exist even after HKSearchCtrl init
			RVHkRoomStatusSrv.currentFilters = $scope.currentFilters;
		};

		// when user changes the employee filter
		$scope.applyEmpfilter = function() {
			$scope.currentFilters.filterByEmployee = $scope.topFilter.byEmployee;
			$_calculateFilters();

			$scope.refreshScroll();

			// save the current edited filter to RVHkRoomStatusSrv
			// so that they can exist even after HKSearchCtrl init
			RVHkRoomStatusSrv.currentFilters = $scope.currentFilters;
		};

		// CICO-10101 #5 requirement: when chosing 'vacant' also show 'queued' since its also vacant
		$scope.checkQueuedAlso = function() {
			if (!!$scope.currentFilters.vacant) {
				$scope.currentFilters.queued = true;
			};
		};
		$scope.keepCheckedIfVacant = function() {
			if (!$scope.currentFilters.queued && !!$scope.currentFilters.vacant) {
				$timeout(function() {
					$scope.currentFilters.queued = true;
				}, 10);
			};
		};


		// CICO-10101 #5 requirement: when chosing 'vacant' also show 'queued' since its also vacant
		/**
		 * CICO-10255
		 * Jos had reported an issue (Housekeeping - Filter screen when you click "show vacant" the "show queued" is also automatically marked)
		 * Have removed invocation of these two functions
		 */
		$scope.checkQueuedAlso = function() {
			if (!!$scope.currentFilters.vacant) {
				$scope.currentFilters.queued = true;
			};
		};
		$scope.keepCheckedIfVacant = function() {
			if (!$scope.currentFilters.queued && !!$scope.currentFilters.vacant) {
				$timeout(function() {
					$scope.currentFilters.queued = true;
				}, 10);
			};
		};


		/**
		 *  A method which checks the filter option status and see if the room should be displayed
		 */
		function $_calculateFilters(source) {

			var source = source || $scope.rooms;
			$scope.noResultsFound = 0;
			var roomTypesUnSelected = true;

			//If all room types are unselected, we should show all rooms.
			angular.forEach($scope.roomTypes, function(roomType, id) {
				if (roomType.isSelected) {
					roomTypesUnSelected = false;
				}
				return false;
			});

			for (var i = 0, j = source.length; i < j; i++) {
				var room = source[i];

				if ($rootScope.isStandAlone) {
					// any matched work type ids of room to chosen work type id
					var workTypeMatch = _.find(room.work_type_ids, function(id) {
						return id == $scope.currentFilters.filterByWorkType;
					});

					// Filter by work type
					if (!!$scope.currentFilters.filterByWorkType && !workTypeMatch) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					};

					// Filter by employee name, strach that the id
					// TODO: currently we only get room.assignee_maid, we need this like this room.assignee_maid{ name: 'name', id: id } 
					if (!!$scope.currentFilters.filterByEmployee && room.assignee_maid.id != $scope.currentFilters.filterByEmployee) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					};
				}


				//Filter by Floors
				//Handling special case : If floor is not set up for room, and a filter is selected, dont show it.
				if ($scope.currentFilters.floorFilterStart || $scope.currentFilters.floorFilterEnd || $scope.currentFilters.floorFilterSingle) {
					if (room.floor.floor_number == null) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
				}

				if ($scope.currentFilters.floorFilterSingle != '' && room.floor.floor_number != $scope.currentFilters.floorFilterSingle) {
					room.display_room = false;
					$scope.noResultsFound++;
					continue;
				}

				if ($scope.currentFilters.floorFilterStart != '' && room.floor.floor_number < $scope.currentFilters.floorFilterStart) {
					room.display_room = false;
					$scope.noResultsFound++;
					continue;
				}

				if ($scope.currentFilters.floorFilterEnd != '' && room.floor.floor_number > $scope.currentFilters.floorFilterEnd) {
					room.display_room = false;
					$scope.noResultsFound++;
					continue;
				}

				// filter by room type
				if (!!room.room_type.id) {
					var matchedRoomType = _.find($scope.roomTypes, function(type) {
						return type.id == room.room_type.id;
					});
					if (!roomTypesUnSelected && !matchedRoomType.isSelected) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
				};

				// filter by status in filter section, HK_STATUS
				if ($scope.isAnyFilterTrue(['dirty', 'pickup', 'clean', 'inspected'])) {
					if (!$scope.currentFilters.dirty && (room.hk_status.value === "DIRTY")) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
					if (!$scope.currentFilters.pickup && (room.hk_status.value === "PICKUP")) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
					if (!$scope.currentFilters.clean && (room.hk_status.value === "CLEAN")) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
					if (!$scope.currentFilters.inspected && (room.hk_status.value === "INSPECTED")) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
				}

				// filter by status in filter section, OCCUPANCY_STATUS
				if ($scope.isAnyFilterTrue(["vacant", "occupied", "queued"])) {
					/**
					 *CICO-10255
					 *Jos had reported an issue (Housekeeping - Filter screen when you click "show vacant" the "show queued" is also automatically marked)
					 *		 				* Have removed invocation of these two functions
					 * Also modified below condition.. Hide queued rooms IFF both vacant and queued are unchecked
					 */
					if (!$scope.currentFilters.queued && !$scope.currentFilters.vacant && room.is_queued) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}

					// If queued, that get priority. Do not show anything which is "not queued" and vacant
					if (!$scope.currentFilters.vacant && !room.is_queued && !room.is_occupied) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}

					// If queued, that get priority.
					if (!$scope.currentFilters.occupied && !room.is_queued && room.is_occupied) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
				}

				// Filter by status in filter section, ROOM_RESERVATION_STATUS
				// For this status, pass the test, if any condition applies.
				// NOTE : This must be the last set of checks, as we make display_room = true and mark continue here.
				if ($scope.isAnyFilterTrue(['stayover', 'not_reserved', 'arrival', 'arrived', 'dueout', 'departed', 'dayuse'])) {
					if ($scope.currentFilters.stayover && room.room_reservation_status.indexOf("Stayover") >= 0) {
						room.display_room = true;
						continue;
					}
					if ($scope.currentFilters.not_reserved && room.room_reservation_status.indexOf("Not Reserved") >= 0) {
						room.display_room = true;
						continue;
					}
					if ($scope.currentFilters.arrival && room.room_reservation_status.indexOf("Arrival") >= 0) {
						room.display_room = true;
						continue;
					}
					if ($scope.currentFilters.arrived && room.room_reservation_status.indexOf("Arrived") >= 0) {
						room.display_room = true;
						continue;
					}
					if ($scope.currentFilters.dueout && room.room_reservation_status.indexOf("Due out") >= 0) {
						room.display_room = true;
						continue;
					}
					if ($scope.currentFilters.departed && room.room_reservation_status.indexOf("Departed") >= 0) {
						room.display_room = true;
						continue;
					}
					if ($scope.currentFilters.dayuse && room.room_reservation_status.indexOf("Day use") >= 0) {
						room.display_room = true;
						continue;
					}

					room.display_room = false;
					$scope.noResultsFound++;
					continue;
				}

				// filter by status in filter section, room reservation HK_STATUS
				// NOTE: This must be the last set of checks, as we make display_room = true and mark continue here.
				// NOTE: in future the internal check may become common - check only 'room_reservation_hk_status'
				if ($scope.isAnyFilterTrue(['out_of_order', 'out_of_service'])) {
					if ($scope.currentFilters.out_of_order && (room.hk_status.value === "OO" || (room.hasOwnProperty('room_reservation_hk_status') && room.room_reservation_hk_status == 3))) {
						room.display_room = true;
						continue;
					}
					if ($scope.currentFilters.out_of_service && (room.hk_status.value === "OS" || (room.hasOwnProperty('room_reservation_hk_status') && room.room_reservation_hk_status == 2))) {
						room.display_room = true;
						continue;
					}

					room.display_room = false;
					$scope.noResultsFound++;
					continue;
				}

				room.display_room = true;
			}


		};

		/**
		 *  Filter Function for filtering our the room list
		 */
		$scope.filterByQuery = function() {

			// since no filer we will have to
			// loop through all rooms
			for (var i = 0, j = $scope.rooms.length; i < j; i++) {
				var room = $scope.rooms[i]
				var roomNo = room.room_no.toUpperCase();

				// if the query is empty
				// apply any filter options
				// and return
				if (!$scope.query) {
					$_calculateFilters();
					break;
					return;
				};

				// let remove any changed applied by filter
				// show all rooms
				room.display_room = true;

				// now match the room no and
				// and show hide as required
				// must match first occurance of the search query
				if ((roomNo).indexOf($scope.query.toUpperCase()) === 0) {
					room.display_room = true;
				} else {
					room.display_room = false;
				}
			}

			// refresh scroll when all ok
			$scope.refreshScroll();
		}

		/**
		 *  A method to clear the search term
		 */
		$scope.clearSearch = function() {
			$scope.query = '';

			// call the filter again maually
			// can't help it
			$scope.filterByQuery();
		}

		/**
		 *   A method to determine if any filter checked
		 *   @return {Boolean} false if none of the filter is checked
		 */
		$scope.isFilterChcked = function() {
			var key, ret;
			for (key in $scope.currentFilters) {
				if (key != 'showAllFloors' && !!$scope.currentFilters[key]) {
					ret = true;
					break;
				} else {
					ret = false;
				}
			}
			return ret;
		}

		/**
		 *  A method to check if any filter in the given set is set to true
		 *  @param {Array} filter arry to be evaluated
		 *  @return {Boolean} true if any filter is set to true
		 */
		$scope.isAnyFilterTrue = function(filterArray) {
			var ret = false;

			for (var i = 0, j = filterArray.length; i < j; i++) {
				if ($scope.currentFilters[filterArray[i]] === true) {
					ret = true;
					break;
				}
			};

			return ret;
		}

		/**
		 *  A method to uncheck all the filter options
		 */
		$scope.clearFilters = function() {
			_.each($scope.currentFilters, function(value, key, list) {
				list[key] = false;
			});

			angular.forEach($scope.roomTypes, function(roomType, id) {
				roomType.isSelected = false;
			});

			// this is the default state
			$scope.currentFilters['showAllFloors'] = true;

			$scope.refreshScroll();
		}

		/**
		 * Click handler for floor selection drop-down
		 * If we select a single floor option, the from-floor/to-floor should be initialised to none.
		 * If we select the from-floor/ to-floor option, the single-floor initialized to none.
		 */
		$scope.validateFloorSelection = function(type) {
			if (type == 'SINGLE_FLOOR') {
				$scope.currentFilters.floorFilterStart = '';
				$scope.currentFilters.floorFilterEnd = '';

			}

			if (type == 'FROM_FLOOR' || type == 'TO_FLOOR') {
				$scope.currentFilters.floorFilterSingle = '';
			}
		};

		/**
		 * Click handler for All-Floors checkbox
		 */
		$scope.allFloorsClicked = function() {
			$scope.currentFilters.showAllFloors = !$scope.currentFilters.showAllFloors;
			$scope.currentFilters.floorFilterStart = '';
			$scope.currentFilters.floorFilterEnd = '';
			$scope.currentFilters.floorFilterSingle = '';
			$scope.refreshScroller('filtersection');
		};



		// could be moved to a directive,
		// but addicted by the amount of control
		// and power it gives here
		var pullRefresh = function() {

			// caching DOM nodes invloved 
			var $rooms = document.getElementById('rooms'),
				$notify = document.getElementById('pull-refresh-notify'),
				$arrow = document.getElementById('icon'),
				$notifyTxt = document.getElementById('ref-text');

			// flags and variables necessary
			var touching = false,
				pulling = false,
				startY = 0,
				nowY = 0,
				initTop = $rooms.scrollTop,
				trigger = 110;

			// translate cache
			var PULL_REFRESH = $filter('translate')('PULL_REFRESH'),
				RELEASE_REFRESH = $filter('translate')('RELEASE_REFRESH');

			// methods to modify the $notifyText and rotate $arrow
			var loadNotify = function(diff) {
				if (!diff) {
					$arrow.className = '';
					$notifyTxt.innerHTML = PULL_REFRESH;
					return;
				};

				if (diff > trigger - 40) {
					$arrow.className = 'rotate';
				} else {
					$arrow.className = '';
				}

				if (diff > trigger - 30) {
					$notifyTxt.innerHTML = RELEASE_REFRESH;
				} else {
					$notifyTxt.innerHTML = PULL_REFRESH;
				}
			};

			// set of excutions to be executed when
			// the user is swiping across the screen
			var touchMoveHandler = function(e) {
				var touch = e.touches ? e.touches[0] : e;

				// if not touching or we are not on top of scroll area
				if (!touching || this.scrollTop > initTop) {
					return;
				};

				nowY = touch.y || touch.pageY;

				// again a precaution
				// that the user has started pull down
				if (startY > nowY) {
					pulling: false;
					return;
				} else {
					pulling: true;
				}

				// only when everything checks out
				// prevent default to block the scrolling
				e.preventDefault();

				// don't remove, you will learn soon why not
				$rooms.style.WebkitTransition = '';
				$notify.style.WebkitTransition = '';

				var diff = (nowY - startY);

				// we move with the swipe
				$rooms.style.webkitTransform = 'translateY(' + diff + 'px)';
				$notify.style.webkitTransform = 'translateY(' + diff + 'px)';

				loadNotify(diff);
			};

			// set of excutions to be executed when
			// the user touch the screen
			var touchStartHandler = function(e) {
				var touch = e.touches ? e.touches[0] : e;

				// if we are not on top of scroll area
				if (this.scrollTop > initTop) {
					return;
				};

				touching = true;
				pulling = false;
				startY = touch.y || touch.pageY;

				$rooms.style.WebkitTransition = '';
				$notify.style.WebkitTransition = '';

				$notify.classList.add('show');

				// only bind 'touchmove' when required
				$rooms.addEventListener('touchmove', touchMoveHandler, false);
			};

			// set of excutions to be executed when
			// the user stops touching the screen
			// TODO: need to bind very similar for 'touchcancel' event
			var touchEndHandler = function(e) {
				var touch = e.touches ? e.touches[0] : e;

				// if we are not on top of scroll area
				if (this.scrollTop > initTop) {
					return;
				};

				// gotta prevent only when
				// user has already pulled down
				if (pulling) {
					e.preventDefault();
				};

				touching = false;
				pulling = false;
				nowY = touch ? (touch.y || touch.pageY) : nowY;

				var diff = (nowY - startY);

				// if we have hit the trigger refresh room list
				if (diff > trigger) {

					// fetchRooms();
					$scope.invokeApi(RVHkRoomStatusSrv.fetchRoomList, {
						businessDate: $rootScope.businessDate,
						refresh: true
					}, function(data) {
						roomList = data;
						if ($rootScope.isStandAlone) {
							// time to decide if this is an employee
							// who has an active work sheets
							$_checkHasActiveWorkSheet();
						} else {
							$timeout(function() {
								$_postProcessRooms(roomList);
							}, 10);
						};
					});

				}

				// for the smooth transition back
				$rooms.style.WebkitTransition = '-webkit-transform 0.3s';
				$notify.style.WebkitTransition = '-webkit-transform 0.3s';

				$rooms.style.webkitTransform = 'translateY(0)';
				$notify.style.webkitTransform = 'translateY(0)';

				// 'touchmove' handler is not necessary
				$rooms.removeEventListener(touchMoveHandler);

				$timeout(function() {
					$notify.classList.remove('show');
				}, 320);

				loadNotify();
			};

			// bind the 'touchstart' handler
			$rooms.addEventListener('touchstart', touchStartHandler, false);

			// bind the 'touchend' handler
			$rooms.addEventListener('touchend', touchEndHandler, false);

			// bind the 'touchcancel' handler
			$rooms.addEventListener('touchcancel', touchEndHandler, false);

			// remove the DOM binds when this scope is distroyed
			$scope.$on('$destroy', function() {
				!!$rooms.length && $rooms.removeEventListener('touchstart');
				!!$rooms.length && $rooms.removeEventListener('touchend');
				!!$rooms.length && $rooms.removeEventListener('touchcancel');
			});
		};

		// initiate pullRefresh
		// dont move these codes outside this controller
		// DOM node will be reported missing
		pullRefresh();


		// There are a lot of bindings that need to cleared
		$scope.$on('$destroy', function() {
			angular.element(roomsEl).off('ontouchmove');
			angular.element(filterOptionsEl).off('ontouchmove');
		});

	}
]);