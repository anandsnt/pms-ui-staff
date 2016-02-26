sntRover.controller('RVActionsManagerController', ['$scope', '$filter', '$rootScope', 'ngDialog', 'rvActionTasksSrv', 'RVReservationCardSrv', 'hotelDetails', '$timeout', '$state', '$stateParams', 'departments',
    function ($scope, $filter, $rootScope, ngDialog, rvActionTasksSrv, RVReservationCardSrv, hotelDetails, $timeout, $state, $stateParams, departments) {

        //-------------------------------------------------------------------------------------------------------------- A. Scope Variables

        $scope.filterOptions = {
            showFilters: false,
            selectedDay: $rootScope.businessDate,
            selectedDepartment: "",
            selectedStatus: "ALL", // other values "ASSIGNED", "UNASSIGNED", "COMPLETED",
            query: ""
        };

        //-------------------------------------------------------------------------------------------------------------- B. Local Methods
        var init = function () {
                var heading = 'Actions Manager';
                $scope.setScroller("rvActionListScroller");
                $scope.departments = departments.data.departments;
                setHeadingTitle(heading);
                fetchActionsList();
            },
            setHeadingTitle = function (heading) {
                $scope.heading = heading;
                $scope.setTitle(heading);
            },
            refreshScroller = function () {
                $scope.refreshScroller('rvActionListScroller');
            },
            getActionDetails = function () {
                $scope.callAPI(rvActionTasksSrv.getActionDetails, {
                    params: $scope.selectedActionId,
                    successCallBack: function (response) {
                        var actionDetails = angular.copy(response.data);
                        $scope.selectedAction = actionDetails
                    }
                })
            },
            fetchActionsList = function () {
                var payLoad = {
                    date: $scope.filterOptions.selectedDay,
                }, onFetchListSuccess = function (response) {
                    $scope.actions = [];
                    _.each(response.results, function (action) {
                        $scope.actions.push(_.extend(action, {
                            assigned: !!action.department_id,
                            isCompleted: action.action_status === "COMPLETED",
                            iconClass: action.action_status ? "icon-" + action.action_status.toLowerCase() : "",
                            departmentName: !!action.department_id ? _.find($scope.departments, {
                                value: action.department_id.toString()
                            }).name : ""
                        }));
                    });
                    if ($scope.actions.length > 0) {
                        // By default the first action is selected
                        $scope.selectedActionId = $scope.actions[0].id;
                        getActionDetails();
                    }
                    refreshScroller();
                };

                if (!!$scope.filterOptions.department) {
                    payLoad.department = $scope.filterOptions.department;
                }

                if ($scope.filterOptions.selectedStatus !== "ALL") {
                    payLoad.action_status = $scope.filterOptions.selectedStatus;
                }

                if (!!$scope.filterOptions.query) {
                    payLoad.query = $scope.filterOptions.query;
                }

                $scope.callAPI(rvActionTasksSrv.fetchActions, {
                    params: payLoad,
                    successCallBack: onFetchListSuccess
                });
            };

        //-------------------------------------------------------------------------------------------------------------- C.Scope Methods

        $scope.actionsFilterDateOptions = {
            firstDay: 1,
            changeYear: true,
            changeMonth: true,
            dateFormat: $rootScope.jqDateFormat,
            yearRange: "0:+10",
            onSelect: function (date, dateObj) {
                $scope.closeDateFilter();
                fetchActionsList();
            }
        };

        $scope.queryActions = function (isReset) {
            // isReset will be received as true from the template if user attempts to clears the query
            if (isReset) {
                $scope.filterOptions.query = "";
            }
            fetchActionsList();
        };

        $scope.initNewAction = function () {
            ngDialog.open({
                template: '/assets/partials/actionsManager/rvNewActionPopup.html',
                scope: $scope,
                controller: 'RVNewActionPopupCtrl',
                closeByDocument: true,
                closeByEscape: true
            });
        };

        $scope.onSelectAction = function (actionId) {
            $scope.selectedActionId = actionId;
            getActionDetails();
        };

        $scope.setActiveFilter = function (selectedFilter) {
            $scope.filterOptions.selectedStatus = selectedFilter;
            fetchActionsList();
        };

        $scope.toggleExtraFilters = function () {
            $scope.filterOptions.showFilters = !$scope.filterOptions.showFilters;
        };

        $scope.onDepartmentSelectionChange = function () {
            fetchActionsList();
        };

        //-------------------------------------------------------------------------------------------------------------- D. Listeners

        var listenerClosePopup = $scope.$on("CLOSE_POPUP", function () {
            ngDialog.close();
        });

        var listenerNewActionPosted = $scope.$on("NEW_ACTION_POSTED", function () {
            ngDialog.close();
        });

        //-------------------------------------------------------------------------------------------------------------- E. Cleanup

        $scope.$on('$destroy', listenerClosePopup);
        $scope.$on('$destroy', listenerNewActionPosted);

        init();
    }
]);