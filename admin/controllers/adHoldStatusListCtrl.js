admin.controller('ADHoldStatusListCtrl',['$scope', '$state', 'ADHoldStatusSrv', '$location', '$anchorScroll', '$timeout',  function($scope, $state, ADHoldStatusSrv, $location, $anchorScroll, $timeout){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.isAddMode = false;
	$scope.holdstatusData={};
   /*
    * To fetch list of hold status
    */
	$scope.listHoldStatus = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data.holdStatuses = data.data.hold_status;
			$scope.currentClickedElement = -1;
			$scope.isAddMode = false;
		};
		$scope.invokeApi(ADHoldStatusSrv.fetch, {} , successCallbackFetch);
	};
	//To list Hold status
	$scope.listHoldStatus();
   /*
    * To render edit hold status
    * @param {index} index of selected hold status
    * @param {id} id of selected hold status
    */
	$scope.editHoldStatus = function(index, id)	{
		$scope.holdstatusData={};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
		$scope.data.holdStatuses.map(function(x){
			if(x.id==id)
				{
				$scope.holdstatusData.name =x.name;
				$scope.holdstatusData.id =x.id;
				$scope.holdstatusData.is_take_from_inventory =x.is_take_from_inventory;
				$scope.holdstatusData.is_system=x.is_system;
				}
		});
	};
   /*
    * Render add hold status screen
    */
	$scope.addNew = function()	{
		$scope.holdstatusData={};
		$scope.currentClickedElement = "new";
		$scope.isAddMode = true;
		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
	};
   /*
    * To get the template of edit screen
    * @param {int} index of the selected hold status
    * @param {string} id of the hold status
    */
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") return "";
		if($scope.currentClickedElement == index){
			 	return "/assets/partials/holdStatus/adHoldStatusEdit.html";
		}
	};
  /*
   * To save/update Hold status details
   */
   $scope.saveHoldStatus = function(){
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
			if($scope.isAddMode){
				// To add new data to scope
    			$scope.data.holdStatuses.push(data.data);
	    	} else {
	    		//To update data with new value
	    		$scope.data.holdStatuses[parseInt($scope.currentClickedElement)].name = $scope.holdstatusData.name;
	    		$scope.data.holdStatuses[parseInt($scope.currentClickedElement)].is_take_from_inventory = $scope.holdstatusData.is_take_from_inventory;
	    		$scope.data.holdStatuses[parseInt($scope.currentClickedElement)].is_system=$scope.holdstatusData.is_system;
	    	}
    		$scope.currentClickedElement = -1;
    	};
    	if($scope.isAddMode){
    		$scope.invokeApi(ADHoldStatusSrv.saveHoldStatus, $scope.holdstatusData , successCallbackSave);
    	} else {
    		$scope.invokeApi(ADHoldStatusSrv.updateHoldStatus, $scope.holdstatusData , successCallbackSave);
    	}
    };
   /*
    * To handle click event
    */
	$scope.clickCancel = function(){
		$scope.currentClickedElement = -1;
	};
   /*
    * To delete HoldStatus
    * @param {int} index of the selected HoldStatus
    * @param {string} id of the selected HoldStatus
    */
	$scope.deleteHoldStatus = function(index, id){
		var successCallbackDelete = function(data){
	 		$scope.$emit('hideLoader');
	 		//handling error case
	 		if(data.status==='failure')
	 		{
	 			$scope.errorMessage = data.errors;
	 		}else{
	 			//Handling success - removing deleted holdstatus
	 			$scope.data.holdStatuses.splice(index, 1);
	 		}
	 		$scope.currentClickedElement = -1;
	 	};
		$scope.invokeApi(ADHoldStatusSrv.deleteHoldStatus, id, successCallbackDelete);
	};
}]);

