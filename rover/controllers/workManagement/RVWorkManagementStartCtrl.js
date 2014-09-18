sntRover.controller('RVWorkManagementStartCtrl', ['$rootScope', '$scope', 'ngDialog', '$state', 'RVWorkManagementSrv', 'wmStatistics',
    function($rootScope, $scope, ngDialog, $state, RVWorkManagementSrv, wmStatistics) {
        $scope.showCreateWorkSheetDialog = function() {
            ngDialog.open({
                template: '/assets/partials/workManagement/popups/rvWorkManagementCreatePopup.html',
                className: 'ngdialog-theme-default',
                closeByDocument: true,
                scope: $scope
            });
        }

        $scope.stateVariables = {
            searching: false,
            searchQuery: "",
            roomSearch: false, // Search can be either for rooms or an employee
            viewingDate: {
                date: "",
                day: 25,
                month: 'September',
                year: 2014
            }
        };

        $scope.workStats = wmStatistics;

        $scope.closeDialog = function() {
            ngDialog.close();
        }

        $scope.continueCreateWorkSheet = function() {
            $state.go('rover.workManagement.new');
            $scope.closeDialog();
        }


        $scope.workManagementSearch = function() {
            if ($scope.stateVariables.searchQuery.length > 0) {
                $scope.stateVariables.searching = true;
            } else {
                $scope.stateVariables.searching = false;
            }
            $scope.$apply();
        }

    }
]);