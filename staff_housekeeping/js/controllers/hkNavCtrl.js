hkRover.controller('HKnavCtrl',['$rootScope', '$scope', function($rootScope, $scope){
	//$scope.menuOpen = false;
	/*$scope.navClicked = function(){
		$scope.menuOpen = $scope.menuOpen ? false : true;
		$scope.sajith ="testsaj";
		console.log($scope.menuOpen);
	
	}*/
	$scope.navClicked = function(){
		console.log($scope.menuOpen);	
		//$scope.menuOpen = $scope.menuOpen ? false : true;
		//console.log($scope.menuOpen);	
		$scope.$broadcast("navc");
	}


}]);