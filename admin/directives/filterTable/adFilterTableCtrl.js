admin.controller('adFilterTableController', ['$scope', 'ngTableParams', '$injector',
    function($scope, ngTableParams, $injector) {

        BaseCtrl.call(this, $scope);
        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        var filterService = $injector.get($scope.filterConfig.apiService);

        $scope.data = {};

        $scope.selectionConfig = {
            activeTab: "SELECTED",
            currentSelectedCount: 0,
            areAllItemsSelected: false,
            areSomeItemsSelected: false,
            noOfItemsSelected: 0
        };

        $scope.updateSelectedList = function() {
            $scope.selectionConfig.currentSelectedCount = _.where($scope.data, {
                isSelected: true
            }).length;

            $scope.selectionConfig.areAllItemsSelected = $scope.data.length > 0 && $scope.selectionConfig.currentSelectedCount === $scope.data.length;
            $scope.selectionConfig.areSomeItemsSelected = $scope.selectionConfig.currentSelectedCount > 0 && !$scope.selectionConfig.areAllItemsSelected;
        };

        /**
         * [processSelectedItems remove the unselected item]
         * @param  {[type]} itemIds [description]
         * @return {[type]}         [description]
         */
        var processSelectedItems = function(itemIds, currentPageList) {

            var selectedRooms = _.where(currentPageList, {
                    isSelected: true
                }),
                currentPageRoomIds = _.pluck(selectedRooms, $scope.filterConfig.trackByKey || 'id');

            itemIds = _.union(itemIds, currentPageRoomIds);

            _.each(currentPageList, function(item) {
                _.each(itemIds, function(itemId, key) {
                    if (item.id === itemId && !item.isSelected) {
                        itemIds.splice(key, 1);
                    }
                });
            });
            return itemIds;
        };

        /**
         * [handleCurrentSelectedPage on page change, mark already selected item as selected]
         * @param  {[type]} alreadyChosenRoomIds [description]
         * @return {[type]}                      [description]
         */
        var handleCurrentSelectedPage = function(alreadyChosenRoomIds, currentPageList) {
            _.each(currentPageList, function(item) {
                _.each(alreadyChosenRoomIds, function(itemId) {
                    if (item.id === itemId) {
                        item.isSelected = true;
                    }
                });
            });
            return currentPageList;
        };

        /**
         * [updateDataSet update the list of items that needs to be saved to sever]
         * @return {[type]} [description]
         */
        var updateDataSet = function() {
            if ($scope.selectionConfig.activeTab === "SELECTED") {
                $scope.filterConfig.selectedExcludedIds = processSelectedItems($scope.filterConfig.selectedExcludedIds, $scope.data);
            } else {
                $scope.filterConfig.unSelectedExcludedIds = processSelectedItems($scope.filterConfig.unSelectedExcludedIds, $scope.data);
            }
        };

        /**
         * [toggleSelectAllItems choose All/ unselect All]
         * @return {[type]} [description]
         */
        $scope.toggleSelectAllItems = function() {
            $scope.selectionConfig.areAllItemsSelected = !$scope.selectionConfig.areAllItemsSelected;
            _.each($scope.data, function(item) {
                item.isSelected = $scope.selectionConfig.areAllItemsSelected;
            });
            $scope.updateSelectedList();
            updateDataSet();
        };

        $scope.toggleSelectItem = function(item) {
            item.isSelected = !item.isSelected;
            updateDataSet();
            $scope.updateSelectedList();
        };

        $scope.displayCountChanged = function(count) {
            $scope.displyCount = count;
        };

        /**
         * [toggleAvailableItems tab actions]
         * @return {[type]} [description]
         */
        $scope.toggleAvailableItems = function() {
            $scope.selectionConfig.activeTab = $scope.selectionConfig.activeTab === "UNSELECTED" ? "SELECTED" : "UNSELECTED";
            $scope.reloadTable();
        };

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params),
                fetchSuccessOfItemList = function(data) {

                    $scope.$emit('hideLoader');
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = data.total_count;
                    $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                    $scope.data = data[$scope.filterConfig.resultsKey || 'items'];
                    if ($scope.selectionConfig.activeTab === "SELECTED") {
                        // set the isSelected Flag for items if in already
                        // selected list
                        $scope.data = handleCurrentSelectedPage($scope.filterConfig.selectedExcludedIds, $scope.data);
                        // $scope.selectionConfig.noOfItemsSelected = data.total_count;
                        $scope.filterConfig.noOfItemsSelected = data.total_count;
                    } else {
                        $scope.data = handleCurrentSelectedPage($scope.filterConfig.unSelectedExcludedIds, $scope.data);
                    }
                    $scope.currentPage = params.page();
                    params.total(data.total_count);
                    $defer.resolve($scope.data);
                    $scope.updateSelectedList();
                };

            if ($scope.filterConfig.serviceMethodParams) {
                getParams = _.extend(getParams, $scope.filterConfig.serviceMethodParams);
            }

            if ($scope.singleTab) {
                $scope.invokeApi(filterService[$scope.filterConfig.serviceMethodName], getParams, fetchSuccessOfItemList);
            } else if ($scope.selectionConfig.activeTab === 'UNSELECTED') {
                $scope.invokeApi(filterService.fetchUnselectedList, getParams, fetchSuccessOfItemList);
            } else {
                $scope.invokeApi(filterService.fetchSelectedList, getParams, fetchSuccessOfItemList);
            }
        };


        $scope.loadTable = function() {
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount, // count per page
                sorting: {
                    // room_no: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: $scope.fetchTableData
            });
        };

        $scope.loadTable();

        $scope.$on('SAVE_SETTINGS_SUCCESS', function() {
            $scope.filterConfig.selectedExcludedIds = [];
            $scope.filterConfig.unSelectedExcludedIds = [];
            $scope.selectionConfig.activeTab = "SELECTED";
            $scope.reloadTable();
        });

    }
]);