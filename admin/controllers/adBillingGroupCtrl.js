admin.controller('ADBillingGroupCtrl',['$scope', '$state', 'ADBillingGroupSrv', 'ngTableParams','$filter',  function($scope, $state, ADBillingGroupSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	// $scope.billingGroupList = [{'name':'xxx'}, {'name':'xxx'}, {'name':'xxx'}];
	

   /*
    * To fetch list of billing groups
    */
	$scope.listBillingGroups = function(){
		
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.billingGroupList = data.results;
			$scope.currentClickedElement = -1;
			
		};
	   $scope.invokeApi(ADBillingGroupSrv.fetch, {} , successCallbackFetch);	
	};
	// To list billing groups
	$scope.listBillingGroups(); 
   /*
    * To render edit room types screen
    * @param {index} index of selected room type
    * @param {id} id of the room type
    */	
	$scope.editBillingGroup = function(index, id)	{
		
		var successCallbackFetchbillingGroupDetails = function(data){
				var successCallbackFetchChargeCodes = function(data){
				$scope.$emit('hideLoader');
				$scope.billingGroupData.available_charge_codes = data.available_charge_codes;
				$scope.currentClickedElement = index;
			};
			$scope.billingGroupData = data.results;
	   		$scope.invokeApi(ADBillingGroupSrv.getChargeCodes, {}, successCallbackFetchChargeCodes);
			
		};
	   $scope.invokeApi(ADBillingGroupSrv.getBillingGroupDetails, id , successCallbackFetchbillingGroupDetails);
		
	 	
	};
   
   /*
    * To get the template of edit screen
    * @param {int} index of the selected room type
    * @param {string} id of the room type
    */
	$scope.getTemplateUrl = function(index, id){
		// if(typeof index === "undefined" || typeof id === "undefined") return "";
		if(typeof index === "undefined" ) return "";
		if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/billingGroups/adBillingGroupDetails.html";
		}
	};
  /*
   * To save/update room type details
   */
   $scope.saveBillingGroup = function(){
		
		var unwantedKeys = [];
		
		var params = dclone($scope.billingGroupData, unwantedKeys);
		
	
		 
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		//Since the list is ordered. Update the ordered data
    		if($scope.isAddMode){
    			var newBillingGroup = {};
    			newBillingGroup.name = $scope.billingGroupData.name;
    			newBillingGroup.id = data.id;
    			$scope.billingGroupList.push($scope.billingGroupData);
    			$scope.isAddMode = false;
    		}else{
    			$scope.billingGroupList[$scope.currentClickedElement].name = $scope.billingGroupData.name;
    			$scope.currentClickedElement = -1;
    		}		
    		
    	};
    	if($scope.isAddMode){
    		$scope.invokeApi(ADBillingGroupSrv.createBillingGroup, params, successCallbackSave);
    	}else{
    		$scope.invokeApi(ADBillingGroupSrv.updateBillingGroup, params, successCallbackSave);
    	}
    	
    };

    /*
   * To delete a floor
   */
   $scope.deleteBillingGroup = function(index){
		
		var unwantedKeys = [];
		console.log($scope.floorListData);
		var param = $scope.billingGroupList[index].id;
    	var successCallbackSave = function(){
    		$scope.$emit('hideLoader');
    		$scope.billingGroupList.splice(index, 1);
    	};
    	$scope.invokeApi(ADBillingGroupSrv.deleteBillingGroup, param, successCallbackSave);
    };
	 /*
    * To add new floor
    * 
    */		
	$scope.addBillingGroup = function(){
		

			var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		//Since the list is ordered. Update the ordered data
    		$scope.currentClickedElement = -1;
			$scope.isAddMode = $scope.isAddMode ? false : true;
			$scope.billingGroupData = {
				"name":"",
				"selected_charge_codes" : []
			};		
    		$scope.billingGroupData.available_charge_codes = data.available_charge_codes;
    	};
    	$scope.invokeApi(ADBillingGroupSrv.getChargeCodes, {}, successCallbackSave);
	};

	/*
    * To select charge code
    * 
    */		
	$scope.selectChargeCode = function(index){
		$scope.billingGroupData.selected_charge_codes.push($scope.billingGroupData.available_charge_codes[index]);

	};
	/*
    * To check whether the charge code is selected or not
    * 
    */		
	$scope.isChecked = function(id){
		for(var i = 0; i < $scope.billingGroupData.selected_charge_codes.length; i++){
			if($scope.billingGroupData.selected_charge_codes[i].id == id)
				return true;
		}
		return false;

	};


	/*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		// $scope.floorListData.description = $scope.floorListData.floortitle;
		// $scope.floorListData.floor_number = $scope.floorListData.floor_number_old;
		if($scope.isAddMode)
			$scope.isAddMode =false;
		else
		    $scope.currentClickedElement = -1;
	};	

}]);

