admin.controller('ADUserRolesCtrl',['$scope','rolesList', function($scope,rolesList){
	BaseCtrl.call(this, $scope);

	
	$scope.dashboard_types = [{"name":"Manager"},
							  {"name":"Front Desk"},
							  {"name":"Housekeeping"}];

	$scope.rolesList = rolesList.user_roles;

}]);