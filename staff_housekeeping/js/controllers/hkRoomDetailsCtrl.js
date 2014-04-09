hkRover.controller('HKRoomDetailsCtrl',
	[
		'$scope',
		'$state',
		'$stateParams',
		'HKRoomDetailsSrv',
		'roomDetailsData',
		'HKSearchSrv',
		function($scope, $state, $stateParams, HKRoomDetailsSrv, roomDetailsData, HKSearchSrv) {
	
	$scope.initColorCodes = function(){
		$scope.isCleanVacant = false;
		$scope.isDirtyVacant = false;
		$scope.isOutOfService = false;
		$scope.isPickup = false;
		$scope.isDefaultRoomColor = false;
		$scope.isRoomOccupied = false;
	};

	$scope.initColorCodes();
	$scope.guestViewStatus = "";
	$scope.$emit('hideNavMenu');
	//$scope.$emit('showLoader');


	$scope.data = roomDetailsData;

	$scope.shouldDisable = function() {
		var stat = $scope.data.room_details.current_hk_status;
		return stat === 'OO' || stat === 'OS' ? true : false;
	};

	_.each($scope.data.room_details.hk_status_list, function(hkStatusDict) { 
	    if(hkStatusDict.value == $scope.data.room_details.current_hk_status){
	    	$scope.currentHKStatus = hkStatusDict;
	    }
	});

		

	/*HKRoomDetailsSrv.fetch($stateParams.id).then(function(data) {
		$scope.$emit('hideLoader');
	    $scope.data = data;

		_.each($scope.data.room_details.hk_status_list, function(hkStatusDict) { 
		    if(hkStatusDict.value == $scope.data.room_details.current_hk_status){
		    	$scope.currentHKStatus = hkStatusDict;
		    }
		});

		$scope.calculateColorCodes();		
		$scope.guestViewStatus = getGuestStatusMapped($scope.data.room_details.reservation_status,
													 $scope.data.room_details.is_late_checkout);
		
	}, function(){
		console.log('fetch failed');
		$scope.$emit('hideLoader');

	});*/



	$scope.calculateColorCodes = function(){
		$scope.initColorCodes();

		if(($scope.data.room_details.current_hk_status == "CLEAN" || $scope.data.room_details.current_hk_status == "INSPECTED")
			&& $scope.data.room_details.is_occupied == "false"){
			$scope.isCleanVacant = true;
		}
		else if($scope.data.room_details.current_hk_status == "DIRTY"
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

	}

	$scope.calculateColorCodes();		
	$scope.guestViewStatus = getGuestStatusMapped($scope.data.room_details.reservation_status,
												 $scope.data.room_details.is_late_checkout);

	$scope.updateHKStatus = function(){	
		$scope.$emit('showLoader');	
		HKRoomDetailsSrv.updateHKStatus($scope.data.room_details.current_room_no, $scope.currentHKStatus.id).then(function(data) {
			$scope.$emit('hideLoader');
			$scope.data.room_details.current_hk_status = $scope.currentHKStatus.value;
			$scope.calculateColorCodes();

			HKSearchSrv.updateHKStatus( $scope.data.room_details );

			console.log("update done");
		}, function(){
			console.log('update failed');
			$scope.$emit('hideLoader');
		});
	};


	// stop bounce effect only on the room-details
	var roomDetailsEl = document.getElementById( '#room-details' );
	angular.element( roomDetailsEl )
		.bind( 'ontouchmove', function(e) {
			e.stopPropagation();
		});
	

}]);