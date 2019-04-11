admin.controller('ADInterfaceSubMenuCtrl', ['$scope', '$state',
    function($scope, $state) {
        switch ($state.current.name) {
            case "admin.textMessagingGroup":
                $scope.sectionTitle = "Integrations > Text Messaging";
                break;
            case "admin.backOfficeSetup":
                $scope.sectionTitle = "Integrations > Back Office";
                break;
            case "admin.centralReservationSystemGroup":
                $scope.sectionTitle = "Integrations > Central Reservation System";
                break;
            case "admin.ifcComtrolSetup":
                $scope.sectionTitle = "Integrations > Comtrol";
                break;
            case "admin.snapshotSetup":
                $scope.sectionTitle = "Integrations > Snapshot";
                break;
            case "admin.mobileKey":
                $scope.sectionTitle = "Integrations > Mobile Key";
                break;
            case "admin.chain.certificates":
                $scope.sectionTitle = "Certificates";
                break;
            case "admin.commissionsSetup":
                $scope.sectionTitle = "Integrations > Commissions";
                break;
            // This menu is available at settings->hotel & staff. Added here to reuse the submenu controller
            case "admin.idCollection":
                $scope.sectionTitle = "ID Collection";
                break;   
            default:
                $scope.sectionTitle = "Integrations > Integrations";
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

        // CICO-36466 Admin Integrations Menu to be sorted by alphabetical
        $scope.subComponents = _.sortBy(subComponents, function(menu) {
            return menu.name.toLowerCase();
        });

        $scope.$on("STATE_CHANGE_FAILURE", function(event, errorMessage) {
            $scope.errorMessage = errorMessage;
        });
    }
]);
