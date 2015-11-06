admin.controller('ADAssignRoomsCtrl', ['$scope', 'ADFloorSetupSrv', 'ngTableParams',
    function($scope, ADFloorSetupSrv, ngTableParams) {
        BaseCtrl.call(this, $scope);
        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        var initController = function() {
                $scope.roomAssignment = {
                    selectedFloorIndex: 0,
                    activeTab: "AVAILABLE", // Available options are AVAILABLE and ASSIGNED
                    selectedCount: 0,
                    areAllRoomsSelected: false,
                    areSomeRoomsSelected: false
                };
                $scope.loadTable();
            }, 
            updateSelectedList = function() {
                $scope.roomAssignment.selectedCount = _.where($scope.data,{
                    isSelected : true
                }).length;

                $scope.roomAssignment.areAllRoomsSelected = $scope.roomAssignment.selectedCount === $scope.data.length;
                $scope.roomAssignment.areSomeRoomsSelected = $scope.roomAssignment.selectedCount > 0 && !$scope.roomAssignment.areAllRoomsSelected;
            };

        $scope.selectFloor = function(floorIdx) {
            $scope.roomAssignment.selectedFloorIndex = floorIdx;
            // IFF activeTab is ASSIGNED Redo the table --> call the API
            if($scope.roomAssignment.activeTab === "ASSIGNED"){
                $scope.reloadTable();
            }
        };

        $scope.toggleAvailableRooms = function() {
            $scope.roomAssignment.activeTab = $scope.roomAssignment.activeTab === "AVAILABLE" ? "ASSIGNED" : "AVAILABLE"
        };

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params),
                fetchSuccessOfItemList = function(data) {
                    $scope.$emit('hideLoader');
                    //No expanded rate view
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = data.total_count;
                    $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                    $scope.data = data.rooms;
                    $scope.currentPage = params.page();
                    params.total(data.total_count);
                    $defer.resolve($scope.data);
                };
            if($scope.roomAssignment.activeTab === "AVAILABLE"){
                $scope.invokeApi(ADFloorSetupSrv.getUnAssignedRooms, getParams, fetchSuccessOfItemList);
            }else{
                $scope.invokeApi(ADFloorSetupSrv.getUnAssignedRooms, getParams, fetchSuccessOfItemList);
            }
        };


        $scope.loadTable = function() {
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount, // count per page
                sorting: {
                    rate: 'asc' // initial sorting
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
            });
            updateSelectedList();
        };

        $scope.toggleSelectRoom = function(roomIdx) {
            $scope.data[roomIdx].isSelected = $scope.data[roomIdx].isSelected;
            updateSelectedList();
        };

        initController();
    }
]);