admin.controller('adDerbySoftSetupMappingCtrl', [
    '$scope', 'adDerbySoftSetupSrv', 'adInterfacesCommonConfigSrv', 'ngTableParams',
    function($scope, adDerbySoftSetupSrv, adInterfacesCommonConfigSrv, ngTableParams) {
        BaseCtrl.call(this, $scope);

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        $scope.state = {
            mode: 'LIST',
            mappingTypes: [
                {
                    name: 'cancellation_policies',
                    text: 'Cancellation Policies'
                },
                {
                    name: 'tax_codes',
                    text: 'Tax Codes'
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
            if (!$scope.state.cancellationPolicies) {
                $scope.callAPI(adDerbySoftSetupSrv.getAllCancellationPolicies, {
                    successCallBack: function(response) {
                        $scope.state.cancellationPolicies = response.results;
                    }
                });
                $scope.callAPI(adDerbySoftSetupSrv.getAllCancellationCodes, {
                    successCallBack: function(response) {
                        console.log(response);
                        $scope.state.cancellationCodes = response.data;
                    }
                });
            }
            if (!$scope.state.taxChargeCodes) {
                $scope.callAPI(adDerbySoftSetupSrv.getAllTaxChargeCodes, {
                    successCallBack: function(response) {
                        $scope.state.taxChargeCodes = response.data.charge_codes;
                    }
                });
                $scope.callAPI(adDerbySoftSetupSrv.getAllTaxCodes, {
                    successCallBack: function(response) {
                        console.log(response);
                        $scope.state.taxCodes = response.data;
                    }
                });
            }
            $scope.state.mode = 'ADD';
        };


        $scope.onClickSaveNew = function() {
            $scope.callAPI(adDerbySoftSetupSrv.saveMapping, {
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
                fetchSuccessOfItemList = function(response) {
                    $scope.$emit('hideLoader');
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = response.total_count;
                    $scope.totalPage = Math.ceil(response.total_count / $scope.displyCount);
                    $scope.data = response.data;
                    $scope.currentPage = params.page();
                    params.total(response.total_count);
                    $defer.resolve($scope.data);
                };

            $scope.invokeApi(adDerbySoftSetupSrv.fetchMappings, getParams, fetchSuccessOfItemList);
        };

        $scope.onClickDelete = function(mapping) {
            $scope.callAPI(adDerbySoftSetupSrv.deleteMapping, {
                params: mapping.id,
                onSuccess: function() {
                    $scope.reloadTable();
                    $scope.state.mode = 'LIST';
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
                $scope.callAPI(adDerbySoftSetupSrv.getAllChargeCodes, {
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
            $scope.callAPI(adDerbySoftSetupSrv.updateMapping, {
                params: _.omit($scope.mapping, ['editing']),
                onSuccess: function() {
                    $scope.reloadTable();
                    $scope.state.mode = 'LIST';
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
