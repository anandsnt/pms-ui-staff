sntRover.controller('RVActionsManagerController', ['$scope', '$rootScope', 'ngDialog', 'rvActionTasksSrv', 'departments', 'dateFilter', 'rvUtilSrv', '$state',
    function ($scope, $rootScope, ngDialog, rvActionTasksSrv, departments, dateFilter, rvUtilSrv, $state) {
        BaseCtrl.call(this, $scope);

        //-------------------------------------------------------------------------------------------------------------- B. Local Methods
        var init = function () {
                $scope.$emit("updateRoverLeftMenu", "actionManager");
                var heading = 'Actions Manager';
                $scope.setScroller("rvActionListScroller", {
                    scrollbars: true,
                    preventDefault: false,
                    fadeScrollbars: true
                });
                $scope.departments = departments.data.departments;
                if (!!$state.params.restore && !!rvActionTasksSrv.getFilterState()) {
                    $scope.filterOptions = rvActionTasksSrv.getFilterState();
                }
                setHeadingAndTitle(heading);
                fetchActionsList();
            },
            setHeadingAndTitle = function (heading) {
                $scope.heading = heading;
                $scope.setTitle(heading);
            },
            refreshScroller = function () {
                $scope.refreshScroller('rvActionListScroller');
            }, getBindabaleAction = function (response) {
                var action = angular.copy(response);
                action.department = action.assigned_to && action.assigned_to.id || "";
                var splitDueTimeString = action.due_at_str.split("T");
                action.dueDate = dateFilter(splitDueTimeString[0], $rootScope.dateFormatForAPI);
                action.dueTime = dateFilter(splitDueTimeString[0] + "T" +  splitDueTimeString[1].split(/[+-]/)[0], "HH:mm");
                return action;
            },
            getActionDetails = function () {
                if (!!$scope.filterOptions.selectedActionId) {
                    $scope.callAPI(rvActionTasksSrv.getActionDetails, {
                        params: $scope.filterOptions.selectedActionId,
                        successCallBack: function (response) {
                            $scope.selectedAction = getBindabaleAction(response.data);
                        }
                    })
                }
            },
            fetchActionsList = function () {
                var payLoad = {
                    date: dateFilter($scope.filterOptions.selectedDay, $rootScope.dateFormatForAPI),
                    per_page: $scope.filterOptions.perPage,
                    page: $scope.filterOptions.page
                }, onFetchListSuccess = function (response) {
                    //catch empty pages
                    if (response.results.length === 0 && response.total_count !== 0 && $scope.filterOptions.page !== 1) {
                        $scope.filterOptions.page = 1;
                        fetchActionsList();
                    }

                    //Pagination
                    $scope.filterOptions.totalCount = response.total_count;
                    $scope.filterOptions.startRecord = (($scope.filterOptions.page - 1) * $scope.filterOptions.perPage) + 1;
                    if (response.results.length === $scope.filterOptions.perPage) {
                        $scope.filterOptions.endRecord = $scope.filterOptions.page * $scope.filterOptions.perPage;
                    } else {
                        $scope.filterOptions.endRecord = $scope.filterOptions.startRecord + response.results.length - 1;
                    }
                    $scope.filterOptions.isLastPage = $scope.filterOptions.endRecord === $scope.filterOptions.totalCount;


                    //Parsing
                    $scope.actions = [];

                    _.each(response.results, function (action) {
                        $scope.actions.push(_.extend(action, {
                            assigned: !!action.department_id,
                            isCompleted: action.action_status === $scope._actionCompleted,
                            iconClass: action.action_status ? "icon-" + action.action_status.toLowerCase() : "",
                            departmentName: !!action.department_id ? _.find($scope.departments, {
                                value: action.department_id.toString()
                            }).name : ""
                        }));
                    });

                    if ($scope.actions.length > 0) {
                        // By default the first action is selected
                        // While coming back from staycard, the previously selected action is selected
                        var selectedAction = _.findWhere($scope.actions, {
                            id: $scope.filterOptions.selectedActionId
                        })
                        if (!selectedAction) {
                            $scope.filterOptions.selectedActionId = $scope.actions[0].id;
                        }
                        getActionDetails();
                    } else {
                        $scope.$broadcast("INIT_NEW_ACTION");
                    }
                    refreshScroller();
                };

                if (!!$scope.filterOptions.department) {
                    payLoad.department_id = $scope.filterOptions.department.value;
                }

                if ($scope.filterOptions.selectedStatus !== "ALL") {
                    payLoad.action_status = $scope.filterOptions.selectedStatus;
                }

                if (!!$scope.filterOptions.query) {
                    payLoad.query = $scope.filterOptions.query;
                }
                if($scope.filterOptions.selectedView == "GUEST"){
                    $scope.callAPI(rvActionTasksSrv.fetchActions, {
                    params: payLoad,
                    successCallBack: onFetchListSuccess
                });
                } else if($scope.filterOptions.selectedView == "GROUP"){
                    $scope.callAPI(rvActionTasksSrv.fetchGroupActions, {
                    params: payLoad,
                    successCallBack: onFetchListSuccess
                });
                }
            },
            updateListEntry = function () {
                var currentAction = _.find($scope.actions, function (action) {
                    return action.id === $scope.filterOptions.selectedActionId
                }), departmentId = $scope.selectedAction.assigned_to && $scope.selectedAction.assigned_to.id;


                _.extend(currentAction, {
                    action_status: $scope.selectedAction.action_status,
                    iconClass: $scope.selectedAction.action_status ? "icon-" + $scope.selectedAction.action_status.toLowerCase() : "",
                    department_id: departmentId,
                    assigned: !!departmentId,
                    departmentName: !!departmentId ? _.find($scope.departments, {
                        value: departmentId.toString()
                    }).name : "",
                    isCompleted: !!$scope.selectedAction.completed_at
                })
            },
            addDatePickerOverlay = function () {
                angular.element("#ui-datepicker-div").after(angular.element('<div></div>', {
                    id: "ui-datepicker-overlay"
                }));
            },
            removeDatePickerOverlay = function () {
                angular.element("#ui-datepicker-overlay").remove();
            },
            datePickerConfig = {
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1,
                beforeShow: addDatePickerOverlay,
                onClose: removeDatePickerOverlay
            };


        //-------------------------------------------------------------------------------------------------------------- B. Scope Variables

        $scope._actionCompleted = "COMPLETED";

        $scope.timeSelectorList = rvUtilSrv.getListForTimeSelector (15, 12);

        $scope.filterOptions = {
            showFilters: false,
            selectedDay: $rootScope.businessDate,
            selectedView: "GUEST",
            department: "",
            selectedStatus: "ALL", // other values "ASSIGNED", "UNASSIGNED", "COMPLETED",
            query: "",
            page: 1,
            perPage: 25,
            totalCount: 0,
            startRecord: 1,
            endRecord: null,
            isLastPage: false,
            selectedActionId: null
        };

        $scope.selectedAction = {
            dueTime: "00:00"
        };

        $scope.selectDateOptions = _.extend(angular.copy(datePickerConfig), {
            defaultDate: tzIndependentDate($rootScope.businessDate),
                onSelect: fetchActionsList

        });

        $scope.dueDateEditOptions = _.extend(angular.copy(datePickerConfig), {
            minDate: tzIndependentDate($rootScope.businessDate),
            onSelect: function (date, datePickerObj) {
                $scope.selectedAction.dueDate = new tzIndependentDate(rvUtilSrv.get_date_from_date_picker(datePickerObj));
                $scope.updateAction();
            }
        });

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
                controller: 'RVNewActionCtrl',
                closeByDocument: true,
                closeByEscape: true
            });
        };

        $scope.onSelectAction = function (actionId) {
            $scope.filterOptions.selectedActionId = actionId;
            getActionDetails();
        };

        $scope.setActiveFilter = function (selectedFilter) {
            $scope.filterOptions.selectedStatus = selectedFilter;
            fetchActionsList();
        };

        $scope.toggleExtraFilters = function () {
            $scope.filterOptions.showFilters = !$scope.filterOptions.showFilters;
        };

        $scope.switchTab = function (selectedTab) {
            $scope.filterOptions.selectedView = selectedTab;
            fetchActionsList();
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
            var payLoad = {
                action_task: {
                    id: $scope.selectedAction.id
                },
                assigned_to: $scope.selectedAction.department || null,
                due_at: dateFilter($scope.selectedAction.dueDate, $rootScope.dateFormatForAPI) +
                ($scope.selectedAction.dueTime ? "T" + $scope.selectedAction.dueTime + ":00" : "")
            }

            if($scope.selectedAction.selectedView == "GUEST") {
                payLoad.reservation_id = $scope.selectedAction.reservation_id;
            } else if($scope.selectedAction.selectedView == "GROUP") {
                payLoad.group_id = $scope.selectedAction.group_id;
            }

            if ($scope.selectedAction.action_status === $scope._actionCompleted) {
                payLoad.is_complete = true;
            }
            $scope.callAPI(rvActionTasksSrv.updateNewAction, {
                params: payLoad,
                successCallBack: function (response) {
                    $scope.selectedAction = getBindabaleAction(response.data);
                    updateListEntry();
                }
            })
            ngDialog.close();
        };

        $scope.completeAction = function () {
            $scope.selectedAction.action_status = $scope._actionCompleted;
            $scope.updateAction();
        };

        $scope.toStayCard = function () {
            //Store the state of the filters so that while coming back from staycard the correct page can be loaded
            rvActionTasksSrv.setFilterState($scope.filterOptions);
            $state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
                "id": $scope.selectedAction.reservation_id,
                "confirmationId": $scope.selectedAction.reservation_confirm_no,
                "isrefresh": false
            });
        };

        $scope.toGroup = function () {
            //Store the state of the filters so that while coming back from staycard the correct page can be loaded
            rvActionTasksSrv.setFilterState($scope.filterOptions);
            $state.go('rover.groups.config', {
                "id": $scope.selectedAction.group_id,
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
            fetchActionsList();
        });

        //-------------------------------------------------------------------------------------------------------------- E. Cleanup

        $scope.$on('$destroy', listenerClosePopup);
        $scope.$on('$destroy', listenerNewActionPosted);

        init();
    }
]);