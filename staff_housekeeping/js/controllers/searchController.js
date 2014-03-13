hkRover.controller('searchController',['$scope', 'HKSearchSrv', '$state', function($scope, HKSearchSrv, $state){
	$scope.roomListFetchComplete = false;
	$scope.isFilterHidden = true;
	$scope.query = '';
	$scope.newTerm = "clean";
	$scope.data = HKSearchSrv.roomList;
	if($scope.data == ''){
		HKSearchSrv.fetch().then(function(messages) {
				$scope.roomListFetchComplete = true;
		        $scope.data = messages;
		});	
	}
	$scope.chck = true;
	
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

	console.log($scope.currentFilters.dirty);

	$scope.myfilter = function(room){
		
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
		if (($scope.currentFilters.stayover === false) && (room.room_reservation_status === "stay over")) {
			return false;
		}
		if (($scope.currentFilters.not_reserved === false) && (room.room_reservation_status === "not reserved")) {
			return false;
		}
		if (($scope.currentFilters.arrival === false) && (room.room_reservation_status === "arrival")) {
			return false;
		}
		if (($scope.currentFilters.arrived === false) && (room.room_reservation_status === "arrived")) {
			return false;
		}
		if (($scope.currentFilters.arrived_dueout === false) && (room.room_reservation_status === "arrived/dueout")) {
			return false;
		}
		if (($scope.currentFilters.arrived_departed === false) && (room.room_reservation_status === "arrived/departed")) {
			return false;
		}
		if (($scope.currentFilters.dueout === false) && (room.room_reservation_status === "dueout")) {
			return false;
		}
		if (($scope.currentFilters.dueout_arrival === false) && (room.room_reservation_status === "dueout/arrival")) {
			return false;
		}
		if (($scope.currentFilters.departed === false) && (room.room_reservation_status === "departed")) {
			return false;
		}
		if (($scope.currentFilters.departed_arrival === false) && (room.room_reservation_status === "departed/arrival")) {
			return false;
		}
		if (($scope.currentFilters.departed_arrived === false) && (room.room_reservation_status === "departed/arrived")) {
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


}]);

