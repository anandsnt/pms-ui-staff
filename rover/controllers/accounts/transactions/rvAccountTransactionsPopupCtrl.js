sntRover.controller('RVAccountTransactionsPopupCtrl',
	['$scope','$rootScope','$filter','rvAccountTransactionsSrv', 'ngDialog',function($scope, $rootScope,$filter, rvAccountTransactionsSrv, ngDialog){
	

	BaseCtrl.call(this, $scope);

	var reloadBillScreen =  function(){
		$scope.$emit('UPDATE_TRANSACTION_DATA');
	};


	var hideLoaderAndClosePopup = function(){
		$scope.$emit("hideLoader");
		reloadBillScreen();
		ngDialog.close();
	};


   /*
	 * API call remove transaction
	 */

	$scope.removeCharge = function(reason){
		

		var params ={
			data:{
				"reason":reason,
				"process":"delete"
			},
			"id" :$scope.selectedTransaction.id
		};

	 	var options = {
			params: 			params,
			successCallBack: 	hideLoaderAndClosePopup,	   
		};
		$scope.callAPI (rvAccountTransactionsSrv.transactionDelete, options);		 	

	};

   /*
	 * API call split transaction
	 */

	$scope.splitCharge = function(qty,isAmountType){

		var split_type = isAmountType ? $rootScope.currencySymbol:'%';
		var splitData = {
			"id" :$scope.selectedTransaction.id,
			"data":{
				"split_type": split_type,
   				"split_value": qty
			}
			 
		};
		var options = {
			params: 			splitData,
			successCallBack: 	hideLoaderAndClosePopup,	   
		};
		$scope.callAPI (rvAccountTransactionsSrv.transactionSplit, options);
		
	};

   /*
	 * API call edit transaction
	 */
	$scope.editCharge = function(newAmount,chargeCode){
		
		var editData = 
		{
			"updatedDate":
						{
				  			"new_amount":newAmount,
				  			"charge_code_id": chargeCode.id
						},
					"id" :$scope.selectedTransaction.id
		};

		var options = {
			params: 			editData,
			successCallBack: 	hideLoaderAndClosePopup,	   
		};
		$scope.callAPI (rvAccountTransactionsSrv.transactionEdit, options);

	};


/*----------------------------edit charge drop down implementation--------------------------------------*/
	
	$scope.chargecodeData = {};
	$scope.chargecodeData.chargeCodeSearchText = "";
	var scrollerOptionsForSearch = {click: true, preventDefault: false};
	$scope.setScroller('chargeCodesList',scrollerOptionsForSearch);

	$scope.selectChargeCode = function(id){
		 for(var i = 0; i < $scope.availableChargeCodes.length; i++){
		 	 if($scope.availableChargeCodes[i].id === id){
		 	 	$scope.selectedChargeCode = $scope.availableChargeCodes[i];
		 	 }
		 }
		$scope.showChargeCodes = false;
		$scope.chargecodeData.chargeCodeSearchText = "";
	};
		 	/**
  	* function to perform filering on results.
  	* if not fouund in the data, it will request for webservice
  	*/
  	var displayFilteredResultsChargeCodes = function(){ 

	    //if the entered text's length < 3, we will show everything, means no filtering    
	    if($scope.chargecodeData.chargeCodeSearchText.length < 3){
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
	        if (($scope.escapeNull(value.name).toUpperCase()).indexOf($scope.chargecodeData.chargeCodeSearchText.toUpperCase()) >= 0 || 
	            ($scope.escapeNull(value.description).toUpperCase()).indexOf($scope.chargecodeData.chargeCodeSearchText.toUpperCase()) >= 0 ) 
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
    * function to clear the charge code search text
    */
	$scope.clearResults = function(){
	  	$scope.chargecodeData.chargeCodeSearchText = "";
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
    * function to trigger the filtering when the search text is entered
    */
    $scope.chargeCodeEntered = function(){
        $scope.showChargeCodes = false;
	   	displayFilteredResultsChargeCodes();
	   	var queryText = $scope.chargecodeData.chargeCodeSearchText;
	    $scope.chargecodeData.chargeCodeSearchText = queryText.charAt(0).toUpperCase() + queryText.slice(1);
    };

}]);