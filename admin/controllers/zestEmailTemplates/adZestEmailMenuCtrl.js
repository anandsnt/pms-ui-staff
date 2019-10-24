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
        $scope.$on("STATE_CHANGE_FAILURE", function(event, errorMessage) {
            $scope.errorMessage = errorMessage;
        });
        /*
         * Handle menu Item click
         * @param {string} stateToGo - next state name
         * @param {object} state - current state
         */
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
