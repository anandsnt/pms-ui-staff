admin.controller('ADZestEmailMenuCtrl', ['$scope', '$state',
    function($scope, $state) {
        $scope.sectionTitle = "Email Templates Settings";
    
        var menu = _.find($scope.selectedMenu.components, {state: $state.current.name});

        if (!menu) {
            menu = _($scope.selectedMenu.components).chain()
                .pluck('sub_components')
                .flatten()
                .findWhere({state: $state.current.name})
                .value();
        }
        $scope.subComponents = (menu && menu.sub_components) || [];

        // To hide menus till implemented
        $scope.subComponents = _.filter($scope.subComponents, function(component) {
            return (component.name === 'General Email Settings' ||
             component.name === 'PreCheckin Email' ||
             component.name === 'Checkin Email' ||
             component.name === 'Checkout Email' ||
             component.name === 'Late Checkout Email');
        });

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
