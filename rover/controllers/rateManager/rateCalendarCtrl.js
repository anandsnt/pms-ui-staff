sntRover.controller('RateCalendarCtrl', ['$scope', '$rootScope','RateMngrCalendarSrv', 'dateFilter', 'ngDialog', 
	function($scope, $rootScope, RateMngrCalendarSrv, dateFilter, ngDialog){
	
	$scope.$parent.myScrollOptions = {
            'RateCalendarCtrl': {
                scrollX: true,
                scrollbars: true,
                interactiveScrollbars: true,
                click: true,
                snap: false
            },
         
   };
   /* Cute workaround. ng-iscroll creates myScroll array in its Scope's $parent.
    * Since our controller's scope is two step above the scroll div, 
    * We create an empty myScroll here. ng-iscroll will see this item, and use the same.
    * Note: If a subscope requires another iScroll, this approach may not work.
    */
   $scope.$parent.myScroll =[];
	
   BaseCtrl.call(this, $scope);
   
	$scope.init = function(){
		$scope.currentExpandedRow = -1;
		$scope.displayMode = "CALENDAR";
		$scope.calendarMode = "RATE_VIEW";
		$scope.currentSelectedRate = {};
		$scope.calendarData = {};
		$scope.popupData = {};
      
        if($scope.currentFilterData.filterConfigured){
        	loadTable();
        }
	};

	/**
	* Click handler for expand button in room type calendar
	*/
	$scope.expandRow = function(index){
		if($scope.currentExpandedRow == index){
			$scope.currentExpandedRow = -1;
			return false;
		}
		$scope.currentExpandedRow = index;
	}

   	/**
    * Fetches the calendar data and update the scope variables 
    */
	var loadTable = function(){
		// If only one rate is selected in the filter section, the defult view is room type calendar 
		if($scope.currentFilterData.rates_selected_list.length == 1){
			$scope.calendarMode = "ROOM_TYPE_VIEW";
			$scope.currentSelectedRate.id = $scope.currentFilterData.rates_selected_list[0].id;
		}

		var calenderDataFetchSuccess = function(data) {
        	$scope.currentFilterData.filterConfigured = true;
			$scope.$emit('hideLoader');
			$scope.calendarData = data;
			if($scope.$parent.myScroll['RateCalendarCtrl'] != undefined){
				setTimeout( function(){
				$scope.$parent.myScroll['RateCalendarCtrl'].refresh();}, 0);
			}
		};

		//Set the current business date value to the service. Done for calculating the history dates
		RateMngrCalendarSrv.businessDate = $rootScope.businessDate;
		if($scope.calendarMode == "RATE_VIEW"){
			var getParams = calculateRateViewCalGetParams();
			$scope.invokeApi(RateMngrCalendarSrv.fetchCalendarData, getParams, calenderDataFetchSuccess);
		
		} else {
			var getParams = calculateRoomTypeViewCalGetParams();
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

		data.name_card_ids = [];
		for(var i in $scope.currentFilterData.name_cards){
			data.name_card_ids.push($scope.currentFilterData.name_cards[i].id);	
		}

		if($scope.currentFilterData.is_checked_all_rates){
			return data;
		}

		data.rate_type_ids = [];
		for(var i in $scope.currentFilterData.rate_type_selected_list){
			data.rate_type_ids.push($scope.currentFilterData.rate_type_selected_list[i].id);	
		}
		
		data.rate_ids = [];
		for(var i in $scope.currentFilterData.rates_selected_list){
			data.rate_ids.push($scope.currentFilterData.rates_selected_list[i].id);	
		}

		return data;
	};

	/**
	* Calcultes the get params for fetching calendar.
	*/
	var calculateRoomTypeViewCalGetParams = function(){

		var data = {};
		data.id = $scope.currentSelectedRate.id;
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
		$scope.currentSelectedRate = rate;
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
		if($scope.currentSelectedRate !== ""){
			params.rate_id = $scope.currentSelectedRate.id;	
		}
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
	* Update the calendar to the 'Rate view' and refresh the calendar
	*/
	$scope.$on("updateRateCalendar", function(){
		$scope.calendarMode = "RATE_VIEW";
		$scope.ratesDisplayed.length=0;
		//Update the rates displayed list - show in topbar
		for( var i in $scope.currentFilterData.rates_selected_list){
			$scope.ratesDisplayed.push($scope.currentFilterData.rates_selected_list[i]);
		}
		loadTable();
	});  

	/**
	* Calendar mode set as rate type calendar
	*/
	$scope.$on("setCalendarModeRateType", function(){
		$scope.calendarMode = "RATE_VIEW";
		$scope.currentSelectedRate = {};
		loadTable();

	});

	/**
	* Click handler for calendar cell. Creates an ng-dialog and pass the scope parameters
	* Set scope variables to be passed to the popup.
	*/
	$scope.showUpdatePriceAndRestrictionsDialog = function(date, rate, roomType, type, isForAllData){	
		$scope.popupData.selectedDate = date;
		$scope.popupData.selectedRate = rate;
		if(rate == ""){
			$scope.popupData.selectedRate = $scope.currentSelectedRate.id;
		}
		$scope.popupData.selectedRoomType = roomType;
		$scope.popupData.fromRoomTypeView = false;
		
		if(type == 'ROOM_TYPE'){
			$scope.popupData.fromRoomTypeView = true;
		}

		$scope.popupData.all_data_selected = false;
		if(isForAllData){
			$scope.popupData.all_data_selected = true;
		}
        
		popupClassName = (function(){

			if($scope.popupData.fromRoomTypeView){
				return 'ngdialog-theme-default restriction-popup fromRoomTypeView';
			}
			else{
				return 'ngdialog-theme-default restriction-popup';
			}
		}());

        ngDialog.open({
            template: '/assets/partials/rateManager/updatePriceAndRestrictions.html',
            className: popupClassName,
            closeByDocument: true,
            scope: $scope
        });
   	};

   	/**
   	* Check if a date is past the current business date
   	* @return true {boolean} if the date is history
   	*/ 
   	$scope.isHistoryDate = function(date){
   		var currentDate = new Date(date);
   		var businessDate = new Date($rootScope.businessDate);
   		var ret = false;
   		if(currentDate.getTime() < businessDate.getTime()){
	   		ret = true;
   		}
   		return ret;
   	}
	
	$scope.refreshCalendar = function(){
		loadTable();
	};

	$scope.init();
  
}]);
