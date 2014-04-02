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
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	
	var fetchFailedOfRoomDetails = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};
	
	//getting the room details
	$scope.invokeApi(adRoomSrv.roomDetails, {'roomId': roomId}, fetchSuccessOfRoomDetails, fetchFailedOfRoomDetails);	

	$scope.goBack = function(){
		 $state.go('admin.rooms');
		if($state.previous.hasOwnProperty("abstract") && $state.previous.hasOwnProperty("abstract") == true){
            $state.go('admin.rooms');
        }
        else{
            $state.go($state.previous.name);
        }

               
	}

}]);