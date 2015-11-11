admin.controller('ADAssignRoomsCtrl', ['$scope', 'ADFloorSetupSrv', 'ngTableParams', 'ngDialog',
    function($scope, ADFloorSetupSrv, ngTableParams, ngDialog) {
        BaseCtrl.call(this, $scope);
        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        var initController = function() {
                $scope.roomAssignment = {
                    selectedFloorIndex: 0,
                    activeTab: $scope.floorsList && $scope.floorsList[0] && $scope.floorsList[0].assigned_rooms_count > 0 ? "ASSIGNED" : "AVAILABLE", // Available options are AVAILABLE and ASSIGNED
                    currentSelectedCount: 0,
                    areAllRoomsSelected: false,
                    areSomeRoomsSelected: false,
                    selectedRooms: [] // This array persists selected rooms across pages
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
            onSaveSuccess = function() {
                if ($scope.roomAssignment.activeTab === "ASSIGNED") {
                    $scope.closeDialog();
                }
                $scope.reloadTable();
                $scope.roomAssignment.selectedRooms = [];
                $scope.$emit("ASSIGNMENT_CHANGED");
            },
            resetSelectedCount = function() {
                $scope.roomAssignment.areAllRoomsSelected = false;
                $scope.roomAssignment.areSomeRoomsSelected = false;
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
            };

        $scope.selectFloor = function(floorIdx) {
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
        };

        $scope.closeDialog = function() {
            ngDialog.close();
        };

        $scope.toggleAvailableRooms = function() {
            $scope.roomAssignment.activeTab = $scope.roomAssignment.activeTab === "AVAILABLE" ? "ASSIGNED" : "AVAILABLE";
            $scope.reloadTable();
            $scope.roomAssignment.selectedRooms = [];
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
                    resetSelectedCount();
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
            room.isSelected = room.isSelected;
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

        $scope.onCancelChanges = function() {
            $scope.closeDialog();
            _.each($scope.data, function(room) {
                room.isSelected = false;
            });
            updateSelectedList();
        };

        initController();
    }
]);