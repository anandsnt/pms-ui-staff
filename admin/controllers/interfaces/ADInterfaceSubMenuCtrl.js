admin.controller('ADInterfaceSubMenuCtrl', ['$scope', '$state',
    function ($scope, $state) {
        switch ($state.current.name){
            case "admin.textMessagingGroup":
                $scope.sectionTitle = "Text Messaging Systems Setup";
                break;
            case "admin.backOfficeSetup":
                $scope.sectionTitle = "Back Office Setup";
                break;
            case "admin.centralReservationSystemGroup":
                $scope.sectionTitle = "Central Reservation Systems Setup";
                break;
            default:
                $scope.sectionTitle = "Interfaces Setup"
        }
        $scope.subComponents = _.find($scope.selectedMenu.components, {state: $state.current.name}).sub_components;
    }
]);