admin.controller('adRoomDetailsCtrl', ['$scope','adRoomSrv', '$state', '$stateParams', function($scope, adRoomSrv, $state, $stateParams){
	/*
	* Controller class for Room Details
	*/
	$scope.errorMessage = '';	
	
	//inheriting from base controller
	BaseCtrl.call(this, $scope);
	
	var roomId = $stateParams.roomId;
	//if roomnumber is null returning to room list
	if(typeof roomId === 'undefined' || roomId.trim() == ''){

		$state.go('admin.rooms');
	}


	var fetchSuccessOfRoomDetails = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;	
		for(var i = 0; i < $scope.data.room_features.length; i++){
			$scope.data.room_features[i].selected = false;
			if($scope.data.active_room_features.indexOf($scope.data.room_features[i].value) != -1) {
				$scope.data.room_features[i].selected = true;
			}
		}		
	};
	
	var fetchFailedOfRoomDetails = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};
	

	//getting the room details
	$scope.invokeApi(adRoomSrv.roomDetails, {'roomId': roomId}, fetchSuccessOfRoomDetails, fetchFailedOfRoomDetails);	

	$scope.goBack = function(){
        $state.go('admin.rooms');                  
	}

	$scope.updateRoomDetails = function(){
		
	}

}]);