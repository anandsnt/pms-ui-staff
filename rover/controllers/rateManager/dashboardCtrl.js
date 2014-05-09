sntRover.controller('RMDashboradCtrl', ['$scope', 'RMCalendarSrv', function($scope, RMCalendarSrv){
	
	BaseCtrl.call(this, $scope);

	$scope.init = function(){
		$scope.displayMode = "CALENDAR";
		fetchCalendarData();

	};

	/*
    * Method to fetch all filter options
    */
	var fetchCalendarData = function(){
		console.log("fetchCalendarData");
		var calenderDataFetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
			console.log(data);
		};
		$scope.invokeApi(RMCalendarSrv.fetch, {}, calenderDataFetchSuccess);
	};

	$scope.showCalendarView = function(){
		$scope.displayMode = "CALENDAR";
	}

	$scope.showGraphView = function(){
		$scope.displayMode = "GRAPH";
	}

	$scope.init();



  
}]);
