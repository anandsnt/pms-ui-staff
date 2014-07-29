admin.controller('ADBillingGroupCtrl',['$scope', '$state', 'ADBillingGroupSrv', 'ngTableParams','$filter',  function($scope, $state, ADBillingGroupSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.billingGroupList = [{'name':'xxx'}, {'name':'xxx'}, {'name':'xxx'}];
	

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
	// $scope.listBillingGroups(); 
   /*
    * To render edit room types screen
    * @param {index} index of selected room type
    * @param {id} id of the room type
    */	
	$scope.editBillingGroup = function(index, id)	{
		
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.billingGroupList = data.results;
			$scope.currentClickedElement = -1;
			
		};
	   $scope.invokeApi(ADBillingGroupSrv.getBillingGroupDetails, id , successCallbackFetch);
		$scope.currentClickedElement = index;
	 	
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
		console.log($scope.floorListData);
		var params = dclone($scope.floorListData, unwantedKeys);
		
	
		 
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		//Since the list is ordered. Update the ordered data
    		if($scope.isAddMode){
    			$scope.data.floors.push(data);
    			$scope.tableParams.reload();
    			$scope.isAddMode = false;
    		}else{
    			$scope.orderedData[parseInt($scope.currentClickedElement)].description = $scope.floorListData.description;
    			$scope.orderedData[parseInt($scope.currentClickedElement)].floor_number = $scope.floorListData.floor_number;
    			$scope.tableParams.reload();
    			$scope.currentClickedElement = -1;
    		}		
    		
    	};
    	$scope.invokeApi(ADBillingGroupSrv.updateBillingGroup, params , successCallbackSave);
    };

    /*
   * To delete a floor
   */
   $scope.deleteBillingGroup = function(index){
		
		var unwantedKeys = [];
		console.log($scope.floorListData);
		var data = {};
		 data.id = $scope.orderedData[index].id;
    	var successCallbackSave = function(){
    		$scope.$emit('hideLoader');
    		var pos = $scope.data.floors.indexOf($scope.orderedData[index]);
    		$scope.data.floors.splice(pos, 1);
    		$scope.tableParams.reload();
    	};
    	$scope.invokeApi(ADFloorSetupSrv.deleteFloor, data , successCallbackSave);
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
				"id":"",
				"selected_charge_codes" : []
			};		
    		$scope.billingGroupData.available_charge_codes = data;
    	};
    	$scope.invokeApi(ADBillingGroupSrv.getChargeCodes, {}, successCallbackSave);
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

