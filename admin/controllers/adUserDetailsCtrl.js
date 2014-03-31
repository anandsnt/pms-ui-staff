admin.controller('ADUserDetailsCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	
	BaseCtrl.call(this, $scope);
	$scope.mod = "";
	$scope.image = "";
	/**
    *   save user details
    */
	$scope.saveUserDetails = function(){
		var params = $scope.data;
		
		var unwantedKeys = [];
		if($scope.image.indexOf("data:")!= -1){
			unwantedKeys = ["departments", "roles"];
		} else {
			unwantedKeys = ["departments", "roles", "user_photo"];
		}
		var data = dclone($scope.data, unwantedKeys);
		// Remove user_photo field if image is not uploaded. Checking base64 encoded data exist or not
		if($scope.image.indexOf("data:")!= -1){
			data.user_photo = $scope.image;
		}
		var successCallback = function(data){
			$scope.$emit('hideLoader');
			$state.go('admin.users', { id: $stateParams.id });
		};
		if($scope.mod == "add"){
			$scope.invokeApi(ADUserSrv.saveUserDetails, data , successCallback);
		} else {
			data.user_id = params.user_id;
			$scope.invokeApi(ADUserSrv.updateUserDetails, data , successCallback);
		}
	};
	/**
    * To render edit screen - 
    * @param {string} the id of the clicked user
    * 
    */
	$scope.userDetailsEdit = function(id){
		var successCallbackRender = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.image = data.user_photo;
			$scope.data.confirm_email = $scope.data.email;
		};
		$scope.invokeApi(ADUserSrv.getUserDetails, {'id':id} , successCallbackRender);
	};
	/**
    * To render add screen
    */
	$scope.userDetailsAdd = function(){
	 	var successCallbackRender = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
		};	
	 	$scope.invokeApi(ADUserSrv.getAddNewDetails, '' , successCallbackRender);	
	};
    /**
    * To set mod of operation - add/edit
    */
	var id = $stateParams.id;
	if(id == ""){
		$scope.mod = "add";
		$scope.userDetailsAdd();
	} else {
		$scope.mod = "edit";
		$scope.userDetailsEdit(id);
	}

}]);