admin.controller('ADRateTypeCtrl', ['$scope', '$rootScope', 'ADRateTypeSrv',
function($scope, $rootScope, ADRateTypeSrv) {
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.rateTypeData = {};
	$scope.isAddMode = false;
	$scope.currentClickedElement = -1;
	var fetchSuccess = function() {
		$scope.data = data;
		$scope.systemDefined = (data.rate_types.system_defined == true) ? "(System Defined)": "";
		console.log("fetchSuccess");
		console.log($scope.data);
		$scope.$emit('hideLoader');
	};

	$scope.invokeApi(ADRateTypeSrv.fetch, {}, fetchSuccess);

	/*
	 * Render add department screen
	 */
	$scope.addNew = function() {
		$scope.rateTypeData = {};
		$scope.currentClickedElement = "new";
		$scope.isAddMode = true;
	};
	
	   /*
    * To render edit department screen
    * @param {index} index of selected department
    * @param {id} id of the department
    */	
	$scope.editRateTypes = function(index, id)	{
		$scope.rateTypeData={};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
	 	var successCallbackRender = function(data){	
	 		$scope.rateTypeData = data;
	 		$scope.$emit('hideLoader');
	 	};
	 	var data = {"id":id };
	 	//$scope.invokeApi(ADRateTypeSrv.getRateTypesDetails, data , successCallbackRender);    
	};
	
	
	
	/*
    * To get the template of edit screen
    * @param {int} index of the selected rate type
    * @param {string} id of the rate type
    */
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") return "";
		if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/rate_types/adRateTypeEdit.html";
		}
	};
		/**
    *   A post method to update ReservationImport for a hotel
    *   @param {String} index value for the hotel list item.
    */
   
	$scope.toggleClicked = function(index){
		
		// checkedStatus will be true, if it checked
      	// show confirm if it is going turn on stage
      	if($scope.data.rate_types[index].activated == 'false'){
          	console.log("false");
      	}
      	var isActivated = $scope.data.rate_types[index].activated  == 'true' ? false : true;
      	var data = {'value' :  $scope.data.rate_types[index].id,  'status': isActivated };
      	
      	var postSuccess = function(){
      		$scope.data.rate_types[index].activated = ($scope.data.rate_types[index].activated == 'true') ? 'false' : 'true';
			$scope.$emit('hideLoader');
		};
		
		
		$scope.invokeApi(ADRateTypeSrv.postRateTypeToggle, data, postSuccess);
	};
  /*
   * To save/update rate typet details
   */
   $scope.saveRateType = function(){
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
			if($scope.isAddMode){
				// To add new data to scope
    			$scope.data.rate_types.push(data);
	    	} else {
	    		//To update data with new value
	    		$scope.data.rate_types[parseInt($scope.currentClickedElement)].name = $scope.rateTypeData.name;
	    		$scope.data.rate_types[parseInt($scope.currentClickedElement)].description = $scope.rateTypeData.description;

	    	}
    		$scope.currentClickedElement = -1;
    	};
    	if($scope.isAddMode){
    		$scope.invokeApi(ADRateTypeSrv.saveRateType, $scope.rateTypeData , successCallbackSave);
    	} else {
    		$scope.invokeApi(ADRateTypeSrv.updateRateType, $scope.rateTypeData , successCallbackSave);
    	}
    };
   /*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		$scope.currentClickedElement = -1;
	};	
}]);
