admin.controller('ADZestLateCheckoutEmailSettingsCtrl', ['$scope', 'data', '$filter', '$controller',
	function($scope, data, $filter, $controller) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.setData(data, data.late_checkout_email_template_settings);
		$scope.mainHeading = $filter('translate')('LATE_CHECKOUT_TEXT_SETTINGS');
		$scope.saveSettings = function() {
			$scope.saveAdminSettings('late_checkout_email_template_settings');
		};
	}
]);