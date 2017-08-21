admin.controller('ADZestCheckinEmailSettingsCtrl', ['$scope', '$state', 'generalSettings', 'data', 'ngDialog', '$filter', '$controller',
    function($scope, $state, generalSettings, data, ngDialog, $filter, $controller) {
        $controller('ADZestBaseEmailSettingsCtrl', {
            $scope: $scope
        });
        $scope.generalSettings = generalSettings;
        $scope.data = data;
        $scope.mainHeading = $filter('translate')('CHECKIN_TEXT_SETTINGS');
    }
]);