hkRover.controller('HKSearchCtrl',['$scope', 'HKSearchSrv', '$state', function($scope, HKSearchSrv, $state){
	$scope.isFilterHidden = false;
	$scope.query = '';

	//$scope.data = HKSearchSrv.roomList;

	//if($scope.data == ''){
		$scope.$emit('showLoader');
		HKSearchSrv.fetch().then(function(data) {
				$scope.$emit('hideLoader');
		        $scope.data = data;
				$scope.refreshScroll();
		        //$scope.$parent.myScroll['rooms'].refresh();
		}, function(){
			console.log("fetch failed");
			$scope.$emit('hideLoader');

		});	
	//}
	
	// To fix scroll issue on search screen
	// TODO : Create directive for iScroll
    var currentScroll = new iScroll('rooms', {
    	scrollbarClass: 'myScrollbar'
    });
	$scope.refreshScroll = function() {
		setTimeout(function () { 
			currentScroll.refresh();
			currentScroll.scrollTo(0, 0, 200);
		}, 100);
	};
	
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
	/*
	Function invoked when user selects a room from the room list
	*/
	$scope.roomListItemClicked = function(room){
		//If the room is Out_of_order or out_of_service, room details should not be displayed
		if(room.hk_status.value == 'OO' || room.hk_status.value == 'OS'){
			return false;
		}
		$state.go('hk.roomDetails', {
				id: room.id
		});

	};


	$scope.currentFilters = {	
							"dirty" : false,
							"pickup": false,
							"clean" : false,
							"inspected" : false,
							"out_of_order" : false,
							"out_of_service" : false,
							"vacant" : false,
							"occupied" : false,
							"stayover" : false,
							"not_reserved" : false,
							"arrival" : false,
							"arrived" : false,
							"dueout" : false,
							"departed" : false,
							"dayuse": false
							}

	$scope.ApplyFilters = function(room){
		//If search term is available ignore the filter options
		if($scope.query !== ""){
			//Filter by search term
			if((room.room_no).indexOf($scope.query) >= 0) return true;
			return false;
		}
		
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
	
	$scope.isFilterChcked = function(){
		for(var f in $scope.currentFilters) {
		    if($scope.currentFilters[f] === true) {
		        return true;
		    }
		}
		return false;
	}

	/* Check if any filter in the given set is set to true
	   @return true if any filter is set to true
	   @return false if no filter is true
	*/
	$scope.isAnyFilterTrue = function(filterArray){
		for(var f in filterArray) {
			if($scope.currentFilters[filterArray[f]] === true){
				return true;
			}
		}
		
		return false

	}


	$scope.filterDoneButtonPressed = function(){
		$scope.refreshScroll();
		$scope.$emit('dismissFilterScreen');

	};

	$scope.clearFilters = function(){
		for(var p in $scope.currentFilters) {
			$scope.currentFilters[p] = false
		}
		$scope.refreshScroll();
	}

	$scope.clearSearch = function(){
		$scope.query = '';
		$scope.refreshScroll();
	}

}]);

