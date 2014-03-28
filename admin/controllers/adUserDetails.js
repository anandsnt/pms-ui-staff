admin.controller('ADUserDetailsCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	
	BaseCtrl.call(this, $scope);
	$scope.mod = "";
	$scope.failureCallback = function(errorMessage){
		$scope.$emit('hideLoader');
		console.log(errorMessage);
		$scope.errorMessage = errorMessage;
	};
	
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
			console.log("============add data=============");
			$scope.invokeApi(ADUserSrv.saveUserDetails, data , successCallback, $scope.failureCallback);
		} else {
			data.user_id = params.user_id;
			console.log("============New data=============");
			console.log(data);
			$scope.invokeApi(ADUserSrv.updateUserDetails, data , successCallback, $scope.failureCallback);
		}
		
		
	};
	
	$scope.userDetailsEdit = function(id){
		console.log("++++++++++++++EDIT++++++++++++++");
		var successCallbackRender = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.data.confirm_email = $scope.data.email;
		};
		$scope.invokeApi(ADUserSrv.getUserDetails, {'id':id} , successCallbackRender, $scope.failureCallback);
	};
	
	$scope.userDetailsAdd = function(){
		console.log("++++++++++++++ADD++++++++++++++");
	 	var successCallbackRender = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
		};	
	 	$scope.invokeApi(ADUserSrv.getAddNewDetails, '' , successCallbackRender, $scope.failureCallback);	
	};
	
	var id = $stateParams.id;
	if(id == ""){
		$scope.mod = "add";
		$scope.userDetailsAdd();
	} else {
			console.log(".............++++++++++++++edit++++++++++++++");
		$scope.mod = "edit";
		$scope.userDetailsEdit(id);
	}
	
	
	
	

}]);