hkRover.controller('HKnavCtrl',['$rootScope', '$scope', function($rootScope, $scope){

	$scope.navClicked = function(){
		$scope.$broadcast("navc");
	}


}]);