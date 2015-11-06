admin.controller('adBritePabXSetupCtrl', ['$scope', 'britePabXSetupValues', 'adBritePabXSetupSrv', function($scope, britePabXSetupValues, adBritePabXSetupSrv){
	
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

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.savePabXSetup = function() {
		var params 	= {
			brite: _.omit( dclone($scope.brite), 'charge_name')
		};

		if (!$scope.brite.enabled) {
			params 	= _.omit(params, 'charge_code_id', 'account_number');
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