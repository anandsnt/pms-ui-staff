admin.controller('ADHotelDetailsCtrl', ['$rootScope', '$scope', 'ADHotelDetailsSrv','$stateParams','$state', function($rootScope, $scope, ADHotelDetailsSrv, $stateParams, $state){

	$scope.isAdminSnt = false;
	$scope.isEdit = false;
	$scope.id = $stateParams.id;
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.readOnly = "no";
	$scope.fileName = "Choose File....";
	$scope.certificate = "";
	if($rootScope.adminRole == "snt-admin"){
		
		$scope.isAdminSnt = true;
		// SNT Admin -To add new hotel view
		if($stateParams.action == "add"){
			$scope.title = "Add New Hotel";
			
			var fetchSuccess = function(data){
			
				$scope.data = data;
				$scope.$emit('hideLoader');
					$scope.data.check_in_primetime ="AM";
					$scope.data.check_out_primetime = "AM";
			};
			
			$scope.invokeApi(ADHotelDetailsSrv.fetchAddData, {}, fetchSuccess);
		}
		// SNT Admin -To edit existing hotel view
		else if($stateParams.action == "edit"){
			$scope.isEdit = true;
			$scope.title = "Edit Hotel";
			var fetchSuccess = function(data){
				console.log(JSON.stringify(data));
				$scope.data = data.data;
				$scope.$emit('hideLoader');
				console.log(data.mli_pem_certificate_loaded);
				if(data.mli_pem_certificate_loaded){
					$scope.fileName = "Certificate Attached";
				}
				if($scope.data.check_in_time.primetime == "" || typeof $scope.data.check_in_time.primetime === 'undefined'){
					$scope.data.check_in_time.primetime = "AM";
					$scope.data.check_in_primetime ="AM";
				}
				if($scope.data.check_out_time.primetime == "" || typeof $scope.data.check_out_time.primetime === 'undefined'){
					$scope.data.check_out_time.primetime = "AM";
					$scope.data.check_out_primetime = "AM";
				}
			};
			$scope.invokeApi(ADHotelDetailsSrv.fetchEditData, {'id':$stateParams.id}, fetchSuccess);
		}
	
	}
	else if($rootScope.adminRole == "hotel-admin"){
		// Hotel Admin -To Edit current hotel view
		$scope.isEdit = true;
		$scope.title = "Edit Hotel";
		$scope.readOnly = "yes";
		var fetchSuccess = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
			$scope.hotelLogoPrefetched = data.hotel_logo;
			if($scope.data.check_in_time.primetime == "" || typeof $scope.data.check_in_time.primetime === 'undefined'){
				$scope.data.check_in_time.primetime = "AM";
				$scope.data.check_in_primetime ="AM";
			}
			if($scope.data.check_out_time.primetime == "" || typeof $scope.data.check_out_time.primetime === 'undefined'){
				$scope.data.check_out_time.primetime = "AM";
				$scope.data.check_out_primetime = "AM";
			}
		};
		$scope.invokeApi(ADHotelDetailsSrv.hotelAdminfetchEditData, {}, fetchSuccess);
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
		// SNT Admin - To save Add/Edit data
		if($scope.isAdminSnt){
			var unwantedKeys = ["time_zones","brands","chains","check_in_time","check_out_time","countries","currency_list","pms_types","signature_display","hotel_logo", "languages"];
			var data = dclone($scope.data, unwantedKeys);
			data.mli_certificate = $scope.certificate;
			var postSuccess = function(){
				$scope.$emit('hideLoader');
				$state.go("admin.hotels");
			};
			
			if($scope.isEdit) $scope.invokeApi(ADHotelDetailsSrv.updateHotelDeatils, data, postSuccess);
			else $scope.invokeApi(ADHotelDetailsSrv.addNewHotelDeatils, data, postSuccess);
		}
		// Hotel Admin -To save Edit data
		else{
			var unwantedKeys = ["time_zones","brands","chains","check_in_time","check_out_time","countries","currency_list","pms_types","hotel_pms_type","is_pms_tokenized","signature_display","hotel_list","menus","mli_hotel_code","mli_chain_code","mli_access_url", "languages"];
			
			var data = dclone($scope.data, unwantedKeys);
			if($scope.hotelLogoPrefetched == data.hotel_logo){ 
				data.hotel_logo = "";
			}
			var postSuccess = function(){
				$scope.$emit('hideLoader');
				$state.go('admin.dashboard', {menu: 0});
			};
			$scope.invokeApi(ADHotelDetailsSrv.updateHotelDeatils, data, postSuccess);
		}
	};
	
	/**
    *   Method to toggle data for 'is_pms_tokenized' as true/false.
    */
	$scope.toggleClicked = function(){
		$scope.data.is_pms_tokenized = ($scope.data.is_pms_tokenized == 'true') ? 'false' : 'true';
	};
	/**
    *   Method to go back to previous state.
    */
	$scope.back = function(){
		if($scope.isAdminSnt) $state.go("admin.hotels");
		else {
			if($rootScope.previousStateParam){
				$state.go($rootScope.previousState, { menu:$rootScope.previousStateParam});
			}
			else if($rootScope.previousState){
				$state.go($rootScope.previousState);
			}
			else 
			{
				$state.go('admin.dashboard', {menu : 0});
			}
		}
	};
	
}]);