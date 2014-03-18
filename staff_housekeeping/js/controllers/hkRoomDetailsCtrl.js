hkRover.controller('HKRoomDetailsCtrl',['$scope', '$state', '$stateParams', 'HKRoomDetailsSrv',  
					function($scope, $state, $stateParams, HKRoomDetailsSrv){
	
	$scope.isCleanVacant = false;
	$scope.isDirtyVacant = false;
	$scope.isOutOfService = false;
	$scope.isPickup = false;
	$scope.isDefaultRoomColor = false;
	$scope.isRoomOccupied = false;
	$scope.guestViewStatus = "";


	$scope.$emit('hideNavMenu');
	
	$scope.$emit('showLoader');
	HKRoomDetailsSrv.fetch($stateParams.id).then(function(data) {
		$scope.$emit('hideLoader');
	    $scope.data = data;

		_.each($scope.data.room_details.hk_status_list, function(hkStatusDict) { 
		    if(hkStatusDict.value == $scope.data.room_details.current_hk_status){
		    	$scope.currentHKStatus = hkStatusDict;
		    }
		});
		
		$scope.guestViewStatus = getGuestStatusMapped($scope.data.room_details.reservation_status);
		
	});

	$scope.getHeaderColorClasses = function(roomHkStatus, isRoomOccupied){

		if((roomHkStatus == "CLEAN" || roomHkStatus == "INSPECTED")
			&& isRoomOccupied == "false"){
			return "inspected-clean";
		}
		if(roomHkStatus == "DIRTY" && isRoomOccupied == "false") {
			return "dirty"
		}
		if((roomHkStatus == "OO") || (roomHkStatus== "OS")) {
			return "";
		}if(roomHkStatus == "PICKUP") {
			return "pickup"
		}

		return "occupied"
		
	}

	$scope.updateHKStatus = function(){
		HKRoomDetailsSrv.updateHKStatus($scope.data.room_details.current_room_no, $scope.currentHKStatus.id).then(function(data) {
			console.log("update done");
		});
	};
	

}]);