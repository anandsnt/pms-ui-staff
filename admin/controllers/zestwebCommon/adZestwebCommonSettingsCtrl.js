admin.controller('ADZestwebCommonSettingsCtrl', ['$scope', '$state', 'zestWebCommonSettings', 'ADzestwebCommonSettingsSrv', function($scope, $state, zestWebCommonSettings , ADzestwebCommonSettingsSrv) {

	BaseCtrl.call(this, $scope);

	//zestWebCommonSettings is resolved from router
	$scope.zestCommonSettings = zestWebCommonSettings;


	//initial loading, no footers will be there. So set some default values for footers
	//from sample JSON file
	if ($scope.zestCommonSettings.zest_web_footer_settings.footers.length === 0) {
		var options = {
			successCallBack: function(response){
				$scope.zestCommonSettings.zest_web_footer_settings.footers = response;
			}
		};
		$scope.callAPI(ADzestwebCommonSettingsSrv.fetchInitialFooterSettings, options);
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