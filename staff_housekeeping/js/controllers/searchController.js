hkRover.controller('searchController',['$scope', 'HKSearchSrv', function($scope, HKSearchSrv){
	HKSearchSrv.fetch().then(function(messages) {
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

}]);

