admin.controller('ADHotelDetailsCtrl', ['$rootScope', '$scope', 'ADHotelDetailsSrv','$stateParams','$state', function($rootScope, $scope, ADHotelDetailsSrv, $stateParams, $state){

	$scope.isAdminSnt = false;
	$scope.isEdit = false;
	$scope.id = $stateParams.id;
	BaseCtrl.call(this, $scope);
	
	if($stateParams.action == "add"){
		$scope.title = "Add Hotel";
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
		$scope.isEdit = true;
		$scope.title = "Edit Hotel";
		var fetchSuccess = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADHotelDetailsSrv.fetchEditData, {'id':$stateParams.id}, fetchSuccess, fetchFailed);
	}
	
	if($rootScope.adminRole == "snt-admin"){
		$scope.isAdminSnt = true;
	}
	
	$scope.clickedTestMliConnectivity = function(){
		console.log("clickedTestMliConnectivity"+$scope.fileread);
		
		var postData = {
			"mli_chain_code": $scope.data.mli_chain_code,
			"mli_hotel_code": $scope.data.mli_chain_code,
			"mli_pem_certificate": $scope.value
		};
		var postSuccess = function(){
			console.log("post successfully");
			$scope.$emit('hideLoader');
		};
		
		var postFailed = function(){
			console.log("fetchFailed");
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADHotelDetailsSrv.testMliConnectivity, postData, postSuccess, postFailed);
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
	

		var unwanted_keys = ["time_zones","brands","chains","check_in_time","check_out_time","countries","currency_list","pms_types","signature_display","hotel_logo"];
		var data = dclone($scope.data, unwanted_keys);
		
		if($scope.isEdit) $scope.invokeApi(ADHotelDetailsSrv.updateHotelDeatils, data, fetchSuccess, fetchFailed);
		else $scope.invokeApi(ADHotelDetailsSrv.addNewHotelDeatils, data, fetchSuccess, fetchFailed);

	};
	$scope.clickedUserSetup = function(){
		$state.go("admin.users");
	};
	
	$scope.clickedCancel = function(){
		console.log("clickedCancel");
	};
	
	$scope.toggleClicked = function(){
		$scope.data.is_pms_tokenized = ($scope.data.is_pms_tokenized == 'true') ? 'false' : 'true';
	};

}]);