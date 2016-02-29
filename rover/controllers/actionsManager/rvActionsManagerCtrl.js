sntRover.controller('RVActionsManagerController', ['$scope', '$rootScope', 'ngDialog', 'rvActionTasksSrv', 'departments', 'dateFilter', 'rvUtilSrv', '$state',
    function ($scope, $rootScope, ngDialog, rvActionTasksSrv, departments, dateFilter, rvUtilSrv, $state) {

        //-------------------------------------------------------------------------------------------------------------- A. Scope Variables

        $scope._actionCompleted = "COMPLETED";

        $scope.filterOptions = {
            showFilters: false,
            selectedDay: $rootScope.businessDate,
            selectedDepartment: "",
            selectedStatus: "ALL", // other values "ASSIGNED", "UNASSIGNED", "COMPLETED",
            query: "",
            page: 1,
            perPage: 5,
            totalCount: null
        };

        $scope.selectedAction = {};

        $scope.selectDateOptions = {
            defaultDate: tzIndependentDate($rootScope.businessDate),
            dateFormat: $rootScope.jqDateFormat,
            numberOfMonths: 1,
            onSelect: function () {
                fetchActionsList();
            }
        };

        $scope.dueDateEditOptions = {
            dateFormat: $rootScope.jqDateFormat,
            numberOfMonths: 1,
            onSelect: function (date, datePickerObj) {
                $scope.selectedAction.dueDate = new tzIndependentDate(rvUtilSrv.get_date_from_date_picker(datePickerObj));
                $scope.updateAction();
            }
        }

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
                        $scope.selectedAction = angular.copy(response.data);
                    }
                })
            },
            fetchActionsList = function () {
                var payLoad = {
                    date: dateFilter($scope.filterOptions.selectedDay, "yyyy-MM-dd"),
                    per_page: $scope.filterOptions.perPage,
                    page: $scope.filterOptions.page
                }, onFetchListSuccess = function (response) {
                    $scope.filterOptions.totalCount = response.total_count;
                    $scope.filterOptions.startRecord = (($scope.filterOptions.page - 1) * $scope.filterOptions.perPage) + 1;
                    // TODO : endRecord on last page
                    $scope.filterOptions.endRecord = $scope.filterOptions.page * $scope.filterOptions.perPage;
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

        $scope.changeAssignment = function () {
            ngDialog.open({
                template: '/assets/partials/actionsManager/rvActionAssignmentPopup.html',
                scope: $scope,
                closeByDocument: true,
                closeByEscape: true
            });
        };

        $scope.updateAction = function () {
            console.log('update', $scope.selectedAction);
            ngDialog.close();
        };

        $scope.completeAction = function () {
            $scope.selectedAction.action_status = $scope._actionCompleted;
            $scope.updateAction();
        };

        $scope.toStayCard = function () {
            $state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
                "id": $scope.selectedAction.reservation_id,
                "confirmationId": $scope.selectedAction.reservation_confirm_no,
                "isrefresh": false
            });
        };

        $scope.loadPrevPage = function () {
            $scope.filterOptions.page--;
            fetchActionsList();
        };

        $scope.loadNextPage = function () {
            $scope.filterOptions.page++;
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