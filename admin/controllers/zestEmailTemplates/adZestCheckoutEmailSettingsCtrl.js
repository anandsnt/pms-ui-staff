admin.controller('ADZestCheckoutEmailSettingsCtrl', ['$scope', 'data', '$filter', '$controller',
	function($scope, data, $filter, $controller) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.setData(data, data.checkout_email_template_settings);
		$scope.mainHeading = $filter('translate')('CHECKOUT_TEXT_SETTINGS');
		$scope.saveSettings = function() {
			$scope.saveAdminSettings('checkout_email_template_settings');
		};
	}
]);