sntRover.controller('rvRouteDetailsCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'RVGuestCardSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, RVGuestCardSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.isAddPayment = false;
    $scope.chargeCodeToAdd = "";
    $scope.showPayment = false;
    $scope.first_bill_id = "";
    $scope.showChargeCodes = false;
    $scope.isBillingGroup = true;
    
    /**
    * Initializing the scrollers for the screen
    */
    var scrollerOptions = { preventDefault: false};
    $scope.setScroller('paymentList', scrollerOptions); 
    $scope.setScroller('billingGroups', scrollerOptions);
    $scope.setScroller('chargeCodes', scrollerOptions); 
    var scrollerOptionsForSearch = {click: true, preventDefault: false};
    $scope.setScroller('chargeCodesList', scrollerOptionsForSearch);
    $scope.chargeCodesListDivHgt = 250;
    $scope.chargeCodesListDivTop = 0;
    setTimeout(function(){
                $scope.refreshScroller('paymentList'); 
                $scope.refreshScroller('billingGroups');
                $scope.refreshScroller('chargeCodes');
                $scope.refreshScroller('chargeCodesList');
                }, 
            500);

    /**
    * function to show the payment list on cancelling or adding new payment
    */
	$scope.showPaymentList = function(){
		$scope.isAddPayment = false;
        $scope.refreshScroller('paymentList'); 
	};
    /**
    * function to show the add payment view
    */
	$scope.showAddPayment = function(){
		$scope.isAddPayment = true;
        $scope.$broadcast('showaddpayment');
	}	
    /**
    * function to switch between the charge code and billing groups views
    */
	$scope.toggleChargeType = function(){
		$scope.isBillingGroup = !$scope.isBillingGroup;
        if($scope.isBillingGroup){
            $scope.refreshScroller('billingGroups');
        }
        else
            $scope.refreshScroller('chargeCodes');
        $scope.showChargeCodes = false;
	}
    /**
    * function to know if the billing grup is selected or not, to adjust the UI
    */
	$scope.isBillingGroupSelected = function(billingGroup){
        for(var i=0; i < $scope.selectedEntity.attached_billing_groups.length; i++){
            if($scope.selectedEntity.attached_billing_groups[i].id == billingGroup.id )
                return true;
        }
        return false;
    }   
    /**
    * function to switch the billing group selection
    */
    $scope.toggleSelectionForBillingGroup = function(billingGroup){
        for(var i=0; i < $scope.selectedEntity.attached_billing_groups.length; i++){
            if($scope.selectedEntity.attached_billing_groups[i].id == billingGroup.id ){
                $scope.selectedEntity.attached_billing_groups.splice(i, 1);
                return;                
            }
        }
        $scope.selectedEntity.attached_billing_groups.push(billingGroup);
        $scope.refreshScroller('billingGroups');
    };
    /**
    * function to remove the charge code
    */
    $scope.removeChargeCode = function(chargeCode){
        for(var i=0; i < $scope.selectedEntity.attached_charge_codes.length; i++){
            if($scope.selectedEntity.attached_charge_codes[i].id == chargeCode.id ){
                $scope.selectedEntity.attached_charge_codes.splice(i, 1);
                return;                
            }
        }
    };    
    /**
    * function to show available charge code list on clicking the dropdown
    */
    $scope.showAvailableChargeCodes = function(){
        $scope.clearResults ();
        displayFilteredResultsChargeCodes();
        $scope.showChargeCodes = !$scope.showChargeCodes;
    }; 

    /**
    * function to select charge code
    */
    $scope.addChargeCode = function(){
        for(var i=0; i < $scope.availableChargeCodes.length; i++){
            if($scope.availableChargeCodes[i].id == $scope.chargeCodeToAdd){
                for(var j=0; j < $scope.selectedEntity.attached_charge_codes.length; j++){
                    
                    if($scope.selectedEntity.attached_charge_codes[j].id == $scope.chargeCodeToAdd ){
                        return;                
                    }
                }     
                $scope.selectedEntity.attached_charge_codes.push($scope.availableChargeCodes[i]); 
                $scope.refreshScroller('chargeCodes');     
                return;
            }
        }
    };      
    /**
    * function to select the charge code to be used in UI
    */
    $scope.selectChargeCode = function(selected_chargecode_id){
        $scope.chargeCodeToAdd = selected_chargecode_id;
         $scope.addChargeCode();
    }
    /**
    * function to fetch available charge code from the server
    */
	$scope.fetchAvailableChargeCodes = function(){
        
            var successCallback = function(data) {
                $scope.availableChargeCodes = data;
                $scope.fetchAvailableBillingGroups();
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
            var data = {};
            data.id = $scope.reservationData.reservation_id;
            data.to_bill = $scope.first_bill_id;
            
            $scope.invokeApi(RVBillinginfoSrv.fetchAvailableChargeCodes, data, successCallback, errorCallback);
    };	
    /**
    * function to fetch available billing groups from the server
    */
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
            var data = {};
            data.id = $scope.reservationData.reservation_id;
            data.to_bill = $scope.first_bill_id;
           
            $scope.invokeApi(RVBillinginfoSrv.fetchAvailableBillingGroups, data, successCallback, errorCallback);
    };	
    /**
    * function to fetch attached payment types from the server
    */
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
    /**
    * function to fetch available bills for the reservation from the server
    */
    $scope.fetchBillsForReservation = function(){
        
            var successCallback = function(data) {
               if(data.length > 0){
                    $scope.first_bill_id = data[0].id;
                    if($scope.reservationData.reservation_id != $scope.selectedEntity.id && $scope.selectedEntity.entity_type == 'RESERVATION'){
                        $scope.bills.push(data[0]);
                        // $scope.$parent.bills.push(data[0]);
                    }else{
                        data.splice(0, 1);
                        $scope.bills = data;
                        $scope.$parent.bills = data;
                    }
                    $scope.selectedEntity.to_bill = $scope.bills[0].id;
                    $scope.fetchAvailableChargeCodes();
                }
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
            var id = $scope.selectedEntity.id;
            if($scope.selectedEntity.entity_type != 'RESERVATION')
                id = $scope.reservationData.reservation_id;
           
            $scope.invokeApi(RVBillinginfoSrv.fetchBillsForReservation, id, successCallback, errorCallback);
    };
    $scope.fetchBillsForReservation();
    /**
    * function to trigger the filtering when the search text is entered
    */
    $scope.chargeCodeEntered = function(){
    	console.log($scope.chargeCodeSearchText);
        $scope.showChargeCodes = false;
	   	displayFilteredResultsChargeCodes();
	   	var queryText = $scope.chargeCodeSearchText;
	   	$scope.chargeCodeSearchText = queryText.charAt(0).toUpperCase() + queryText.slice(1);
    };
	/**
    * function to clear the charge code search text
    */
	$scope.clearResults = function(){
	  	$scope.chargeCodeSearchText = "";
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
	          $scope.availableChargeCodes[i].is_selected = true;
	      }     
	      $scope.refreshScroller('chargeCodesList');
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
	      $scope.refreshScroller('chargeCodesList');              
	    }
  	};	
  	/**
    * function to know if the charge code is selected, to adjust in UI
    */
  	$scope.isChargeCodeSelected = function(chargeCode){
  		for(var i=0; i < $scope.selectedEntity.attached_charge_codes.length; i++){
            if($scope.selectedEntity.attached_charge_codes[i].id == chargeCode.id )
                return true;
        }
        return false;
  	};

    /**
    * Listener for the save button click
    */
    $scope.$on('routeSaveClicked', function(event){
            
            $scope.saveRoute();
    });
    /**
    * function to save the new route
    */
    $scope.saveRoute = function(){
            var successCallback = function(data) {
                $scope.$parent.$emit('hideLoader');
                $scope.isReloadNeeded = true;
                $scope.headerButtonClicked();
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           $scope.selectedEntity.reservation_id=$scope.reservationData.reservation_id;
           
           $scope.invokeApi(RVBillinginfoSrv.saveRoute, $scope.selectedEntity, successCallback, errorCallback);
    };
}]);