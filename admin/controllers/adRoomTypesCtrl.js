admin.controller('ADRoomTypesCtrl',['$scope', '$state', 'ADRoomTypesSrv', 'ngTableParams','$filter',  function($scope, $state, ADRoomTypesSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.departmentData = {};
   /*
    * To fetch list of departments
    */
	$scope.listRoomTypes = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
			console.log($scope.data);
			// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.room_types.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.room_types.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.room_types, params.orderBy()) :
		                                $scope.data.room_types;
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });
			
			
			
		};
		$scope.invokeApi(ADRoomTypesSrv.fetch, {} , successCallbackFetch);	
	};
	//To list departments
	$scope.listRoomTypes(); 
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
}]);

