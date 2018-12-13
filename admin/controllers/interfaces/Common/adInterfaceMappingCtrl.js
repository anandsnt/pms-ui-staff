admin.controller('adInterfaceMappingCtrl', [
    '$scope', 'adIFCInterfaceMappingSrv', 'adInterfacesCommonConfigSrv', 'ngTableParams',
    function($scope, adIFCInterfaceMappingSrv, adInterfacesCommonConfigSrv, ngTableParams) {
        BaseCtrl.call(this, $scope);

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        $scope.state = {
            mode: 'LIST',
            mappingTypes: $scope.mappingTypes.map(function(mappingType) {
                return {
                    name: mappingType,
                    text: mappingType
                };
            })
        };

        /**
         * returns empty mapping
         * @return {{typeof: string, value: string, external_value: string, meta_data: {cost_center: string}}} empty mapping
         */
        function fetchEmptyMapping() {
            return {
                typeof: (function() {
                    if ($scope.mappingTypes.length === 1) {
                        return $scope.mappingTypes[0];
                    }

                    return '';
                })(),
                value: '',
                external_value: ''
            };
        }

        $scope.onClickAdd = function() {
            if (!$scope.state.meta) {
                $scope.callAPI(adIFCInterfaceMappingSrv.fetchMeta, {
                    params: $scope.interface,
                    successCallBack: function(meta) {
                        $scope.state.meta = meta;
                        $scope.state.mode = 'ADD';
                    }
                });
            } else {
                $scope.state.mode = 'ADD';
            }
        };

        $scope.onClickSaveNew = function() {
            $scope.callAPI(adIFCInterfaceMappingSrv.add, {
                params: {
                    mapping: $scope.mapping,
                    interfaceIdentifier: $scope.interface
                },
                successCallBack: function() {
                    $scope.reloadTable();
                    $scope.state.mode = 'LIST';
                    $scope.mapping = fetchEmptyMapping();
                }
            });
        };

        /*
         * This method is to set page count.
         * @param {number} page count
         */
        $scope.displayCountChanged = function(count) {
            $scope.displyCount = count;
        };

        $scope.onCancelDetailedView = function() {
            resetAllEdits();
            $scope.state.mode = 'LIST';
        };

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params),
                fetchSuccessOfItemList = function(data) {
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = data.total_count;
                    $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                    $scope.data = data.data;
                    $scope.currentPage = params.page();
                    params.total(data.total_count);
                    $defer.resolve($scope.data);
                };

            $scope.callAPI(adIFCInterfaceMappingSrv.fetch, {
                params: getParams,
                successCallBack: fetchSuccessOfItemList
            });
        };

        $scope.onClickDelete = function(mapping) {
            $scope.callAPI(adIFCInterfaceMappingSrv.delete, {
                params: {
                    id: mapping.id,
                    interfaceIdentifier: $scope.interface
                },
                onSuccess: function() {
                    $scope.reloadTable();
                }
            });
        };

        /**
         * @return {undefined} undefined
         */
        function resetAllEdits() {
            $scope.data.map(function(mapping) {
                mapping.editing = false;
            });
        }

        $scope.onEditMapping = function(mapping) {
            resetAllEdits();
            if (!$scope.state.meta) {
                $scope.callAPI(adIFCInterfaceMappingSrv.fetchMeta, {
                    params: $scope.interface,
                    successCallBack: function(meta) {
                        $scope.state.meta = meta;
                        $scope.mapping = angular.copy(mapping);
                        mapping.editing = true;
                        $scope.state.mode = 'EDIT';
                    }
                });
            } else {
                $scope.mapping = angular.copy(mapping);
                mapping.editing = true;
                $scope.state.mode = 'EDIT';
            }
        };


        $scope.onClickUpdate = function() {
            $scope.callAPI(adIFCInterfaceMappingSrv.update, {
                params: {
                    id: $scope.mapping.id,
                    mapping: _.omit($scope.mapping, ['editing', 'created_at', 'integration_id', 'property_id', 'updated_at', 'id']),
                    interfaceIdentifier: $scope.interface
                },
                onSuccess: function() {
                    $scope.reloadTable();
                }
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
            $scope.mapping = fetchEmptyMapping();
            $scope.loadTable();
        })();
    }]);
