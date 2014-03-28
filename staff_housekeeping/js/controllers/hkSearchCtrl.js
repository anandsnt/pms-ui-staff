
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
		$scope.refreshScroll();

		// since filter is applied after the user press 'DONE'
		// the $digest loop only begins then. This freezes DOM,
		// User may hit 'DONE' again
		// TODO: better filter method needed
		if ($scope.filterOpen) {
			$scope.$emit('dismissFilterScreen');
		};
	};


	/**
	*  Filter Function for filtering our the room list
	*  @param {dict} room to be filtered  
	*  @return {Boolean} true if room matches the filter criteria
	*/
	$scope.ApplyFilters = function(room){
		//If search term is available ignore the filter options
		if($scope.query !== ""){
			//Filter by search term
			if((room.room_no).indexOf($scope.query) >= 0) return true;
			return false;
		}

		// while the user is choosing the filter
		// do NOT process anymore yet, cost too much $digest cycles
		if ($scope.filterOpen) {
			return false;
		};

		//Filter by status in filter section, HK_STATUS
		if($scope.isAnyFilterTrue(['dirty','pickup','clean','inspected','out_of_order','out_of_service'])){

			if (($scope.currentFilters.dirty === false) && (room.hk_status.value === "DIRTY")) {
				return false;
			}
			if (($scope.currentFilters.pickup === false) && (room.hk_status.value === "PICKUP")) {
				return false;
			}
			if (($scope.currentFilters.clean === false) && (room.hk_status.value === "CLEAN")) {
				return false;
			}
			if (($scope.currentFilters.inspected === false) && (room.hk_status.value === "INSPECTED")) {
				return false;
			}
			if (($scope.currentFilters.out_of_order === false) && (room.hk_status.value === "OO")) {
				return false;
			}
			if (($scope.currentFilters.out_of_service === false) && (room.hk_status.value === "OS")) {
				return false;
			}
		}

		//Filter by status in filter section, OCCUPANCY_STATUS
		if ($scope.isAnyFilterTrue(["vacant","occupied"])){
			if (($scope.currentFilters.vacant === false) && (room.is_occupied === "false")) {
				return false;
			}

			if (($scope.currentFilters.occupied === false) && (room.is_occupied === "true")) {
				return false;
			}
		}

		//Filter by status in filter section, ROOM_RESERVATION_STATUS
		// For this status, pass the test, if any condition applies.
		if ($scope.isAnyFilterTrue(['stayover', 'not_reserved', 'arrival', 'arrived', 'dueout', 'departed', 'dayuse'])){

			if (($scope.currentFilters.stayover === true) && 
				(room.room_reservation_status.indexOf("Stayover") >= 0)) {
				return true;
			}

			if (($scope.currentFilters.not_reserved === true) && 
				(room.room_reservation_status.indexOf("Not Reserved") >= 0)) {
				return true;
			}
			if (($scope.currentFilters.arrival === true) && 
				(room.room_reservation_status.indexOf("Arrival") >= 0)) {
				return true;
			}
			if (($scope.currentFilters.arrived === true) && 
				(room.room_reservation_status.indexOf("Arrived") >= 0)) {
				return true;
			}

			if (($scope.currentFilters.dueout === true) && 
				(room.room_reservation_status.indexOf("Due out") >= 0)) {
				return true;
			}

			if (($scope.currentFilters.departed === true) && 
				(room.room_reservation_status.indexOf("Departed") >= 0)) {
				return true;
			}

			if (($scope.currentFilters.dayuse === true) && 
				(room.room_reservation_status.indexOf("Day use") >= 0)) {
				return true;
			}

			return false;
		}
		return true;
		
	}
	
	/**
	*   A method to determine if any filter checked
	*   @return {Boolean} false if none of the filter is checked
	*/
	$scope.isFilterChcked = function(){
		for(var f in $scope.currentFilters) {
		    if($scope.currentFilters[f] === true) {
		        return true;
		    }
		}

		return false;
	}

	/**
	*  A method to check if any filter in the given set is set to true
	*  @param {Array} filter arry to be evaluated
	*  @return {Boolean} true if any filter is set to true
	*/
	$scope.isAnyFilterTrue = function(filterArray){
		for(var f in filterArray) {
			if($scope.currentFilters[filterArray[f]] === true){
				return true;
			}
		}

		return false
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

	/**
	*  A method to clear the search term
	*/
	$scope.clearSearch = function(){
		$scope.query = '';
		$scope.refreshScroll();
	}

}]);

