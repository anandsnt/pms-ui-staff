hkRover.controller('roomDetailsController',['$scope', '$state', '$stateParams', 'HKRoomDetailsSrv',  
					function($scope, $state, $stateParams, HKRoomDetailsSrv){
	
	$scope.isCleanVacant = false;
	$scope.isDirtyVacant = false;
	$scope.isOutOfService = false;
	$scope.isPickup = false;
	$scope.isDefaultRoomColor = false;
	$scope.isRoomOccupied = false;
	$scope.guestViewStatus = "";

	HKRoomDetailsSrv.fetch($stateParams.id).then(function(data) {
	    $scope.data = data;

		_.each($scope.data.room_details.hk_status_list, function(hkStatusDict) { 
		    if(hkStatusDict.value == $scope.data.room_details.current_hk_status){
		    	$scope.currentHKStatus = hkStatusDict;
		    }
		});
		
		if(($scope.data.room_details.current_hk_status == "Clean" || $scope.data.room_details.current_hk_status == "Inspected")
			&& $scope.data.room_details.is_occupied == "false"){
			$scope.isCleanVacant = true;
		}else if($scope.data.room_details.current_hk_status == "Dirty"
			&& $scope.data.room_details.is_occupied == "false") {
			$scope.isDirtyVacant = true;
		}else if(($scope.data.room_details.current_hk_status == "Out of Order") ||
			 ($scope.data.room_details.current_hk_status == "Out of Service")) {
			$scope.isOutOfService = true;
		}else if($scope.data.room_details.current_hk_status == "Pickup") {
			$scope.isPickup = true;
		}else {
			$scope.isDefaultRoomColor = true;
		}

		$scope.guestViewStatus = getGuestStatusMapped($scope.data.room_details.reservation_status);
	});
	

}]);