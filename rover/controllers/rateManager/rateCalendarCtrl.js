sntRover.controller('RateCalendarCtrl', ['$scope', 'RateMngrCalendarSrv', 'ngTableParams','dateFilter', function($scope, RateMngrCalendarSrv, ngTableParams, dateFilter){
	
	BaseCtrl.call(this, $scope);

	$scope.init = function(){
		$scope.currentExpandedRow = -1;
		$scope.displayMode = "CALENDAR";
		$scope.calendarMode = "RATE_VIEW";
		$scope.calendarData = {};
	};

	$scope.expandRow = function(index){
		if($scope.currentExpandedRow == index){
			$scope.currentExpandedRow = -1;
			return false;
		}
		$scope.currentExpandedRow = index;
	}

	/**
    * Method to fetch calendar data
    */
	var loadTable = function(rateId){
		var calenderDataFetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.calendarData = data;
		};

		if($scope.calendarMode == "RATE_VIEW"){
			var getData = calculateRateViewCalGetParams();
			$scope.invokeApi(RateMngrCalendarSrv.fetchCalendarData, getData, calenderDataFetchSuccess);
		
		} else {
			var getData = calculateRoomTypeViewCalGetParams(rateId);
			$scope.invokeApi(RateMngrCalendarSrv.fetchRoomTypeCalenarData, {}, calenderDataFetchSuccess);
		}
	};

	/**
	* Calcultes the get params for fetching calendar.
	*/
	var calculateRateViewCalGetParams = function(){

		var data = {};
		data.from_date = dateFilter($scope.currentFilterData.begin_date, 'yyyy-MM-dd');
		data.to_date = dateFilter($scope.currentFilterData.end_date, 'yyyy-MM-dd');
		
		data.rate_type_ids = [];
		var rateTypeSelected = $scope.currentFilterData.rate_type_selected;
		var rateTypeId = rateTypeSelected !== "" ? parseInt(rateTypeSelected) : "";
		if(rateTypeId != ""){
			data.rate_type_ids.push(rateTypeId);
		}
		
		data.rate_ids = [];
		for(var i in $scope.currentFilterData.rates_selected_list){
			data.rate_ids.push($scope.currentFilterData.rates_selected_list[i].id);	
		}
		
		data.name_card_ids = [];	
		return data;
	};

	/**
	* Calcultes the get params for fetching calendar.
	*/
	var calculateRoomTypeViewCalGetParams = function(rateId){

		var data = {};
		data.id = rateId;
		data.from_date = dateFilter($scope.currentFilterData.begin_date, 'yyyy-MM-dd');
		data.to_date = dateFilter($scope.currentFilterData.end_date, 'yyyy-MM-dd');
		
		return data;
	};

	/**
	* Click handler for up-arrows in rate_view_calendar
	*/
	$scope.goToRoomTypeCalendarView = function(rateId){
		$scope.calendarMode = "ROOM_TYPE_VIEW";
		loadTable(rateId);
	};
	/**
	* Handle openall/closeall button clicks
	* Calls the API to update the "CLOSED" restriction.
	*/
	$scope.openCloseAllRestrictions = function(action){
		var restrictionUpdateSuccess = function(){
			$scope.$emit('hideLoader');
			loadTable();
		};

		var params = {};
		params.details = []; 
		
		item = {};
		item.from_date = dateFilter($scope.currentFilterData.begin_date, 'yyyy-MM-dd');
		item.to_date = dateFilter($scope.currentFilterData.end_date, 'yyyy-MM-dd');
		item.restrictions = [];
		
		var rr = {};
		rr.action = action;
		var restrictionTypes = $scope.calendarData.restriction_types;
		var restrictionTypeId = "";
		for (var i = 0, keys = Object.keys(restrictionTypes), j = keys.length; i < j; i++) {
			if(restrictionTypes[keys[i]].value == "CLOSED"){
				restrictionTypeId = restrictionTypes[keys[i]].id;
				break;
			}
		}
		rr.restriction_type_id = restrictionTypeId;

		item.restrictions.push(rr);
		params.details.push(item);

		$scope.invokeApi(RateMngrCalendarSrv.updateRestrictions, params, restrictionUpdateSuccess);
	}
	/**
	* Click event handler for filter menu "show rates" button
	*/
	$scope.$on("showRatesClicked", function(){
		$scope.calendarMode = "RATE_VIEW";
		loadTable();
	});

	$scope.init();
  
}]);
