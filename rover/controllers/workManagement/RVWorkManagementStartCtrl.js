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
                date: "",
                day: 25,
                month: 'September',
                year: 2014
            },
            searchResults: []
        };

        var dummyRoomResults = [{
            roomNumber : 45,
            roomStatus : "room_status",
            reservationStatus : "reservation_status",
            departureTime : "departure-time"
        },{
            roomNumber : 65,
            roomStatus : "room_status",
            reservationStatus : "reservation_status",
            departureTime : "departure-time"
        }]

        var dummyEmnployeeResults = [{
            roomNumber : 45,
            roomStatus : "room_status",
            reservationStatus : "reservation_status",
            departureTime : "departure-time"
        },{
            roomNumber : 65,
            roomStatus : "room_status",
            reservationStatus : "reservation_status",
            departureTime : "departure-time"
        }]

        $scope.workStats = wmStatistics;

        $scope.closeDialog = function() {
            ngDialog.close();
        }

        $scope.continueCreateWorkSheet = function() {
            $state.go('rover.workManagement.new');
            $scope.closeDialog();
        }

        $scope.showWorkSheet = function(){
            $state.go('rover.workManagement.singleSheet');
        }


        $scope.workManagementSearch = function() {
            if ($scope.stateVariables.searchQuery.length > 0) {
                var searchKey = $scope.stateVariables.searchQuery;
                $scope.stateVariables.searchResults = [];
                if (searchKey.match(/[0-9]/)) {
                    var onRoomSearchSuccess = function(data) {
                        console.log(data);
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
                        $scope.$emit('hideLoader');
                    }
                    $scope.invokeApi(RVWorkManagementSrv.searchEmployees, {
                        key: searchKey,
                        date: $scope.stateVariables.viewingDate.date,
                        workType: $scope.stateVariables.selectedWorkType
                    }, onEmployeeSearchSuccess);
                }

            } else {
                $scope.stateVariables.searching = false;
            }
            $scope.$apply();
        }

    }
]);