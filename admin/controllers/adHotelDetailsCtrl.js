
admin.controller('ADHotelDetailsCtrl', ['$rootScope', '$scope', 'ADHotelDetailsSrv','$stateParams', function($rootScope, $scope, ADHotelDetailsSrv, $stateParams){
	$scope.isAdminSnt = false;
	$scope.isEdit = false;
	
	if($stateParams.action == "add"){
		var fetchSuccess = function(data){
			$scope.data = data;
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
		};
		ADHotelDetailsSrv.fetchAddData().then(fetchSuccess, fetchFailed);
	}
	else if($stateParams.action == "edit"){
		
		var fetchSuccess = function(data){
			$scope.data = data;
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
		};
		
		ADHotelDetailsSrv.fetchEditData($stateParams.id).then(fetchSuccess, fetchFailed);
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
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
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