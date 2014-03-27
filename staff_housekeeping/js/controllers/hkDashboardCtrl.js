hkRover.controller('HKDashboardCtrl',['$scope', 'dashboardData',  function($scope, dashboardData){
	/*hkDashboardSrv.fetch().then(function(messages) {
        $scope.data = messages;
	});*/
	$scope.data = dashboardData;

}]);

hkRover.controller('HKRootCtrl',['$rootScope', '$scope', function($rootScope, $scope){
	$scope.menuOpen = false;
	
	$scope.$on("navc", function(event){
		$scope.menuOpen = $scope.menuOpen ? false : true;
	
	})


}]);

    
