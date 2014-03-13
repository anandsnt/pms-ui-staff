hkRover.controller('HKSearchCtrl',['$scope', 'HKSearchSrv', '$state', function($scope, HKSearchSrv, $state){
	$scope.isFilterHidden = true;
	$scope.query = '';
	$scope.newTerm = "clean";
	
	$scope.data = HKSearchSrv.roomList;
	if($scope.data == ''){
		HKSearchSrv.fetch().then(function(data) {
		        $scope.data = data;
		        $scope.$parent.myScroll['rooms'].refresh();
		});	
	}

	$scope.currentFilters = {	
							"dirty" : true,
							"pickup": true,
							"clean" : true,
							"inspected" : true,
							"out_of_order" : true,
							"out_of_service" : true,
							"vacant" : true,
							"occupied" : true,
							"stayover" : true,
							"not_reserved" : true,
							"arrival" : true,
							"arrived" : true,
							"arrived_dueout" : true,
							"arrived_departed" : true,
							"dueout" : true,
							"dueout_arrival" : true,
							"departed" : true,
							"departed_arrival" : true,
							"departed_arrived" : true
							}


	$scope.ApplyFilters = function(room){

		//Filter by search term
		if((room.room_no).indexOf($scope.query) < 0) {
			return false;
		}
		
		//Filter by status in filter section
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
		if (($scope.currentFilters.vacant === false) && (room.is_occupied === "false")) {
			return false;
		}
		if (($scope.currentFilters.occupied === false) && (room.is_occupied === "true")) {
			return false;
		}
		if (($scope.currentFilters.stayover === false) && (room.room_reservation_status === "Stayover")) {
			return false;
		}
		if (($scope.currentFilters.not_reserved === false) && (room.room_reservation_status === "Not Reserved")) {
			return false;
		}
		if (($scope.currentFilters.arrival === false) && (room.room_reservation_status === "Arrival")) {
			return false;
		}
		if (($scope.currentFilters.arrived === false) && (room.room_reservation_status === "Arrived")) {
			return false;
		}
		if (($scope.currentFilters.arrived_dueout === false) && (room.room_reservation_status === "Arrived / Due Out")) {
			return false;
		}
		if (($scope.currentFilters.arrived_departed === false) && (room.room_reservation_status === "Arrived / Departed")) {
			return false;
		}
		if (($scope.currentFilters.dueout === false) && (room.room_reservation_status === "Due Out")) {
			return false;
		}
		if (($scope.currentFilters.dueout_arrival === false) && (room.room_reservation_status === "Due Out / Arrival")) {
			return false;
		}
		if (($scope.currentFilters.departed === false) && (room.room_reservation_status === "Departed")) {
			return false;
		}
		if (($scope.currentFilters.departed_arrival === false) && (room.room_reservation_status === "Departed / Arrival")) {
			return false;
		}
		if (($scope.currentFilters.departed_arrived === false) && (room.room_reservation_status === "Departed / Arrived")) {
			return false;
		}

		return true;
	}

	$scope.isCleanVacant = function(roomHkStatus, isRoomOccupied){
		if((roomHkStatus == 'INSPECTED' || roomHkStatus == 'CLEAN') && isRoomOccupied == 'false'){
			return true;

		}
	}

	$scope.isDirtyVacant = function(roomHkStatus, isRoomOccupied){
		if((roomHkStatus == 'DIRTY' || roomHkStatus == 'PICKUP') && isRoomOccupied == 'false')
			return true;
	}

	$scope.isOutofOrder = function(roomHkStatus){
		if(roomHkStatus == 'OO' || roomHkStatus == 'OS')
			return true;
	}

	$scope.goToRoomDetails = function(id){
		// preselect the current reservation group
		$state.go('hk.roomDetails', {
			id: id
		});

	}

	$scope.filterRoomsClicked = function(){
		$scope.isFilterHidden = !$scope.isFilterHidden;
		$scope.$emit('filterRoomsClicked');
	}

	$scope.isFilterChcked = function(){
		for(var p in $scope.currentFilters) {
		    if($scope.currentFilters[p] === true) {
		        return true;
		    }
		}
	}

	$scope.clearFilters = function(){
		for(var p in $scope.currentFilters) {
			$scope.currentFilters[p] = false
		}
	}



}]);

