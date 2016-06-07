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

	var clearPaymentChargeCodeValues = function(){
		$scope.lightspeed.payment_charge_code_id 	= '';
		$scope.lightspeed.payment_charge_code_name 	= '';
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.saveLightSpeedPOSSetup = function() {
		var params 	= {
			lightspeed: _.omit( dclone($scope.lightspeed), 'charge_code_name' , 'payment_charge_code_name')
		};

		if (!$scope.lightspeed.enabled) {
			params.lightspeed = _.pick(params.lightspeed, 'enabled');
		}

		if (params.lightspeed.charge_code_id === '') {
			$timeout(function() {
				$scope.errorMessage = ['Please search a default charge code, pick from the list and proceed'];
				clearConfigValues();
			}, 20);
			return;
		}

		if (!params.lightspeed.payment_charge_code_id) {
			$timeout(function() {
				$scope.errorMessage = ['Please search a default payment code, pick from the list and proceed'];
				clearPaymentChargeCodeValues();
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
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = function() {
		$scope.lightspeed = lightSpeedSetupValues;
	}();
}])