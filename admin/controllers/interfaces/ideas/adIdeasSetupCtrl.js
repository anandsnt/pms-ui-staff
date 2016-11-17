admin.controller('adIdeasSetupCtrl', ['$scope', 'ideaSetup',
    function($scope, ideaSetup) {

        BaseCtrl.call(this, $scope);
        $scope.$on('changeMenu', function(e, value) {
            $scope.selectedMenu = value;
        });

        $scope.cancelMenuSelection = function() {
            $scope.selectedMenu = '';
        };

        (function init() {
            $scope.ideaSetup = ideaSetup;
            // handle null in selected_charge_groups and available_charge_groups
            $scope.ideaSetup.selected_charge_groups = $scope.ideaSetup.selected_charge_groups || [];
            $scope.ideaSetup.available_charge_groups = $scope.ideaSetup.available_charge_groups || [];
            $scope.selectedMenu = "";
        })();
    }
]);