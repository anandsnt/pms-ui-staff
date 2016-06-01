admin.controller('ADM3BackOfficeCtrl', ['$scope', 'afasSetupValues', 'ADM3SetupSrv', function($scope, afasSetupValues, adAfasSetupSrv){
	BaseCtrl.call (this, $scope);

	/**
	 * when clicked on check box to enable/diable letshare 
	 * @return {undefiend}
	 */
	$scope.toggleAfasEnabled = function() {
		$scope.afas.enabled = !$scope.afas.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfSaveAfasSetup = function(data) {
		$scope.goBackToPreviousState();
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.saveAfasSetup = function() {
		var params 	= {
			afas: $scope.afas
		};
        var options = {
            params 			: params,
            successCallBack : successCallBackOfSaveAfasSetup
        };
        $scope.callAPI(adAfasSetupSrv.saveConfig, options);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = function() {
		$scope.afas = {};
		$scope.afas.enabled = afasSetupValues.enabled;
		$scope.afas.emails = afasSetupValues.emails;
	}();
}])