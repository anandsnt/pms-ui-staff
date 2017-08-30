admin.controller('ADZestQRKeyDeliverySettingsCtrl', ['$scope', 'data', '$filter', '$controller',
	function($scope, data, $filter, $controller) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.setData(data, data.qr_key_delivery_email_template_settings);
		$scope.hideButtonField = true;
		$scope.mainHeading = $filter('translate')('QR_EMAIL_TEXT_SETTINGS');
		$scope.saveSettings = function() {
			$scope.saveAdminSettings('qr_key_delivery_email_template_settings', true);
		};
	}
]);