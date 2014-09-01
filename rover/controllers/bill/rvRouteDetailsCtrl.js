sntRover.controller('rvRouteDetailsCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'RVGuestCardSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, RVGuestCardSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.isAddPayment = false;
    $scope.chargeCodeToAdd = "";
    $scope.showPayment = false;

	$scope.showPaymentList = function(){
		$scope.isAddPayment = false;
	}

	$scope.showAddPayment = function(){
		$scope.isAddPayment = true;
	}	

	$scope.toggleChargeType = function(){
		$scope.isBillingGroup = !$scope.isBillingGroup;
	}

	$scope.setChargeType = function(){
		if(($scope.selectedEntity.attached_charge_codes.length == 0 && $scope.selectedEntity.attached_billing_groups.length == 0) || $scope.selectedEntity.attached_billing_groups.length > 0){
			$scope.isBillingGroup = true;
		}else if($scope.selectedEntity.attached_charge_codes.length > 0 ){
			$scope.isBillingGroup = false;
		}
	}	

    $scope.isBillingGroupSelected = function(billingGroup){
        for(var i=0; i < $scope.selectedEntity.attached_billing_groups.length; i++){
            if($scope.selectedEntity.attached_billing_groups[i].id == billingGroup.id )
                return true;
        }
        return false;
    }   

    $scope.toggleSelectionForBillingGroup = function(billingGroup){
        for(var i=0; i < $scope.selectedEntity.attached_billing_groups.length; i++){
            if($scope.selectedEntity.attached_billing_groups[i].id == billingGroup.id ){
                $scope.selectedEntity.attached_charge_codes = [];
                $scope.selectedEntity.attached_billing_groups.splice(i, 1);
                return;                
            }
        }
        $scope.selectedEntity.attached_charge_codes = [];
        $scope.selectedEntity.attached_billing_groups.push(billingGroup);
    };

    $scope.removeChargeCode = function(chargeCode){
        for(var i=0; i < $scope.selectedEntity.attached_charge_codes.length; i++){
            if($scope.selectedEntity.attached_charge_codes[i].id == chargeCode.id ){
                $scope.selectedEntity.attached_billing_groups = [];
                $scope.selectedEntity.attached_charge_codes.splice(i, 1);
                return;                
            }
        }
    };    

    $scope.addChargeCode = function(){
        for(var i=0; i < $scope.availableChargeCodes.length; i++){
            if($scope.availableChargeCodes[i].id == $scope.chargeCodeToAdd){
                for(var j=0; j < $scope.selectedEntity.attached_charge_codes.length; j++){
                    
                    if($scope.selectedEntity.attached_charge_codes[j].id == $scope.chargeCodeToAdd ){
                        $scope.selectedEntity.attached_billing_groups = [];
                        return;                
                    }
                }     
                $scope.selectedEntity.attached_billing_groups = [];
                $scope.selectedEntity.attached_charge_codes.push($scope.availableChargeCodes[i]);         
            }
        }
    };  

	$scope.setChargeType();

    

	$scope.fetchAvailableChargeCodes = function(){
        
            var successCallback = function(data) {
                $scope.availableChargeCodes = data;
                $scope.fetchAvailableBillingGroups();
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
            
            $scope.invokeApi(RVBillinginfoSrv.fetchAvailableChargeCodes, {}, successCallback, errorCallback);
    };	

    $scope.fetchAvailableBillingGroups = function(){
        
            var successCallback = function(data) {
                $scope.availableBillingGroups = data;
                if($scope.reservationData.reservation_id == $scope.selectedEntity.id){
                    $scope.showPayment = true;
                    $scope.fetchAttachedPaymentTypes();
                }else{
                    $scope.$parent.$emit('hideLoader');
                }
                
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           
            $scope.invokeApi(RVBillinginfoSrv.fetchAvailableBillingGroups, {}, successCallback, errorCallback);
    };	
    $scope.fetchAttachedPaymentTypes = function(){
        
            var successCallback = function(data) {
                
                $scope.attachedPaymentTypes = data;
                $scope.$parent.$emit('hideLoader');
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           
            $scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.reservationData.user_id, successCallback, errorCallback);
    };
    $scope.fetchAvailableChargeCodes();
    
    $scope.chargeCodeEntered = function(){
    	console.log($scope.chargeCodeSearchText);
	   	displayFilteredResultsChargeCodes();
	   	var queryText = $scope.chargeCodeSearchText;
	   	$scope.chargeCodeSearchText = queryText.charAt(0).toUpperCase() + queryText.slice(1);
    };
	
	$scope.clearResults = function(){
	  	$scope.chargeCodeSearchText = "";
	};
  	var searchSuccessChargeCodes = function(data){
		$scope.$emit("hideLoader");
		$scope.availableChargeCodes = data.accounts;
		console.log(data);
		setTimeout(function(){$scope.refreshScroller('cards_search_scroller');}, 750);
	};
  	/**
  	* function to perform filering on results.
  	* if not fouund in the data, it will request for webservice
  	*/
  	var displayFilteredResultsChargeCodes = function(){ 
	    //if the entered text's length < 3, we will show everything, means no filtering    
	    if($scope.chargeCodeSearchText.length < 3){
	      //based on 'is_row_visible' parameter we are showing the data in the template      
	      for(var i = 0; i < $scope.availableChargeCodes.length; i++){
	          $scope.availableChargeCodes[i].is_row_visible = true;
	      }     
	      
	      // we have changed data, so we are refreshing the scrollerbar
	      //$scope.refreshScroller('cards_search_scroller');      
	    }
	    else{
	      var value = ""; 
	      //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
	      //if it is zero, then we will request for webservice
	      for(var i = 0; i < $scope.availableChargeCodes.length; i++){
	        value = $scope.availableChargeCodes[i];
	        if (($scope.escapeNull(value.code).toUpperCase()).indexOf($scope.chargeCodeSearchText.toUpperCase()) >= 0 || 
	            ($scope.escapeNull(value.description).toUpperCase()).indexOf($scope.chargeCodeSearchText.toUpperCase()) >= 0 ) 
	            {
	               $scope.availableChargeCodes[i].is_row_visible = true;
	            }
	        else {
	          $scope.availableChargeCodes[i].is_row_visible = false;
	        }
	              
	      }
	      // we have changed data, so we are refreshing the scrollerbar
	      //$scope.refreshScroller('cards_search_scroller');                  
	    }
  	};	
}]);