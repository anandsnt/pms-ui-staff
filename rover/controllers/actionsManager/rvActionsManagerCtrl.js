sntRover.controller('RVActionsManagerController',
    ['$scope',
    '$rootScope',
    'ngDialog',
    'rvActionTasksSrv',
    'departments',
    'dateFilter',
    'rvUtilSrv',
    '$state',
    'RVreportsSubSrv',
    '$window',
    '$timeout',
    '$filter',
    'rvPermissionSrv',
    function ($scope, $rootScope,
             ngDialog, rvActionTasksSrv,
             departments, dateFilter,
             rvUtilSrv, $state,
             reportsSubSrv, $window,
            $timeout, $filter, rvPermissionSrv ) {
        BaseCtrl.call(this, $scope);

        // -------------------------------------------------------------------------------------------------------------- B. Local Methods
        var init = function () {
                $scope.$emit("updateRoverLeftMenu", "actionManager");
                var heading = 'Actions Manager';

                $scope.setScroller("rvActionListScroller", {
                    scrollbars: true,
                    preventDefault: false,
                    fadeScrollbars: true
                });

                $scope.setScroller("create-action-scroller", {
                    scrollbars: true,
                    preventDefault: false,
                    fadeScrollbars: true
                });

                $scope.setScroller("actionSummaryScroller", {
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
                action.dueTimeAmPm = dateFilter(splitDueTimeString[0] + "T" +  splitDueTimeString[1].split(/[+-]/)[0], "hh:mm a");
                return action;
            },
            getActionDetails = function () {
                if (!!$scope.filterOptions.selectedActionId) {
                    $scope.callAPI(rvActionTasksSrv.getActionDetails, {
                        params: $scope.filterOptions.selectedActionId,
                        successCallBack: function (response) {
                            $scope.selectedAction = getBindabaleAction(response.data);
                            $scope.selectedView = "list";
                            refreshActionSummaryScroller();
                        }
                    });
                }
            },
            fetchActionsList = function () {
                var payLoad = {
                    date: dateFilter($scope.filterOptions.selectedDay, $rootScope.dateFormatForAPI),
                    per_page: $scope.filterOptions.perPage,
                    page: $scope.filterOptions.page
                }, onFetchListSuccess = function (response) {
                    // catch empty pages
                    if (response.results.length === 0 && response.total_count !== 0 && $scope.filterOptions.page !== 1) {
                        $scope.filterOptions.page = 1;
                        fetchActionsList();
                    }

                    // Pagination
                    $scope.filterOptions.totalCount = response.total_count;
                    $scope.filterOptions.startRecord = (($scope.filterOptions.page - 1) * $scope.filterOptions.perPage) + 1;
                    if (response.results.length === $scope.filterOptions.perPage) {
                        $scope.filterOptions.endRecord = $scope.filterOptions.page * $scope.filterOptions.perPage;
                    } else {
                        $scope.filterOptions.endRecord = $scope.filterOptions.startRecord + response.results.length - 1;
                    }
                    $scope.filterOptions.isLastPage = $scope.filterOptions.endRecord === $scope.filterOptions.totalCount;


                    // Parsing
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

                    if (!$scope.actions.length) {
                        $scope.selectedView = 'new';
                    }

                    if ($scope.actions.length > 0) {
                        // By default the first action is selected
                        // While coming back from staycard, the previously selected action is selected
                        var selectedAction = _.findWhere($scope.actions, {
                            id: $scope.filterOptions.selectedActionId
                        });

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
                if ($scope.filterOptions.selectedView == "GUEST") {
                    $scope.callAPI(rvActionTasksSrv.fetchActions, {
                    params: payLoad,
                    successCallBack: onFetchListSuccess
                });
                } else if ($scope.filterOptions.selectedView == "GROUP") {
                    $scope.callAPI(rvActionTasksSrv.fetchGroupActions, {
                    params: payLoad,
                    successCallBack: onFetchListSuccess
                });
                }
            },
            updateListEntry = function () {
                var currentAction = _.find($scope.actions, function (action) {
                    return action.id === $scope.filterOptions.selectedActionId;
                }), departmentId = $scope.selectedAction.assigned_to && $scope.selectedAction.assigned_to.id;


                _.extend(currentAction, {
                    action_status: $scope.selectedAction.action_status,
                    iconClass: $scope.selectedAction.action_status ? "icon-" + $scope.selectedAction.action_status.toLowerCase() : "",
                    department_id: departmentId,
                    assigned: !!departmentId,
                    departmentName: !!departmentId ? _.find($scope.departments, {
                        value: departmentId.toString()
                    }).name : "",
                    isCompleted: !!$scope.selectedAction.completed_at,
                    description: $scope.selectedAction.description
                });
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
            },
            refreshCreateActionScroller = function () {
                $scope.refreshScroller('create-action-scroller');
            },
            refreshActionSummaryScroller = function () {
                $scope.refreshScroller('actionSummaryScroller');
            };


        // -------------------------------------------------------------------------------------------------------------- B. Scope Variables

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

        // -------------------------------------------------------------------------------------------------------------- C.Scope Methods

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
            $scope.selectedView = "new";
            refreshCreateActionScroller();
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
                    id: $scope.selectedAction.id,
                    description: $scope.selectedAction.note
                },                
                due_at: dateFilter($scope.selectedAction.dueDate, $rootScope.dateFormatForAPI) +
                ($scope.selectedAction.dueTime ? "T" + $scope.selectedAction.dueTime + ":00" : "")
            };

            if ($scope.selectedAction.department) {
               payLoad.assigned_to = $scope.selectedAction.department.value;
            } else {
                payLoad.assigned_to = '';
            }            

            if (!!$scope.selectedAction.reservation_id) {
                payLoad.reservation_id = $scope.selectedAction.reservation_id;
            } else if (!!$scope.selectedAction.group_id) {
                payLoad.group_id = $scope.selectedAction.group_id;
            }

            if ($scope.selectedAction.action_status === $scope._actionCompleted) {
                payLoad.is_complete = true;
            }
            $scope.callAPI(rvActionTasksSrv.updateNewAction, {
                params: payLoad,
                successCallBack: function (response) {
                    $scope.selectedAction = getBindabaleAction(response.data);
                    $scope.selectedView = 'list';
                    updateListEntry();
                }
            });
            ngDialog.close();
        };

        $scope.completeAction = function () {
            $scope.selectedAction.action_status = $scope._actionCompleted;
            $scope.updateAction();
        };

        $scope.toStayCard = function () {
            // Store the state of the filters so that while coming back from staycard the correct page can be loaded
            rvActionTasksSrv.setFilterState($scope.filterOptions);
            $state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
                "id": $scope.selectedAction.reservation_id,
                "confirmationId": $scope.selectedAction.reservation_confirm_no,
                "isrefresh": false
            });
        };

        $scope.toGroup = function () {
            // Store the state of the filters so that while coming back from staycard the correct page can be loaded
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


        // -------------------------------------------------------------------------------------------------------------- D. Listeners

        var listenerClosePopup = $scope.$on("CLOSE_POPUP", function () {
            ngDialog.close();
        });

        var listenerNewActionPosted = $scope.$on("NEW_ACTION_POSTED", function () {
            ngDialog.close();
            $scope.selectedView = "list";
            fetchActionsList();
        });

        // -------------------------------------------------------------------------------------------------------------- E. Cleanup

        $scope.$on('$destroy', listenerClosePopup);
        $scope.$on('$destroy', listenerNewActionPosted);

        // add the print orientation before printing
        var addPrintOrientation = function() {
            $( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
        };

        // add the print orientation after printing
        var removePrintOrientation = function() {
            $( '#print-orientation' ).remove();
        };

        // Get the parameters required for the report
        var getReportParams = function() {
            var params = {};

            // report id for Action manager report
            params.id = 61;
            params.from_date = $filter('date')($scope.filterOptions.selectedDay, 'yyyy/MM/dd');
            params.to_date = params.from_date;
            params.assigned_departments = [];

            if ($scope.filterOptions.department == "") {
                _.each($scope.departments, function(department) {
                    params.assigned_departments.push(department.value);
                });
            } else {
                params.assigned_departments.push($scope.filterOptions.department.value);
            }

            if ($scope.filterOptions.selectedStatus === "ALL") {
                params.status = ["UNASSIGNED", "ASSIGNED", "COMPLETED"];
            } else {
                params.status = [$scope.filterOptions.selectedStatus];
            }

            params.actions_by = [$scope.filterOptions.selectedView];
            params.per_page = 1000;
            params.page = 1;

            return params;

        };

        // Set the filters that are applied to the report
        var setAppliedFilter = function() {
            $scope.appliedFilter = {};

            $scope.appliedFilter.date = dateFilter($scope.filterOptions.selectedDay, $rootScope.dateFormatForAPI);
            if ($scope.filterOptions.selectedStatus === 'ALL') {
               $scope.appliedFilter.completion_status = ['ALL STATUS'];
            } else {
               $scope.appliedFilter.completion_status = [$scope.filterOptions.selectedStatus];
            }

            if ($scope.filterOptions.department === '') {
                $scope.appliedFilter.assigned_departments = ['ALL DEPARTMENTS'];
            } else {
                $scope.appliedFilter.assigned_departments = [$scope.filterOptions.department.name];
            }

            $scope.appliedFilter.show = [$scope.filterOptions.selectedView];

            $scope.leftColSpan = 2;
            $scope.rightColSpan = 2;

        };

        // Print the action manager report from the action manager screen
        $scope.printActionManager = function() {

            var sucessCallback = function(data) {

                $scope.$emit('hideLoader');
                $scope.printActionManagerData = data;
                $scope.errorMessage = "";

                // add the orientation
                addPrintOrientation();

                var onPrintCompletion = function() {
                    $timeout(function() {
                        // CICO-9569 to solve the hotel logo issue
                        $("header .logo").removeClass('logo-hide');
                        $("header .h2").addClass('text-hide');
                        // remove the orientation after similar delay
                        removePrintOrientation();
                    }, 200); 
                };
                /*
                *   ======[ READY TO PRINT ]======
                */
                // this will show the popup with full bill
                $timeout(function() {

                    /*
                    *   ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                    */
                    if ( sntapp.cordovaLoaded ) {
                        cordova.exec(onPrintCompletion, function() {
                            onPrintCompletion();
                        }, 'RVCardPlugin', 'printWebView', []);
                    } else {
                        $window.print(); 
                        onPrintCompletion(); 
                    }
                }, 200);

            };

            var failureCallback = function(errorData) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorData;
            };

            var params = getReportParams();

            setAppliedFilter();

            $scope.invokeApi(reportsSubSrv.fetchReportDetails, params, sucessCallback, failureCallback);
        };

        // Checks whether edit/complete btn should be shown or not
        $scope.shouldShowEditAndCompleteBtn = function(action) {
            return ["UNASSIGNED", 'ASSIGNED'].indexOf(action.action_status) > -1;
        };

        // Checks whether delete button should be shown or not
        $scope.shouldShowDeleteBtn = function(action) {
            return ["UNASSIGNED", 'ASSIGNED', 'COMPLETED'].indexOf(action.action_status) > -1;
        };

        // Prepare the view for editing action
        $scope.prepareEditAction = function() {
            $scope.selectedView = 'edit';
        };

        // Cancel the edit operation
        $scope.cancelEdit = function() {
            $scope.selectedView = 'list';
        };

        // Checks the permission to edit action
        $scope.hasPermissionToEditAction = function() {
            return rvPermissionSrv.getPermissionValue('EDIT_ACTION');
        };

        // Checks the permission to edit action
        $scope.hasPermissionToDeleteAction = function() {
            return rvPermissionSrv.getPermissionValue('DELETE_ACTION');
        };

        // Prepare delete Action
        $scope.prepareDeletAction = function() {
            $scope.selectedAction.originalStatus = $scope.selectedAction.action_status;
            $scope.selectedAction.action_status = 'delete';
        };

        // Delete action
        $scope.deleteAction = function() {

          var onSuccess = function() {                    
                    fetchActionsList();
                },
                onFailure = function(data) {
                    // show failed msg, so user can try again-?
                    if (data[0]) {
                        $scope.errorMessage = 'Internal Error Occured';
                    }                    
                };
            var apiConfig = {
                params: $scope.selectedAction.id,
                onSuccess: onSuccess,
                onFailure: onFailure
            };
            
            $scope.errorMessage = [];

            $scope.callAPI(rvActionTasksSrv.deleteActionTask, apiConfig);            
        };

        // Cancel delete operation
        $scope.cancelDelete = function() {
            $scope.selectedAction.action_status = $scope.selectedAction.originalStatus;
        };

        // Get the action status info
        $scope.getActionStatusInfo = function(action) {
            var status = action.action_status;

            if (status === 'delete') {
                status = 'Delete Action?';
            } else if (action.over_due && status !== 'COMPLETED') {
                status = 'OVERDUE';
            }

            return status;
        };

        init();
    }
]);
