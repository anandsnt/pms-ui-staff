admin.controller('adGustoPOSSetupCtrl', ['$scope', 'gustoSetupValues', 'adGustoPOSSetupSrv', '$timeout',
	function($scope, gustoSetupValues, adGustoPOSSetupSrv, $timeout) {
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable pabx 
	 * @return {undefiend}
	 */
	$scope.toggleGustoPOSEnabled = function() {
		$scope.gusto.enabled = !$scope.gusto.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfgustoPOSSetup = function(data) {
		$scope.goBackToPreviousState();
	};

	// if there is any error occured
	$scope.$on("showErrorMessage", function($event, errorMessage) {
		$event.stopPropagation();
		$scope.errorMessage = errorMessage;
	});

	var clearConfigValues = function() {
        $scope.gusto.charge_code_id 	= '';
        $scope.gusto.charge_code_name 	= '';
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.saveGustoPOSSetup = function() {
		var params 	= {
			gusto: _.omit( dclone($scope.gusto), 'charge_code_name' )
		};

		if (!$scope.gusto.enabled) {
			params.gusto = _.pick(params.gusto, 'enabled');
		}

		if (params.gusto.charge_code_id === '') {
			$timeout(function() {
				$scope.errorMessage = ['Please search a charge code, pick from the list and proceed'];
				clearConfigValues();
			}, 20);
			return;
		}

        var options = {
            params: params,
            successCallBack: successCallBackOfgustoPOSSetup
        };

        $scope.callAPI(adGustoPOSSetupSrv.saveGustoPOSConfiguration, options);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = (function() {
		$scope.gusto = gustoSetupValues;
	}());
}]);