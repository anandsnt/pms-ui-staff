sntRover.controller('RateCalendarCtrl', ['$scope', 'RateMngrCalendarSrv', 'ngTableParams', function($scope, RateMngrCalendarSrv, ngTableParams){
	
	BaseCtrl.call(this, $scope);
	$scope.calendarMode = "RATE_VIEW";

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
	var getCalendarData = function($defer, params){
		var calenderDataFetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.calendarData = data;
        	params.total(data.length);
            $defer.resolve(data);
		};

		if($scope.calendarMode == "RATE_VIEW"){
			$scope.invokeApi(RateMngrCalendarSrv.fetchCalendarData, {}, calenderDataFetchSuccess);
		} else {
			$scope.invokeApi(RateMngrCalendarSrv.fetchRoomTypeCalenarData, {}, calenderDataFetchSuccess);
		}
	};

	var loadTable = function(data){
		console.log("loadTable");
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: 10 
		    }, {
		    	total: 2,
		        getData: getCalendarData
		    }
		);
	};

	/**
	* Click handler for up-arrows in rate_view_calendar
	*/
	$scope.goToRoomTypeCalendarView = function(){
		$scope.calendarMode = "ROOM_TYPE_VIEW";
		loadTable();
	};

	$scope.init();



  
}]);
