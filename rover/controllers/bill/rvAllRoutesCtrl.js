sntRover.controller('rvAllRoutesCtrl',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.isInitialPage = true;

	$scope.routes = [
        {
            "id": "1",
            "entity_name": "Aron Smith",
            "entity_avatar": "http://localhost:3000/assets/avatar-female.png",
            "route_type": "charge_code",
            "entity_role": "guest",
            "route_charges": [
                "room",
                "food",
                "parking"
            ],
            "bill_no": 3
        },
        {
            "id": "2",
            "entity_name": "John Smith",
            "entity_avatar": "http://localhost:3000/assets/avatar-female.png",
            "route_type": "billing_group",
            "entity_role": "accompny_guest",
            "route_charges": [
                "room",
                "food"
            ],
            "bill_no": 4
        },
        {
            "id": "3",
            "entity_name": "John Smith",
            "entity_avatar": "http://localhost:3000/assets/avatar-female.png",
            "route_type": "billing_group",
            "entity_role": "travel_agent",
            "route_charges": [
                "room",
                "food",
                "parking"
            ],
            "bill_no": 4
        },
        {
            "id": "4",
            "entity_name": "Allianz Insurance",
            "entity_avatar": "http://localhost:3000/assets/avatar-female.png",
            "route_type": "charge_code",
            "entity_role": "company",
            "route_charges": [
                "food",
                "parking"
            ],
            "bill_no": 5
        }
    ];

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
    	if(route.route_charges.length > 2){
    		return 'Multiple';
    	}else{
    		return route.route_charges[0] + ', ' + route.route_charges[1];
    	}
    }
		
	
}]);