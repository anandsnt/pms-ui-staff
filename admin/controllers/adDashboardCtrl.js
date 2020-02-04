admin.controller('ADDashboardCtrl', ['$scope', '$state', '$stateParams', '$rootScope', function($scope, $state, $stateParams, $rootScope) {
    $scope.selectedMenu = $scope.data.menus[$stateParams.menu];
    if ($stateParams.errorMsg) {
        $scope.errorMessage = $stateParams.errorMsg;
    }
    if ($scope.isZestStationEnabled || $scope.selectedMenu.menu_name !== 'Station') {
        if($scope.selectedMenu.menu_name !== 'Zest' && !$scope.isZestWebEnabled) {
            $scope.errorMessage = [];
        }
        $scope.$emit("changedSelectedMenu", $stateParams.menu);
        if (typeof $scope.data !== 'undefined') {
            $scope.policeExportEnabled = $scope.data.police_export_enabled;
            // CICO-36466 Admin Interfaces Menu to be sorted by alphabetical
            // NOTE: Currently only the Interfaces Menu items are sorted!
            if ($scope.selectedMenu && $scope.selectedMenu.menu_name === "Integrations") {
                $scope.selectedMenu.components = _.sortBy($scope.data.menus[$stateParams.menu].components, function(menu) {
                    return menu.name.toLowerCase();
                });
            }
            // As part of CICO-27990, Notification menu is hiding for SP, ie shows only for sntAdmin
            if ($rootScope.isServiceProvider) {
                $scope.selectedMenu.components = _.filter($scope.selectedMenu.components, function(item) {
                    return item.name !== "Notifications";
                });
            }
        }
    } else {
        $scope.errorMessage = ['Your current subscription package does not include this service'];
    }
}]);
