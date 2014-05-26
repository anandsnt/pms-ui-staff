admin.controller('ADUserRolesCtrl',['$scope','rolesList','ADUserRolesSrv', function($scope,rolesList,ADUserRolesSrv){
	BaseCtrl.call(this, $scope);

	
	$scope.dashboard_types = [
							  {"name":"Manager"},
							  {"name":"Front Desk"},
							  {"name":"Housekeeping"}
							 ];

	$scope.rolesList = rolesList.user_roles;
	$scope.addMode = false;
	$scope.newUserRole = "";

	$scope.addNewClick = function(){

		$scope.addMode = !$scope.addMode;
	};

	var userRoleSuccessCallback = function(){
		$scope.addNewClick();
		$scope.$emit('hideLoader');

		$scope.rolesList.push({"name":$scope.newUserRole});
		$scope.newUserRole = "";//reset
	}
	var userRoleFailureCallback = function(){
		$scope.addNewClick();
		$scope.$emit('hideLoader');
	}
	$scope.saveUserRole =  function(){
		var data = {"name": $scope.newUserRole};
		$scope.invokeApi(ADUserRolesSrv.saveUserRole, data, userRoleSuccessCallback,userRoleFailureCallback);
		
	}
	$scope.cancelClick = function(){
		$scope.addNewClick();
	}

}]);