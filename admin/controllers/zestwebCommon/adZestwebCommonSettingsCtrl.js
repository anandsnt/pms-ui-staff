admin.controller('ADZestwebCommonSettingsCtrl', ['$scope', '$state', 'zestWebCommonSettings', 'initialFooterSettings', 'ADzestwebCommonSettingsSrv', function($scope, $state, zestWebCommonSettings, initialFooterSettings, ADzestwebCommonSettingsSrv) {

	BaseCtrl.call(this, $scope);

	//zestWebCommonSettings is resolved from router
	$scope.zestCommonSettings = zestWebCommonSettings;

	//In the initial loading, no footers will be there. So set some default values for footers
	//from sample JSON file
	var numberOfFooterItems = 3;

	for (i = 0; i < numberOfFooterItems; i++) {
		//if footer item is not present, create one with default settings
		if (_.isUndefined($scope.zestCommonSettings.zest_web_footer_settings.footers[i])) {
			$scope.zestCommonSettings.zest_web_footer_settings.footers.push(initialFooterSettings);
		}
	}

	/**
	 * [saveSettings description]
	 * @return {[type]} [description]
	 */
	$scope.saveSettings = function() {
		var saveSettingsCallback = function(response) {
			$scope.successMessage = 'Success';
			$scope.zestCommonSettings = response;
		};
		var params = angular.copy($scope.zestCommonSettings);
		var options = {
			params: $scope.zestCommonSettings,
			successCallBack: saveSettingsCallback
		};
		$scope.callAPI(ADzestwebCommonSettingsSrv.saveSettings, options);
	};

}]);