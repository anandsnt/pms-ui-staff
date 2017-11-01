    admin.controller('ADAssignRoomsToSectionsCtrl', ['$scope', 'ADHKSectionSrv', 'ngTableParams',
        function($scope, ADHKSectionSrv, ngTableParams) {

            BaseCtrl.call(this, $scope);
            ADBaseTableCtrl.call(this, $scope, ngTableParams);

            // Initialize the controller
            var init = function() {
                    $scope.roomAssignment = {
                        selectedHkSectionIndex: 0,
                        activeTab: $scope.hkSections && $scope.hkSections[0] && $scope.hkSections[0].assigned_rooms_count > 0 ? "ASSIGNED" : "AVAILABLE", // Available options are AVAILABLE and ASSIGNED
                        currentSelectedCount: 0,
                        areAllRoomsSelected: false,
                        areSomeRoomsSelected: false
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
                    $scope.reloadTable();
                    $scope.$emit("ASSIGNMENT_CHANGED");
                    updateSelectedList();
                };


            // Handles the selection of a particular hk section
            $scope.selectHKSection = function(hkSectionIdx) {
                $scope.roomAssignment.selectedHkSectionIndex = hkSectionIdx;
                if ($scope.roomAssignment.activeTab === "AVAILABLE" && $scope.hkSections[hkSectionIdx].assigned_rooms_count > 0) {
                    $scope.roomAssignment.activeTab = "ASSIGNED";
                } else if ($scope.roomAssignment.activeTab === "ASSIGNED") {
                    if ($scope.hkSections[hkSectionIdx].assigned_rooms_count <= 0) {
                        $scope.roomAssignment.activeTab = "AVAILABLE";
                    }
                }
                $scope.reloadTable();
            };

            // Toggle between available and assigned rooms
            $scope.toggleAvailableRooms = function() {
                $scope.roomAssignment.activeTab = $scope.roomAssignment.activeTab === "AVAILABLE" ? "ASSIGNED" : "AVAILABLE";
                $scope.reloadTable();
            };

            // Fetch room data
            $scope.fetchTableData = function($defer, params) {
                var getParams = $scope.calculateGetParams(params),
                    fetchSuccessOfItemList = function(data) {
                        $scope.currentClickedElement = -1;
                        $scope.totalCount = data.total_count;
                        $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                        $scope.data = data.rooms;
                        $scope.currentPage = params.page();
                        params.total(data.total_count);
                        $defer.resolve($scope.data);
                        updateSelectedList();
                    },
                    options = {
                        params: getParams,
                        successCallBack: fetchSuccessOfItemList
                    };

                if ($scope.roomAssignment.activeTab === "AVAILABLE") {
                    $scope.callAPI(ADHKSectionSrv.getUnAssignedRooms, options);
                } else {
                    getParams = _.extend(getParams, {
                        hKsectionId: $scope.hkSections[$scope.roomAssignment.selectedHkSectionIndex].id
                    });
                    options.params = getParams;
                    $scope.callAPI(ADHKSectionSrv.getHKSectionDetails, options);
                }
            };

            // Loads the table to render the rooms
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

            // Toggle all selection
            $scope.toggleSelectAllRooms = function() {
                $scope.roomAssignment.areAllRoomsSelected = !$scope.roomAssignment.areAllRoomsSelected;
                _.each($scope.data, function(room) {
                    room.isSelected = $scope.roomAssignment.areAllRoomsSelected;
                });
                updateSelectedList();
            };

            // Toggle the selection of a particular room
            $scope.toggleSelectRoom = function(room) {
                room.isSelected = !room.isSelected;
                updateSelectedList();
            };

            // Invokes the assign/unassign api
            $scope.commitChanges = function() {
                var selectedRooms = _.where($scope.data, {
                        isSelected: true
                    }),
                    params = {
                        hkSectionId: $scope.hkSections[$scope.roomAssignment.selectedHkSectionIndex].id,
                        payLoad: {
                            room_ids: _.pluck(selectedRooms, 'id')
                        }
                    };

                if ($scope.roomAssignment.activeTab === "AVAILABLE") {
                    $scope.invokeApi(ADHKSectionSrv.assignRooms, params, onSaveSuccess);
                } else {
                    $scope.invokeApi(ADHKSectionSrv.unAssignRooms, params, onSaveSuccess);
                }
            };

            // Handler for save rooms
            $scope.onSaveChanges = function() {
                $scope.commitChanges();
            };

            // Handler for cancel selection
            $scope.onCancelChanges = function() {
                $scope.toggleAvailableRooms();
            };

            init();
        }
    ]);
