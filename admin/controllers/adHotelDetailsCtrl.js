admin.controller('ADHotelDetailsCtrl', ['$rootScope', '$scope', 'ADHotelDetailsSrv','$stateParams','$state', function($rootScope, $scope, ADHotelDetailsSrv, $stateParams, $state){

	$scope.isAdminSnt = false;
	$scope.isEdit = false;
	$scope.id = $stateParams.id;
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
	//To add new hotel view
	if($stateParams.action == "add"){
		$scope.title = "Add Hotel";
		
		var fetchSuccess = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
		};
		
		$scope.invokeApi(ADHotelDetailsSrv.fetchAddData, {}, fetchSuccess);
	}
	// To edit existing hotel view
	else if($stateParams.action == "edit"){
		$scope.isEdit = true;
		$scope.title = "Edit Hotel";
		
		var fetchSuccess = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
		};
		
		$scope.invokeApi(ADHotelDetailsSrv.fetchEditData, {'id':$stateParams.id}, fetchSuccess);
	}
	// To set flag for SNT admin
	if($rootScope.adminRole == "snt-admin"){
		$scope.isAdminSnt = true;
	}
	
	/**
    *   A post method for Test MliConnectivity for a hotel
    */
	$scope.clickedTestMliConnectivity = function(){

		var postData = {
			"mli_chain_code": $scope.data.mli_chain_code,
			"mli_hotel_code": $scope.data.mli_hotel_code,
			"mli_pem_certificate": $scope.certificate
		};
		
		$scope.invokeApi(ADHotelDetailsSrv.testMliConnectivity, postData);
	};
	
	/**
    *   A post method for Add New and UPDATE Existing hotel details.
    */
	$scope.clickedSave = function(){
		
		var unwantedKeys = ["time_zones","brands","chains","check_in_time","check_out_time","countries","currency_list","pms_types","signature_display","hotel_logo"];
		var data = dclone($scope.data, unwantedKeys);
		
		if($scope.isEdit) $scope.invokeApi(ADHotelDetailsSrv.updateHotelDeatils, data);
		else $scope.invokeApi(ADHotelDetailsSrv.addNewHotelDeatils, data);
	};
	
	/**
    *   Method to toggle data for 'is_pms_tokenized' as true/false.
    */
	$scope.toggleClicked = function(){
		$scope.data.is_pms_tokenized = ($scope.data.is_pms_tokenized == 'true') ? 'false' : 'true';
	};

}]);