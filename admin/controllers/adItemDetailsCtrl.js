admin.controller('ADItemDetailsCtrl', ['$scope','ADItemSrv', '$state','$stateParams', function($scope, ADItemSrv, $state, $stateParams){
	/*
	* Controller class for Room List
	*/

	$scope.errorMessage = '';
	$scope.mod = 'edit'
	
	//inheriting from base controller
	BaseCtrl.call(this, $scope);
	
	
	var itemId = $stateParams.itemid;
	//if itemid is null, means it is for add item form
	if(typeof itemId === 'undefined' || itemId.trim() == ''){
		$scope.mod = 'add';
	}

	var fetchSuccessOfItemDetails = function(data){
		$scope.$emit('hideLoader');
		$scope.itemDetails = data;
	};
	
	var fetchFailedOfItemDetails = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};
	if($scope.mod == 'edit'){
		$scope.invokeApi(ADItemSrv.getItemDetails, {'item_id': itemId}, fetchSuccessOfItemDetails, fetchFailedOfItemDetails);
	}
	else{
		$scope.invokeApi(ADItemSrv.addItemDetails, {}, fetchSuccessOfItemDetails, fetchFailedOfItemDetails);
	}
	

	$scope.goBack = function(){
		$state.go('admin.items');
	}

	$scope.saveItemDetails = function()	{
		var postData = {};
		if($scope.mod == 'edit'){
			postData.value = $scope.itemDetails.item_id;
		}

		postData.is_favorite = $scope.itemDetails.is_favourite;
		postData.item_description = $scope.itemDetails.item_description;
		postData.unit_price = $scope.itemDetails.unit_price;
		postData.charge_code = $scope.itemDetails.selected_charge_code;
		var fetchSuccessOfSaveItemDetails = function(){
			$scope.goBack();
		};
		$scope.invokeApi(ADItemSrv.saveItemDetails, postData, fetchSuccessOfSaveItemDetails);
	}

}]);