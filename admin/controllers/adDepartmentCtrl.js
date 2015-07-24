admin.controller('ADDepartmentListCtrl',['$scope', '$state', 'ADDepartmentSrv', '$location', '$anchorScroll', '$timeout',  function($scope, $state, ADDepartmentSrv, $location, $anchorScroll, $timeout){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.departmentData = {};
	$scope.isAddMode = false;
   /*
    * To fetch list of departments
    */
	$scope.listDepartments = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
			$scope.isAddMode = false;
		};
		$scope.invokeApi(ADDepartmentSrv.fetch, {} , successCallbackFetch);
	};
	//To list departments
	$scope.listDepartments();
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
	$scope.addNew = function()	{
		$scope.departmentData={};
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
		if(typeof index === "undefined" || typeof id === "undefined") {
			return "";
		}
		if($scope.currentClickedElement === index){
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
	 		$scope.currentClickedElement = -1;
	 	};
		$scope.invokeApi(ADDepartmentSrv.deleteDepartment, id , successCallbackDelete);
	};
}]);

