admin.controller('adInterfaceMappingsCtrl', [
    '$scope', 'adInterfaceMappingSrv', 'adInterfacesCommonConfigSrv', 'ngTableParams',
    function($scope, adInterfaceMappingSrv, adInterfacesCommonConfigSrv, ngTableParams) {
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
                $scope.callAPI(adInterfaceMappingSrv.getAllChargeCodes, {
                    successCallBack: function(response) {
                        $scope.state.chargeCodes = response.data.charge_codes;
                    }
                });
            }
            $scope.state.mode = 'ADD';
        };


        $scope.onClickSaveNew = function() {
            $scope.mapping.interface = $scope.interface;
            $scope.callAPI(adInterfaceMappingSrv.createMapping, {
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

            getParams.interface = $scope.interface;

            $scope.invokeApi(adInterfaceMappingSrv.fetchMappings, getParams, fetchSuccessOfItemList);
        };

        $scope.onClickDelete = function(mapping) {
            mapping.interface = $scope.interface;
            $scope.callAPI(adInterfaceMappingSrv.deleteMapping, {
                params: mapping,
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
                $scope.callAPI(adInterfaceMappingSrv.getAllChargeCodes, {
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
            var params = _.omit($scope.mapping, ['editing']);

            params.interface = $scope.interface;

            $scope.callAPI(adInterfaceMappingSrv.updateMapping, {
                params: params,
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
       /**
        * @return {string} formattedMappingType formatted to Title Case
        * @param {sting} mappingType camel_case mapping type from API
        */
        $scope.formatMappingType = function(mappingType) {
          if (mappingType.includes('_')) {
              var split = mappingType.split('_'); // split mapping type on '_'
              var formattedMappingType = '';

              for (var i = 0; i < split.length; i++) {
                  // for each word in mapping type, capitalize first character and downcase the others,
                  // concat to formattedMappingType
                  formattedMappingType += split[i].charAt(0).toUpperCase() + split[i].slice(1).toLowerCase() + ' ';
              }
              return formattedMappingType.trim();
          }
              // if no underscores, titlecase mappingType
              return mappingType.charAt(0).toUpperCase() + mappingType.slice(1).toLowerCase();
          
        };

        (function() {
            $scope.totalCount = 0;
            $scope.mapping = fetchEmptyMapping();
            $scope.loadTable();
        })();
    }]);
