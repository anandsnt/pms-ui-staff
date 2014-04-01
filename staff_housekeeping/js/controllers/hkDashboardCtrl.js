hkRover.controller('HKDashboardCtrl',['$scope', 'dashboardData',  function($scope, dashboardData){

	$scope.data = dashboardData;

	// stop bounce effect only on the login container
	var dashboardEl = document.getElementById( '#dashboard' );
	angular.element( dashboardEl )
		.bind( 'ontouchmove', function(e) {
			e.stopPropagation();
		});

}]);

hkRover.controller('HKRootCtrl',['$rootScope', '$scope', function($rootScope, $scope){
	$scope.menuOpen = false;
	
	$scope.$on("navc", function(event){
		$scope.menuOpen = $scope.menuOpen ? false : true;
	})
}]);

    
