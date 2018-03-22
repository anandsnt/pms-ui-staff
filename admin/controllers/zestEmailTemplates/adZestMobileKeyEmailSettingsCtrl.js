admin.controller('ADZestMobileKeyEmailSettingsCtrl', ['$scope', 'data', '$filter', '$controller',
	function($scope, data, $filter, $controller) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.setData(data, data.mobile_key_email_template_settings, 'KEY_EMAIL');
		$scope.hideButtonField = true;
		$scope.hideTextTwoField = true;
		$scope.isMobileKeyEmail = true;
		$scope.mainHeading = $filter('translate')('STATION_MOBILE_KEY_DELIVERY_SETTINGS');
		$scope.saveSettings = function() {
			$scope.saveAdminSettings('mobile_key_email_template_settings', true);
		};
	}
]);