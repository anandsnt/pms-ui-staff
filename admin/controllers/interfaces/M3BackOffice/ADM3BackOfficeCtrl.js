admin.controller('ADM3BackOfficeCtrl', ['$scope', 'm3AccountingSetupValues', 'ADM3SetupSrv', function($scope, m3AccountingSetupValues, ADM3SetupSrv){
	BaseCtrl.call (this, $scope);

	/**
	 * when clicked on check box to enable/diable letshare
	 * @return {undefiend}
	 */
	$scope.toggleActivation = function() {
		$scope.m3Accounting.enabled = !$scope.m3Accounting.enabled;
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
	$scope.saveSetup = function() {
        var options = {
            params: {
                enabled: $scope.m3Accounting.enabled,
                emails: $scope.m3Accounting.emails
            },
            successCallBack: successCallBackOfSaveAfasSetup
        };
        $scope.callAPI(ADM3SetupSrv.saveConfig, options);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = function() {
		$scope.m3Accounting = {
			enabled : m3AccountingSetupValues.enabled,
		    emails : m3AccountingSetupValues.emails
		};
	}();
}])