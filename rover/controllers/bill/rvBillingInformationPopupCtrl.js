sntRover.controller('rvBillingInformationPopupCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.isInitialPage = true;
    $scope.isEntitySelected = false;

    $scope.selectedEntity = {};
	$scope.results = {};
    $scope.bills = [];
	
	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.dimissLoaderAndDialog = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

	$scope.getHeaderButtonLabel = function(){
		return $scope.isInitialPage? $filter('translate')('ADD_ROUTES_LABEL') : $filter('translate')('ALL_ROUTES_LABEL');		
	}

	$scope.headerButtonClicked = function(){
        $scope.isEntitySelected = false;
		$scope.isInitialPage = !$scope.isInitialPage;
	}

    $scope.deSelectEntity = function(){
        $scope.isEntitySelected = false;
    }

	$scope.selectEntity = function(index,type){

		$scope.isEntitySelected = true;
        $scope.isInitialPage = false;
        if(type === 'ATTACHED_ENTITY'){
        	$scope.selectedEntity = $scope.attachedEntities[index];
            $scope.selectedEntity.is_new = false; 
        }
        else if(type === 'RESERVATIONS'){
        	var data = $scope.results.reservations[index];
        	$scope.selectedEntity = {
			    "id": data.id,
			    "reservation_status" : data.reservation_status,
			    "name": data.firstname + " " + data.lastname,
			    "images": data.images,
			    "bill_no": "",
			    "entity_type": "RESERVATION",
			    "has_accompanying_guests" : ( data.images.length >1 ) ? "true" : "false",
			    "attached_charge_codes": [],
			    "attached_billing_groups": [],
                "is_new" : true
			};
			
        	console.log($scope.selectedEntity);
        }
        else if(type === 'CARDS'){
        	var data = $scope.results.cards[index];
        	$scope.selectedEntity = {
			    "id": data.id,
			    "name": data.account_name,
			    "bill_no": "",
			    "images": {
		            "primary": data.company_logo,
		            "secondary": ""
		        },
			    "attached_charge_codes": [],
			    "attached_billing_groups": [],
                "is_new" : true
			};
			if(data.data.account_type === 'COMPANY'){
				$scope.selectedEntity.entity_type = 'COMPANY_CARD';
			}
			else{
				$scope.selectedEntity.entity_type = 'TRAVEL_AGENT';
			}
			console.log($scope.selectedEntity);
        }
	}

	$scope.getEntityRole = function(route){
    	if(route.entity_type == 'RESERVATION' &&  route.has_accompanying_guests == 'false')
    		return 'guest';
    	else if(route.entity_type == 'RESERVATION')
    		return 'accompany';
    	else if(route.entity_type == 'TRAVEL_AGENT')
    		return 'travel-agent';
    	else if(route.entity_type == 'COMPANY_CARD')
    		return 'company';
    };
    $scope.getEntityIconClass = function(route){
        if(route.entity_type == 'RESERVATION' &&  route.has_accompanying_guests == 'true')
            return 'accompany';
    	else if(route.entity_type == 'RESERVATION' || route.entity_type == 'COMPANY_CARD')
            return '';
    	else if(route.entity_type == 'TRAVEL_AGENT')
    		return 'icons icon-travel-agent';
    	
    };

    $scope.fetchRoutes = function(){
        
            var successCallback = function(data) {
                $scope.attachedEntities = data;
                $scope.routes = data;
                 $scope.$parent.$emit('hideLoader');
            };
            var errorCallback = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           
            $scope.invokeApi(RVBillinginfoSrv.fetchRoutes, $scope.reservationData.reservation_id, successCallback, errorCallback);
    };	

    $scope.fetchRoutes();

    $scope.saveRoute = function(){
            var successCallback = function(data) {
                $scope.$emit('hideLoader');
            };
            var errorCallback = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           $scope.selectedEntity.reservation_id=$scope.reservationData.reservation_id;
           
           $scope.invokeApi(RVBillinginfoSrv.saveRoute, $scope.selectedEntity, successCallback, errorCallback);
    };
	
}]);