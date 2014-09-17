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

        $scope.stateVariables = {
            searching: false,
            roomSearch: false, // Search can be either for rooms or an employee
            viewingDate: {
                date: "",
                day: 25,
                month: September,
                year: 2014
            }
        };

        $scope.workStats = {
            "departures": {
                "clean": 30,
                "total_hours": "03.45",
                "total_maids_required": 12,
                "total_rooms_assigned": 2,
                "total_rooms_completed": 3
            },
            "stay_overs": {
                "clean": 12,
                "total_hours": "1.45",
                "total_maids_required": 12,
                "total_rooms_assigned": 2,
                "total_rooms_completed": 3
            }
        };

        $scope.closeDialog = function() {
            ngDialog.close();
        }

        $scope.continueCreateWorkSheet = function() {
            $state.go('rover.workManagement.new');
            $scope.closeDialog();
        }
    }
]);