sntRover.controller('UpdatePriceAndRestrictionsCtrl', ['$q', '$scope', 'ngDialog',
    function ($q, $scope, ngDialog) {
    	console.log($scope.calendarData);
    	console.log($scope.currentlySelectedDate);
    	console.log($scope.currentlySelectedRate);



        $scope.hideUpdatePriceAndRestrictionsDialog = function(){
            console.log('reached::hideUpdatePriceAndRestrictionsDialog');
            ngDialog.close();
        };

        $scope.isRestrictionOn = function(rateRestrictions, searchRestrictionKey){
        	var ret = false;
        	for(var i=0 in rateRestrictions){
        		if(rateRestrictions[i].restriction_type_id == searchRestrictionKey){
        			ret = true;
        		}
        	}
        	return ret;
        };
    }
]);