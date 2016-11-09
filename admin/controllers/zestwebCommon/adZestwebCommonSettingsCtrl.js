admin.controller('ADZestwebCommonSettingsCtrl', ['$scope', '$state', 'zestWebCommonSettings', 'initialFooterSettings', 'ADzestwebCommonSettingsSrv', function($scope, $state, zestWebCommonSettings, initialFooterSettings, ADzestwebCommonSettingsSrv) {

	BaseCtrl.call(this, $scope);

	/**
	 * [setFooterData description]
	 */
	var setFooterData = function() {
		//for readability in HTML
		$scope.footer1 = angular.copy($scope.zestCommonSettings.zest_web_footer_settings.footers[0]);
		$scope.footer2 = angular.copy($scope.zestCommonSettings.zest_web_footer_settings.footers[1]);
		$scope.footer3 = angular.copy($scope.zestCommonSettings.zest_web_footer_settings.footers[2]);
	};

	/**
	 * [saveSettings description]
	 * @return {[type]} [description]
	 */
	$scope.saveSettings = function() {

		var saveSettingsCallback = function(response) {
			$scope.successMessage = 'Success';
			$scope.zestCommonSettings = response;
			setFooterData();
		};

		var apiParams = angular.copy($scope.zestCommonSettings);

		apiParams.zest_web_footer_settings.footers[0] = angular.copy($scope.footer1);
		apiParams.zest_web_footer_settings.footers[1] = angular.copy($scope.footer2);
		apiParams.zest_web_footer_settings.footers[2] = angular.copy($scope.footer3);

		var options = {
			params: apiParams,
			successCallBack: saveSettingsCallback
		};

		$scope.callAPI(ADzestwebCommonSettingsSrv.saveSettings, options);
	};

	var init = function() {

		//zestWebCommonSettings is resolved from router
		$scope.zestCommonSettings = zestWebCommonSettings;
		$scope.errorMessage = '';
		$scope.successMessage = '';
		//In the initial loading, no footers will be there. So set some default values for footers
		//from sample JSON file
		var numberOfFooterItems = 3;

		for (i = 0; i < numberOfFooterItems; i++) {
			//if footer item is not present, create one with default settings
			if (_.isUndefined($scope.zestCommonSettings.zest_web_footer_settings.footers[i])) {
				$scope.zestCommonSettings.zest_web_footer_settings.footers.push(initialFooterSettings);
			}
		}
		setFooterData();
	}();

}]);