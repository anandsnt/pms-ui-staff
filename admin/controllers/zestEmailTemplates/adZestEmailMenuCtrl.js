admin.controller('ADZestEmailMenuCtrl', ['$scope', '$state',
    function($scope, $state) {
        switch ($state.current.name) {
            case "admin.zestEmailGeneralSettings":
                $scope.sectionTitle = "General Settings";
                break;
            case "admin.zestPreCheckinEmailSettings":
                $scope.sectionTitle = "PreCheckin Email Settings";
                break;
            default:
                $scope.sectionTitle = "Email Templates Settings";
        }

        var menu = _.find($scope.selectedMenu.components, {state: $state.current.name});

        if (!menu) {
            menu = _($scope.selectedMenu.components).chain()
                .pluck('sub_components')
                .flatten()
                .findWhere({state: $state.current.name})
                .value();
        }
        $scope.subComponents = (menu && menu.sub_components) || [];

        $scope.$on("STATE_CHANGE_FAILURE", function(event, errorMessage) {
            $scope.errorMessage = errorMessage;
        });

        $scope.clickedMenuItem = function($event, stateToGo, state) {
            if (!state) {
                state = {};
            }

            $state.go(stateToGo);

            if ($scope.menuOpen) {
                $scope.menuOpen = !$scope.menuOpen;
                $scope.showSubMenu = false;
            }
        };
    }
]);
