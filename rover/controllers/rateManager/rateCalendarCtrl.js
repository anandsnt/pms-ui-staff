sntRover.controller('RateCalendarCtrl', ['$scope', 'RMCalendarSrv', 'ngTableParams', function($scope, RMCalendarSrv, ngTableParams){
	
	BaseCtrl.call(this, $scope);

	$scope.init = function(){
		$scope.currentExpandedRow = -1;
		$scope.displayMode = "CALENDAR";
		loadTable();

	};

	$scope.expandRow = function(index){
		if($scope.currentExpandedRow == index){
			$scope.currentExpandedRow = -1;
			return false;
		}
		$scope.currentExpandedRow = index;
	}

	/*
    * Method to fetch all calendar data
    */
	var fetchCalendarData = function($defer, params){
		var calenderDataFetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.calendarData = data;
        	params.total(data.length);
            $defer.resolve(data);
		};
		$scope.invokeApi(RMCalendarSrv.fetch, {}, calenderDataFetchSuccess);
	};

	var loadTable = function(data){
		console.log("loadTable");
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: 10 
		    }, {
		    	total: 2,
		        getData: fetchCalendarData
		    }
		);
	}

	$scope.init();



  
}]);
