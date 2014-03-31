admin.controller('ADUserDetailsCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	
	BaseCtrl.call(this, $scope);
	$scope.mod = "";
	$scope.image = "";
   /**
    *   Failure callback function
    *   @param {String} errorMessage from server
    */
	$scope.failureCallback = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
	};
	/**
    *   save user deatils
    */
	$scope.saveUserDetails = function(){
		var params = $scope.data;
		
		var unwanted_keys = [];
		if($scope.image.indexOf("data:")!= -1){
			unwanted_keys = ["departments", "roles"];
		} else {
			unwanted_keys = ["departments", "roles", "user_photo"];
		}
		var data = dclone($scope.data, unwanted_keys);
		// Remove user_photo field if image is not uploaded. Checking base64 encoded data exist or not
		if($scope.image.indexOf("data:")!= -1){
			data.user_photo = $scope.image;
		}
		var successCallback = function(data){
			$scope.$emit('hideLoader');
			$state.go('admin.users', { id: $stateParams.id });
		};
		if($scope.mod == "add"){
			$scope.invokeApi(ADUserSrv.saveUserDetails, data , successCallback, $scope.failureCallback);
		} else {
			data.user_id = params.user_id;
			$scope.invokeApi(ADUserSrv.updateUserDetails, data , successCallback, $scope.failureCallback);
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
		$scope.invokeApi(ADUserSrv.getUserDetails, {'id':id} , successCallbackRender, $scope.failureCallback);
	};
	/**
    * To render add screen
    */
	$scope.userDetailsAdd = function(){
	 	var successCallbackRender = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
		};	
	 	$scope.invokeApi(ADUserSrv.getAddNewDetails, '' , successCallbackRender, $scope.failureCallback);	
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