sntRover.controller('UpdatePriceAndRestrictionsCtrl', ['$q', '$scope', 'ngDialog',
    function ($q, $scope, ngDialog) {
        $scope.init = function(){
            computePopUPdata();
        };

        $scope.hideUpdatePriceAndRestrictionsDialog = function(){
            console.log('reached::hideUpdatePriceAndRestrictionsDialog');
            ngDialog.close();
        };

        var computePopUPdata = function(){
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
			console.log(JSON.stringify($scope.data.restrictionTypes));
        };

        $scope.updateRestriction = function(id, action){
            console.log("updateRestriction");
            console.log(id);
            console.log(action);

            if(action == "ENABLE"){
                $scope.data.restrictionTypes[id].isRestrictionEnabled = true; 
            }
            if(action == "ENABLE"){
                $scope.data.restrictionTypes[id].isRestrictionEnabled = false; 
            }


        };

        $scope.init();
        
        $scope.saveRestriction = function(){
        	console.log(JSON.stringify($scope.data.restrictionTypes));
        };
    }
]);