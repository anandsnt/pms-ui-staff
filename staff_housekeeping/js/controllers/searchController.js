hkRover.controller('searchController',['$scope', 'HKSearchSrv', '$state', function($scope, HKSearchSrv, $state){
	$scope.roomListFetchComplete = false;
	$scope.isFilterHidden = true;
	$scope.query = '';
	$scope.newTerm = "clean";

	console.log($scope.query);
	$scope.data = HKSearchSrv.roomList;
	if($scope.data == ''){
		HKSearchSrv.fetch().then(function(messages) {
				$scope.roomListFetchComplete = true;
		        $scope.data = messages;
		});	
	}
	
	$scope.currentFilters = {	
							"should_show_occupied": true,
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
							"arrived/dueout" : false,
							"arrived/departed" : false,
							"dueout" : false,
							"dueout/arrival" : false,
							"departed" : false,
							"departed/arrival" : false,
							"departed/arrived" : false
							}

	$scope.myfilter = function(a){
		
		/*if (($scope.currentFilters.should_show_occupied === false) && (a.is_occupied === "true")) {
			return false;
		}
		if (($scope.currentFilters.should_show_occupied === true) && (a.is_occupied !== "false")) {
			return false;
		}*/
		// if (($scope.currentFilters.dirty === false) && (a.is_occupied !== "false")) {
		// 	return false;
		// }
		// if (($scope.currentFilters.should_show_occupied === true) && (a.is_occupied !== "false")) {
		// 	return false;
		// }
		// if (($scope.currentFilters.should_show_occupied === true) && (a.is_occupied !== "false")) {
		// 	return false;
		// }
		return true;
	}

	$scope.isCleanVacant = function(roomHkStatus, isRoomOccupied){
		if((roomHkStatus == 'Inspected' || roomHkStatus == 'Clean') && isRoomOccupied == 'false')
			return true;
	}

	$scope.isDirtyVacant = function(roomHkStatus, isRoomOccupied){
		if((roomHkStatus == 'Dirty' || roomHkStatus == 'Pickup') && isRoomOccupied == 'false')
			return true;
	}

	$scope.isOutofOrder = function(roomHkStatus){
		if(roomHkStatus == 'Out of Order' || roomHkStatus == 'Out of Service')
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

