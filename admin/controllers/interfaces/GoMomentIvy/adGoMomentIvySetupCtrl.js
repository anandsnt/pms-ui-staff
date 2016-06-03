admin.controller('adGoMomentIvySetupCtrl', ['$scope', 'goMomentIvySetupValues', 'adGoMomentIvySetupSrv', function($scope, goMomentIvySetupValues, adGoMomentIvySetupSrv){
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable GoMomentIvy 
	 * @return {undefiend}
	 */
	$scope.toggleGoMomentIvyEnabled = function() {
		$scope.goMomentIvy.enabled = !$scope.goMomentIvy.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfSaveGoMomentIvySetup = function(data) {
		$scope.goBackToPreviousState();
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.saveGoMomentIvySetup = function() {
		var params 	= {
			goMomentIvy: $scope.goMomentIvy.enabled ? $scope.goMomentIvy : _.pick($scope.goMomentIvy, 'enabled')
		};
        var options = {
            params 			: params,
            successCallBack : successCallBackOfSaveGoMomentIvySetup
        };
        $scope.callAPI(adGoMomentIvySetupSrv.saveGoMomentIvyConfiguration, options);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = function() {
		$scope.goMomentIvy = {};
		$scope.goMomentIvy.enabled = goMomentIvySetupValues.enabled;
	}();
}])