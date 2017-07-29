admin.controller('ADZestEmailGeneralSettings', ['$scope', '$state','generalSettings',
    function($scope, $state,generalSettings) {
        console.log(generalSettings);
        $scope.generalSettings = generalSettings;
    }
]);
