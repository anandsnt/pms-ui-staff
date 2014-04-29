admin.controller('ADMarketsCtrl',['$scope', 'ADMarketsSrv', function($scope, ADMarketsSrv){

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	$scope.currentClickedElement = -1;
    /*
    * To fetch charge markets list
    */
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
	};
	$scope.invokeApi(ADMarketsSrv.fetch, {},fetchSuccessCallback);
	
    /*
    * To render edit screen
    * @param {int} index index of selected markets
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
			 return "/assets/partials/markets/adMarketsEdit.html";
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
			$scope.data.markets.push(data);
		};
  		$scope.invokeApi(ADMarketsSrv.save, { 'name' : $scope.data.name }, postSuccess);
	};
	/*
    * To handle save button in edit box.
    */
   	$scope.updateItem = function(){
   		var postSuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
		};
 		var data = $scope.data.markets[$scope.currentClickedElement];
  		$scope.invokeApi(ADMarketsSrv.update, data, postSuccess);
   	};
   	/*
    * To handle delete button in edit box and list view.
    */
	$scope.clickedDelete = function(id){
		var successDeletionCallback = function(){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
			// delete data from scope
			angular.forEach($scope.data.markets,function(item, index) {
	 			if (item.value == id) {
	 				$scope.data.markets.splice(index, 1);
	 			}
 			});
		};
		$scope.invokeApi(ADMarketsSrv.deleteItem, {'value':id }, successDeletionCallback);
	};
	
}]);

