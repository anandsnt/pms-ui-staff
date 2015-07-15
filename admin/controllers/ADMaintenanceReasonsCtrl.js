admin.controller('ADMaintenanceReasonsCtrl',['$scope', 'ADMaintenanceReasonsSrv', '$anchorScroll', '$timeout',  '$location',
 function($scope, ADMaintenanceReasonsSrv, $anchorScroll, $timeout, $location){

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 4);
	$scope.currentClickedElement = -1;
	$scope.preveousName = "";
    /*
    * To fetch Maintenance Reasons list
    */
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
	};
	$scope.invokeApi(ADMaintenanceReasonsSrv.fetch, {},fetchSuccessCallback);

    /*
    * To render edit screen
    * @param {int} index index of selected Maintenance Reasons
    * @paran {string} id - Maintenance Reasons id
    */
	$scope.editItem = function(index)	{
		$scope.currentClickedElement = index;
		$scope.preveousName = $scope.data.maintenance_reasons[index].name;
	};
	/*
    * To get the template of edit screen
    * @param {int} index of the selected item
    * @param {string} id of the item
    */
	$scope.getTemplateUrl = function(index){
		if($scope.currentClickedElement === index){
			 return "/assets/partials/maintenanceReasons/adMaintenanceReasonsEdit.html";
		}
	};
	/*
    * To handle cancel click
    */
	$scope.clickedCancel = function(){
		if($scope.currentClickedElement != 'new'){
			$scope.data.maintenance_reasons[$scope.currentClickedElement].name = $scope.preveousName;
			$scope.preveousName = "";
		}
		$scope.data.name = "";
		$scope.currentClickedElement = -1;
	};
	/*
    * To handle add new button click
    */
	$scope.addNewClicked = function(){
		$scope.currentClickedElement = 'new';
		$timeout(function() {
            $location.hash('add-new');
            $anchorScroll();
    	});
	};
	/*
    * To handle save button in add new box.
    */
  	$scope.saveAddNew = function(){
  		var postSuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
			$scope.data.name = "";
			$scope.data.maintenance_reasons.push(data);
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
 		var data = $scope.data.maintenance_reasons[$scope.currentClickedElement];
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
			angular.forEach($scope.data.maintenance_reasons,function(item, index) {
	 			if (item.value === id) {
	 				$scope.data.maintenance_reasons.splice(index, 1);
	 			}
 			});
		};
		$scope.invokeApi(ADMaintenanceReasonsSrv.deleteItem, {'value':id }, successDeletionCallback);
	};

}]);

