admin.controller('ADInterfaceSubMenuCtrl', ['$scope', '$state',
    function($scope, $state) {
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
            case "admin.chain.certificates":
                $scope.sectionTitle = "Certificates Setup";
                break;
            case "admin.commissionsSetup":
                $scope.sectionTitle = "Commissions Setup";
                break;
            case "admin.idCollection":
                $scope.sectionTitle = "ID Collection";
                break;
            default:
                $scope.sectionTitle = "Interfaces Setup";
        }

        var menu = _.find($scope.selectedMenu.components, {state: $state.current.name});

        if (!menu) {
            menu = _($scope.selectedMenu.components).chain()
                .pluck('sub_components')
                .flatten()
                .findWhere({state: $state.current.name})
                .value();
        }

        var subComponents = (menu && menu.sub_components) || [];

        // CICO-36466 Admin Interfaces Menu to be sorted by alphabetical
        $scope.subComponents = _.sortBy(subComponents, function(menu) {
            return menu.name.toLowerCase();
        });

        $scope.$on("STATE_CHANGE_FAILURE", function(event, errorMessage) {
            $scope.errorMessage = errorMessage;
        });
    }
]);
