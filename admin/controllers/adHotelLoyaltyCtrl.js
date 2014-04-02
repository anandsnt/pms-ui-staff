admin.controller('ADHotelLoyaltyCtrl',['$scope', '$state', 'ADHotelLoyaltySrv',  function($scope, $state, ADHotelLoyaltySrv){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.hotelLoyaltyData = {};
	$scope.isAddMode = false;
   /*
    * To fetch list of departments
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
	//To list departments
	$scope.listHotelLoyaltyPrograms(); 
   /*
    * To render edit department screen
    * @param {index} index of selected department
    * @param {id} id of the department
    */	
	$scope.editDepartments = function(index, id)	{
		$scope.departmentData={};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
	 	var successCallbackRender = function(data){	
	 		$scope.departmentData = data;
	 		$scope.$emit('hideLoader');
	 	};
	 	var data = {"id":id };
	 	$scope.invokeApi(ADDepartmentSrv.getDepartmentDetails, data , successCallbackRender);    
	};
   /*
    * Render add department screen
    */
	$scope.addNewHotelLoyalty = function()	{
			$scope.editData   = {};
		$scope.hotelLoyaltyData={};
		$scope.currentClickedElement = "new";
		$scope.editData.lov  = [{'value':'','name':''}];
		$scope.isAddMode = true;
	};
   /*
    * To get the template of edit screen
    * @param {int} index of the selected department
    * @param {string} id of the department
    */
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") return "";
		if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/departments/adDepartmentsEdit.html";
		}
	};
  /*
   * To save/update department details
   */
   $scope.saveDepartment = function(){
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
			if($scope.isAddMode){
				// To add new data to scope
    			$scope.data.departments.push(data);
	    	} else {
	    		//To update data with new value
	    		$scope.data.departments[parseInt($scope.currentClickedElement)].name = $scope.departmentData.name;
	    	}
    		$scope.currentClickedElement = -1;
    	};
    	if($scope.isAddMode){
    		$scope.invokeApi(ADDepartmentSrv.saveDepartment, $scope.departmentData , successCallbackSave);
    	} else {
    		$scope.invokeApi(ADDepartmentSrv.updateDepartment, $scope.departmentData , successCallbackSave);
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
	 	};
		$scope.invokeApi(ADDepartmentSrv.deleteDepartment, id , successCallbackDelete);
	};
	
	
	
	
	
	
	/*
    * To handle focus event on lov levels
    */
	$scope.onFocus = function(index){
		if((index === $scope.editData.lov.length-1) || ($scope.editData.lov.length==1)){
			$scope.newOptionAvailable = true;
			// exclude first two fields
			if($scope.editData.lov.length > 2){
				angular.forEach($scope.editData.lov,function(item, index) {
					if (item.name == "" && index < $scope.editData.lov.length-1 ) {
						$scope.newOptionAvailable = false;
					}
				});
			}
			if($scope.newOptionAvailable)
				$scope.editData.lov.push({'value':'','name':''});
		}
	};
   /*
    * To handle text change on lov levels
    */
	$scope.textChanged = function(index){

		if($scope.editData.lov.length>1){
			if($scope.editData.lov[index].name == "")
				$scope.editData.lov.splice(index, 1);
		}
	};
   /*
    * To handle blur event on lov levels
    */
	$scope.onBlur = function(index){
		if($scope.editData.lov.length>1){
			if($scope.editData.lov[index].name == "")
				$scope.editData.lov.splice(index, 1);
			angular.forEach($scope.editData.lov,function(item, i) {
				if (item.name == "" && i != $scope.editData.lov.length-1) {
					$scope.editData.lov.splice(i, 1);
				}
			});
		}
	};
	
	
}]);

