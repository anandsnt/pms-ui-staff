sntRover.controller('RVWorkManagementStartCtrl', ['$rootScope', '$scope', 'ngDialog', '$state', 'RVWorkManagementSrv', 'RVWorkManagementSrv', '$timeout',
    function($rootScope, $scope, ngDialog, $state, RVWorkManagementSrv, RVWorkManagementSrv, $timeout) {
        $scope.setHeading("Work Management");
        BaseCtrl.call(this, $scope);

        $scope.showCreateWorkSheetDialog = function() {
            ngDialog.open({
                template: '/assets/partials/workManagement/popups/rvWorkManagementCreatePopup.html',
                className: 'ngdialog-theme-default',
                closeByDocument: true,
                scope: $scope
            });
        }

        $scope.setScroller('roomsSearchResults');
        $scope.setScroller('maidsSearchResults');

        var setStats = function() {
            var onFetchSuccess = function(wmStatistics) {
                    $scope.$emit('hideLoader');
                    $scope.workStats = wmStatistics;
                },
                onFetchFailure = function(errorMessage) {
                    $scope.errorMessage = "";
                    $scope.errorMessage = errorMessage;
                    $scope.$emit('hideLoader');
                }
            $scope.invokeApi(RVWorkManagementSrv.fetchStatistics, $scope.stateVariables.viewingDate, onFetchSuccess, onFetchFailure);
        }



        $scope.stateVariables = {
            searching: false,
            searchQuery: "",
            lastSearchQuery: "",
            employeeSearch: false, // Search can be either for rooms or an employee
            noSearchResults: false,
            viewingDate: {
                date: $rootScope.businessDate,
                work_type_id: $scope.workTypes[0].id // Default to daily cleaning [Assuming it comes in as first entry]
            },
            searchResults: {
                maids: [],
                rooms: []
            },
            newSheet: {
                user_id: "",
                work_type_id: $scope.workTypes[0].id, // Default to daily cleaning [Assuming it comes in as first entry]
                date: $rootScope.businessDate,
            },
            assignRoom: {
                user_id: "",
                work_type_id: $scope.workTypes[0].id, // Default to daily cleaning [Assuming it comes in as first entry],
                rooms: []
            }
        };


        $scope.closeDialog = function() {
            $scope.errorMessage = "";
            ngDialog.close();
        }

        $scope.continueCreateWorkSheet = function() {
            var onCreateSuccess = function(data) {
                    $scope.$emit('hideLoader');
                    $state.go('rover.workManagement.singleSheet', {
                        id: data.id,
                        date: data.date,
                        from: "START"
                    });
                    $scope.closeDialog();
                },
                onCreateFailure = function(errorMessage) {
                    $scope.errorMessage = "";
                    $scope.errorMessage = errorMessage;
                    $scope.$emit('hideLoader');
                }
            $scope.invokeApi(RVWorkManagementSrv.createWorkSheet, $scope.stateVariables.newSheet, onCreateSuccess, onCreateFailure);
        }

        $scope.showWorkSheet = function(id) {
            if (id) {
                $state.go('rover.workManagement.singleSheet', {
                    date: $scope.stateVariables.viewingDate.date,
                    id: id,
                    from: "START"
                });
            }
        }

        $scope.onRoomSelect = function(room) {
            $scope.stateVariables.assignRoom.rooms = [room.id];
            if (room.work_sheet_id) {
                $state.go('rover.workManagement.singleSheet', {
                    date: $scope.stateVariables.viewingDate.date,
                    id: room.work_sheet_id,
                    from: "START"
                });
            } else { //Assign the room to an employee
                $scope.stateVariables.assignRoom.work_type_id = room.work_type_ids[0];
                ngDialog.open({
                    template: '/assets/partials/workManagement/popups/rvWorkManagementAssignRoom.html',
                    className: 'ngdialog-theme-default',
                    closeByDocument: true,
                    scope: $scope,
                    data: JSON.stringify({
                        workTypes: _.filter($scope.workTypes, function(wT) {
                            return room.work_type_ids.indexOf(wT.id) > -1;
                        })
                    })
                });
            }
        }

        $scope.assignRoom = function() {
            $scope.errorMessage = "";
            if (!$scope.stateVariables.assignRoom.work_type_id) {
                $scope.errorMessage = ['Please select a work type.'];
                return false;
            }
            if (!$scope.stateVariables.assignRoom.user_id) {
                $scope.errorMessage = ['Please select an employee.'];
                return false;
            }
            var onAssignSuccess = function(data) {
                    $scope.$emit('hideLoader');
                    $scope.stateVariables.assignRoom.user_id = "";
                    $scope.stateVariables.assignRoom.work_type_id = "";
                    var workSheet = data.touched_work_sheets && data.touched_work_sheets[0] && data.touched_work_sheets[0].work_sheet_id;
                    $scope.showWorkSheet(workSheet);
                    $scope.closeDialog();
                },
                onAssignFailure = function(errorMessage) {
                    $scope.$emit('hideLoader');
                    $scope.errorMessage = errorMessage;
                }
            $scope.invokeApi(RVWorkManagementSrv.saveWorkSheet, {
                "date": $scope.stateVariables.viewingDate.date,
                "task_id": $scope.stateVariables.assignRoom.work_type_id,
                "order": "",
                "assignments": [{
                    "assignee_id": $scope.stateVariables.assignRoom.user_id,
                    "room_ids": $scope.stateVariables.assignRoom.rooms,
                    "work_sheet_id": "",
                    "from_search": true
                }]
            }, onAssignSuccess, onAssignFailure);
        }

        function isSearchOnSingleDigit(searchTerm){
            if($rootScope.isSingleDigitSearch){
                return isNaN(searchTerm);
            } else {
                return true;
            }
        };

        $scope.workManagementSearch = function(refresh) {
            /**
            * Single digit search for room number will be initiated based on the settings in admin
            * Ref Story: CICO-10323
            */
            if(isSearchOnSingleDigit($scope.stateVariables.searchQuery) && $scope.stateVariables.searchQuery.length < 3){
                return false;
            }

            if (refresh || ($scope.stateVariables.searchQuery.length > 0 && $scope.stateVariables.lastSearchQuery !== $scope.stateVariables.searchQuery)) {
                var searchKey = $scope.stateVariables.searchQuery;
                $scope.stateVariables.lastSearchQuery = $scope.stateVariables.searchQuery;
                $scope.stateVariables.searching = true;
                if (searchKey.match(/[0-9]/)) {
                    var onRoomSearchSuccess = function(rooms) {
                        $scope.stateVariables.employeeSearch = false;
                        $scope.stateVariables.searchResults.rooms = rooms;
                        $scope.stateVariables.noSearchResults = $scope.stateVariables.searchResults.rooms.length === 0;
                        $scope.refreshScroller('roomsSearchResults');
                        $scope.$emit('hideLoader');
                    }
                    $scope.invokeApi(RVWorkManagementSrv.searchRooms, {
                        key: searchKey,
                        date: $scope.stateVariables.viewingDate.date
                    }, onRoomSearchSuccess);
                } else {
                    var onEmployeeSearchSuccess = function(maids) {
                        $scope.stateVariables.employeeSearch = true;
                        $scope.stateVariables.searchResults.maids = maids;
                        $scope.stateVariables.noSearchResults = $scope.stateVariables.searchResults.maids.length === 0;
                        $scope.refreshScroller('maidsSearchResults');
                        $scope.$emit('hideLoader');
                    }
                    $scope.invokeApi(RVWorkManagementSrv.searchEmployees, {
                        key: searchKey,
                        date: $scope.stateVariables.viewingDate.date,
                        workType: $scope.stateVariables.viewingDate.work_type_id
                    }, onEmployeeSearchSuccess);
                }

            } else {
                $scope.stateVariables.searchResults.maids = [];
                $scope.stateVariables.searchResults.rooms = [];
                $scope.stateVariables.lastSearchQuery = "";
                $scope.stateVariables.searching = false;
                $scope.stateVariables.noSearchResults = false;
                $scope.$apply();
            }
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

        $scope.onWorkTypeChanged = function() {
            if ($scope.stateVariables.searching) {
                $scope.workManagementSearch(true);
            }
            setStats();
        }

        $scope.onViewDateChanged = function() {
            if ($scope.stateVariables.searching) {
                $scope.workManagementSearch(true);
            }
            setStats();
        }

        setStats();


    }
]);