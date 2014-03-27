
admin.controller('ADHotelDetailsCtrl', ['$rootScope', '$scope', 'ADHotelDetailsSrv','$stateParams', function($rootScope, $scope, ADHotelDetailsSrv, $stateParams){
	$scope.isAdminSnt = false;
	$scope.isEdit = false;
	BaseCtrl.call(this, $scope);
	
	if($stateParams.action == "add"){
		var fetchSuccess = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
			$scope.$emit('hideLoader');
		};
		
		$scope.invokeApi(ADHotelDetailsSrv.fetchAddData, {}, fetchSuccess, fetchFailed);
	}
	else if($stateParams.action == "edit"){
		
		var fetchSuccess = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADHotelDetailsSrv.fetchEditData, {'id':$stateParams.id}, fetchSuccess, fetchFailed);
		$scope.isEdit = true;
	}
	
	if($rootScope.adminRole == "snt-admin"){
		$scope.isAdminSnt = true;
	}

	$scope.clickedTestMliConnectivity = function(){
		console.log("clickedTestMliConnectivity");
	};
	
	$scope.clickedSave = function(){
		
		var fetchSuccess = function(){
			console.log("post successfully");
			$scope.$emit('hideLoader');
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
			$scope.$emit('hideLoader');
		};
		
		if($scope.isEdit) ADHotelDetailsSrv.updateHotelDeatils($scope.data).then(fetchSuccess, fetchFailed);
		else ADHotelDetailsSrv.addNewHotelDeatils($scope.data).then(fetchSuccess, fetchFailed);
	};
	
	$scope.clickedCancel = function(){
		console.log("clickedCancel");
	};
	
	$scope.toggleClicked = function(){
		$scope.data.is_pms_tokenized = ($scope.data.is_pms_tokenized == 'true') ? 'false' : 'true';
	};

}]);