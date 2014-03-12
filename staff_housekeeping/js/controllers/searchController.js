hkRover.controller('searchController',['$scope', 'HKSearchSrv', '$state', function($scope, HKSearchSrv, $state){
	$scope.roomListFetchComplete = false;
	$scope.isFilterHidden = true;

	HKSearchSrv.fetch().then(function(messages) {
			$scope.roomListFetchComplete = true;
	        $scope.data = messages;
	});

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

