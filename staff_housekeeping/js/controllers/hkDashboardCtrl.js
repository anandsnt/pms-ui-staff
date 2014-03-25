hkRover.controller('HKDashboardCtrl',['$scope', 'hkDashboardSrv',  function($scope, hkDashboardSrv){

	hkDashboardSrv.fetch().then(function(messages) {
        $scope.data = messages;
	});

}]);

hkRover.controller('HKRootCtrl',['$rootScope', '$scope', function($rootScope, $scope){
	$scope.menuOpen = false;
	
	$scope.$on("navc", function(event){
		$scope.menuOpen = $scope.menuOpen ? false : true;
	
	})


}]);

    
