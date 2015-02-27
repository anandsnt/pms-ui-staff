admin.controller('ADEmvTerminalDetailsCtrl', ['$scope','$rootScope','ADEmvTerminalsSrv', '$state','$stateParams', function($scope, $rootScope, ADEmvTerminalsSrv, $state, $stateParams){
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
		$scope.invokeApi(ADEmvTerminalsSrv.getItemDetails, {'item_id': itemId}, fetchSuccessOfItemDetails, fetchFailedOfItemDetails);	
	}
	
	$scope.goBack = function(){
		$state.go('admin.emvTerminals');  
	}

	$scope.saveItemDetails = function()	{
		var postData = {};
		if($scope.mod == 'edit'){
			postData.id = $scope.itemDetails.id;			
		}

		postData.name = $scope.itemDetails.name;
		postData.terminal_identifier = $scope.itemDetails.terminal_identifier;

		var fetchSuccessOfSaveItemDetails = function(){
			$scope.goBack();
			$rootScope.$emit("UPDATELIST");
		};	
		
		if($scope.mod == 'edit'){
			$scope.invokeApi(ADEmvTerminalsSrv.updateItemDetails, postData, fetchSuccessOfSaveItemDetails);
		}
		else{	
			$scope.invokeApi(ADEmvTerminalsSrv.saveItemDetails, postData, fetchSuccessOfSaveItemDetails);	
		}
	}

}]);