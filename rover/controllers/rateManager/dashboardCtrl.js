sntRover.controller('RMDashboradCtrl', ['$scope', 'RMCalendarSrv', 'ngTableParams', function($scope, RMCalendarSrv, ngTableParams){
	
	BaseCtrl.call(this, $scope);
	$scope.displayMode = "CALENDAR";


	$scope.showCalendarView = function(){
		$scope.displayMode = "CALENDAR";
	}

	$scope.showGraphView = function(){
		$scope.displayMode = "GRAPH";
	}
  
}]);
