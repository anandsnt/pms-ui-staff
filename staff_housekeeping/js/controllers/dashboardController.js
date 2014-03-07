hkRover.controller('DashboardController',['$scope', 'DashboardService',  function($scope, DashboardService){

	DashboardService.fetch().then(function(messages) {
        $scope.data = messages;
	});

	/*$scope.navClicked = function(){
		console.log("nav clicked");
	};*/

}]);

hkRover.controller('HKRootCtrl',['$rootScope', '$scope', function($rootScope, $scope){
	
	//$scope.menuOpen = "Sajith sajith2";
	$scope.sajith = "Sajith";
	$scope.menuOpen = false;
	
	$scope.$on("navc", function(){
		console.log("In navc function");
		$scope.menuOpen = $scope.menuOpen ? false : true;
		$scope.sajith ="testsaj";
		console.log($scope.menuOpen);
	
	})


}]);

    