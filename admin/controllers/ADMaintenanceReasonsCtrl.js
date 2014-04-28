admin.controller('ADChargeGroupsCtrl',['$scope', 'ADMaintenanceReasonsSrv', function($scope, ADMaintenanceReasonsSrv){

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	$scope.currentClickedElement = -1;
    /*
    * To fetch charge groups list
    */
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
	};
	$scope.invokeApi(ADMaintenanceReasonsSrv.fetch, {},fetchSuccessCallback);
	
    /*
    * To render edit screen
    * @param {int} index index of selected charge groups
    * @paran {string} id - charge groups id
    */
	$scope.editItem = function(index)	{
		$scope.currentClickedElement = index;
	};
	/*
    * To get the template of edit screen
    * @param {int} index of the selected item
    * @param {string} id of the item
    */
	$scope.getTemplateUrl = function(index){
		if($scope.currentClickedElement == index){ 
			 return "/assets/partials/maintenanceReasons/adMaintenanceReasonsEdit.html";
		}
	};
	/*
    * To handle cancel click
    */	
	$scope.clickedCancel = function(){
		$scope.currentClickedElement = -1;
	};
	/*
    * To handle add new button click
    */
	$scope.addNewClicked = function(){
		$scope.currentClickedElement = 'new';
	};
	/*
    * To handle save button in add new box.
    */
  	$scope.saveAddNew = function(){
  		var postSuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
			$scope.data.name = "";
			$scope.data.charge_groups.push(data);
		};
  		$scope.invokeApi(ADMaintenanceReasonsSrv.save, { 'name' : $scope.data.name }, postSuccess);
	};
	/*
    * To handle save button in edit box.
    */
   	$scope.updateItem = function(){
   		var postSuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
		};
 		var data = $scope.data.charge_groups[$scope.currentClickedElement];
  		$scope.invokeApi(ADMaintenanceReasonsSrv.update, data, postSuccess);
   	};
   	/*
    * To handle delete button in edit box and list view.
    */
	$scope.clickedDelete = function(id){
		var successDeletionCallback = function(){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
			// delete data from scope
			angular.forEach($scope.data.charge_groups,function(item, index) {
	 			if (item.value == id) {
	 				$scope.data.charge_groups.splice(index, 1);
	 			}
 			});
		};
		$scope.invokeApi(ADMaintenanceReasonsSrv.deleteItem, {'value':id }, successDeletionCallback);
	};
	
}]);

