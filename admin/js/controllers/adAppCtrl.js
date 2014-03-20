admin.controller('ADAppCtrl',['$rootScope','$scope', 'ADDashboardSrv', function($rootScope,$scope, ADDashboardSrv){

    //$scope.data = ADDashboardSrv.fetch();
	if($rootScope.admin_role == "hotel-admin" ){
		$scope.data = ADDashboardSrv.fetch();
		$scope.isAdmin =  true;
	}	
	else{
		 $scope.data = ADDashboardSrv.fetchSNT();
		 $scope.isAdmin =  false;
	}
	
	$scope.selectedMenu = $scope.data.menus[0];

	//function to change the selected menu
	//index is the array position
	$scope.setSelectedMenu = function(index)	{
		if(index < $scope.data.menus.length){
			$scope.selectedMenu = $scope.data.menus[index];
		}
	};
 
}]);

    