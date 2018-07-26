admin.controller('ADDashboardCtrl', ['$scope', '$state', '$stateParams', '$rootScope', function($scope, $state, $stateParams, $rootScope) {
    $scope.$emit("changedSelectedMenu", $stateParams.menu);
    if (typeof $scope.data !== 'undefined') {
        $scope.selectedMenu = $scope.data.menus[$stateParams.menu];

        // CICO-36466 Admin Interfaces Menu to be sorted by alphabetical
        // NOTE: Currently only the Interfaces Menu items are sorted!
        if ($scope.selectedMenu && $scope.selectedMenu.menu_name === "Interfaces") {
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
}]);


