sntRover.controller('rvAllRoutesCtrl',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.isInitialPage = true;

	

    var scrollerOptions = { preventDefault: false};
    $scope.setScroller('routes', scrollerOptions);  

    setTimeout(function(){
                $scope.refreshScroller('routes'); 
                }, 
            500);
    $scope.getCharges = function(route){
    	if(route.attached_charge_codes.length > 2 || route.attached_billing_groups.length > 2){
    		return 'Multiple';
    	}else if(route.attached_charge_codes.length > 0){
    		return route.attached_charge_codes[0].description + ', ' + route.attached_charge_codes[1].description;
    	}else if(route.attached_billing_groups.length > 0){
            return route.attached_billing_groups[0].description + ', ' + route.attached_billing_groups[1].description;
        }
    }

    $scope.getRouteType = function(route){
        if(route.attached_charge_codes.length > 0){
            return 'CHARGE GROUP(S)';
        }else{
            return 'BILLING GROUP(S)';
        }
    }

    $scope.deleteRoute = function(index){
        var successCallback = function(data) {
                
                
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };

            var data = {};
            data.id = $scope.routes[index].id;
            data.from_bill = $scope.routes[index].from_bill;
            data.to_bill = $scope.routes[index].to_bill;
            $scope.invokeApi(RVBillinginfoSrv.deleteRoute, data, successCallback, errorCallback);
    }
		
	
}]);