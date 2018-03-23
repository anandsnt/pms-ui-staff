admin.controller('ADZestCheckinEmailSettingsCtrl', ['$scope', 'data', '$filter', '$controller',
	function($scope, data, $filter, $controller) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.setData(data, data.checkin_email_template_settings);
		$scope.mainHeading = $filter('translate')('CHECKIN_TEXT_SETTINGS');
		$scope.saveSettings = function() {
			$scope.saveAdminSettings('checkin_email_template_settings');
		};
	}
]);