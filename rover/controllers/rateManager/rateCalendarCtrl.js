sntRover.controller('RateCalendarCtrl', ['$scope', 'RateMngrCalendarSrv', 'ngTableParams', 'dateFilter', 'ngDialog', function($scope, RateMngrCalendarSrv, ngTableParams, dateFilter, ngDialog){
	
	BaseCtrl.call(this, $scope);

	$scope.init = function(){
		$scope.currentExpandedRow = -1;
		$scope.displayMode = "CALENDAR";
		$scope.calendarMode = "RATE_VIEW";
		$scope.calendarData = {};
        $scope.currentlySelectedDate = "";
        $scope.currentlySelectedRate = {};
        $scope.currentlySelectedRoomType = {};
        if($scope.filterConfigured){
        	loadTable();
        }
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
			var getParams = calculateRateViewCalGetParams();
			$scope.invokeApi(RateMngrCalendarSrv.fetchCalendarData, getParams, calenderDataFetchSuccess);
		
		} else {
			var getParams = calculateRoomTypeViewCalGetParams(rateId);
			$scope.invokeApi(RateMngrCalendarSrv.fetchRoomTypeCalenarData, getParams, calenderDataFetchSuccess);
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
	$scope.goToRoomTypeCalendarView = function(rate){
		$scope.ratesDisplayed.length = 0;
		$scope.ratesDisplayed.push(rate);
        $scope.$emit("enableBackbutton");
		$scope.calendarMode = "ROOM_TYPE_VIEW";
		loadTable(rate.id);
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
		$scope.ratesDisplayed.length=0;
		for( var i in $scope.currentFilterData.rates_selected_list){
			$scope.ratesDisplayed.push($scope.currentFilterData.rates_selected_list[i]);
		}
		loadTable();
	});  

	$scope.$on("setCalendarModeRateType", function(){
		$scope.calendarMode = "RATE_VIEW";
		loadTable();

	});

	$scope.showUpdatePriceAndRestrictionsDialog = function(date, type, obj){
        console.log(type);
        $scope.currentlySelectedDate = date;
        if (type === 'RATE'){ $scope.currentlySelectedRate = obj; }
        if (type === 'ROOM_TYPE'){ $scope.currentlySelectedRoomType = obj; }
        console.log('reached::showUpdatePriceAndRestrictionsDialog');
        console.log(obj);
        ngDialog.open({
            template: '/assets/partials/rateManager/updatePriceAndRestrictions.html',
            className: 'ngdialog-theme-default',
            closeByDocument: true,
            scope: $scope
        });
    }

	$scope.init();
  
}]);
