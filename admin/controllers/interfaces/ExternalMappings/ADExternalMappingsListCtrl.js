admin.controller('ADExternalMappingsListCtrl', ['$scope', '$state', '$stateParams', 'ADInterfaceMappingSrv', 'ngTableParams',
    function($scope, $state, $stateParams, ADInterfaceMappingSrv, ngTableParams) {

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        $scope.onClickAdd = function() {
            $state.go('admin.add-external-mapping', {
                hotel_id: $stateParams.hotel_id,
                interface_id: $stateParams.interface_id,
                interface_name: $stateParams.interface_name
            });
        };
        /*
         * This methode is to set page count.
         * @param {number} page count
         */
        $scope.displayCountChanged = function(count) {
            $scope.displyCount = count;
        };

        $scope.navigateBack = function() {
            $state.go('admin.externalMappings');
        };

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params),
                fetchSuccessOfItemList = function(data) {
                    $scope.$emit('hideLoader');
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = data.total_count;
                    $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                    $scope.data = data.mappings;
                    $scope.currentPage = params.page();
                    params.total(data.total_count);
                    $defer.resolve($scope.data);
                };

            getParams = _.extend(getParams, {
                interface_id: $stateParams.interface_id
            });
            $scope.invokeApi(ADInterfaceMappingSrv.fetchInterfaceExternalMappingsList, getParams, fetchSuccessOfItemList);
        };

        $scope.onClickDelete = function(mapping) {
            $scope.callAPI(ADInterfaceMappingSrv.deleteMappingWithId, {
                params: {
                    mapping_id: mapping.id
                },
                onSuccess: function() {
                    $scope.reloadTable();
                }
            });
        };

        $scope.onEditMapping = function(mapping) {
            $state.go('admin.edit-external-mapping', {
                hotel_id: $stateParams.hotel_id,
                interface_id: $stateParams.interface_id,
                interface_name: $stateParams.interface_name,
                mapping_id: mapping.id
            });
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

        (function() {
            $scope.totalCount = 0;

            $scope.interface = {
                name: $stateParams.interface_name
            };
            $scope.loadTable();
        })();
    }
]);
