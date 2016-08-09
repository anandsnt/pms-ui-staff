admin.controller('ADInterfaceSubMenuCtrl', ['$scope', '$state',
    function($scope, $state) {
        $scope.subComponents = _.find($scope.selectedMenu.components, {state: $state.current.name}).sub_components;

        $scope.$on("STATE_CHANGE_FAILURE", function(event, errorMessage) {
            $scope.errorMessage = errorMessage;
        });
    }
]);