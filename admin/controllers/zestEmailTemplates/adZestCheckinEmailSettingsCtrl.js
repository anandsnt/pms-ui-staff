admin.controller('ADZestCheckinEmailSettingsCtrl', ['$scope', '$state', 'data', 'ngDialog', '$filter', '$controller',
    function($scope, $state, data, ngDialog, $filter, $controller) {
        $controller('ADZestBaseEmailSettingsCtrl', {
            $scope: $scope
        });
        $scope.generalSettings = data.general_email_template_settings;
		$scope.data = data.precheckin_email_template_settings;
        $scope.mainHeading = $filter('translate')('CHECKIN_TEXT_SETTINGS');
    }
]);