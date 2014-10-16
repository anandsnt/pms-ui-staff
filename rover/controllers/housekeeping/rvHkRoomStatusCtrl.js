sntRover.controller('RVHkRoomStatusCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$state',
	'$filter',
	'RVHkRoomStatusSrv',
	'fetchedRoomList',
	function($scope, $rootScope, $timeout, $state, $filter, RVHkRoomStatusSrv, fetchedRoomList) {


		// TODO: RESTRUCTURE THE CODE TO PROPER SECTIONS
		// 1. stateChange  should keep filters or reset them?
		// 2. fetch housemaid list, work type list, floor type etc and possible cashing in srv
		// 3. should fetch room list again or not
		// 4. all filters and things
		// 5. calculate filters, check possiblity of moving it to a seperate module its too big!
		// 6. pull down to refresh
		// 7. performance enhancement


		// additional check since the router resolve may fail
		if ( !fetchedRoomList ) {
			var fetchedRoomList = RVHkRoomStatusSrv.roomList;
		};

		/*var successCallback = function(data){
			//$scope.allRoomTypes = data;
		};*/
		$scope.allRoomTypes = RVHkRoomStatusSrv.allRoomTypes;
		if( isEmptyObject(RVHkRoomStatusSrv.allRoomTypes) ){
			$scope.invokeApi(RVHkRoomStatusSrv.fetchAllRoomTypes, {}, '', '', 'NONE');
		}


		BaseCtrl.call(this, $scope);

		// set the previous state
		$rootScope.setPrevState = {
		    title: $filter('translate')('DASHBOARD'),
		    name: 'rover.dashboard'
		}

		// set title in header
		$scope.setTitle( $filter('translate')('ROOM_STATUS') );
		$scope.heading = $filter('translate')('ROOM_STATUS');
	    $scope.$emit("updateRoverLeftMenu", "roomStatus");

		$scope.filterOpen = false;
		$scope.localLoader = false;

		$scope.query = '';
		$scope.showPickup = false;
		$scope.showInspected = false;

		$scope.showQueued = false;

		$scope.noResultsFound = 0;

		$scope.topFilter = {};

		// default values for these
		// for a HK staff the filterByEmployee value must be defalut to that
		// and filter the rooms accordingly
		// fetch all the HK work staff
		if ( $rootScope.isStandAlone ) {

			// switching b/w summary and rooms on mobile view
			if ( $rootScope.isMaintenanceStaff ) {
				$scope.currentView = 'summary';
			} else {
				$scope.currentView = 'rooms';
			}
			$scope.changeView = function(view) {
				$scope.currentView = view;
			};

			$scope.workTypes = [];
			var defaultWorkType;
			var wtCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.workTypes = data;

				// chose the first work type for now
				defaultWorkType = data[0].id;
			};
			$scope.invokeApi(RVHkRoomStatusSrv.getWorkTypes, {}, wtCallback);

			// fetch all the HK work staff
			$scope.HKMaids = [];
			var defaultMaid;
			var hkmCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.HKMaids = data;

				// TODO: We need to have the id's here to compare
				defaultMaid = _.find($scope.HKMaids, function(maid) {
					return maid.id == $rootScope.userName;
				});
			};
			$scope.invokeApi(RVHkRoomStatusSrv.fetchHKMaids, {}, hkmCallback);
		};

		// make sure any previous open filter is not showing
		$scope.$emit( 'dismissFilterScreen' );

		$scope.noScroll = true;
		var afterFetch = function(data) {
			$scope.localLoader = true;

			// apply the filter first
			$scope.calculateFilters(data.rooms);

			// making unique copies of array
			// slicing same array not good.
			// say thanks to underscore.js
			var smallPart = _.compact( data.rooms );
			var restPart  = _.compact( data.rooms );

			// smaller part consisit of enogh rooms
			// that will fill in the screen
			smallPart = smallPart.slice( 0, 13 );
			restPart  = restPart.slice( 13 );

			// first load the small part
			$scope.rooms = smallPart;

			// load the rest after a small delay
			$timeout(function() {

				// push the rest of the rooms into $scope.rooms
				// remember slicing is only happening on the Ctrl and not on Srv
				$scope.rooms.push.apply( $scope.rooms, restPart );

				// scroll to the previous room list scroll position
				var toPos = localStorage.getItem( 'roomListScrollTopPos' );
				$scope.refreshScroll( toPos );

				$scope.localLoader = false;

			// execute this after this much time
			// as the animation is in progress
			}, 700);
		};


		var fetchRooms = function() {
			//Fetch the roomlist if necessary
			if ( RVHkRoomStatusSrv.isListEmpty() || !fetchedRoomList.rooms.length) {

				var callback = function(data) {
					$scope.showPickup = data.use_pickup;
					$scope.showInspected = data.use_inspected;
					$scope.showQueued = data.is_queue_rooms_on;

					if ( $rootScope.isStandAlone ) {
						// show the rooms with matching worktype
						// update filterByWorkType filter
						$scope.topFilter.byWorkType = defaultWorkType;
						$scope.currentFilters.filterByWorkType = $scope.topFilter.byWorkType;
					}

					// only set this for the staff with housekeeping dashboard
					if ( $rootScope.isMaintenanceStaff ) {
						// show the user related rooms only
						// update filterByWorkType filter
						$scope.topFilter.byEmployee = defaultMaid;
						$scope.currentFilters.filterByEmployee = $scope.topFilter.byEmployee;
					}

					$scope.$emit('hideLoader');
					afterFetch( data );
				};	
				$scope.invokeApi(RVHkRoomStatusSrv.fetch, $rootScope.businessDate, callback);
			} else {
				$timeout(function() {
					if ( $rootScope.isStandAlone ) {
						// restore the filterByWorkType from previous chosen value
						$scope.topFilter.byWorkType = $scope.currentFilters.filterByWorkType;
					}

					// only set this for the staff with housekeeping dashboard
					if ( $rootScope.isMaintenanceStaff ) {
						// restore the filterByEmployee from previous chosen value
						$scope.topFilter.byEmployee = $scope.currentFilters.filterByEmployee;
					}
					
					afterFetch( fetchedRoomList );
				}, 1);
			}
		};

		fetchRooms();

		var fetchFloors = function() {
			//Fetch the roomlist if necessary

			$scope.$emit('showLoader');
			RVHkRoomStatusSrv.fetch_floors().then(function(data) {
				$scope.$emit('hideLoader');
				$scope.floors = data;
			}, function() {
				$scope.$emit('hideLoader');
			});
		}

		fetchFloors();

		$scope.currentFilters = RVHkRoomStatusSrv.currentFilters;

		/** The filters should be re initialized in we are navigating from dashborad to search
		*   In back navigation (From room details to search), we would retain the filters.
		*/
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if ( (fromState.name === 'rover.housekeeping.roomDetails' && toState.name !== 'rover.housekeeping.roomStatus') || (fromState.name === 'rover.housekeeping.roomStatus' && toState.name !== 'rover.housekeeping.roomDetails') ) {
				RVHkRoomStatusSrv.currentFilters = RVHkRoomStatusSrv.initFilters();
				$scope.currentFilters = RVHkRoomStatusSrv.currentFilters;
				localStorage.removeItem( 'roomListScrollTopPos' );
			};
		});




		var roomsEl = document.getElementById( 'rooms' );
		var filterOptionsEl = document.getElementById( 'filter-options' );

		// stop browser bounce while swiping on rooms element
		angular.element( roomsEl )
			.on( 'ontouchmove', function(e) {
				e.stopPropagation();
			});

		// stop browser bounce while swiping on filter-options element
		angular.element( filterOptionsEl )
			.on( 'ontouchmove', function(e) {
				e.stopPropagation();
			});

		$scope.refreshScroll = function(toPos) {
			if ( roomsEl.scrollTop === toPos ) {
				return;
			};

			if ( isNaN(parseInt(toPos)) ) {
				var toPos = 0;
			} else {
				localStorage.removeItem( 'roomListScrollTopPos' );
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
		$scope.checkboxClicked = function(item){
			RVHkRoomStatusSrv.toggleFilter( item );	
		}

		$scope.showFilters = function() {
			$scope.filterOpen = true;
		};

		/**
		*  A method to handle the filter done button
		*  Refresh the room list scroll
		*  Emits a call to dismiss the filter screen
		*/	
		$scope.filterDoneButtonPressed = function() {
			$scope.calculateFilters();

			$scope.refreshScroll();

			$scope.filterOpen = false;

			// save the current edited filter to RVHkRoomStatusSrv
			// so that they can exist even after HKSearchCtrl init
			RVHkRoomStatusSrv.currentFilters = $scope.currentFilters;
			RVHkRoomStatusSrv.allRoomTypes = $scope.allRoomTypes;
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
				$scope.calculateFilters();
				$scope.refreshScroll();
			}

			// save the current edited filter to RVHkRoomStatusSrv
			// so that they can exist even after HKSearchCtrl init
			RVHkRoomStatusSrv.currentFilters = $scope.currentFilters;
		};

		// when user changes the employee filter
		$scope.applyEmpfilter = function() {
			$scope.currentFilters.filterByEmployee = $scope.topFilter.byEmployee;
			$scope.calculateFilters();

			$scope.refreshScroll();

			// save the current edited filter to RVHkRoomStatusSrv
			// so that they can exist even after HKSearchCtrl init
			RVHkRoomStatusSrv.currentFilters = $scope.currentFilters;
		};

		// CICO-10101 #5 requirement: when chosing 'vacant' also show 'queued' since its also vacant
		$scope.checkQueuedAlso = function() {
			if ( !!$scope.currentFilters.vacant ) {
				$scope.currentFilters.queued = true;
			};
		};
		$scope.keepCheckedIfVacant = function() {
			if ( !$scope.currentFilters.queued && !!$scope.currentFilters.vacant ) {
				$timeout(function() {
					$scope.currentFilters.queued = true;
				}, 10);
			};
		};


		// CICO-10101 #5 requirement: when chosing 'vacant' also show 'queued' since its also vacant
		$scope.checkQueuedAlso = function() {
			if ( !!$scope.currentFilters.vacant ) {
				$scope.currentFilters.queued = true;
			};
		};
		$scope.keepCheckedIfVacant = function() {
			if ( !$scope.currentFilters.queued && !!$scope.currentFilters.vacant ) {
				$timeout(function() {
					$scope.currentFilters.queued = true;
				}, 10);
			};
		};


		/**
		*  A method which checks the filter option status and see if the room should be displayed
		*/
		$scope.calculateFilters = function(source) {
			$scope.localLoader = true;

			var source = source || $scope.rooms;
			$scope.noResultsFound = 0;
			var allRoomTypesUnSelected = true;

			//If all room types are unselected, we should show all rooms.
			angular.forEach($scope.allRoomTypes, function(roomType, id) {
				if( roomType.isSelected ){
					allRoomTypesUnSelected = false;					
				}
				return false;
			});

			for (var i = 0, j = source.length; i < j; i++) {
				var room = source[i];

				if ( $rootScope.isStandAlone ) {
					// any matched work type ids of room to chosen work type id
					var workTypeMatch = _.find(room.work_type_ids, function(id) {
						return id == $scope.currentFilters.filterByWorkType;
					});

					// Filter by work type
					if ( !!$scope.currentFilters.filterByWorkType && !workTypeMatch ) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					};

					// Filter by employee name, strach that the id
					// TODO: currently we only get room.assignee_maid, we need this like this room.assignee_maid{ name: 'name', id: id } 
					if ( !!$scope.currentFilters.filterByEmployee && !room.assignee_maid.id ) {
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
				if ( !!room.room_type.id ) {
					if ( !allRoomTypesUnSelected && !$scope.allRoomTypes[room.room_type.id].isSelected ){
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
				};				

				// filter by status in filter section, HK_STATUS
				if( $scope.isAnyFilterTrue(['dirty','pickup','clean','inspected']) ) {
					console.log('dirty, pickup, clean, inspected');
					if ( !$scope.currentFilters.dirty && (room.hk_status.value === "DIRTY") ) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
					if ( !$scope.currentFilters.pickup && (room.hk_status.value === "PICKUP") ) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
					if ( !$scope.currentFilters.clean && (room.hk_status.value === "CLEAN") ) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
					if ( !$scope.currentFilters.inspected && (room.hk_status.value === "INSPECTED") ) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
				}

				// filter by status in filter section, OCCUPANCY_STATUS
				if ( $scope.isAnyFilterTrue(["vacant","occupied","queued"]) ) {
					console.log('vacant, occupied, queued');
					if ( !$scope.currentFilters.queued && room.is_queued ) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}

					// If queued, that get priority. Do not show anything which is "not queued" and vacant
					if ( !$scope.currentFilters.vacant && !room.is_queued && !room.is_occupied ) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}

					// If queued, that get priority.
					if ( !$scope.currentFilters.occupied && !room.is_queued && room.is_occupied ) {
						room.display_room = false;
						$scope.noResultsFound++;
						continue;
					}
				}

				// Filter by status in filter section, ROOM_RESERVATION_STATUS
				// For this status, pass the test, if any condition applies.
				// NOTE : This must be the last set of checks, as we make display_room = true and mark continue here.
				if ( $scope.isAnyFilterTrue(['stayover', 'not_reserved', 'arrival', 'arrived', 'dueout', 'departed', 'dayuse']) ) {
					console.log('reservation status');
					if ( $scope.currentFilters.stayover && room.room_reservation_status.indexOf("Stayover") >= 0 ) {
						room.display_room = true;
						continue;
					}
					if ( $scope.currentFilters.not_reserved && room.room_reservation_status.indexOf("Not Reserved") >= 0 ) {
						room.display_room = true;
						continue;
					}
					if ( $scope.currentFilters.arrival && room.room_reservation_status.indexOf("Arrival") >= 0 ) {
						room.display_room = true;
						continue;
					}
					if ( $scope.currentFilters.arrived && room.room_reservation_status.indexOf("Arrived") >= 0 ) {
						room.display_room = true;
						continue;
					}
					if ( $scope.currentFilters.dueout && room.room_reservation_status.indexOf("Due out") >= 0 ) {
						room.display_room = true;
						continue;
					}
					if ( $scope.currentFilters.departed && room.room_reservation_status.indexOf("Departed") >= 0 ) {
						room.display_room = true;
						continue;
					}
					if ( $scope.currentFilters.dayuse && room.room_reservation_status.indexOf("Day use") >= 0 ) {
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
				if( $scope.isAnyFilterTrue(['out_of_order', 'out_of_service']) ) {
					if ( $scope.currentFilters.out_of_order && (room.hk_status.value === "OO" || (room.hasOwnProperty('room_reservation_hk_status') && room.room_reservation_hk_status == 3)) ) {
						room.display_room = true;
						continue;
					}
					if ( $scope.currentFilters.out_of_service && (room.hk_status.value === "OS" || (room.hasOwnProperty('room_reservation_hk_status') && room.room_reservation_hk_status == 2)) ) {
						room.display_room = true;
						continue;
					}

					room.display_room = false;
					$scope.noResultsFound++;
					continue;
				}

				room.display_room = true;
			}

			$scope.localLoader = false;
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
				if ( !$scope.query ) {
					$scope.calculateFilters();
					break;
					return;
				};

				// let remove any changed applied by filter
				// show all rooms
				room.display_room = true;

				// now match the room no and
				// and show hide as required
				// must match first occurance of the search query
				if ( (roomNo).indexOf($scope.query.toUpperCase()) === 0 ) {
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
		$scope.clearSearch = function(){
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
				if ( key != 'showAllFloors' && !!$scope.currentFilters[key] ) {
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
				if( $scope.currentFilters[filterArray[i]] === true ){
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

			angular.forEach($scope.allRoomTypes, function(roomType, id) {
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
		};






		// could be moved to a directive,
		// but addicted by the amount of control
		// and power it gives here
		var pullRefresh = function() {

			// caching DOM nodes invloved 
			var $rooms     = document.getElementById( 'rooms' ),
				$notify    = document.getElementById( 'pull-refresh-notify' ),
				$arrow     = document.getElementById( 'icon' ),
				$notifyTxt = document.getElementById( 'ref-text' );

			// flags and variables necessary
			var touching = false,
				pulling  = false,
				startY   = 0,
				nowY     = 0,
				initTop  = $rooms.scrollTop,
				trigger  = 110;

			// translate cache
			var PULL_REFRESH = $filter('translate')('PULL_REFRESH'),
				RELEASE_REFRESH = $filter('translate')('RELEASE_REFRESH');

			// methods to modify the $notifyText and rotate $arrow
			var loadNotify = function(diff) {
				if ( !diff ) {
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
				if ( !touching || this.scrollTop > initTop ) {
					return;
				};

				nowY = touch.y || touch.pageY;

				// again a precaution
				// that the user has started pull down
				if ( startY > nowY ) {
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

				loadNotify( diff );
			};

			// set of excutions to be executed when
			// the user touch the screen
			var touchStartHandler = function(e) {
				var touch = e.touches ? e.touches[0] : e;

				// if we are not on top of scroll area
				if ( this.scrollTop > initTop ) {
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
				if ( this.scrollTop > initTop ) {
					return;
				};

				// gotta prevent only when
				// user has already pulled down
				if ( pulling ) {
					e.preventDefault();	
				};

				touching = false;
				pulling = false;
				nowY = touch ? (touch.y || touch.pageY) : nowY;

				var diff = (nowY - startY);

				// if we have hit the trigger refresh room list
				if (diff > trigger) {
					fetchRooms();
				}

				// for the smooth transition back
				$rooms.style.WebkitTransition = '-webkit-transform 0.3s';
				$notify.style.WebkitTransition = '-webkit-transform 0.3s';

				$rooms.style.webkitTransform = 'translateY(0)';
				$notify.style.webkitTransform = 'translateY(0)';

				// 'touchmove' handler is not necessary
				$rooms.removeEventListener( touchMoveHandler );

				$timeout(function() {
					$notify.classList.remove('show');
				}, 320);

				loadNotify();
			};

			// bind the 'touchstart' handler
			$rooms.addEventListener( 'touchstart', touchStartHandler, false );

			// bind the 'touchend' handler
			$rooms.addEventListener( 'touchend', touchEndHandler, false );

			// bind the 'touchcancel' handler
			$rooms.addEventListener( 'touchcancel', touchEndHandler, false );

			// remove the DOM binds when this scope is distroyed
			$scope.$on( '$destroy', function() {				
				!!$rooms.length && $rooms.removeEventListener( 'touchstart' );
				!!$rooms.length && $rooms.removeEventListener( 'touchend' );
				!!$rooms.length && $rooms.removeEventListener( 'touchcancel' );
			});
		};

		// initiate pullRefresh
		// dont move these codes outside this controller
		// DOM node will be reported missing
		pullRefresh();


		// There are a lot of bindings that need to cleared
		$scope.$on( '$destroy', function() {
			angular.element( roomsEl ).off( 'ontouchmove' );
			angular.element( filterOptionsEl ).off( 'ontouchmove' );
		});

	}
]);