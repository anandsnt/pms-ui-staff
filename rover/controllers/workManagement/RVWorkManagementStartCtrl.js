sntRover.controller('RVWorkManagementStartCtrl', ['$rootScope', '$scope', 'ngDialog', '$state',
    function($rootScope, $scope, ngDialog, $state) {

        $scope.showCreateWorkSheetDialog = function() {
            ngDialog.open({
                template: '/assets/partials/workManagement/popups/rvWorkManagementCreatePopup.html',
                className: 'ngdialog-theme-default',
                closeByDocument: true,
                scope: $scope
            });
        }

        $scope.closeDialog = function() {
            ngDialog.close();
        }

        $scope.continueCreateWorkSheet = function() {
            $state.go('rover.workManagement.new');
            $scope.closeDialog();
        }
    }
]);