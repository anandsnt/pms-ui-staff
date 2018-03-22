admin.controller('ADZestTextKeyDeliverySettingsCtrl', ['$scope', 'data', '$filter', '$controller',
	function($scope, data, $filter, $controller) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.hideButtonField = true;
		$scope.setData(data, data.text_key_delivery_email_template_settings, 'KEY_EMAIL');
		$scope.keyDeliveryCommonSettings = data.key_delivery_common_settings;
		// for preview set sample data
		$scope.roomNumber = '101';
		$scope.mainHeading = $filter('translate')('TEXT_KEY_DELIVERY_SETTINGS');
		$scope.saveSettings = function() {
			$scope.saveAdminSettings('text_key_delivery_email_template_settings', true);
		};
	}
]);
