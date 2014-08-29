sntRover.controller('rvAllRoutesCtrl',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.isInitialPage = true;

	$scope.routes = $scope.$parent.attachedEntities;

    $scope.getEntityRole = function(route){
    	if(route.entity_role == 'guest')
    		return 'guest';
    	else if(route.entity_role == 'accompny_guest')
    		return 'accompany';
    	else if(route.entity_role == 'travel_agent')
    		return 'travel-agent';
    	else if(route.entity_role == 'company')
    		return 'company';
    };
    $scope.getEntityIconClass = function(route){
    	if(route.entity_role == 'guest' || route.entity_role == 'company')
    		return '';
    	else if(route.entity_role == 'accompny_guest')
    		return 'accompany';
    	else if(route.entity_role == 'travel_agent')
    		return 'icons icon-travel-agent';
    	
    };

    $scope.getCharges = function(route){
    	if(route.attached_charge_codes.length > 2){
    		return 'Multiple';
    	}else if(route.attached_charge_codes.length > 0){
    		return route.route_charges[0] + ', ' + route.route_charges[1];
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