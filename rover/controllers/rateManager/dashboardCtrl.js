sntRover.controller('RMDashboradCtrl', ['$scope', function($scope){
	
	BaseCtrl.call(this, $scope);
	$scope.displayMode = "CALENDAR";
	
	$scope.currentFilterData =	{
           begin_date : new Date(),
           end_date : new Date(),
           zoom_level : [{"value": "3","name": "3 days"},{"value": "4","name": "4 days"},{"value": "5","name": "5 days"},{"value": "6","name": "6 days"},{"value": "7","name": "7 days"}],
           zoom_level_selected : '',
           is_checked_all_rates : 'true',
           rate_types: [],
           rate_type_selected : '',
           rates : [],
           selectedRatesList : [],
           nameOnCards : []
   	};
   	
	$scope.showCalendarView = function(){
		$scope.displayMode = "CALENDAR";
	};

	$scope.showGraphView = function(){
		$scope.displayMode = "GRAPH";
	};
  
}]);
