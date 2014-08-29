sntRover.controller('rvBillingInformationPopupCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.isInitialPage = true;
    $scope.isEntitySelected = false;

    $scope.selectedEntity = {};
	$scope.results = {};
	
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

	$scope.selectEntity = function(index,type){
		$scope.isEntitySelected = true;
        $scope.isInitialPage = false;
        if(type === 'ATTACHED_ENTITY'){
        	$scope.selectedEntity = $scope.attachedEntities[index];
        }
        else if(type === 'RESERVATIONS'){
        	var data = $scope.results.reservations[index];
        	$scope.selectedEntity = {
			    "id": data.id,
			    "name": data.firstname + " " + data.lastname,
			    "bill_no": "",
			    "entity_type": "RESERVATION",
			    "attached_charge_codes": [],
			    "attached_billing_groups": []
			};
			
			if(data.images.length >1){
				$scope.selectedEntity.images = {
					"primary": data.images[0].guest_image,
			        "secondary": data.images[1].guest_image
				}
				$scope.selectedEntity.has_accompanying_guests = "true";
			}
			else{
				$scope.selectedEntity.images = {
		            "primary": data.images[0].guest_image,
		            "secondary": ""
		       	};
				$scope.selectedEntity.has_accompanying_guests = "false";
			}
        	console.log($scope.selectedEntity);
        }
        else if(type === 'CARDS'){
        	var data = $scope.results.cards[index];
        	$scope.selectedEntity = {
			    "id": data.id,
			    "name": data.account_name,
			    "bill_no": "",
			    "entity_type": data.account_type,
			    "images": {
		            "primary": data.company_logo,
		            "secondary": ""
		        },
			    "attached_charge_codes": [],
			    "attached_billing_groups": []
			};
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
           
            $scope.invokeApi(RVBillinginfoSrv.fetchRoutes, {}, successCallback, errorCallback);
    };	

    $scope.fetchRoutes();
	
}]);