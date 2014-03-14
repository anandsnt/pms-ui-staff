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
		
		if(($scope.data.room_details.current_hk_status == "CLEAN" || $scope.data.room_details.current_hk_status == "INSPECTED")
			&& $scope.data.room_details.is_occupied == "false"){
			$scope.isCleanVacant = true;
		}else if($scope.data.room_details.current_hk_status == "DIRTY"
			&& $scope.data.room_details.is_occupied == "false") {
			$scope.isDirtyVacant = true;
		}else if(($scope.data.room_details.current_hk_status == "OO") ||
			 ($scope.data.room_details.current_hk_status == "OS")) {
			$scope.isOutOfService = true;
		}else if($scope.data.room_details.current_hk_status == "PICKUP") {
			$scope.isPickup = true;
		}else {
			$scope.isDefaultRoomColor = true;
		}

		$scope.guestViewStatus = getGuestStatusMapped($scope.data.room_details.reservation_status);

		console.log($scope.data.room_details.reservation_status);
		console.log($scope.data.room_details.current_hk_status);
		console.log($scope.data.room_details.current_room_reservation_status);
		console.log($scope.data.room_details.is_occupied);
		
	});

	$scope.updateHKStatus = function(){
		console.log($scope.currentHKStatus.value);
		HKRoomDetailsSrv.updateHKStatus($scope.data.room_details.current_room_no, $scope.currentHKStatus.description).then(function(data) {
			console.log("update done");
		});
	};
	

}]);