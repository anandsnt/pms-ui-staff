admin.controller('ADZestEmailPrecheckinSettingsCtrl', ['$scope', '$state', 'generalSettings', 'data', 'ngDialog', '$translate', '$filter', '$controller',
    function($scope, $state, generalSettings, data, ngDialog, $translate, $filter, $controller) {
        $controller('ADZestBaseEmailSettingsCtrl', {
            $scope: $scope
        });
        $scope.generalSettings = generalSettings;
        $scope.data = data;
        $scope.mainHeading = $filter('translate')('PRECHECKIN_TEXT_SETTINGS');
       
    }
]);