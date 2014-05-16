sntRover.controller('UpdatePriceAndRestrictionsCtrl', ['$q', '$scope', 'ngDialog', 'UpdatePriceAndRestrictionsSrv',
    function ($q, $scope, ngDialog, UpdatePriceAndRestrictionsSrv) {
        $scope.init = function(){
            $scope.showRestrictionDayUpdate = false;
            // console.log("*****************************JPHME HM calendr************************");
            // console.log(JSON.stringify($scope.popupData));
             // console.log("*****************************JPHME HM popup************************");
             // console.log(JSON.stringify($scope.popupData));
            if($scope.popupData.fromRoomTypeView){
                computePopupdateForRoomTypeCal();
            }else{
                computePopUpdata();
            }
        };

        $scope.hideUpdatePriceAndRestrictionsDialog = function(){
            ngDialog.close();
        };

        var computePopupdateForRoomTypeCal = function(){
            var selectedDateInfo = {};
            for(var i in $scope.calendarData.data){
                if($scope.calendarData.data[i].room_type.id == $scope.popupData.selectedRate){
                    selectedDateInfo = $scope.calendarData.data[i][$scope.popupData.selectedDate];
                }
            }
            $scope.data = {};
            var restrictionTypes = {};
            var rTypes = $scope.calendarData.restriction_types;
            for(var i in rTypes){
                restrictionTypes[rTypes[i].id] = rTypes[i];
                var item =  rTypes[i];
                var itemID = rTypes[i].id;

                for(var i in selectedDateInfo.restrictions){
                    item.days = "";
                    item.isRestrictionEnabled = false;
                    item.showEdit = false;
                    if(selectedDateInfo.restrictions[i].restriction_type_id == itemID){
                        item.days = selectedDateInfo.restrictions[i].days;
                        item.isRestrictionEnabled = true;
                        break;
                    }
                }
                restrictionTypes[itemID] = item;
            }
            $scope.data.restrictionTypes = restrictionTypes;
            
            // console.log("value====="+JSON.stringify($scope.calendarData));
            angular.forEach($scope.calendarData.data, function(value, key){
            	var selectedDate = $scope.popupData.selectedDate;
        		$scope.data.single = value[selectedDate].single;
        		$scope.data.double = value[selectedDate].double;
        		$scope.data.extra_adult = value[selectedDate].extra_adult;
        		$scope.data.child = value[selectedDate].child;
		    });
            
            
			
        };

        /**
        * Compute the restrictions data     
        */
        var computePopUpdata = function(){
            var selectedDateInfo = {};
            for(var i in $scope.calendarData.data){
                if($scope.calendarData.data[i].id == $scope.popupData.selectedRate){
                    selectedDateInfo = $scope.calendarData.data[i][$scope.popupData.selectedDate];
                }
            }

            $scope.data = {};
            var restrictionTypes = {};
            var rTypes = $scope.calendarData.restriction_types;
            for(var i in rTypes){
                restrictionTypes[rTypes[i].id] = rTypes[i];
                var item =  rTypes[i];
                var itemID = rTypes[i].id;
				item.days = "";
                item.isRestrictionEnabled = false;
                item.showEdit = false;

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
			// console.log(JSON.stringify($scope.data.previousRestrictionTypes));
        };

        /**
        * Click handler for restriction on/off buttons
        * Enable disable restriction. 
        */
        $scope.onOffRestrictions = function(id, action, days){
            if(days != ""){
                $scope.showRestrictionDayUpdate = true;
                $scope.data.restrictionTypes[id].showEdit = true;
                console.log("open popup");
                return false;
            }

            if(action == "ENABLE"){
                $scope.data.restrictionTypes[id].isRestrictionEnabled = true; 
            }
            if(action == "DISABLE"){
                $scope.data.restrictionTypes[id].isRestrictionEnabled = false; 
            }
        };
        $scope.init();
        
        $scope.saveRestriction = function(){
        	
        	var data = {};
        	data.details = [];
        	var details = {};
        	details.restrictions = [];
        	details.from_date = "";
        	details.to_date = "";
        	
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
        			details.restrictions.push(restrictionData);
        		}
		    });
		    if(!$scope.popupData.fromRoomTypeView){
		    	data.rate_id = $scope.popupData.selectedRate;
		    	details.from_date = $scope.popupData.selectedDate  ;
		    	details.to_date = $scope.popupData.selectedDate;
		    }
		    data.details.push(details);
        	$scope.invokeApi(UpdatePriceAndRestrictionsSrv.savePriceAndRestrictions, data);
        	
        };
    }
]);