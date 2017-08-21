admin.controller('ADZestLateCheckoutEmailSettingsCtrl', ['$scope', '$state', 'generalSettings', 'data', 'ngDialog', '$filter', '$controller',
    function($scope, $state, generalSettings, data, ngDialog, $filter, $controller) {
        $controller('ADZestBaseEmailSettingsCtrl', {
            $scope: $scope
        });
        $scope.generalSettings = generalSettings;
        $scope.data = data;
        $scope.mainHeading = $filter('translate')('LATE_CHECKOUT_TEXT_SETTINGS');
    }
]);