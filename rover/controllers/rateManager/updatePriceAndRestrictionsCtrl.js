sntRover.controller('UpdatePriceAndRestrictionsCtrl', ['$q', '$scope', 'ngDialog',
    function ($q, $scope, ngDialog) {
        $scope.init = function(){
            if($scope.popupData.fromRoomTypeView){
                computePopupdateForRoomTypeCal();
            }else{
                computePopUpdata();
            }
        };

        $scope.hideUpdatePriceAndRestrictionsDialog = function(){
            console.log('reached::hideUpdatePriceAndRestrictionsDialog');
            ngDialog.close();
        };

        var computePopupdateForRoomTypeCal = function(){
            var selectedDateInfo = {};
            for(var i in $scope.calendarData.data){
                if($scope.calendarData.data[i].room_type.id == $scope.popupData.selectedRate){
                    selectedDateInfo = $scope.calendarData.data[i][$scope.popupData.selectedDate];
                }
            }
            console.log(JSON.stringify(selectedDateInfo));
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
                    if(selectedDateInfo.restrictions[i].restriction_type_id == itemID){
                        item.days = selectedDateInfo.restrictions[i].days;
                        item.isRestrictionEnabled = true;
                        break;
                    }
                }
                restrictionTypes[itemID] = item;
            }
            $scope.data.restrictionTypes = restrictionTypes;

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
        $scope.onOffRestrictions = function(id, action){

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
        	data.restrictions = [];
        	console.log(JSON.stringify($scope.data));
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
        			data.restrictions.push(restrictionData);
        		}
		    });
		    
        	console.log(JSON.stringify(data));
        	
        };
    }
]);