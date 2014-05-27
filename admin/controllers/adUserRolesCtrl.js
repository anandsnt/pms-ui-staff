admin.controller('ADUserRolesCtrl',['$scope','userRolesData','ADUserRolesSrv', function($scope,userRolesData,ADUserRolesSrv){
	BaseCtrl.call(this, $scope);

	
	
	$scope.rolesList = userRolesData.userRoles;
	$scope.dashboard_types = userRolesData.dashboards;


	//to delete
	$scope.dashboard_types = [
							  {"value":0,"name":"Manager"},
							  {"value":1,"name":"Front Desk"},
							  {"value":2,"name":"Housekeeping"}
							 ];


	$scope.addMode = false;
	$scope.newUserRole = "";

	$scope.toggleAddMode = function(){

		$scope.addMode = !$scope.addMode;
	};

	var userRoleSuccessCallback = function(){
		$scope.toggleAddMode();
		$scope.$emit('hideLoader');

		$scope.rolesList.push({"name":$scope.newUserRole});
		$scope.newUserRole = "";//reset
	}
	var userRoleFailureCallback = function(){
		$scope.toggleAddMode();
		$scope.$emit('hideLoader');
	}
	$scope.saveUserRole =  function(){
		var data = {"name": $scope.newUserRole};
		$scope.invokeApi(ADUserRolesSrv.saveUserRole, data, userRoleSuccessCallback,userRoleFailureCallback);
		
	}
	$scope.cancelClick = function(){
		$scope.toggleAddMode();
	}


	$scope.changeDashBoard =  function(id,dashboardId){

		console.log(id);
		console.log(dashboardId);
	}

}]);