admin.controller('ADAppCtrl',['$scope', 'ADDashboardSrv', function($scope, ADDashboardSrv){

	$scope.data = ADDashboardSrv.fetch();
	
	$scope.selectecMenu = $scope.data.menus[0];

	//function to change the selected menu
	//index is the array position
	$scope.setSelectedMenu = function(index)	{
		if(index < $scope.data.menus.length){
			$scope.selectedMenu = $scope.data.menus[index];
		}
	};

	
}]);

    