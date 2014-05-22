sntRover.controller('UpdatePriceAndRestrictionsCtrl', ['$q', '$scope', 'ngDialog','dateFilter', 'RateMngrCalendarSrv', 'UpdatePriceAndRestrictionsSrv',
    function ($q, $scope, ngDialog, dateFilter, RateMngrCalendarSrv, UpdatePriceAndRestrictionsSrv) {
        $scope.init = function(){
            $scope.showRestrictionDayUpdate = false;
            $scope.showExpandedView = false;
            $scope.data = {};

            if($scope.popupData.fromRoomTypeView){
                computePopupdateForRoomTypeCal();
            }else{
                computePopUpdataForRateViewCal();
                fetchPriceDetailsForRate();
            }


        };

        $scope.daysOptions = {  "days": 
                            {   "mon" : false,
                                "tue" : false,
                                "wed" : false,
                                "thu" : false,
                                "fri" : false,
                                "sat" : false,
                                "sun" : false,
                            },
                        "numOfWeeks" : 2,
                        "applyToPrice" : false,
                        "applyToRestrictions" : false
                     };

        $scope.hideUpdatePriceAndRestrictionsDialog = function(){
            ngDialog.close();
        };

        var fetchPriceDetailsForRate = function() {
            var data = {};
            data.id = $scope.popupData.selectedRate;
            data.from_date = dateFilter($scope.popupData.selectedDate, 'yyyy-MM-dd');
            data.to_date = dateFilter($scope.popupData.selectedDate, 'yyyy-MM-dd');
            var priceDetailsFetchSuccess = function(response) {
                var roomPriceData = [];
                for (var i in response.data){
                    var roomType = {};
                    roomType.name = response.data[i].name;
                    roomType.rate = response.data[i][$scope.popupData.selectedDate].single;
                    roomPriceData.push(roomType);
                }
                $scope.data.roomPriceData = roomPriceData;
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(RateMngrCalendarSrv.fetchRoomTypeCalenarData, data, priceDetailsFetchSuccess);


        };

        var computePopupdateForRoomTypeCal = function(){
            $scope.data = {};
            $scope.data.id = "";
            $scope.data.name = "";
            selectedDateInfo = {};
            for(var i in $scope.calendarData.data){
                if($scope.calendarData.data[i].id == $scope.popupData.selectedRoomType){
                    selectedDateInfo = $scope.calendarData.data[i][$scope.popupData.selectedDate];
                    $scope.data.id = $scope.calendarData.data[i].id;
                    $scope.data.name = $scope.calendarData.data[i].name;
                }
            }

            var restrictionTypes = {};
            var rTypes = $scope.calendarData.restriction_types;
            for(var i in rTypes){
                restrictionTypes[rTypes[i].id] = rTypes[i];
                var item =  rTypes[i];
                var itemID = rTypes[i].id;
                item.days = "";
                item.isRestrictionEnabled = false;
                item.showEdit = false;
                item.hasEdit = isRestictionHasDaysEnter(rTypes[i].value);

                for(var i in selectedDateInfo.restrictions){


                    if(selectedDateInfo.restrictions[i].restriction_type_id == itemID){
                        item.days = selectedDateInfo.restrictions[i].days;
                        item.isRestrictionEnabled = true;
                        break;
                    }
                }
                restrictionTypes[itemID] = item;
            }
            $scope.data.restrictionTypes = restrictionTypes;
            $scope.data.previousRestrictionTypes = JSON.parse(JSON.stringify($scope.data.restrictionTypes));
            
            angular.forEach($scope.calendarData.data, function(value, key){
            	var selectedDate = $scope.popupData.selectedDate;
        		$scope.data.single = value[selectedDate].single;
        		$scope.data.double = value[selectedDate].double;
        		$scope.data.extra_adult = value[selectedDate].extra_adult;
        		$scope.data.child = value[selectedDate].child;
        		
        		
		    });
		    $scope.data.single_sign = "";
            $scope.data.single_extra_amnt = "";
            $scope.data.single_amnt_diff = "";
            $scope.data.double_sign = "";
            $scope.data.double_extra_amnt = "";
            $scope.data.double_amnt_diff = "";
            $scope.data.extra_adult_sign = "";
            $scope.data.extra_adult_extra_amnt = "";
            $scope.data.extra_adult_amnt_diff = "";
            $scope.data.child_sign = "";
            $scope.data.child_extra_amnt = "";
            $scope.data.child_amnt_diff = "";
            
           
			
        };

        /**
        * Compute the restrictions data     
        */
        var computePopUpdataForRateViewCal = function(){
            $scope.data = {};
            $scope.data.id = "";
            $scope.data.name = "";

            var selectedDateInfo = {};
            for(var i in $scope.calendarData.data){
                if($scope.calendarData.data[i].id == $scope.popupData.selectedRate){
                    selectedDateInfo = $scope.calendarData.data[i][$scope.popupData.selectedDate];
                    $scope.data.id = $scope.calendarData.data[i].id;
                    $scope.data.name = $scope.calendarData.data[i].name;
                }
            }
           

            var restrictionTypes = {};
            var rTypes = $scope.calendarData.restriction_types;
            for(var i in rTypes){
                restrictionTypes[rTypes[i].id] = rTypes[i];
                var item =  rTypes[i];
                var itemID = rTypes[i].id;
				item.days = "";
                item.isRestrictionEnabled = false;
                item.showEdit = false;
                item.hasEdit = isRestictionHasDaysEnter(rTypes[i].value);

                for(var i in selectedDateInfo){
                    if(selectedDateInfo[i].restriction_type_id == itemID){
                        item.days = selectedDateInfo[i].days;
                        item.isRestrictionEnabled = true;
                        break;
                    }
                }
                restrictionTypes[itemID] = item;
            }
            $scope.data.restrictionTypes = restrictionTypes;
            $scope.data.previousRestrictionTypes = JSON.parse(JSON.stringify($scope.data.restrictionTypes));
        };

        var isRestictionHasDaysEnter = function(restriction){
            var ret = true;
            if(['CLOSED', 'CLOSED_ARRIVAL', 'CLOSED_DEPARTURE'].indexOf(restriction) >= 0){
                ret = false;
            }
            return ret;
        }

        /**
        * Click handler for restriction on/off buttons
        * Enable disable restriction. 
        */
        $scope.onOffRestrictions = function(id, action, days){

        	angular.forEach($scope.data.restrictionTypes, function(value, key){
        		value.showEdit =  false;
        	});
            console.log($scope.popupData.all_data_selected);
            console.log($scope.data.restrictionTypes[id].hasEdit)
                console.log("here");
            if($scope.popupData.all_data_selected){
                //$scope.showRestrictionDayUpdate = true;
                $scope.data.restrictionTypes[id].showEdit = true;
                return false;
            }
            //The restriction has normal on of action
            if($scope.data.restrictionTypes[id].hasEdit){
                $scope.data.restrictionTypes[id].days = prompt("Please enter the restriction", $scope.data.restrictionTypes[id].days);
            }
            if($scope.data.restrictionTypes[id].days == "" && $scope.data.restrictionTypes[id].days == null) {
                return false;
            }
                
            if(action == "ENABLE"){
                $scope.data.restrictionTypes[id].isRestrictionEnabled = true; 
            }
            if(action == "DISABLE"){
                $scope.data.restrictionTypes[id].isRestrictionEnabled = false; 
            }
 
        };

        $scope.expandButtonClicked = function(){
            $scope.showExpandedView = !$scope.showExpandedView;
        };

        getAllSelectedDates = function() {
            console.log(JSON.stringify($scope.daysOptions));
            var currentDayOfWeek = dateFilter($scope.popupData.selectedDate, 'EEE');


            return "abc";


        };

       
        $scope.saveRestriction = function(){

            var datesSelected = getAllSelectedDates();
        	
        	var data = {};
        	data.details = [];
        	// data.details.single = [];
        	// data.details.double = [];
        	// data.details.extra_adult = [];
        	// data.details.child = [];
        	var restrictionDetails = {};
        	restrictionDetails.restrictions = [];
        	restrictionDetails.from_date = "";
        	restrictionDetails.to_date = "";
        	
        	
        	
        	angular.forEach($scope.data.restrictionTypes, function(value, key){
        		if($scope.data.previousRestrictionTypes[key].isRestrictionEnabled != value.isRestrictionEnabled){
        			var action = "";
        			if($scope.data.previousRestrictionTypes[key].isRestrictionEnabled == "true"){
        				action = "remove";
        			} else {
        				action = "add";
        			}
        			var restrictionData = {
        				"action": action,
        				"restriction_type_id": value.id,
        				"days": value.days
        			};
        			restrictionDetails.restrictions.push(restrictionData);
        		}
		    });
            //The popup appears by from the rate calendar view
		    if(!$scope.popupData.fromRoomTypeView){
                data.rate_id = $scope.popupData.selectedRate;
		    	restrictionDetails.from_date = $scope.popupData.selectedDate;
		    	restrictionDetails.to_date = $scope.popupData.selectedDate;
            //The popup appears by from the room type calendar view
		    } else {
		    	data.rate_id = $scope.popupData.selectedRate;
                data.room_type_id = $scope.popupData.selectedRoomType;
		    	restrictionDetails.from_date = $scope.popupData.selectedDate;
		    	restrictionDetails.to_date = $scope.popupData.selectedDate;

		    	restrictionDetails.single = {};
                restrictionDetails.double = {};
                restrictionDetails.extra_adult = {};
                restrictionDetails.child = {};
		    	if($scope.data.single==""){
		    		restrictionDetails.single.value = $scope.data.single_sign + $scope.data.single_extra_amnt;
		    		
		    		if($scope.data.single_amnt_diff == "$"){
		    			restrictionDetails.single.type = "amount_diff";
		    		} else {
		    			restrictionDetails.single.type = "percent_diff";
		    		}
        			
		    	} else {
		    		restrictionDetails.single.value = $scope.data.single;
        			restrictionDetails.single.type = "amount_new";
		    	}
		    	
		    	if($scope.data.double==""){
		    		restrictionDetails.double.value = $scope.data.double_sign + $scope.data.double_extra_amnt;
		    		if($scope.data.double_amnt_diff == "$"){
		    			restrictionDetails.double.type = "amount_diff";
		    		} else {
		    			restrictionDetails.double.type = "percent_diff";
		    		}
        			
		    	} else {
		    		restrictionDetails.double.value = $scope.data.double;
        			restrictionDetails.double.type = "amount_new";
		    	}
		
		    	
		   		
		    	if($scope.data.extra_adult==""){
		    		restrictionDetails.extra_adult.value = $scope.data.extra_adult_sign + $scope.data.extra_adult_extra_amnt;
		    		if($scope.data.extra_adult_amnt_diff == "$"){
		    			restrictionDetails.extra_adult.type = "amount_diff";
		    		} else {
		    			restrictionDetails.extra_adult.type = "percent_diff";
		    		}
        			
		    	} else {
		    		restrictionDetails.extra_adult.value = $scope.data.extra_adult;
        			restrictionDetails.extra_adult.type = "amount_new";
		    	}
		    	
		    	if($scope.data.child==""){
		    		restrictionDetails.child.value = $scope.data.child_sign + $scope.data.child_extra_amnt;
		    		if($scope.data.child_amnt_diff == "$"){
		    			restrictionDetails.child.type = "amount_diff";
		    		} else {
		    			restrictionDetails.child.type = "percent_diff";
		    		}
        			
		    	} else {
		    		restrictionDetails.child.value = $scope.data.child;
        			restrictionDetails.child.type = "amount_new";
		    	}
                restrictionDetails.single.value = parseFloat(restrictionDetails.single.value);
                restrictionDetails.double.value = parseFloat(restrictionDetails.double.value);
                restrictionDetails.extra_adult.value = parseFloat(restrictionDetails.extra_adult.value);
                restrictionDetails.child.value = parseFloat(restrictionDetails.child.value);
		    }
		    
		    data.details.push(restrictionDetails);
        	$scope.invokeApi(UpdatePriceAndRestrictionsSrv.savePriceAndRestrictions, data);
        	
        	$scope.refreshData();
        	ngDialog.close();
        	
        };


        $scope.init();
        
       
    
}]);