admin.controller('adBritePabXSetupCtrl', ['$scope', 'britePabXSetupValues', 'adBritePabXSetupSrv', '$timeout',
	function($scope, britePabXSetupValues, adBritePabXSetupSrv, $timeout) {
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable pabx 
	 * @return {undefiend}
	 */
	$scope.toggleBritePabXEnabled = function() {
		$scope.brite.enabled = !$scope.brite.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfSaveBritePabXSetup = function(data) {
		$scope.goBackToPreviousState();
	};

	// if there is any error occured
	$scope.$on("showErrorMessage", function($event, errorMessage) {
		$event.stopPropagation();
		$scope.errorMessage = errorMessage;
	});

	var clearConfigValues = function() {
        $scope.brite.charge_code_id 	= '';
        $scope.brite.charge_code_name 	= '';
	};	
	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.savePabXSetup = function() {
		var params 	= {
			brite: _.omit( dclone($scope.brite), 'charge_code_name')
		};

		if (!$scope.brite.enabled) {
			params.brite = _.omit(params.brite, 'charge_code_id', 'account_number');
		}

		if (params.brite.charge_code_id === '') {
			$timeout(function() {
				$scope.errorMessage = ['Please search a charge code, pick from the list and proceed'];
				clearConfigValues();
			}, 20);
			return;
		}

        var options = {
            params 			: params,
            successCallBack : successCallBackOfSaveBritePabXSetup
        };
        $scope.callAPI(adBritePabXSetupSrv.saveBritePabXConfiguration, options);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = function() {
		$scope.brite = britePabXSetupValues;
	}();
}])