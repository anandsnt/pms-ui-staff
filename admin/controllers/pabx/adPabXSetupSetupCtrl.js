admin.controller('adPabXSetupSetupCtrl', ['$scope', 'pabxSetupValues', 'adPabXSetupSrv', function($scope, pabxSetupValues, adPabXSetupSrv){
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable pabx 
	 * @return {undefiend}
	 */
	$scope.togglePabXEnabled = function() {
		$scope.pabx.enabled = !$scope.pabx.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfSavePabXSetup = function(data) {
		$scope.goBackToPreviousState();
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.savePabXSetup = function() {
		var params 	= {
			pabx: _.omit( dclone($scope.pabx), 'charge_name')
		};

		if (!$scope.pabx.enabled) {
			params 	= _.omit(params, 'charge_code_id', 'account_number');
		}
        var options = {
            params 			: params,
            successCallBack : successCallBackOfSavePabXSetup
        };
        $scope.callAPI(adPabXSetupSrv.savePabXConfiguration, options);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = function() {
		$scope.pabx = {};
		$scope.pabx.enabled = pabxSetupValues.enabled;
	}();
}])