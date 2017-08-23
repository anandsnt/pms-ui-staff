admin.controller('ADZestCheckoutEmailSettingsCtrl', ['$scope', '$state', 'data', 'ngDialog', '$filter', '$controller',
    function($scope, $state, data, ngDialog, $filter, $controller) {
        $controller('ADZestBaseEmailSettingsCtrl', {
            $scope: $scope
        });
        $scope.generalSettings = data.general_email_template_settings;
		$scope.data = data.precheckin_email_template_settings;
        $scope.mainHeading = $filter('translate')('CHECKOUT_TEXT_SETTINGS');
    }
]);