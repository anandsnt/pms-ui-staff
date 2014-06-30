admin.controller('ADHotelLoyaltyCtrl',['$scope', '$state', 'ADHotelLoyaltySrv',  function($scope, $state, ADHotelLoyaltySrv){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.hotelLoyaltyData = {};
	$scope.isAddMode = false;
	$scope.levelEditProgress = false;
   /*
    * To fetch list of hotel loyalty
    */
	$scope.listHotelLoyaltyPrograms = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
		
			$scope.isAddMode = false;
		};
		$scope.invokeApi(ADHotelLoyaltySrv.fetch, {} , successCallbackFetch);	
	};
	//To list hotel loyalty
	$scope.listHotelLoyaltyPrograms(); 
   /*
    * To render edit hotel loyalty screen
    * @param {index} index of selected hotel loyalty
    * @param {id} id of the hotel loyalty
    */	
	$scope.editHotelLoyalty = function(index, id)	{
		$scope.hotelLoyaltyData={};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
	 	var successCallbackRender = function(data){	
	 		$scope.hotelLoyaltyData = data;
	 		 		if($scope.hotelLoyaltyData.levels.length === 0)
						$scope.hotelLoyaltyData.levels.push({'value':'','name':''});
	 		$scope.$emit('hideLoader');
	 	};

	 	var data = {"id":id };
	 	$scope.invokeApi(ADHotelLoyaltySrv.getHotelLoyaltyDetails, data , successCallbackRender);    
	};
   /*
    * Render add hotel loyalty screen
    */
	$scope.addNewHotelLoyalty = function()	{
		$scope.hotelLoyaltyData   = {};
		$scope.hotelLoyaltyData={};
		$scope.currentClickedElement = "new";
		$scope.hotelLoyaltyData.levels  = [{'value':'','name':''}];
		$scope.isAddMode = true;
	};
   /*
    * To get the template of edit screen
    * @param {int} index of the selected hotel loyalty
    * @param {string} id of the hotel loyalty
    */
	$scope.getTemplateUrl = function(index, id){
		 if(typeof index === "undefined" || typeof id === "undefined") return "";
		 if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/hotelLoyalty/adHotelLoyaltyAdd.html";
		 }
	};
  /*
   * To save/update hotel loyalty details
   */
   $scope.saveHotelLoyalty = function(){
   	
   		var lovNames = [];
 		angular.forEach($scope.hotelLoyaltyData.levels,function(item, index) {
 			if (item.name == "") {
 				$scope.hotelLoyaltyData.levels.splice(index, 1);
 			}
 			else{
 				if($scope.isAddMode){
 					dict = { 'name': item.name};
 				} else {
 					dict = { 'name': item.name, 'value': item.value};
 				}
 				lovNames.push(dict);
 			}
 		});
   	
   		$scope.hotelLoyaltyData.levels = lovNames;
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
			if($scope.isAddMode){
				// To add new data to scope
    			$scope.data.hotel_loyalty_program.push(data);
	    	} else {
	    		//To update data with new value
	    		$scope.data.hotel_loyalty_program[parseInt($scope.currentClickedElement)].name = $scope.hotelLoyaltyData.name;
	    	}
    		$scope.currentClickedElement = -1;
    	};
    	var errorCallbackSave = function(data){
    		$scope.$emit('hideLoader');
			if($scope.hotelLoyaltyData.levels.length === 0)
				$scope.hotelLoyaltyData.levels.push({'value':'','name':''});
    	};
    	if($scope.isAddMode){
    		$scope.invokeApi(ADHotelLoyaltySrv.saveHotelLoyalty, $scope.hotelLoyaltyData , successCallbackSave);
    	} else {
    		$scope.invokeApi(ADHotelLoyaltySrv.updateHotelLoyalty, $scope.hotelLoyaltyData , successCallbackSave);
    	}
    };
   /*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		$scope.currentClickedElement = -1;
	};	
	/**
    * To Activate/Inactivate hotel loyalty
    * @param {string} hotel loyalty id 
    * @param {string} current status of the hotel loyalty
    * @param {num} current index
    */ 
	$scope.activateInactivate = function(loyaltyId, currentStatus, index){
		var nextStatus = (currentStatus == "true" ? "false" : "true");
		var data = {
			"set_active": nextStatus,
			"value": loyaltyId
		};
		var successCallbackActivateInactivate = function(data){
			$scope.data.hotel_loyalty_program[index].is_active = (currentStatus == "true" ? "false" : "true");
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADHotelLoyaltySrv.activateInactivate, data , successCallbackActivateInactivate);
	};	
	/*
    * To handle focus event on hotel loyalty levels
    */
	$scope.onFocus = function(index){
		if((index === $scope.hotelLoyaltyData.levels.length-1) || ($scope.hotelLoyaltyData.levels.length==1)){
			$scope.newOptionAvailable = true;
			// exclude first two fields
			if($scope.hotelLoyaltyData.levels.length > 2){
				angular.forEach($scope.hotelLoyaltyData.levels,function(item, index) {
					if (item.name == "" && index < $scope.hotelLoyaltyData.levels.length-1 ) {
						$scope.newOptionAvailable = false;
					}
				});
			}
			if($scope.newOptionAvailable)
				$scope.hotelLoyaltyData.levels.push({'value':'','name':''});
		}
	};
   /*
    * To handle text change on hotel loyalty levels
    */
	$scope.textChanged = function(index){

		$scope.levelEditProgress = true;
		if($scope.hotelLoyaltyData.levels.length>1){
			if($scope.hotelLoyaltyData.levels[index].name == "")
				$scope.hotelLoyaltyData.levels.splice(index, 1);
		}
	};
   /*
    * To handle blur event on hotel loyalty levels
    */
	$scope.onBlur = function(index){
		if($scope.hotelLoyaltyData.levels.length>1){
			if($scope.hotelLoyaltyData.levels[index].name == "")
				$scope.hotelLoyaltyData.levels.splice(index, 1);
			angular.forEach($scope.hotelLoyaltyData.levels,function(item, i) {
				if (item.name == "" && i != $scope.hotelLoyaltyData.levels.length-1) {
					$scope.hotelLoyaltyData.levels.splice(i, 1);
				}
			});
		}
	};
	
}]);

