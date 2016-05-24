admin.controller('ADInterfaceSubMenuCtrl', ['$scope', '$state',
    function ($scope, $state) {
        $scope.subComponents = _.find($scope.selectedMenu.components, {state: $state.current.name}).sub_components;
    }
]);