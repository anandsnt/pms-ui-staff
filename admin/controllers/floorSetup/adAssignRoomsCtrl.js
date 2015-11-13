admin.controller('ADAssignRoomsCtrl', ['$scope', 'ADFloorSetupSrv', 'ngTableParams', 'ngDialog', 'adTransactionCenterSrv', '$state',
    function($scope, ADFloorSetupSrv, ngTableParams, ngDialog, adTransactionCenterSrv, $state) {
        
        BaseCtrl.call(this, $scope);
        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        var outwardNavigation = {
                "MANAGE_FLOORS": 0,
                "TAB_SWITCH": 1,
                "FLOOR_CHANGE": 3,
                "STATE_CHANGE": 4,
                "OPEN_MENU": 5
            },
            initController = function() {
                $scope.roomAssignment = {
                    selectedFloorIndex: 0,
                    activeTab: $scope.floorsList && $scope.floorsList[0] && $scope.floorsList[0].assigned_rooms_count > 0 ? "ASSIGNED" : "AVAILABLE", // Available options are AVAILABLE and ASSIGNED
                    currentSelectedCount: 0,
                    areAllRoomsSelected: false,
                    areSomeRoomsSelected: false,
                    selectedRooms: [], // This array persists selected rooms across pages
                    filterSelectedRooms: 'ALL'
                };
                $scope.loadTable();
            },
            updateSelectedList = function() {
                $scope.roomAssignment.currentSelectedCount = _.where($scope.data, {
                    isSelected: true
                }).length;

                $scope.roomAssignment.areAllRoomsSelected = $scope.data.length > 0 && $scope.roomAssignment.currentSelectedCount === $scope.data.length;
                $scope.roomAssignment.areSomeRoomsSelected = $scope.roomAssignment.currentSelectedCount > 0 && !$scope.roomAssignment.areAllRoomsSelected;
            },
            updateParentsAboutSelectedRooms = function() {
                if (!!$scope.roomAssignment.selectedRooms && !!$scope.roomAssignment.selectedRooms.length) {
                    adTransactionCenterSrv.beginTransaction('SELECT_ROOMS_IN_ASSIGN_FLOORS');
                } else {
                    adTransactionCenterSrv.endTransaction('SELECT_ROOMS_IN_ASSIGN_FLOORS');
                }
            },
            onSaveSuccess = function() {
                if ($scope.roomAssignment.activeTab === "ASSIGNED") {
                    $scope.closeDialog();
                }
                $scope.reloadTable();
                clearPersistedRoomsList();
                $scope.$emit("ASSIGNMENT_CHANGED");
            },
            persistSelection = function(room, toggleIndividualRoom) {
                //In case room is already available in selected list --> remove it! else append it to the list
                var inList = _.detect($scope.roomAssignment.selectedRooms, {
                    id: room.id
                });
                if (!!inList && !!inList.id && toggleIndividualRoom) {
                    $scope.roomAssignment.selectedRooms = _.without($scope.roomAssignment.selectedRooms, inList);
                } else {
                    $scope.roomAssignment.selectedRooms.push(room);
                }
                updateParentsAboutSelectedRooms();
            },
            updateSelectedStatus = function() {
                _.each($scope.roomAssignment.selectedRooms, function(room) {
                    var roomInPage = _.detect($scope.data, {
                        id: room.id
                    });
                    if (!!roomInPage && !!roomInPage.id) {
                        roomInPage.isSelected = true;
                    }
                });
            },
            promptUserCommit = function(userAction, params) {

                ngDialog.open({
                    template: '/assets/partials/floorSetups/adRoomAssignmentConfirmationPopup.html',
                    scope: $scope,
                    closeByDocument: true,
                    className: 'ngdialog-theme-default single-calendar-modal',
                    data: JSON.stringify({
                        roomCount: $scope.roomAssignment.selectedRooms.length,
                        floorName: $scope.floorsList[$scope.roomAssignment.selectedFloorIndex].floor_number,
                        userAction: userAction,
                        params: params
                    })
                });

            },
            clearPersistedRoomsList = function() {
                $scope.roomAssignment.selectedRooms = [];
                updateParentsAboutSelectedRooms();
            };

        // /===================/ METHODS IN SCOPE /===================/ //

        $scope.selectFloor = function(floorIdx) {
            if (!!$scope.roomAssignment.selectedRooms.length) {
                promptUserCommit(outwardNavigation.FLOOR_CHANGE, {
                    floorIdx: floorIdx
                });
            } else {
                $scope.roomAssignment.selectedFloorIndex = floorIdx;
                if ($scope.roomAssignment.activeTab === "AVAILABLE" && $scope.floorsList[floorIdx].assigned_rooms_count > 0) {
                    $scope.roomAssignment.activeTab = "ASSIGNED";
                    $scope.reloadTable();
                } else if ($scope.roomAssignment.activeTab === "ASSIGNED") {
                    if ($scope.floorsList[floorIdx].assigned_rooms_count <= 0) {
                        $scope.roomAssignment.activeTab = "AVAILABLE";
                    }
                    $scope.reloadTable();
                }
            }
        };

        $scope.closeDialog = function() {
            ngDialog.close();
        };

        $scope.toggleAvailableRooms = function() {
            if (!!$scope.roomAssignment.selectedRooms.length) {
                promptUserCommit(outwardNavigation.TAB_SWITCH)
            } else {
                $scope.roomAssignment.activeTab = $scope.roomAssignment.activeTab === "AVAILABLE" ? "ASSIGNED" : "AVAILABLE";
                $scope.reloadTable();
                clearPersistedRoomsList();
            }
        };

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params),
                fetchSuccessOfItemList = function(data) {
                    $scope.$emit('hideLoader');
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = data.total_count;
                    $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                    $scope.data = data.rooms;
                    $scope.currentPage = params.page();
                    params.total(data.total_count);
                    $defer.resolve($scope.data);
                    updateSelectedStatus();
                    updateSelectedList();
                    $scope.closeDialog();
                };
            if ($scope.roomAssignment.activeTab === "AVAILABLE") {
                $scope.invokeApi(ADFloorSetupSrv.getUnAssignedRooms, getParams, fetchSuccessOfItemList);
            } else {
                getParams = _.extend(getParams, {
                    floorID: $scope.floorsList[$scope.roomAssignment.selectedFloorIndex].id
                });
                $scope.invokeApi(ADFloorSetupSrv.getFloorDetails, getParams, fetchSuccessOfItemList);
            }
        };


        $scope.loadTable = function() {
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount, // count per page
                sorting: {
                    room_no: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: $scope.fetchTableData
            });
        };

        $scope.toggleSelectAllRooms = function() {
            $scope.roomAssignment.areAllRoomsSelected = !$scope.roomAssignment.areAllRoomsSelected;
            _.each($scope.data, function(room) {
                room.isSelected = $scope.roomAssignment.areAllRoomsSelected;
                persistSelection(room);
            });
            updateSelectedList();
        };

        $scope.toggleSelectRoom = function(room) {
            room.isSelected = !room.isSelected;
            updateSelectedList();
            persistSelection(room, true); //second param is to toggleIndividualRoom
        };

        $scope.commitChanges = function() {
            var params = {
                floorID: $scope.floorsList[$scope.roomAssignment.selectedFloorIndex].id,
                payLoad: {
                    room_ids: _.pluck($scope.roomAssignment.selectedRooms, 'id')
                }
            };

            if ($scope.roomAssignment.activeTab === "AVAILABLE") {
                $scope.invokeApi(ADFloorSetupSrv.assignRooms, params, onSaveSuccess);
            } else {
                $scope.invokeApi(ADFloorSetupSrv.unAssignRooms, params, onSaveSuccess);
            }
        }

        $scope.onSaveChanges = function() {
            $scope.commitChanges();
        };

        $scope.onContinueAction = function(userAction, params) {
            $scope.closeDialog();
            // Reset selected Rooms
            clearPersistedRoomsList();
            // Continue with user action after the user proceeds to ignore his/her selection of rooms
            switch (userAction) {
                case outwardNavigation.MANAGE_FLOORS:
                    $scope.toggleAssignFloors();
                    break;
                case outwardNavigation.TAB_SWITCH:
                    $scope.toggleAvailableRooms();
                    break;
                case outwardNavigation.FLOOR_CHANGE:
                    $scope.selectFloor(params.floorIdx);
                    break;
                case outwardNavigation.STATE_CHANGE:
                    $state.go(params.toState.name, params.toParams);
                    break;
                case outwardNavigation.OPEN_MENU:
                    $scope.$emit('navToggled');
                    break;
                default:
                    console.log("user action" + userAction + "NOT handled", params);
            }
        };

        $scope.onCancelChanges = function() {
            // On cancel -> Navigate back to manage floors in case user has nothing selected pending commit
            clearPersistedRoomsList();
            $scope.toggleAssignFloors();
        };

        // /===================/ LISTENERS /===================/ //

        var eventListener = $scope.$on("CONFIRM_USER_ACTION", function(event, message) {
            // Additional Check here as Emits and Broadcasts are used to communicate between parents and children
            if (!!$scope.roomAssignment.selectedRooms.length) {
                promptUserCommit(outwardNavigation[message.userAction], message.params);
            } else {
                $scope.onContinueAction(outwardNavigation[message.userAction], message.params)
            }
        });

        $scope.$on('$destroy', eventListener);

        initController();
    }
]);