admin.controller('ADSourcesCtrl',['$scope', 'ADSourcesSrv', '$anchorScroll', '$timeout', '$location',
	function($scope, ADSourcesSrv, $anchorScroll, $timeout, $location){

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 7);
	$scope.currentClickedElement = -1;
	$scope.preveousName = "";
    /*
    * To fetch charge sources list
    */
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
	};
	$scope.invokeApi(ADSourcesSrv.fetch, {},fetchSuccessCallback);
	/*
    * To handle enable/disable of use sources
    */
	$scope.clickedUsedSources = function(){
		$scope.invokeApi(ADSourcesSrv.toggleUsedSources, {'is_use_sources':$scope.data.is_use_sources });
	};
    /*
    * To render edit screen
    * @param {int} index index of selected source
    */
	$scope.editItem = function(index)	{
		$scope.currentClickedElement = index;
		$scope.preveousName = $scope.data.sources[index].name;
	};
	/*
    * To get the template of edit screen
    * @param {int} index of the selected source
    */
	$scope.getTemplateUrl = function(index){
		if($scope.currentClickedElement === index){
			 return "/assets/partials/sources/adSourcesEdit.html";
		}
	};
	/*
    * To handle cancel click
    */
	$scope.clickedCancel = function(){
		if($scope.currentClickedElement != 'new'){
			$scope.data.sources[$scope.currentClickedElement].name = $scope.preveousName;
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
		if(index === undefined) var data = $scope.data.sources[$scope.currentClickedElement];
		else var data = $scope.data.sources[index];

  		$scope.invokeApi(ADSourcesSrv.update, data, postSuccess);
   	};
   	/*
    * To handle delete button in edit box.
    */
	$scope.clickedDelete = function(id){
		var successDeletionCallback = function(){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
			// delete data from scope
			angular.forEach($scope.data.sources,function(item, index) {
	 			if (item.value === id) {
	 				$scope.data.sources.splice(index, 1);
	 			}
 			});
		};
		$scope.invokeApi(ADSourcesSrv.deleteItem, {'value':id }, successDeletionCallback);
	};

}]);

