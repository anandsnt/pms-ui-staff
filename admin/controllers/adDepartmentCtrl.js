admin.controller('ADDepartmentListCtrl',['$scope', '$state', 'ADDepartmentSrv',  function($scope, $state, ADDepartmentSrv){
	
	$scope.errorMessage = '';
	$scope.departmentData = {};
	$scope.isAddMode = false;
	$scope.listDepartments = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
			$scope.isAddMode = false;
			//$scope.addFormView = false; //In case add new is open
		};
		$scope.invokeApi(ADDepartmentSrv.fetch, {} , successCallbackFetch);	
	};
	
		
	$scope.listDepartments(); 
	
	
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
	$scope.addNew = function()	{
		$scope.departmentData={};
		$scope.currentClickedElement = "new";
		$scope.isAddMode = true;
			//$scope.addFormView = true;
	};
	
	//Function to get the template for edit url
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") return "";
		if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/departments/adDepartmentsEdit.html";
		}
		
	
	};

   
   
   $scope.saveDepartment = function(){
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
			if($scope.isAddMode){
    			$scope.data.departments.push(data);
    			console.log($scope.data);
	    	} else {
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
		
	//Previous view if clicked cancel
	$scope.clickCancel = function(){
		$scope.currentClickedElement = -1;
		//$scope.addFormView = false;
	};			
	$scope.deleteDepartment = function(index, id){
		var successCallbackDelete = function(data){	
	 		$scope.$emit('hideLoader');
	 		$scope.data.departments.splice(index, 1);
	 	};
		$scope.invokeApi(ADDepartmentSrv.deleteDepartment, id , successCallbackDelete);
	};

}]);

