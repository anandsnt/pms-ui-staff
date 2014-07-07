
hkRover.controller('HKSearchCtrl',
	[
		'$scope',
		'$rootScope',
		'HKSearchSrv',
		'$state',
		'$timeout',
		'fetchedRoomList',
	function($scope, $rootScope, HKSearchSrv, $state, $timeout, fetchedRoomList) {

	$scope.query = '';
	$scope.showPickup = false;
	$scope.showInspected = false;
	$scope.showQueued = false;

	// make sure any previous open filter is not showing
	$scope.$emit('dismissFilterScreen');

	var afterFetch = function(data) {

		// making unique copies of array
		// slicing same array not good.
		// say thanks to underscore.js
		var smallPart = _.compact( data.rooms );
		var restPart  = _.compact( data.rooms );

		// smaller part consisit of enogh rooms
		// that will fill in the screen
		smallPart = smallPart.slice( 0, 20 );
		restPart  = restPart.slice( 20 );

		// first load the small part
        $scope.rooms = smallPart;

        // load the rest after a small delay
        $timeout(function() {

        	// push the rest of the rooms into $scope.rooms
        	// remember slicing is only happening on the Ctrl and not on Srv
        	$scope.rooms.push.apply( $scope.rooms, restPart );

        	// apply the filter
        	$scope.calculateFilters();

        	// scroll to the previous room list scroll position
        	var toPos = localStorage.getItem( 'roomListScrollTopPos' );
        	$scope.refreshScroll( toPos );

        	// finally hide the loaded
        	// in almost every case this will not block UX
        	$scope.$emit( 'hideLoader' );
        }, 100);
	};

	var fetchRooms = function() {
		//Fetch the roomlist if necessary
		if ( HKSearchSrv.isListEmpty() || !fetchedRoomList.length) {
			$scope.$emit('showLoader');
			HKSearchSrv.fetch().then(function(data) {
				$scope.showPickup = data.use_pickup;
				$scope.showInspected = data.use_inspected;
				$scope.showQueued = data.is_queue_rooms_on;
				afterFetch( data );
			}, function() {
				console.log("fetch failed");
				$scope.$emit('hideLoader');
			});	
		} else {
			$timeout(function() {

				// show loader as we will be slicing the rooms
				// in smaller and bigger parts and show smaller first
				// and rest after a delay
				$scope.$emit('showLoader');
				afterFetch( fetchedRoomList );
			}, 1);
		}
	};

	fetchRooms();

	$scope.currentFilters = HKSearchSrv.currentFilters;

	/** The filters should be re initialized in we are navigating from dashborad to search
	*   In back navigation (From room details to search), we would retain the filters.
	*/
	// $scope.$on('$locationChangeStart', function(event, next, current) {
	// 	var currentState = current.split('/')[next.split('/').length-1]; 
	// 	if(currentState == ROUTES.dashboard){
	// 		$scope.currentFilters = HKSearchSrv.initFilters();	
	// 	}
	// });


	var roomsEl = document.getElementById( 'rooms' );
	var filterOptionsEl = document.getElementById( 'filter-options' );

	// stop browser bounce while swiping on rooms element
	angular.element( roomsEl )
		.bind( 'ontouchmove', function(e) {
			e.stopPropagation();
		});

	// stop browser bounce while swiping on filter-options element
	angular.element( filterOptionsEl )
		.bind( 'ontouchmove', function(e) {
			e.stopPropagation();
		});

	$scope.refreshScroll = function(toPos) {
		if ( roomsEl.scrollTop === toPos ) {
			return;
		};

		if ( isNaN(parseInt(toPos)) ) {
			var toPos = 0;
		} else {
			localStorage.removeItem('roomListScrollTopPos');
		}

		// must delay untill DOM is ready to jump
		$timeout(function() {
			roomsEl.scrollTop = toPos;
		}, 100);
	};

	/**
	*  Function invoked when user selects a room from the room list
	*  @param {dict} room selected  
	*  Change the state to room details
	*/
	$scope.roomListItemClicked = function(room){
		$state.go('hk.roomDetails', {
			id: room.id
		});

		// store the current room list scroll position
		localStorage.setItem('roomListScrollTopPos', roomsEl.scrollTop);
	};


	/**
	*  Function to Update the filter service on changing the filter state
	*  @param {string} name of the filter to be updated
	*/
	$scope.checkboxClicked = function(item){
		HKSearchSrv.toggleFilter( item );	
	}


	/**
	*  A method to handle the filter done button
	*  Refresh the room list scroll
	*  Emits a call to dismiss the filter screen
	*/	
	$scope.filterDoneButtonPressed = function(){
		$scope.calculateFilters();

		$scope.refreshScroll();
		
		if ($scope.filterOpen) {
			$scope.$emit('dismissFilterScreen');
		};

		// save the current edited filter to HKSearchSrv
		// so that they can exist even after HKSearchCtrl init
		HKSearchSrv.currentFilters = $scope.currentFilters;
	};

	/**
	*  A method which checks the filter option status and see if the room should be displayed
	*/
	$scope.calculateFilters = function() {

		for (var i = 0, j = $scope.rooms.length; i < j; i++) {
			var room = $scope.rooms[i];

			//Filter by status in filter section, HK_STATUS
			if($scope.isAnyFilterTrue(['dirty','pickup','clean','inspected','out_of_order','out_of_service'])){

				if ( !$scope.currentFilters.dirty && (room.hk_status.value === "DIRTY") ) {
					room.display_room = false;
					continue;
				}
				if ( !$scope.currentFilters.pickup && (room.hk_status.value === "PICKUP") ) {
					room.display_room = false;
					continue;
				}
				if ( !$scope.currentFilters.clean && (room.hk_status.value === "CLEAN") ) {
					room.display_room = false;
					continue;
				}
				if ( !$scope.currentFilters.inspected && (room.hk_status.value === "INSPECTED") ) {
					room.display_room = false;
					continue;
				}
				if ( !$scope.currentFilters.out_of_order && (room.hk_status.value === "OO") ) {
					room.display_room = false;
					continue;
				}
				if ( !$scope.currentFilters.out_of_service && (room.hk_status.value === "OS") ) {
					room.display_room = false;
					continue;
				}
			}
			//Filter by status in filter section, OCCUPANCY_STATUS
			if ($scope.isAnyFilterTrue(["vacant","occupied","queued"])){
				
			
				
				if ( !$scope.currentFilters.queued && room.is_queued ) {
					room.display_room = false;
					continue;
				}
				
				// If queued, that get priority. Do not show anything which is "not queued" and vacant
				if ( !$scope.currentFilters.vacant && !room.is_queued && !room.is_occupied ) {
					room.display_room = false;
					continue;
				}
				// If queued, that get priority.
				if ( !$scope.currentFilters.occupied && !room.is_queued && room.is_occupied ) {
					room.display_room = false;
					continue;
				}
			}
			//Filter by status in filter section, ROOM_RESERVATION_STATUS
			// For this status, pass the test, if any condition applies.
			if ($scope.isAnyFilterTrue(['stayover', 'not_reserved', 'arrival', 'arrived', 'dueout', 'departed', 'dayuse'])){

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
				continue;

			}
			room.display_room = true;

		}
	};



	/**
	*  Filter Function for filtering our the room list
	*/
	$scope.filterByQuery = function(){

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
		var ret = false;

		for (var f in $scope.currentFilters) {
		    if($scope.currentFilters[f] === true) {
		        ret = true;
		        break;
		    }
		}

		return ret;
	}

	/**
	*  A method to check if any filter in the given set is set to true
	*  @param {Array} filter arry to be evaluated
	*  @return {Boolean} true if any filter is set to true
	*/
	$scope.isAnyFilterTrue = function(filterArray){
		var ret = false;

		for (var i = 0, j = filterArray.length; i < j; i++) {
			if($scope.currentFilters[filterArray[i]] === true){
				ret = true;
				break;
			}
		};

		return ret;
	}

	/**
	*  A method to uncheck all the filter options
	*/
	$scope.clearFilters = function(){
		for(var p in $scope.currentFilters) {
			$scope.currentFilters[p] = false
		}
		$scope.refreshScroll();
	}



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
			startY   = 0,
			nowY     = 0,
			initTop  = $rooms.scrollTop,
			trigger  = 100; 

		// methods to modify the $notifyText and rotate $arrow
		var loadNotify = function(diff) {
			if ( !diff ) {
				$arrow.className = '';
				$notifyTxt.innerHTML = 'Pull down to refresh...';
				return;
			};

			if (diff > trigger - 30) {
				$arrow.className = 'rotate';
			} else {
				$arrow.className = '';
			}

			if (diff > trigger - 20) {
				$notifyTxt.innerHTML = 'Release to refresh...';
			} else {
				$notifyTxt.innerHTML = 'Pull down to refresh...';
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
 			if ( startY > nowY ) {
				return;
			};

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
			startY = touch.y || touch.pageY;

			$rooms.style.WebkitTransition = '';
			$notify.style.WebkitTransition = '';

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

			// gotta prevent since the user has already pulled down
			e.preventDefault();

			touching = false;
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

			// 'touchmove' handler is not more necessary
			$rooms.removeEventListener(touchMoveHandler);

			loadNotify();
		};

		// bind the 'touchstart' handler
		$rooms.addEventListener('touchstart', touchStartHandler, false);

		// bind the 'touchstart' handler
		// TODO: need a similar for 'touchcancel'
		$rooms.addEventListener('touchend', touchEndHandler, false);
	};

	// initiate pullRefresh
	// dont move these codes outside this controller
	// DOM node will be missing
	pullRefresh();



	$scope.$on( 'destroy', function() {

		HKSearchSrv.currentFilters = HKSearchSrv.initFilters();

	});

}]);

