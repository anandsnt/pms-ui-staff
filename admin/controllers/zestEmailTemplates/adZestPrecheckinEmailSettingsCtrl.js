admin.controller('ADZestEmailPrecheckinSettingsCtrl', ['$scope', 'data', '$filter', '$controller',
	function($scope, data, $filter, $controller) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.setData(data, data.precheckin_email_template_settings);
		$scope.mainHeading = $filter('translate')('PRECHECKIN_TEXT_SETTINGS');
		$scope.saveSettings = function() {
			$scope.saveAdminSettings('precheckin_email_template_settings');
		};
	}
]);