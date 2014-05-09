sntRover.controller('RMDashboradCtrl',['$scope', function($scope){
	
	BaseCtrl.call(this, $scope);
	$scope.displayMode = "CALENDAR";

	$scope.showCalendarView = function(){
		$scope.displayMode = "CALENDAR";
	}

	$scope.showGraphView = function(){
		$scope.displayMode = "GRAPH";
	}

  
}]);
