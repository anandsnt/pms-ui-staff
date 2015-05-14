sntRover.controller('RateCalendarCtrl', ['$scope', '$rootScope','RateMngrCalendarSrv', 'dateFilter', 'ngDialog', 
	function($scope, $rootScope, RateMngrCalendarSrv, dateFilter, ngDialog){
	$scope.$parent.myScrollOptions = {
            RateCalendarCtrl: {
                scrollX: true,
                scrollbars: true,
                interactiveScrollbars: true,
                click: true,
                snap: false
            }
   };
   /* Cute workaround. ng-iscroll creates myScroll array in its Scope's $parent.
    * Since our controller's scope is two step above the scroll div, 
    * We create an empty myScroll here. ng-iscroll will see this item, and use the same.
    * Note: If a subscope requires another iScroll, this approach may not work.
    */
   $scope.$parent.myScroll =[];
   $scope.isWeekend = function(date){
       //get the 'day' format, sat/sun and return true if its considered a weekend
       var day = new Date(date).getDay();
       //sat=5, sun=6
       if (day === 6 || day === 5){
           return true;
       } else {
           return false;
       }
   };

   BaseCtrl.call(this, $scope);
   
	$scope.init = function(){
		$scope.currentExpandedRow = -1;
		$scope.displayMode = "CALENDAR";
		$scope.calendarMode = "RATE_VIEW";
		$scope.currentSelectedRate = {};
		$scope.calendarData = {};
		$scope.popupData = {};
        $scope.loading = true;

        if($scope.currentFilterData.filterConfigured){
        	loadTable();
        }
        
        
        
        
        
	};

        $scope.applyToAll = function(d, s){
            d.setFromValue = s;
            $scope.$broadcast('apply-all-price-adjust',d);
        };



	/**
	* Click handler for expand button in room type calendar
	*/
       
       $scope.isExpandedHeight = 0;
       
	$scope.expandRow = function(index){
		if($scope.currentExpandedRow === index){
			$scope.currentExpandedRow = -1;
			$scope.refreshScroller();

			return false;
		}
		$scope.currentExpandedRow = index;
		$scope.refreshScroller();
	};
        $scope.isExpandedRow = function(idx){
                if (idx == $scope.currentExpandedRow){
                    return true;
                } else {
                    return false;
                }
        };
        $scope.getLimitRow = function(rowIndex){
            if (rowIndex){
                if (rowIndex == $scope.currentExpandedRow){
                    return 8;
                } else {
                    return 3;
                }
            } else return 8;
        };

	$scope.refreshScroller = function(){
            $scope.initScrollBind();
            if ( $scope.$parent.myScroll.RateCalendarCtrl ){
		setTimeout( function(){
			$scope.$parent.myScroll.RateCalendarCtrl.refresh();
		}, 0);
            }
	};
        
        $scope.hasOverride = function(a,label){
            var L = label.toLowerCase();
            if (a && a.length > 0){
                for (var i in a){
                    if (a[i].toLowerCase() === L){
                        return true;
                    }
                }
            } else {
                return false;
            }
            return false;
            
        };
        
        $scope.isRestrictTo = function(zoom, restrictions){
            var z = ''+zoom;
            if (typeof restrictions === typeof []){
                var n = restrictions.length;
                if (n === 0){
                    return 3;
                }
                switch (z){
                    case '3':
                        if (n >= 1){return 3;}
                        break;

                    case '4':
                        if (n >= 1){
                            return 3;}
                        break;

                    case '5': 
                        if (n >= 1){
                            return 3;}
                        break;

                    case '6':
                        if (n > 1){return 2;} else {return 3;}
                        break;

                    case '7': 
                        if (n > 1){return 2;} else {return 3;}
                        break;
                }
            }
        };

	/**
	* @returns totalnumber of dates {Number} to be displayed
	*/
	var getNumOfCalendarColumns = function(){
		var numColumns = new Date($scope.currentFilterData.end_date) - new Date($scope.currentFilterData.begin_date);
        numColumns = numColumns/(24*60*60*1000) + 1;

        return parseInt(numColumns);
	};

   	/**
    * Fetches the calendar data and update the scope variables 
    */
	var loadTable = function(){
		$scope.loading = true;
                $scope.$emit('showLoader');
		setTimeout( function(){
		// If only one rate is selected in the filter section, the defult view is room type calendar 
		if($scope.currentFilterData.rates_selected_list.length === 1){
			$scope.calendarMode = "ROOM_TYPE_VIEW";
			$scope.currentSelectedRate.id = $scope.currentFilterData.rates_selected_list[0].id;
		}

		var calenderDataFetchSuccess = function(data) {
			//Set the calendar type
			if(data.type === 'ROOM_TYPES_LIST'){
				$scope.calendarMode = "ROOM_TYPE_VIEW";
			} else {
				$scope.calendarMode = "RATE_VIEW";
			}

			if(typeof data.selectedRateDetails !== 'undefined'){
				$scope.currentSelectedRate = data.selectedRateDetails;
				$scope.ratesDisplayed.push(data.selectedRateDetails);
			}

			$scope.calendarData = data;
                    /*    
                if ($scope.calendarMode === 'ROOM_TYPE_VIEW'){
                    var dates = data.dates;
                    if (typeof data.data === typeof []){
                        if (data.data.length > 0){
                            data.data.isHourly = true;
                            if (data.data.length > 1){
                                //this is an override on the default rate
                             //   data.data[1][dates[0]].overrides = [];
                             //   data.data[1][dates[0]].overrides.push('single');
                            }
                        }
                    }
                }
                */
			$scope.$emit('hideLoader');		
		};

		//Set the current business date value to the service. Done for calculating the history dates
		RateMngrCalendarSrv.businessDate = $rootScope.businessDate;

		if($scope.calendarMode == "RATE_VIEW"){
			$scope.invokeApi(RateMngrCalendarSrv.fetchCalendarData, calculateRateViewCalGetParams(), calenderDataFetchSuccess)
			.then(finalizeCapture);
		
		} else {
			$scope.invokeApi(RateMngrCalendarSrv.fetchRoomTypeCalenarData, calculateRoomTypeViewCalGetParams(), calenderDataFetchSuccess)
			.then(finalizeCapture);
		}
            }, 200);
	};

	function finalizeCapture() {
            $scope.initScrollBind();
		$scope.loading = false;
		$scope.currentFilterData.filterConfigured = true;
		
		$scope.$emit('computeColumWidth');	

		if($scope.$parent.myScroll.RateCalendarCtrl){
			$scope.refreshScroller();
		}		
	}

	/**
	* Calcultes the get params for fetching calendar.
	*/
	var calculateRateViewCalGetParams = function(){
		var data = {};

		data.from_date = dateFilter($scope.currentFilterData.begin_date, 'yyyy-MM-dd');
		data.to_date = dateFilter($scope.currentFilterData.end_date, 'yyyy-MM-dd');
		//Total number of dates to be displayed
        data.per_page = getNumOfCalendarColumns();

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

		//Total number of dates to be displayed
        data.per_page = getNumOfCalendarColumns();
		return data;
	};


	/**
	* Click handler for up-arrows in rate_view_calendar
	*/
	$scope.goToRoomTypeCalendarView = function(rate){
                $scope.$emit('showLoader');
		$scope.loading = true;
		setTimeout( function(){
                    $scope.ratesDisplayed.length = 0;
                    $scope.ratesDisplayed.push(rate);
                    $scope.currentSelectedRate = rate;
                    $scope.$emit("enableBackbutton");
                    $scope.calendarMode = "ROOM_TYPE_VIEW";
                    loadTable(rate.id);
		}, 200);
                
	};
	/**
	* Handle openall/closeall button clicks
	* Calls the API to update the "CLOSED" restriction.
	*/
	$scope.openCloseAllRestrictions = function(action){

		var restrictionUpdateSuccess = function(){
			//$scope.$emit('hideLoader');
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
	};

	/**
	* Update the calendar to the 'Rate view' and refresh the calendar
	*/
	$scope.$on("updateRateCalendar", function(){
            $scope.$emit('showLoader');
		var rates_selected = $scope.currentFilterData.rates_selected_list,
			rates_displayed = $scope.ratesDisplayed;

		$scope.calendarMode = "RATE_VIEW";
		$scope.ratesDisplayed.length=0;
		//Update the rates displayed list - show in topbar
		//for( var i in $scope.currentFilterData.rates_selected_list){
		for(var  i = 0, len = rates_selected.length; i < len; i++) {
			rates_displayed.push(rates_selected[i]);
		}

		loadTable();
	});  

	/**
	* Calendar mode set as rate type calendar
	*/
	$scope.$on("setCalendarModeRateType", function(){
            $scope.$emit('showLoader');
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
		if(rate === ""){
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
            controller: 'UpdatePriceAndRestrictionsCtrl',
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
   	};
        
        $scope.initScrollBind = function(){
                var scrollTable = $(".scrollTable");
                    scrollTable.scroll(function() {
                        scrollTable.scrollTop($(this).scrollTop());
                });
        };

	$scope.toggleRestrictionIconView = function() {
		return !$scope.loading;
	};

	$scope.refreshCalendar = function(){
            $scope.$emit('showLoader');
		loadTable();
	};

	$scope.init();
}]);
