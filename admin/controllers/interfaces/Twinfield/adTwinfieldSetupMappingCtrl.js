admin.controller('adTwinfieldSetupMappingCtrl', [
    '$scope', 'adTwinfieldSetupSrv', 'adInterfacesCommonConfigSrv', 'ngTableParams',
    function($scope, adTwinfieldSetupSrv, adInterfacesCommonConfigSrv, ngTableParams) {
        BaseCtrl.call(this, $scope);

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        $scope.state = {
            showNewMapForm: false,
            mappingTypes: [
                {
                    name: 'gl_account',
                    text: 'GL Account Number'
                },
                {
                    name: 'vat_code',
                    text: 'VAT Code'
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
                external_value: '',
                meta_data: {
                    'cost_center': ''
                }
            };
        }

        $scope.mapping = fetchEmptyMapping();

        $scope.onClickAdd = function() {
            if (!$scope.state.meta) {
                $scope.callAPI(adTwinfieldSetupSrv.fetchMeta, {
                    successCallBack: function(meta) {
                        $scope.state.meta = meta;
                        $scope.state.showNewMapForm = true;
                    }
                });
            } else {
                $scope.state.showNewMapForm = true;
            }
        };


        $scope.onClickSaveNew = function() {
            $scope.callAPI(adTwinfieldSetupSrv.saveMapping, {
                params: $scope.mapping,
                successCallBack: function() {
                    $scope.reloadTable();
                    $scope.state.showNewMapForm = false;
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

            $scope.invokeApi(adTwinfieldSetupSrv.fetchMappings, getParams, fetchSuccessOfItemList);
        };

        // $scope.onClickDelete = function(mapping) {
        //     $scope.callAPI(ADInterfaceMappingSrv.deleteMappingWithId, {
        //         params: {
        //             mapping_id: mapping.id
        //         },
        //         onSuccess: function() {
        //             $scope.reloadTable();
        //         }
        //     });
        // };

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

            $scope.loadTable();
        })();
    }]);
