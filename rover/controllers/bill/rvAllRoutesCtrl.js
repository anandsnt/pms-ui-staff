sntRover.controller('rvAllRoutesCtrl',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.isInitialPage = true;

	

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
		
	
}]);