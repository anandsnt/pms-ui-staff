admin.controller('ADHoldStatusListCtrl',['$scope', '$state', 'ADHoldStatusSrv', '$location', '$anchorScroll', '$timeout',  function($scope, $state, ADHoldStatusSrv, $location, $anchorScroll, $timeout){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.departmentData = {};
	$scope.isAddMode = false;
   /*
    * To fetch list of hold status
    */
	$scope.listHoldStatus = function(){
		console.log("in");
		var successCallbackFetch = function(data){			
			$scope.$emit('hideLoader');
			//TODO- API INtegration
			$scope.data.holdStatuses = data.data.departments;			
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
	$scope.editDepartments = function(index, id)	{		
		$scope.holdstatusData={};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
		$scope.data.holdStatuses.map(function(x){
			if(x.value==id)
				{
					$scope.holdstatusData = x;					
				}
		}); 
		//TODO-remove below code
	 	// var successCallbackRender = function(data){	
	 	// 	$scope.holdstatusData = data;
	 	// 	$scope.$emit('hideLoader');
	 	// };
	 	// var data = {"id":id };
	 	// $scope.invokeApi(ADDepartmentSrv.getDepartmentDetails, data , successCallbackRender);    
	};
   /*
    * Render add department screen
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
    * @param {int} index of the selected department
    * @param {string} id of the department
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
   	console.log("Save");
   	console.log($scope.holdstatusData);
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
			if($scope.isAddMode){
				// To add new data to scope
    			$scope.data.holdStatus.push(data);
	    	} else {
	    		//To update data with new value
	    		$scope.data.holdStatus[parseInt($scope.currentClickedElement)].name = $scope.holdstatusData.name;
	    	}
    		$scope.currentClickedElement = -1;
    	};
    	if($scope.isAddMode){    		
    		$scope.invokeApi(ADDepartmentSrv.saveDepartment, $scope.departmentData , successCallbackSave);
    	} else {
    		//TODO-Here we Done -Edit
    		$scope.invokeApi(ADDepartmentSrv.updateDepartment, $scope.holdstatusData , successCallbackSave);
    	}
    };
   /*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		$scope.currentClickedElement = -1;
	};	
   /*
    * To delete department
    * @param {int} index of the selected department
    * @param {string} id of the selected department
    */		
	$scope.deleteDepartment = function(index, id){
		var successCallbackDelete = function(data){	
	 		$scope.$emit('hideLoader');
	 		$scope.data.departments.splice(index, 1);
	 		$scope.currentClickedElement = -1;
	 	};
		$scope.invokeApi(ADDepartmentSrv.deleteDepartment, id , successCallbackDelete);
	};
}]);

