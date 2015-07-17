admin.controller('ADMarketsCtrl',['$scope', 'ADMarketsSrv', '$anchorScroll', '$timeout', '$location',
	function($scope, ADMarketsSrv, $anchorScroll, $timeout, $location){

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 7);
	$scope.currentClickedElement = -1;
	$scope.preveousItem = "";
    /*
    * To fetch charge markets list
    */
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
	};
	$scope.invokeApi(ADMarketsSrv.fetch, {},fetchSuccessCallback);
	/*
    * To handle nable/disable of use markets
    */
	$scope.clickedUsedMarkets = function(){
		$scope.invokeApi(ADMarketsSrv.toggleUsedMarkets, {'is_use_markets':$scope.data.is_use_markets });
	};
    /*
    * To render edit screen
    * @param {int} index index of selected markets
    */
	$scope.editItem = function(index)	{
		$scope.currentClickedElement = index;
		$scope.preveousItem = $scope.data.markets[index].name;
	};
	/*
    * To get the template of edit screen
    * @param {int} index of the selected item
    */
	$scope.getTemplateUrl = function(index){
		if($scope.currentClickedElement === index){
			 return "/assets/partials/markets/adMarketsEdit.html";
		}
	};
	/*
    * To handle cancel click
    */
	$scope.clickedCancel = function(){
		if($scope.currentClickedElement !== 'new'){
			$scope.data.markets[$scope.currentClickedElement].name = $scope.preveousItem;
			$scope.preveousItem = "";
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
			$scope.data.markets.push(data);
		};
  		$scope.invokeApi(ADMarketsSrv.save, { 'name' : $scope.data.name }, postSuccess);
	};
	/*
    * To handle save button in edit box.
    */
   	$scope.updateItem = function(index){
   		var postSuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
		};
		if(index === undefined) {
			var data = $scope.data.markets[$scope.currentClickedElement];
		}
		else {
			var data = $scope.data.markets[index];
		}
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
	 			if (item.value === id) {
	 				$scope.data.markets.splice(index, 1);
	 			}
 			});
		};
		$scope.invokeApi(ADMarketsSrv.deleteItem, {'value':id }, successDeletionCallback);
	};

}]);

