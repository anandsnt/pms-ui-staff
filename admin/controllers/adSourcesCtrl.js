admin.controller('ADSourcesCtrl',['$scope', 'ADSourcesSrv', function($scope, ADSourcesSrv){

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 7);
	$scope.currentClickedElement = -1;
    /*
    * To fetch charge sources list
    */
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
	};
	$scope.invokeApi(ADSourcesSrv.fetch, {},fetchSuccessCallback);
	/*
    * To handle nable/disable of use sources
    */
	$scope.clickedUsedMarkets = function(){
		$scope.invokeApi(ADSourcesSrv.toggleUsedMarkets, {'is_use_markets':$scope.data.is_use_sources });
	};
    /*
    * To render edit screen
    * @param {int} index index of selected sources
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
			 return "/assets/partials/sources/adSourcesEdit.html";
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
			$scope.data.sources.push(data);
		};
  		$scope.invokeApi(ADSourcesSrv.save, { 'name' : $scope.data.name }, postSuccess);
	};
	/*
    * To handle save button in edit box.
    */
   	$scope.updateItem = function(index){
   		var postSuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
		};
		if(index == undefined) var data = $scope.data.sources[$scope.currentClickedElement];
		else var data = $scope.data.sources[index];
		
  		$scope.invokeApi(ADSourcesSrv.update, data, postSuccess);
   	};
   	/*
    * To handle delete button in edit box and list view.
    */
	$scope.clickedDelete = function(id){
		var successDeletionCallback = function(){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
			// delete data from scope
			angular.forEach($scope.data.sources,function(item, index) {
	 			if (item.value == id) {
	 				$scope.data.sources.splice(index, 1);
	 			}
 			});
		};
		$scope.invokeApi(ADSourcesSrv.deleteItem, {'value':id }, successDeletionCallback);
	};
	
}]);

