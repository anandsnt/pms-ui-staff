admin.controller('adCegidMappingController', [
    '$scope', 'adCegidMappingSrv', 'ngTableParams',
    function ($scope, adCegidMappingSrv, ngTableParams) {
        BaseCtrl.call(this, $scope);

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        $scope.state = {
            mode: 'LIST',
            vat_codes: [],
            mappingTypes: [
                {
                    name: 'charge_code',
                    text: 'Charge Code - General Ledger'
                },
                {
                    name: 'charge_code_analytic_code',
                    text: 'Charge Code - Analytic Code'
                }]
        };

        /**
         * returns empty mapping
         * @return {{typeof: string, value: string, external_value: string, meta_data: {vat_code: string}}} empty mapping
         */
        function fetchEmptyMapping() {
            return {
                typeof: '',
                value: '',
                external_value: '',
                meta_data: {
                    'vat_code': ''
                }
            };
        }

        $scope.onClickAdd = function () {
            if (!$scope.state.meta) {
                $scope.callAPI(adCegidMappingSrv.fetchMeta, {
                    successCallBack: function (meta) {
                        $scope.state.meta = meta;
                        $scope.state.mode = 'ADD';
                        $scope.mapVatCodesToState();
                    }
                });
            } else {
                $scope.state.mode = 'ADD';
            }
        };

        $scope.onClickSaveNew = function () {
            $scope.callAPI(adCegidMappingSrv.saveMapping, {
                params: $scope.mapping,
                successCallBack: function () {
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
        $scope.displayCountChanged = function (count) {
            $scope.displyCount = count;
        };

        $scope.onCancelDetailedView = function () {
            resetAllEdits();
            $scope.state.mode = 'LIST';
        };

        $scope.fetchTableData = function ($defer, params) {
            var getParams = $scope.calculateGetParams(params),
                fetchSuccessOfItemList = function (data) {
                    $scope.$emit('hideLoader');
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = data.total_count;
                    $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                    $scope.data = data.data;
                    $scope.currentPage = params.page();
                    params.total(data.total_count);
                    $defer.resolve($scope.data);
                };

            $scope.invokeApi(adCegidMappingSrv.fetchMappings, getParams, fetchSuccessOfItemList);
        };

        $scope.onClickDelete = function (mapping) {
            $scope.callAPI(adCegidMappingSrv.deleteMapping, {
                params: mapping.id,
                onSuccess: function () {
                    $scope.reloadTable();
                }
            });
        };

        /**
         * @return {undefined} undefined
         */
        function resetAllEdits() {
            $scope.data.map(function (mapping) {
                mapping.editing = false;
            });
        }

        $scope.onEditMapping = function (mapping) {
            resetAllEdits();
            if (!$scope.state.meta) {
                $scope.callAPI(adCegidMappingSrv.fetchMeta, {
                    successCallBack: function (meta) {
                        $scope.state.meta = meta;
                        $scope.mapping = angular.copy(mapping);
                        mapping.editing = true;
                        $scope.state.mode = 'EDIT';
                        $scope.mapVatCodesToState();
                    }
                });
            } else {
                $scope.mapping = angular.copy(mapping);
                mapping.editing = true;
                $scope.state.mode = 'EDIT';
            }
        };

        $scope.onClickUpdate = function () {
            $scope.callAPI(adCegidMappingSrv.updateMapping, {
                params: _.omit($scope.mapping, ['editing', 'created_at', 'integration_id', 'property_id', 'updated_at']),
                onSuccess: function () {
                    $scope.reloadTable();
                    $scope.state.mode = 'LIST';
                }
            });
        };

        $scope.loadTable = function () {
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

        $scope.mapVatCodesToState = function() {
            if ($scope.state.meta.charge_codes) {
                $scope.state.vat_codes = $scope.state.meta.charge_codes.map(function(charge_code) {
                    return {
                        vat_code: charge_code.link_with[0] || 'No Vat Code for This Charge Code',
                        charge_code: charge_code.charge_code
                    }
                });
            }
        };

        (function () {
            $scope.totalCount = 0;
            $scope.mapping = fetchEmptyMapping();
            $scope.loadTable();
        })();
    }]);
