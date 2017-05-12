admin.controller('ADInterfaceSubMenuCtrl', ['$scope', '$state',
    function($scope, $state) {
      console.log($state.current.name);
        switch ($state.current.name) {
            case "admin.textMessagingGroup":
                $scope.sectionTitle = "Text Messaging Systems Setup";
                break;
            case "admin.backOfficeSetup":
                $scope.sectionTitle = "Back Office Setup";
                break;
            case "admin.centralReservationSystemGroup":
                $scope.sectionTitle = "Central Reservation Systems Setup";
                break;
            case "admin.ifcComtrolSetup":
                $scope.sectionTitle = "Comtrol Setup";
                break;
            case "admin.snapshotSetup":
                $scope.sectionTitle = "Snapshot Setup";
                break;
            case "admin.mobileKey":
                $scope.sectionTitle = "Mobile Key Setup";
                break;
            default:
                $scope.sectionTitle = "Interfaces Setup";
        }
        console.log($scope.selectedMenu.components);
        var subComponents = _.find($scope.selectedMenu.components, {state: $state.current.name}).sub_components;

        // CICO-36466 Admin Interfaces Menu to be sorted by alphabetical
        $scope.subComponents = _.sortBy(subComponents, function(menu) {
            return menu.name.toLowerCase();
        });

        $scope.$on("STATE_CHANGE_FAILURE", function(event, errorMessage) {
            $scope.errorMessage = errorMessage;
        });
    }
]);
