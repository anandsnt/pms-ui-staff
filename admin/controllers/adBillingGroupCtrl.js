admin.controller('ADBillingGroupCtrl',['$scope', '$state', 'ADBillingGroupSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout', '$location',
  function($scope, $state, ADBillingGroupSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
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
				$scope.billingGroupData.title = $scope.billingGroupData.name;
				$scope.currentClickedElement = index;
				$scope.billingGroupData.available_charge_codes.forEach(function(charge,index){
					if($scope.billingGroupData.selected_charge_codes.indexOf(charge.id) != -1){
						$scope.billingGroupData.available_charge_codes[index].isChecked =true;
					}
					$scope.updateIsAllChargeCodeSelectedStatus();
				});
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
    			$scope.billingGroupList.push(data);
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
		var param = $scope.billingGroupList[index].id;
    	var successCallbackSave = function(){
    		$scope.$emit('hideLoader');
    		$scope.currentClickedElement = -1;
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
				"title":"",
				"name":"",
				"selected_charge_codes" : []
			};
    		$scope.billingGroupData.available_charge_codes = data.available_charge_codes;
    		$timeout(function() {
	            $location.hash('new-form-holder');
	            $anchorScroll();
	    	});
    	};
    	$scope.invokeApi(ADBillingGroupSrv.getChargeCodes, {}, successCallbackSave);
	};

	/*
    * To select charge code
    *
    */
	$scope.selectChargeCode = function(index){
		if($scope.isChecked($scope.billingGroupData.available_charge_codes[index].id)){
			$scope.removeChargeCode($scope.billingGroupData.available_charge_codes[index].id);
			$scope.billingGroupData.available_charge_codes[index].isChecked = false;
		}else{
			$scope.billingGroupData.selected_charge_codes.push($scope.billingGroupData.available_charge_codes[index].id);
			$scope.billingGroupData.available_charge_codes[index].isChecked = true;
		}
		$scope.updateIsAllChargeCodeSelectedStatus();
	};

	/*
    * Check whether all charge code selected or not
    *
    */
	$scope.updateIsAllChargeCodeSelectedStatus = function(){
		$scope.billingGroupData.isAllChargeCodeSelected = false;
		$scope.billingGroupData.available_charge_codes.forEach(function(chargeCode){
			if(!chargeCode.isChecked){
				$scope.billingGroupData.isAllChargeCodeSelected =true;
			}
		});
		$scope.billingGroupData.isAllChargeCodeSelected = !$scope.billingGroupData.isAllChargeCodeSelected;
	}
	/*
    * To remove the selected charge code with id
    *
    */
	$scope.removeChargeCode = function(id){
		var pos;
		for(var i = 0; i < $scope.billingGroupData.selected_charge_codes.length; i++){
			if($scope.billingGroupData.selected_charge_codes[i] == id){
				pos = i;
				break;
			}
				
		}
		$scope.billingGroupData.selected_charge_codes.splice(pos, 1);

	};
	/*
    * To check whether the charge code is selected or not
    *
    */
	$scope.isChecked = function(id){
		for(var i = 0; i < $scope.billingGroupData.selected_charge_codes.length; i++){
			if($scope.billingGroupData.selected_charge_codes[i] == id)
				return true;
		}
		return false;

	};
	$scope.selectOrUnselectAllChargeCodeSelected = function(){
		if($scope.billingGroupData.isAllChargeCodeSelected){
			$scope.billingGroupData.selected_charge_codes.length = 0;
			$scope.billingGroupData.available_charge_codes.forEach(function(chargeCode, index){
			$scope.billingGroupData.selected_charge_codes.push(chargeCode.id);
			$scope.billingGroupData.available_charge_codes[index].isChecked = true;
			});
		}else{
			
			$scope.billingGroupData.selected_charge_codes.length = 0;
			$scope.billingGroupData.available_charge_codes.forEach(function(chargeCode, index){
			$scope.billingGroupData.available_charge_codes[index].isChecked = false;
			});

		}
		$scope.updateIsAllChargeCodeSelectedStatus();
			
	};
	/*
    * To handle click event
    */
	$scope.clickCancel = function(){
		$scope.billingGroupData.name = $scope.billingGroupData.title;
		if($scope.isAddMode)
			$scope.isAddMode =false;
		else
		    $scope.currentClickedElement = -1;
	};

}]);

