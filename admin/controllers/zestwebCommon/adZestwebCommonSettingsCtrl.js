admin.controller('ADZestwebCommonSettingsCtrl', ['$scope', '$state', 'zestWebCommonSettings', 'ADzestwebCommonSettingsSrv', function($scope, $state, zestWebCommonSettings, ADzestwebCommonSettingsSrv) {

	BaseCtrl.call(this, $scope);

	$scope.zestCommonSettings = zestWebCommonSettings;

	if ($scope.zestCommonSettings.zest_web_footer_settings.footers.length === 0) {
		$scope.zestCommonSettings.zest_web_footer_settings.footers = [{
			"id": "",
			"is_active": false,
			"label": "",
			"url": ""
		}, {
			"id": "",
			"is_active": false,
			"label": "",
			"url": ""
		}, {
			"id": "",
			"is_active": false,
			"label": "",
			"url": ""
		}]

	};

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