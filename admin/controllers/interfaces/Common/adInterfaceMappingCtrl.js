admin.controller('adInterfaceMappingCtrl', [
    '$scope', 'adIFCInterfaceMappingSrv', 'adInterfacesCommonConfigSrv', 'ngTableParams',
    function($scope, adIFCInterfaceMappingSrv, adInterfacesCommonConfigSrv, ngTableParams) {
        BaseCtrl.call(this, $scope);

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        var mappingText = {
            'cancellation_code': 'Cancellation Codes',
            'charge_code': 'Charge Code - General Ledger',
            'charge_code_cost_center': 'Charge Code - Cost Center',
            'charge_code_department_code': 'Charge Code - Department Code',
            'group_hold_status': 'Group Hold Status',
            'market_code': 'Market Code - Market Segment',
            'market_segment': 'Market Code - Market Segment',
            'market_code_department_code': 'Market Code - Department Code',
            'payment_code_billing_account': 'Payment Code - Billing Account Number',
            'source_code': 'Source Code',
            'tax_code': 'Tax Codes',
            'tax_charge_code': 'Tax Codes',
            'room_number': 'Room Numbers'
        };

        var mappingPartials = {
            'DELPHI': '/assets/partials/interfaces/delphi/mapping.html',
            'DERBYSOFT': '/assets/partials/interfaces/DerbySoft/adDerbySoftMappingDetailView.html',
            'FISKALTRUST': '/assets/partials/interfaces/fiskaltrust/adFiskaltrustMappingDetailView.html',
            'HOGIA': '/assets/partials/interfaces/hogia/adHogiaMappingDetailView.html',
            'SUNACCOUNTING': '/assets/partials/interfaces/SunAccounting/adSunAccountingMappingDetailView.html',
            'EXACTONLINE': '/assets/partials/interfaces/exactonline/adExactonlineMapping.html',
            'IGEL': '/assets/partials/interfaces/igel/adIgelMappingDetailView.html',
            'SAFEACCOUNTING': '/assets/partials/interfaces/safeaccounting/mapping.html',
            'AXBASE3000': '/assets/partials/interfaces/axbase3000/adAxbaseMapping.html'
        };

        $scope.state = {
            mode: 'LIST',
            mappingTypes: $scope.mappingTypes.map(function(mappingType) {
                return {
                    name: mappingType,
                    text: mappingText[mappingType] ? mappingText[mappingType] : mappingType
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

        $scope.fetchMappingPartial = function() {
            return mappingPartials[$scope.interface];
        };

        $scope.onClickAdd = function() {
            if (!$scope.state.meta) {
                $scope.callAPI(adIFCInterfaceMappingSrv.fetchMeta, {
                    params: $scope.interface,
                    successCallBack: function(meta) {
                        $scope.state.meta = meta;
                        $scope.mapping = fetchEmptyMapping();
                        $scope.state.mode = 'ADD';
                    }
                });
            } else {
                $scope.mapping = fetchEmptyMapping();
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
                },
                failureCallBack: function(response) {
                    $scope.errorMessage = response["errors"] ? response["errors"] : response;
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
                    // Convert to number in case the external values have a restriction
                    if (adIFCInterfaceMappingSrv.isNumericExternalValue($scope.interface)) {
                        _.each(response.data, function(mapping) {
                            mapping.external_value = parseInt(mapping.external_value, 10);
                        });
                    }
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = response.total_count || response.data.length;
                    $scope.totalPage = Math.ceil(response.total_count / $scope.displyCount);
                    $scope.data = response.data;
                    $scope.currentPage = params.page();
                    params.total($scope.totalCount);
                    $defer.resolve($scope.data);
                };

            $scope.callAPI(adIFCInterfaceMappingSrv.fetch, {
                params: {
                    payload: getParams,
                    interfaceIdentifier: $scope.interface
                },
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
                    $scope.state.mode = 'LIST';
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
