admin.controller('ADUserDetailsCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	
	BaseCtrl.call(this, $scope);
	$scope.mod = "";
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
		var data = {
			"first_name": params.first_name,
			"last_name": params.last_name,
			"job_title": params.job_title,
			"user_department": params.user_department,
			"phone": params.phone,
			"password": params.password,
			"confirm_password": params.confirm_password,
			"user_photo": "",
			"email": params.email,
			"confirm_email": params.confirm_email
		};
		var successCallback = function(data){
			$scope.$emit('hideLoader');
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