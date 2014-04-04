admin.controller('ADChargeGroupsCtrl',['$scope', 'ADChargeGroupsSrv', function($scope, ADChargeGroupsSrv){

	BaseCtrl.call(this, $scope);
	$scope.editData   = {};
	$scope.currentClickedElement = -1;
	$scope.isAddmode = false;
	$scope.isEditmode = false;
	$scope.addFormView = false;
	$scope.isShowAddNew = false;
    /*
    * To fetch charge groups list
    */
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
	};
	$scope.invokeApi(ADChargeGroupsSrv.fetch, {},fetchSuccessCallback);
	
    /*
    * To render edit screen
    * @param {int} index index of selected charge groups
    * @paran {string} id - charge groups id
    */
	$scope.editItem = function(index,id)	{
		$scope.currentClickedElement = index;
		$scope.editId = id;
		var data = { 'editId' : id };
		var editSuccessCallback = function(data) {
			$scope.editData = data;
		};		
		$scope.invokeApi(ADChargeGroupsSrv.edit,data,editSuccessCallback);
	};
	/*
    * To get the template of edit screen
    * @param {int} index of the selected item
    * @param {string} id of the item
    */
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") return "";
		if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/departments/adDepartmentsEdit.html";
		}
	};
	/*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		$scope.currentClickedElement = -1;
	};	
	$scope.addNewClicked = function(){
		$scope.isShowAddNew = true;
	};
	$scope.closeAddNew = function(){
		$scope.isShowAddNew = false;
	};
  	$scope.saveAddNew = function(){
		$scope.isShowAddNew = false;
	};
	
	
	
}]);

