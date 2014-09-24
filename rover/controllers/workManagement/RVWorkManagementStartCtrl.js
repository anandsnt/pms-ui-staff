sntRover.controller('RVWorkManagementStartCtrl', ['$rootScope', '$scope', 'ngDialog', '$state', 'RVWorkManagementSrv', 'wmStatistics', 'RVWorkManagementSrv',
    function($rootScope, $scope, ngDialog, $state, RVWorkManagementSrv, wmStatistics, RVWorkManagementSrv) {

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
            employeeSearch: false, // Search can be either for rooms or an employee
            viewingDate: {
                date: $rootScope.businessDate,
                work_type_id: ""
            },
            searchResults: [],
            newSheet: {
                user_id: "",
                work_type_id: "",
                date: $rootScope.businessDate,
            }
        };

        var dummyRoomResults = [{
            roomNumber: 45,
            roomStatus: "room_status",
            reservationStatus: "INHOUSE",
            departureTime: "06:54",
            arrivalTime: "12:34"
        }, {
            roomNumber: 65,
            roomStatus: "room_status",
            reservationStatus: "CHECK-IN",
            departureTime: "06:54",
            arrivalTime: "12:34"
        }]

        $scope.workStats = wmStatistics;

        $scope.closeDialog = function() {
            ngDialog.close();
        }

        $scope.continueCreateWorkSheet = function() {
            var onCreateSuccess = function(data) {
                    $scope.$emit('hideLoader');
                    $state.go('rover.workManagement.singleSheet', {
                        id: data.id,
                        date: data.date
                    });
                    $scope.closeDialog();
                },
                onCreateFailure = function(data) {
                    $scope.$emit('hideLoader');
                }
            $scope.invokeApi(RVWorkManagementSrv.createWorkSheet, $scope.stateVariables.newSheet, onCreateSuccess, onCreateFailure);
        }

        $scope.showWorkSheet = function() {
            $state.go('rover.workManagement.singleSheet');
        }


        $scope.workManagementSearch = function() {
            if ($scope.stateVariables.searchQuery.length > 0) {
                var searchKey = $scope.stateVariables.searchQuery;
                $scope.stateVariables.searchResults = [];
                if (searchKey.match(/[0-9]/)) {
                    var onRoomSearchSuccess = function(data) {
                        $scope.stateVariables.searchResults = dummyRoomResults;
                        $scope.stateVariables.searching = true;
                        $scope.stateVariables.employeeSearch = false;
                        $scope.$emit('hideLoader');
                    }
                    $scope.invokeApi(RVWorkManagementSrv.searchRooms, {
                        key: searchKey,
                        date: $scope.stateVariables.viewingDate.date,
                        workType: $scope.stateVariables.selectedWorkType
                    }, onRoomSearchSuccess);
                } else {
                    var onEmployeeSearchSuccess = function(data) {
                        console.log(data);
                        $scope.stateVariables.searching = true;
                        $scope.stateVariables.employeeSearch = true;
                        $scope.stateVariables.searchResults = data;
                        $scope.$emit('hideLoader');
                    }
                    $scope.invokeApi(RVWorkManagementSrv.searchEmployees, {
                        key: searchKey,
                        date: $scope.stateVariables.viewingDate.date,
                        workType: $scope.stateVariables.viewingDate.work_type_id
                    }, onEmployeeSearchSuccess);
                }

            } else {
                $scope.stateVariables.searchResults = [];
                $scope.stateVariables.searching = false;
            }
            $scope.$apply();
        }

        $scope.showCalendar = function(controller) {
            ngDialog.open({
                template: '/assets/partials/workManagement/popups/rvWorkManagementSearchDateFilter.html',
                controller: controller,
                className: 'ngdialog-theme-default single-date-picker',
                closeByDocument: true,
                scope: $scope
            });
        }

        $scope.showCreateCalendar = function() {
            ngDialog.open({
                template: '/assets/partials/workManagement/popups/rvWorkManagementCreateDatePicker.html',
                controller: 'RVWorkManagementCreateDatePickerController',
                className: 'ngdialog-theme-default single-date-picker',
                closeByDocument: true,
                scope: $scope
            });
        }
    }
]);