admin.controller('ADUserRolesCtrl',['$scope','userRolesData','ADUserRolesSrv', function($scope,userRolesData,ADUserRolesSrv){

	BaseCtrl.call(this, $scope);
	$scope.rolesList = userRolesData.userRoles;
	$scope.dashboard_types = userRolesData.dashboards;
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
	};
	var userRoleFailureCallback = function(){
		$scope.toggleAddMode();
		$scope.$emit('hideLoader');
	};

	$scope.saveUserRole =  function(){
		var data = {"name": $scope.newUserRole};
		$scope.invokeApi(ADUserRolesSrv.saveUserRole, data, userRoleSuccessCallback,userRoleFailureCallback);

	};

	$scope.cancelClick = function(){
		$scope.toggleAddMode();
	};

	var changeDashBoardSuccessCallback = function(){
		$scope.$emit('hideLoader');
	};
	var changeDashBoardFailureCallback = function(){
		$scope.$emit('hideLoader');
	};

	$scope.changeDashBoard =  function(id,dashboardId){
		var data =  {"value" : id,"dashboard_id" :dashboardId };
		$scope.invokeApi(ADUserRolesSrv.assignDashboard, data, changeDashBoardSuccessCallback,changeDashBoardFailureCallback);
	};

}]);