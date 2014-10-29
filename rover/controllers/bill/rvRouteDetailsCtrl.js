sntRover.controller('rvRouteDetailsCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'RVPaymentSrv', 'ngDialog', 'RVBillCardSrv', function($scope, $rootScope,$filter, RVBillinginfoSrv, RVPaymentSrv, ngDialog, RVBillCardSrv){
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
        $scope.chargeCodeSearchText = '';
        $scope.showChargeCodes = false;
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
            if($scope.reservationData.reservation_id != $scope.selectedEntity.id && $scope.selectedEntity.entity_type == 'RESERVATION'){
                        data.to_bill = $scope.first_bill_id;
            }else{
                data.to_bill = $scope.selectedEntity.to_bill;
            }
            data.is_new = $scope.selectedEntity.is_new;
            
            
            $scope.invokeApi(RVBillinginfoSrv.fetchAvailableChargeCodes, data, successCallback, errorCallback);
    };	
    /**
    * function to fetch available billing groups from the server
    */
    $scope.fetchAvailableBillingGroups = function(){
        
            var successCallback = function(data) {
                $scope.availableBillingGroups = data;
                if(data.length == 0)
                    $scope.isBillingGroup = false;
                if($scope.reservationData.reservation_id != $scope.selectedEntity.id && $scope.selectedEntity.entity_type == 'RESERVATION'){
                    $scope.$parent.$emit('hideLoader');                    
                }else{
                    $scope.showPayment = true;
                    $scope.fetchAttachedPaymentTypes();
                }
                
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
            var data = {};
            data.id = $scope.reservationData.reservation_id;
            if($scope.reservationData.reservation_id != $scope.selectedEntity.id && $scope.selectedEntity.entity_type == 'RESERVATION'){
                        data.to_bill = $scope.first_bill_id;
            }else{
                data.to_bill = $scope.selectedEntity.to_bill;
            }
            data.is_new = $scope.selectedEntity.is_new;
           
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
           
            $scope.invokeApi(RVPaymentSrv.getPaymentList, $scope.reservationData.reservation_id, successCallback, errorCallback);
    };

    /**
    * function to exclude bills for already existing routings
    */
    $scope.excludeExistingBills = function(bills){
        
           for(var i = 0; i < $scope.routes.length; i++){
                for(var j = 0; j < bills.length; j++){
                    if(bills[j].id == $scope.routes[i].to_bill && $scope.selectedEntity.id != $scope.routes[i].id){
                        bills.splice(j, 1);
                        break;
                    }
                }
           }
           return bills;
    };
    /**
    * function to fetch available bills for the reservation from the server
    */
    $scope.fetchBillsForReservation = function(){
        
            var successCallback = function(data) {
                $scope.bills = [];
                $scope.$parent.bills = [];
                
               if(data.length > 0){
                    $scope.first_bill_id = data[0].id;
                    $scope.newBillNumber = data.length + 1;
                    if($scope.reservationData.reservation_id != $scope.selectedEntity.id && $scope.selectedEntity.entity_type == 'RESERVATION'){
                        $scope.bills.push(data[0]);
                        $scope.bills = $scope.excludeExistingBills($scope.bills);
                        $scope.$parent.bills = $scope.bills;
                    }else{
                        data.splice(0, 1);
                        $scope.bills = $scope.excludeExistingBills(data);
                        if($scope.newBillNumber <= 10){
                            var newBill = {};
                            newBill.id = 'new';
                            newBill.bill_number = '' + $scope.newBillNumber + '(new)';
                            $scope.bills.push(newBill);
                        }                        
                        $scope.$parent.bills = $scope.bills;
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
    * function to update the company and travel agent in stay card header
    */
    $scope.updateCardInfo = function(){
        
        if(($scope.selectedEntity.entity_type == 'COMPANY_CARD' && (typeof $scope.reservationDetails.companyCard.id == 'undefined'|| $scope.reservationDetails.companyCard.id == '')) || 
            ($scope.selectedEntity.entity_type == 'TRAVEL_AGENT' && ($scope.reservationDetails.travelAgent.id == 'undefined' || $scope.reservationDetails.travelAgent.id == ''))) {
            $rootScope.$broadcast('CardInfoUpdated', $scope.selectedEntity.id, $scope.selectedEntity.entity_type);
        }        
    }
    /**
    * function to save the new route
    */
    $scope.saveRoute = function(){
            var successCallback = function(data) {
                $scope.$parent.$emit('hideLoader');
                $scope.setReloadOption(true);
                $scope.headerButtonClicked();
                $scope.updateCardInfo();
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           $scope.selectedEntity.reservation_id=$scope.reservationData.reservation_id;      
           
           /*
                     * If user selects the new bill option,
                     * we'll first create the bill and then save the route for that bill
                     */
           if($scope.selectedEntity.to_bill != 'new'){
                $scope.invokeApi(RVBillinginfoSrv.saveRoute, $scope.selectedEntity, successCallback, errorCallback);
            }else{
                var billData ={
                        "reservation_id" : $scope.reservationData.reservation_id
                        };
                    /*
                     * Success Callback of create bill action
                     */
                    var createBillSuccessCallback = function(data){
                        $scope.$emit('hideLoader');   
                        $scope.selectedEntity.to_bill = data.id;      
                        //Fetch data again to refresh the screen with new data
                        $scope.invokeApi(RVBillinginfoSrv.saveRoute, $scope.selectedEntity, successCallback, errorCallback);
                    };
                    $scope.invokeApi(RVBillCardSrv.createAnotherBill,billData,createBillSuccessCallback, errorCallback);
            }
            
    };
}]);