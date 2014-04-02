
hkRover.controller('HKSearchCtrl',
	[
		'$scope', 'HKSearchSrv', '$state', '$timeout',
	function($scope, HKSearchSrv, $state, $timeout){

	$scope.query = '';

	// make sure any previous open filter is not showing
	$scope.$emit('dismissFilterScreen');

	//Fetch the roomlist
	$scope.$emit('showLoader');
	HKSearchSrv.fetch().then(function(data) {
		$scope.$emit('hideLoader');
        $scope.data = data;
        for (var i = 0; i < data.rooms.length; i ++){
			data.rooms[i].display_room = true;
        }

        $scope.calculateFilters();

        // scroll to the previous room list scroll position
        var toPos = localStorage.getItem( 'roomListScrollTopPos' );
        $scope.refreshScroll( toPos );

	}, function(){
		console.log("fetch failed");
		$scope.$emit('hideLoader');
	});	

	$scope.currentFilters = HKSearchSrv.currentFilters;

	/** The filters should be re initialized in we are navigating from dashborad to search
	*   In back navigation (From room details to search), we would retain the filters.
	*/
	$scope.$on('$locationChangeStart', function(event, next, current) { 
		var currentState = current.split('/')[next.split('/').length-1]; 
		if(currentState == ROUTES.dashboard){
			$scope.currentFilters = HKSearchSrv.initFilters();	
		}
	});



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

	//Retrun the room color classes
	$scope.getRoomColorClasses = function(roomHkStatus, isRoomOccupied, isReady){

		if((roomHkStatus == 'CLEAN' || roomHkStatus == 'INSPECTED') && isRoomOccupied == 'false') {
			return "room-clean";
		}
		if((roomHkStatus == 'DIRTY' || roomHkStatus == 'PICKUP') && isRoomOccupied == 'false') {
			return "room-dirty";
		}
		if(roomHkStatus == 'OO' || roomHkStatus == 'OS'){
			return "room-out";
		}
		return "";

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

		for (var i = 0, j = $scope.data.rooms.length; i < j; i++) {
			var room = $scope.data.rooms[i];

			//Filter by status in filter section, HK_STATUS
			if($scope.isAnyFilterTrue(['dirty','pickup','clean','inspected','out_of_order','out_of_service'])){

				if (($scope.currentFilters.dirty === false) && (room.hk_status.value === "DIRTY")) {
					room.display_room = false;
					continue;
				}
				if (($scope.currentFilters.pickup === false) && (room.hk_status.value === "PICKUP")) {
					room.display_room = false;
					continue;
				}
				if (($scope.currentFilters.clean === false) && (room.hk_status.value === "CLEAN")) {
					room.display_room = false;
					continue;
				}
				if (($scope.currentFilters.inspected === false) && (room.hk_status.value === "INSPECTED")) {
					room.display_room = false;
					continue;
				}
				if (($scope.currentFilters.out_of_order === false) && (room.hk_status.value === "OO")) {
					room.display_room = false;
					continue;
				}
				if (($scope.currentFilters.out_of_service === false) && (room.hk_status.value === "OS")) {
					room.display_room = false;
					continue;
				}
			}

			//Filter by status in filter section, OCCUPANCY_STATUS
			if ($scope.isAnyFilterTrue(["vacant","occupied"])){
				if (($scope.currentFilters.vacant === false) && (room.is_occupied === "false")) {
					room.display_room = false;
					continue;
				}

				if (($scope.currentFilters.occupied === false) && (room.is_occupied === "true")) {
					room.display_room = false;
					continue;
				}
			}

			//Filter by status in filter section, ROOM_RESERVATION_STATUS
			// For this status, pass the test, if any condition applies.
			if ($scope.isAnyFilterTrue(['stayover', 'not_reserved', 'arrival', 'arrived', 'dueout', 'departed', 'dayuse'])){

				if (($scope.currentFilters.stayover === true) && 
					(room.room_reservation_status.indexOf("Stayover") >= 0)) {
					room.display_room = true;
					continue;
				}

				if (($scope.currentFilters.not_reserved === true) && 
					(room.room_reservation_status.indexOf("Not Reserved") >= 0)) {
					room.display_room = true;
					continue;
				}
				if (($scope.currentFilters.arrival === true) && 
					(room.room_reservation_status.indexOf("Arrival") >= 0)) {
					room.display_room = true;
					continue;
				}
				if (($scope.currentFilters.arrived === true) && 
					(room.room_reservation_status.indexOf("Arrived") >= 0)) {
					room.display_room = true;
					continue;
				}

				if (($scope.currentFilters.dueout === true) && 
					(room.room_reservation_status.indexOf("Due out") >= 0)) {
					room.display_room = true;
					continue;
				}

				if (($scope.currentFilters.departed === true) && 
					(room.room_reservation_status.indexOf("Departed") >= 0)) {
					
					room.display_room = true;
					continue;
				}

				if (($scope.currentFilters.dayuse === true) && 
					(room.room_reservation_status.indexOf("Day use") >= 0)) {
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
		for (var i = 0, j = $scope.data.rooms.length; i < j; i++) {
			var room = $scope.data.rooms[i]
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

}]);