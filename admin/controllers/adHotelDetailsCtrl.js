admin.controller('ADHotelDetailsCtrl', [
							'$rootScope',
							'$scope',
							'ADHotelDetailsSrv',
							'$stateParams',
							'$state',
							'ngDialog',
							function($rootScope, $scope, ADHotelDetailsSrv, $stateParams, $state, ngDialog){

	$scope.isAdminSnt = false;
	$scope.isEdit = false;
	$scope.id = $stateParams.id;
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.readOnly = "no";
	$scope.fileName = "Choose File....";
	$scope.hotel_logo_file = $scope.fileName;
	$scope.hotel_template_logo_file = $scope.fileName;
	$scope.certificate = "";
	$scope.isHotelChainEditable =  true;
	//pms start date setting calendar options
	$scope.pmsStartDateOptions = {
	    changeYear: true,
	    changeMonth: true,
	    yearRange: "0:+10",
	    onSelect: function()	 {
	    	ngDialog.close();
	    }
  	};
	if($rootScope.adminRole === "snt-admin"){
		$scope.isHotelChainEditable = false;
		$scope.isAdminSnt = true;
		if($stateParams.action ==="addfromSetup"){
			$scope.previousStateIsDashBoard = true;
		}
		// SNT Admin -To add new hotel view
		if($stateParams.action === "add" || $stateParams.action ==="addfromSetup"){
			$scope.title = "Add New Hotel";

			var fetchSuccess = function(data){
				$scope.data = data.data;
				$scope.data.brands = [];
				$scope.data.is_external_references_import_on = false;
				$scope.data.external_references_import_freq = undefined;
				$scope.data.is_hold_room_import_on = false;
				$scope.data.hold_room_import_freq = undefined;
				$scope.languages = data.languages;
				$scope.$emit('hideLoader');
					$scope.data.check_in_primetime ="AM";
					$scope.data.check_out_primetime = "AM";
			};

			$scope.invokeApi(ADHotelDetailsSrv.fetchAddData, {}, fetchSuccess);
		}
		// SNT Admin -To edit existing hotel view
		else if($stateParams.action === "edit"){
			$scope.isEdit = true;
			$scope.title = "Edit Hotel";
			var fetchSuccess = function(data){
				$scope.data = data.data;
				$scope.languages = data.languages;
				$scope.$emit('hideLoader');
				if(data.mli_pem_certificate_loaded){
					$scope.fileName = "Certificate Attached";
				}
				if($scope.data.check_in_time.primetime === "" || typeof $scope.data.check_in_time.primetime === 'undefined'){
					$scope.data.check_in_time.primetime = "AM";
					$scope.data.check_in_primetime ="AM";
				}
				if($scope.data.check_out_time.primetime === "" || typeof $scope.data.check_out_time.primetime === 'undefined'){
					$scope.data.check_out_time.primetime = "AM";
					$scope.data.check_out_primetime = "AM";
				}
			};
			$scope.invokeApi(ADHotelDetailsSrv.fetchEditData, {'id':$stateParams.id}, fetchSuccess);
		}

	}
	else if($rootScope.adminRole === "hotel-admin"){
		// Hotel Admin -To Edit current hotel view
		$scope.isEdit = true;
		$scope.title = "Edit Hotel";
		$scope.readOnly = "yes";
		var fetchSuccess = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
			$scope.hotelLogoPrefetched = data.hotel_logo;
			$scope.hotelTemplateLogoPrefetched = data.hotel_template_logo;
			if($scope.data.check_in_time.primetime === "" || typeof $scope.data.check_in_time.primetime === 'undefined'){
				$scope.data.check_in_time.primetime = "AM";
				$scope.data.check_in_primetime ="AM";
			}
			if($scope.data.check_out_time.primetime === "" || typeof $scope.data.check_out_time.primetime === 'undefined'){
				$scope.data.check_out_time.primetime = "AM";
				$scope.data.check_out_primetime = "AM";
			}
		};
		$scope.invokeApi(ADHotelDetailsSrv.hotelAdminfetchEditData, {}, fetchSuccess);
	}

	$scope.$watch(
		function(){
		return $scope.data.hotel_template_logo;
	}, function(logo) {
				if(logo === 'false')
					$scope.fileName = "Choose File....";
				$scope.hotel_template_logo_file = $scope.fileName;
			}
		);
	$scope.$watch(function(){
		return $scope.data.hotel_logo;
	}, function(logo) {
				if(logo === 'false')
					$scope.fileName = "Choose File....";
				$scope.hotel_logo_file = $scope.fileName;
			}
		);

	/**
	* function to open calndar popup for choosing pms start date
	*/
	$scope.setPmsStartDate = function(){
		ngDialog.open({
            template: '/assets/partials/hotel/adPmsStartDateCalendarPopup.html',
            className: 'ngdialog ngdialog-theme-default calendar-single1',
            closeByDocument: true,
            scope: $scope
        });
	};

	/**
    *   A post method for Test MliConnectivity for a hotel
    */
	$scope.clickedTestMliConnectivity = function(){

		var postData = {
			"mli_chain_code": $scope.data.mli_chain_code,
			"mli_hotel_code": $scope.data.mli_hotel_code,
			"mli_pem_certificate": $scope.certificate
		};

		var testMliConnectivitySuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.successMessage = "Connection Valid";
		};

		$scope.invokeApi(ADHotelDetailsSrv.testMliConnectivity, postData,testMliConnectivitySuccess);
	};

	/**
    *   A post method for Add New and UPDATE Existing hotel details.
    */
	$scope.clickedSave = function(){
		// SNT Admin - To save Add/Edit data
		if($scope.isAdminSnt){
			var unwantedKeys = ["time_zones","brands","chains","check_in_time","check_out_time","countries","currency_list","pms_types","signature_display","hotel_logo", "languages", "hotel_template_logo"];
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


		/*********** Commented out to fix CICO-8508 ****************************/
		//template logo was not updating when existing image was removed
		/********************************************************************/
			if($scope.data.payment_gateway === "MLI"){

				var unwantedKeys = ["time_zones","brands","chains","check_in_time","check_out_time","countries","currency_list","pms_types","hotel_pms_type","is_single_digit_search","is_pms_tokenized","signature_display","hotel_list","menus","mli_hotel_code","mli_chain_code","mli_access_url", "languages","date_formats", "six_merchant_id", "six_validation_code", "is_external_references_import_on", "external_references_import_freq", "is_hold_room_import_on", "hold_room_import_freq","allow_desktop_swipe","cc_swipe_listening_port"];
			 } else {
			 	var unwantedKeys = ["time_zones","brands","chains","check_in_time","check_out_time","countries","currency_list","pms_types","hotel_pms_type","is_single_digit_search","is_pms_tokenized","signature_display","hotel_list","menus","mli_hotel_code","mli_chain_code","mli_access_url", "languages","date_formats", "mli_payment_gateway_url", "mli_merchant_id", "mli_api_version", "mli_api_key", "mli_site_code", "is_external_references_import_on", "external_references_import_freq", "is_hold_room_import_on", "hold_room_import_freq","allow_desktop_swipe","cc_swipe_listening_port"];
			 }


			var data = dclone($scope.data, unwantedKeys);
			if($scope.hotelLogoPrefetched === data.hotel_logo){
				data.hotel_logo = "";
			}
			if($scope.hotelTemplateLogoPrefetched === data.hotel_template_logo){
				data.hotel_template_logo = "";
			}
			var postSuccess = function(){
				$scope.$emit('hideLoader');
				$state.go('admin.dashboard', {menu: 0});
				$scope.$emit('hotelNameChanged',{"new_name":$scope.data.hotel_name});
				angular.forEach($scope.data.currency_list,function(item, index) {
		       		if (item.id === $scope.data.default_currency) {
		       			$rootScope.currencySymbol = getCurrencySign(item.code);
				 	}
	       		});
			};
			$scope.invokeApi(ADHotelDetailsSrv.updateHotelDeatils, data, postSuccess);
		}
	};

	/**
    *   Method to toggle data for 'is_pms_tokenized' as true/false.
    */
	$scope.toggleClicked = function(){
		$scope.data.is_pms_tokenized = ($scope.data.is_pms_tokenized === 'true') ? 'false' : 'true';
	};
	/**
    *   Method to toggle data for 'is_pms_tokenized' as true/false.
    */
	$scope.doNotUpdateVideoToggleClicked = function(){
		$scope.data.do_not_update_video_checkout = ($scope.data.do_not_update_video_checkout === 'true') ? 'false' : 'true';
	};

    /**
    *   Method to toggle data for 'room_status_per_room_type' as true/false.
    */
	$scope.roomStatusUpdatePerRoomType = function(){
		$scope.data.is_room_status_import_per_room_type_on = ($scope.data.is_room_status_import_per_room_type_on === 'true') ? 'false' : 'true';
	};

	/**
    *   Method to toggle data for 'use_kiosk_entity_id_for_fetch_booking' as true/false.
    */
	$scope.kioskEntityToggleClicked = function(){
		$scope.data.use_kiosk_entity_id_for_fetch_booking = ($scope.data.use_kiosk_entity_id_for_fetch_booking === 'true') ? 'false' : 'true';
	};

	/**
    *   Method to toggle data for 'use_snt_entity_id_for_checkin_checkout' as true/false.
    */
	$scope.sntEntityToggleClicked = function(){
		$scope.data.use_snt_entity_id_for_checkin_checkout = ($scope.data.use_snt_entity_id_for_checkin_checkout === 'true') ? 'false' : 'true';
	};

	/**
    *   to test MLI connectivity.
    */

	$scope.testMLIPaymentGateway = function(){

		var testMLIPaymentGatewaySuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.successMessage = "Connection Valid";
		};

		var testMLIPaymentGatewayError = function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};

		$scope.invokeApi(ADHotelDetailsSrv.testMLIPaymentGateway,{}, testMLIPaymentGatewaySuccess, testMLIPaymentGatewayError);

	};


	/**
    *   Method to go back to previous state.
    */
	$scope.back = function(){

		if($scope.isAdminSnt) {

    		if($scope.previousStateIsDashBoard)
    			$state.go("admin.dashboard",{"menu":0});
    		else{
    			$state.go("admin.hotels");
    		}

		}
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
	/**
    *   To handle change in hotel chain and populate brands accordingly.
    */
	$scope.$watch('data.hotel_chain', function() {
		$scope.data.brands = [];
        angular.forEach($scope.data.chains, function(item, index) {
                if (item.id === $scope.data.hotel_chain) {
                	$scope.data.brands = item.brands;
                }
        });
    });
	/**
    *   To handle show hide status for the logo delete button
    */
    $scope.isLogoAvailable = function(logo){
    	if(logo !== '/assets/logo.png' && logo !== 'false')
    		return true;
    	else return false;
    };

}]);