admin.controller('ADHotelLoyaltyCtrl',['$scope', '$state', 'ADHotelLoyaltySrv', '$anchorScroll', '$timeout',  '$location', '$rootScope',
  function($scope, $state, ADHotelLoyaltySrv, $anchorScroll, $timeout, $location, $rootScope){
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.hotelLoyaltyData = {};
	$scope.isAddMode = false;
	$scope.levelEditProgress = false;
	$scope.addEditTitle = "";
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
		$scope.addEditTitle = "Edit";
	 	var successCallbackRender = function(data){
	 		$scope.hotelLoyaltyData = data;
	 		 		if($scope.hotelLoyaltyData.levels.length === 0) {
						$scope.hotelLoyaltyData.levels.push({'value':'','name':''});
					}
	 		$scope.setLoyaltyLevelEditStatus();
	 		$scope.$emit('hideLoader');
	 	};

	 	var data = {"id":id };
	 	$scope.invokeApi(ADHotelLoyaltySrv.getHotelLoyaltyDetails, data , successCallbackRender);
	};
	/*
    * To set the initial edit status for the levels
    */
	$scope.setLoyaltyLevelEditStatus = function(){
		for(var i = 0; i < $scope.hotelLoyaltyData.levels.length; i++){
			$scope.hotelLoyaltyData.levels[i].editProgress = false;
		}
	};
   /*
    * Render add hotel loyalty screen
    */
	$scope.addNewHotelLoyalty = function()	{
		$scope.addEditTitle = "Add new";
		$scope.hotelLoyaltyData   = {};
		$scope.hotelLoyaltyData={};
		$scope.currentClickedElement = "new";
		$scope.hotelLoyaltyData.levels  = [{'value':'','name':'', 'editProgress':false}];
		$scope.isAddMode = true;
		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
	};
   /*
    * To get the template of edit screen
    * @param {int} index of the selected hotel loyalty
    * @param {string} id of the hotel loyalty
    */
	$scope.getTemplateUrl = function(index, id){
		 if(typeof index === "undefined" || typeof id === "undefined") {
		 	return "";
		 }
		 if($scope.currentClickedElement === index){
			 	return "/assets/partials/hotelLoyalty/adHotelLoyaltyAdd.html";
		 }
	};
  /*
   * To save/update hotel loyalty details
   */
   $scope.saveHotelLoyalty = function(){
   		var lovNames = [];
 		angular.forEach($scope.hotelLoyaltyData.levels,function(item, index) {
 			if (item.name === "") {
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
    	var errorCallbackSave = function(error){
    		$scope.errorMessage = error[0];
    		$scope.$emit('hideLoader');
    		//scroll to top of the page where error message is shown
			angular.element( document.querySelector('.content')).scrollTop(0);
			if($scope.hotelLoyaltyData.levels.length === 0) {
				$scope.hotelLoyaltyData.levels.push({'value':'','name':'', 'editProgress':false});
			}
    	};
    	if($scope.isAddMode){
    		$scope.invokeApi(ADHotelLoyaltySrv.saveHotelLoyalty, $scope.hotelLoyaltyData , successCallbackSave, errorCallbackSave);
    	} else {
    		$scope.invokeApi(ADHotelLoyaltySrv.updateHotelLoyalty, $scope.hotelLoyaltyData , successCallbackSave, errorCallbackSave);
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
		var nextStatus = !currentStatus;
		var data = {
			"set_active": nextStatus? "true" : "false",
			"value": loyaltyId
		};
		var successCallbackActivateInactivate = function(data){
			$scope.data.hotel_loyalty_program[index].is_active = nextStatus;
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADHotelLoyaltySrv.activateInactivate, data , successCallbackActivateInactivate);
	};
	$scope.activateMainInactivate = function(currentStatus){
		var nextStatus = !$scope.data.use_hlp;
		var data = {
			"set_active": nextStatus
		};
		var successCallbackActivateMainInactivate = function(data){
			$scope.data.use_hlp = !$scope.data.use_hlp;
			$rootScope.isHLPActive = $scope.data.use_hlp;
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADHotelLoyaltySrv.switchMainToggle, data , successCallbackActivateMainInactivate);
	};

	$scope.getEditStatusForLevel = function(index){
		return $scope.hotelLoyaltyData.levels [index].editProgress;
	};
	/*
    * To handle focus event on hotel loyalty levels
    */
	$scope.onFocus = function(index){
		$scope.hotelLoyaltyData.levels [index].editProgress = true;
		if((index === $scope.hotelLoyaltyData.levels.length-1) || ($scope.hotelLoyaltyData.levels.length===1)){
			$scope.newOptionAvailable = true;
			// exclude first two fields
			if($scope.hotelLoyaltyData.levels.length > 2){
				angular.forEach($scope.hotelLoyaltyData.levels,function(item, index) {
					if (item.name === "" && index < $scope.hotelLoyaltyData.levels.length-1 ) {
						$scope.newOptionAvailable = false;
					}
				});
			}
			if($scope.newOptionAvailable) {
				$scope.hotelLoyaltyData.levels.push({'value':'','name':'', 'editProgress':false});
			}
		}
	};
   /*
    * To handle text change on hotel loyalty levels
    */
	$scope.textChanged = function(index){

		if($scope.hotelLoyaltyData.levels.length>1){
			if($scope.hotelLoyaltyData.levels[index].name === "") {
				$scope.hotelLoyaltyData.levels.splice(index, 1);
			}
		}
	};
   /*
    * To handle blur event on hotel loyalty levels
    */
	$scope.onBlur = function(index){
		if($scope.hotelLoyaltyData.levels.length>1){
			if($scope.hotelLoyaltyData.levels[index].name === "") {
				$scope.hotelLoyaltyData.levels.splice(index, 1);
			}
			angular.forEach($scope.hotelLoyaltyData.levels,function(item, i) {
				if (item.name === "" && i !== $scope.hotelLoyaltyData.levels.length-1) {
					$scope.hotelLoyaltyData.levels.splice(i, 1);
				}
			});
		}else{
			$scope.hotelLoyaltyData.levels [index].editProgress = false;
		}
	};
}]);

