sntRover.controller('rvBillingInformationPopupCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.isInitialPage = true;
    $scope.isEntitySelected = false;

    $scope.selectedEntity = {};
	$scope.results = {};
    $scope.bills = [];
    $scope.isReloadNeeded = false;
	
	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.dimissLoaderAndDialog = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};
    /**
    * function to get label for all routes and add routes button
    */
	$scope.getHeaderButtonLabel = function(){
		return $scope.isInitialPage? $filter('translate')('ADD_ROUTES_LABEL') : $filter('translate')('ALL_ROUTES_LABEL');		
	}
    /**
    * function to handle the click 'all routes' and 'add routes' button
    */
	$scope.headerButtonClicked = function(){
        $scope.isEntitySelected = false;
		$scope.isInitialPage = !$scope.isInitialPage;
        if($scope.isInitialPage  && $scope.isReloadNeeded){
            $scope.isReloadNeeded = false;
            $scope.fetchRoutes();
        }
	}
    /**
    * function to handle the pencil button click in route detail screen
    */
    $scope.deSelectEntity = function(){
        $scope.isEntitySelected = false;
    }
    /**
    * function to handle entity selection from the 'All Routes' screen and the 'select entity' screen
    */
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
                "is_opted_late_checkout" : data.is_opted_late_checkout,
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
    /*
    * function used in template to map the reservation status to the view expected format
    */
    $scope.getGuestStatusMapped = function(reservationStatus, isLateCheckoutOn){
      var viewStatus = "";
      if(isLateCheckoutOn && "CHECKING_OUT" == reservationStatus){
        viewStatus = "late-check-out";
        return viewStatus;
      }
      if("RESERVED" == reservationStatus){
        viewStatus = "arrival";
      }else if("CHECKING_IN" == reservationStatus){
        viewStatus = "check-in";
      }else if("CHECKEDIN" == reservationStatus){
        viewStatus = "inhouse";
      }else if("CHECKEDOUT" == reservationStatus){
        viewStatus = "departed";
      }else if("CHECKING_OUT" == reservationStatus){
        viewStatus = "check-out";
      }else if("CANCELED" == reservationStatus){
        viewStatus = "cancel";
      }else if(("NOSHOW" == reservationStatus)||("NOSHOW_CURRENT" == reservationStatus)){
        viewStatus = "no-show";
      }
      return viewStatus;
  };

     /**
    * function to get the class for the 'li' according to the entity role
    */
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
     /**
    * function to get the class for the 'icon' according to the entity role
    */
    $scope.getEntityIconClass = function(route){
        if(route.entity_type == 'RESERVATION' &&  route.has_accompanying_guests == 'true')
            return 'accompany';
    	else if(route.entity_type == 'RESERVATION' || route.entity_type == 'COMPANY_CARD')
            return '';
    	else if(route.entity_type == 'TRAVEL_AGENT')
    		return 'icons icon-travel-agent';
    	
    };
    /**
    * function to fetch the attached entity list
    */
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
    /**
    * function to save the new route
    */
    $scope.saveRoute = function(){
            var successCallback = function(data) {
                $scope.$emit('hideLoader');
                $scope.isReloadNeeded = true;
                $scope.headerButtonClicked();
            };
            var errorCallback = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           $scope.selectedEntity.reservation_id=$scope.reservationData.reservation_id;
           
           $scope.invokeApi(RVBillinginfoSrv.saveRoute, $scope.selectedEntity, successCallback, errorCallback);
    };
	
}]);