admin.controller('ADZestwebCommonSettingsCtrl', ['$scope', '$state', 'zestWebCommonSettings', 'ADzestwebCommonSettingsSrv', function($scope, $state, zestWebCommonSettings, ADzestwebCommonSettingsSrv) {

	BaseCtrl.call(this, $scope);

	$scope.zestCommonSettings = zestWebCommonSettings;

	/**
	 * [saveSettings description]
	 * @return {[type]} [description]
	 */
	$scope.saveSettings = function() {
		var saveSettingsCallback = function() {
			$scope.successMessage = 'Success';
		};
		var options = {
			params: $scope.zestCommonSettings,
			successCallBack: saveSettingsCallback
		};
		$scope.callAPI(ADzestwebCommonSettingsSrv.saveSettings, options);
	};

}]);