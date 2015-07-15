admin.controller('adRoomDetailsCtrl', ['$scope','ADRoomSrv', '$state', '$stateParams', function($scope, ADRoomSrv, $state, $stateParams){
	/*
	* Controller class for Room Details
	*/
	$scope.errorMessage = '';
	$scope.fileName = "Choose File....";


	//inheriting from base controller
	BaseCtrl.call(this, $scope);

	var roomId = $stateParams.roomId;

	if(roomId){
		//if roomnumber is null returning to room list
		if(typeof roomId === 'undefined' || roomId.trim() === ''){
			$state.go('admin.rooms');
		}
		$scope.editMode = true;
	}

	/*
	* Success function of room details fetch
	* Doing the operatios on data here
	*/
	var fetchSuccessOfRoomDetails = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;
		$scope.floors = data.floors;
		$scope.roomNumber = $scope.data.room_number;
		/*
		* adding the seletected attribute on room feature here
		* which will be used in template for adding class if it the selected attribute is true
		*/
		for(var i = 0; i < $scope.data.room_features.length; i++){
			$scope.data.room_features[i].selected = false;
			if($scope.data.active_room_features.indexOf($scope.data.room_features[i].value) != -1) {
				$scope.data.room_features[i].selected = true;
			}
		}

		/*
		* adding the seletected attribute on room likes here
		* which will be used in template for adding class if it the selected attribute is true
		*/
		for(var i = 0; i < $scope.data.room_likes.length; i++){
			for(var j = 0; j < $scope.data.room_likes[i].options.length; j++){
				$scope.data.room_likes[i].options[j].selected = false;
				if($scope.data.active_room_likes.indexOf($scope.data.room_likes[i].options[j].value) != -1) {
					$scope.data.room_likes[i].options[j].selected = true;
				}
			}

		}

	};

	var fetchFailedOfRoomDetails = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};

	/*
	* function to do operation on room likes after selecting one.
	* param {string} group name
	* index {integer} position of the element in array
	*/
	$scope.changed = function(groupName, index){
		for(var i = 0; i < $scope.data.room_likes.length; i++){
			if($scope.data.room_likes[i].group_name === groupName){
				for(var j = 0; j < $scope.data.room_likes[i].options.length; j++){
					if(j !== index){
						$scope.data.room_likes[i].options[j].selected = false;
					}
				}

			}

		}
	};


	var fecthAllRoomDetailsSuccessCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;
		for(var i = 0; i < $scope.data.room_features.length; i++){
			$scope.data.room_features[i].selected = false;
		}
		for(var i = 0; i < $scope.data.room_likes.length; i++){
			for(var j = 0; j < $scope.data.room_likes[i].options.length; j++){
				$scope.data.room_likes[i].options[j].selected = false;
		    }
	    }
	    $scope.floors = data.floors;

		$scope.data.room_image = "";
		$scope.data.room_number="";
		$scope.data.room_type_id="";

	};
	var fecthAllRoomDetailsFailureCallback = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};

    if($scope.editMode){
    //getting the room details
	$scope.invokeApi(ADRoomSrv.roomDetails, {'roomId': roomId}, fetchSuccessOfRoomDetails, fetchFailedOfRoomDetails);
    }
    else
    {
     $scope.invokeApi(ADRoomSrv.fecthAllRoomDetails, {}, fecthAllRoomDetailsSuccessCallback, fecthAllRoomDetailsFailureCallback);
    }


	/*
	* method for go back to previous stage, it is always room listing
	*/
	$scope.goBack = function(){
        $state.go('admin.rooms');
	};

	/*
	* method to update the room details
	*/
	$scope.updateRoomDetails = function(){

		var postData = {};
		postData.room_id = $scope.data.room_id;
		postData.room_number = $scope.data.room_number;
		postData.room_type_id = $scope.data.room_type_id;
		postData.active_room_features = [];
		postData.active_room_likes = [];
		postData.selected_floor = $scope.data.selected_floor;
		postData.max_occupancy = $scope.data.max_occupancy;
		// to get seletected features
		for(var i = 0; i < $scope.data.room_features.length; i++){
			if($scope.data.room_features[i].selected === true ){
				postData.active_room_features.push($scope.data.room_features[i].value);
			}
		}
		// to get seletect likes
		for(var i = 0; i < $scope.data.room_likes.length; i++){
			for(var j = 0; j < $scope.data.room_likes[i].options.length; j++){
				if($scope.data.room_likes[i].options[j].selected === true){
					postData.active_room_likes.push($scope.data.room_likes[i].options[j].value);
				}
			}
		}

		if($scope.data.room_image.indexOf("data:")!= -1){
			postData.room_image = $scope.data.room_image;
		}

		if($scope.editMode)
		    $scope.invokeApi(ADRoomSrv.update, {'room_id': $scope.data.room_id, 'updateData': postData}, $scope.successCallbackOfUpdateRoomDetails);
		else
			$scope.invokeApi(ADRoomSrv.createRoom, {'updateData': postData}, $scope.successCallbackOfUpdateRoomDetails);

	};

	/**
	* Success function of updateRoomDetails's web service call
	*/
	$scope.successCallbackOfUpdateRoomDetails = function(data){
		$scope.goBack();
	};

}]);