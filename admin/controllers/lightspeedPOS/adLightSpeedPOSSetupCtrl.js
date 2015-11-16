admin.controller('adLightSpeedPOSSetupCtrl', ['$scope', 'lightSpeedSetupValues', 'adLightSpeedPOSSetupSrv', '$timeout',
	function($scope, lightSpeedSetupValues, adLightSpeedPOSSetupSrv, $timeout) {
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable pabx 
	 * @return {undefiend}
	 */
	$scope.toggleLightSpeedPOSEnabled = function() {
		$scope.lightspeed.enabled = !$scope.lightspeed.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfLightSpeedPOSSetup = function(data) {
		$scope.goBackToPreviousState();
	};

	// if there is any error occured
	$scope.$on("showErrorMessage", function($event, errorMessage) {
		$event.stopPropagation();
		$scope.errorMessage = errorMessage;
	});

	var clearConfigValues = function() {
        $scope.lightspeed.charge_code_id 	= '';
        $scope.lightspeed.charge_code_name 	= '';
	};

	var successCallBackOfImportProducts = function() {
		$scope.successMessage = 'Successfully imported product & product groups from Lightspeed POS';
	};

	var failureCallBackOfImportProducts = function() {
		$scope.errorMessage = ['Failed to import product & product groups from Lightspeed POS'];
	};
	
	/**
	 * import products from light speed POS
	 * @return {undefined}
	 */
	$scope.importProducts = function() {
        var options = {
            successCallBack : successCallBackOfImportProducts,
            failureCallBack : failureCallBackOfImportProducts
        };
        $scope.callAPI(adLightSpeedPOSSetupSrv.importProductsFromLightspeedPOS, options);
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.saveLightSpeedPOSSetup = function() {
		var params 	= {
			lightspeed: _.omit( dclone($scope.lightspeed), 'charge_code_name' )
		};

		if (!$scope.lightspeed.enabled) {
			params.lightspeed = _.pick(params.lightspeed, 'enabled');
		}

		if (params.lightspeed.charge_code_id === '') {
			$timeout(function() {
				$scope.errorMessage = ['Please search a charge code, pick from the list and proceed'];
				clearConfigValues();
			}, 20);
			return;
		}

        var options = {
            params 			: params,
            successCallBack : successCallBackOfLightSpeedPOSSetup
        };
        $scope.callAPI(adLightSpeedPOSSetupSrv.saveLightSpeedPOSConfiguration, options);
	};

	/**
	 * @return {Boolean}
	 */
	$scope.shouldEnableImportButton = function() {
		if ($scope.lightspeed.enabled) {
			return false;
		}

		var requiredKeyValuesToEnable = _.pick($scope.lightspeed, 'rover_unique_id', 'charge_code_id', 'url', 'username', 'password');

		console.log (requiredKeyValuesToEnable);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = function() {
		$scope.copy_lightspeed_settings = lightSpeedSetupValues;
		$scope.lightspeed = lightSpeedSetupValues;
	}();
}])