admin.controller('adVectronSetupMappingCtrl', [
    '$scope', 'adVectronSetupSrv', 'adInterfacesCommonConfigSrv', 'ngTableParams',
    function($scope, adVectronSetupSrv, adInterfacesCommonConfigSrv, ngTableParams) {
        BaseCtrl.call(this, $scope);

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        $scope.state = {
            mode: 'LIST',
            mappingTypes: [
                {
                    name: 'charge_code',
                    text: 'Charge Code'
                }]
        };

        /**
         * returns empty mapping
         * @return {{typeof: string, value: string, external_value: string, meta_data: {cost_center: string}}} empty mapping
         */
        function fetchEmptyMapping() {
            return {
                typeof: '',
                value: '',
                external_value: ''
            };
        }

        $scope.onClickAdd = function() {
            if (!$scope.state.chargeCodes) {
                $scope.callAPI(adVectronSetupSrv.getAllChargeCodes, {
                    successCallBack: function(response) {
                        $scope.state.chargeCodes = response.data.charge_codes;
                    }
                });
            }
            $scope.state.mode = 'ADD';
        };


        $scope.onClickSaveNew = function() {
            $scope.callAPI(adVectronSetupSrv.saveMapping, {
                params: $scope.mapping,
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
                    $scope.$emit('hideLoader');
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = data.total_count;
                    $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                    $scope.data = data.results;
                    $scope.currentPage = params.page();
                    params.total(data.total_count);
                    $defer.resolve($scope.data);
                };

            $scope.invokeApi(adVectronSetupSrv.fetchMappings, getParams, fetchSuccessOfItemList);
        };

        $scope.onClickDelete = function(mapping) {
            $scope.callAPI(adVectronSetupSrv.deleteMapping, {
                params: mapping.id,
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
            if (!$scope.state.chargeCodes) {
                $scope.callAPI(adVectronSetupSrv.getAllChargeCodes, {
                    successCallBack: function(response) {
                        $scope.state.chargeCodes = response.data.charge_codes;
                    }
                });
            }
            $scope.mapping = angular.copy(mapping);
            mapping.editing = true;
            $scope.state.mode = 'EDIT';
        };


        $scope.onClickUpdate = function() {
            $scope.callAPI(adVectronSetupSrv.updateMapping, {
                params: _.omit($scope.mapping, ['editing', 'created_at', 'integration_id', 'property_id', 'updated_at']),
                onSuccess: function() {
                    $scope.reloadTable();
                }
            });
        };

        $scope.loadTable = function() {
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount // count per page
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
