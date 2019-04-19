admin.controller('adVectronMappingCtrl', [
    '$scope', 'adVectronSetupSrv', 'ngTableParams',
    function ($scope, adVectronSetupSrv, ngTableParams) {
        BaseCtrl.call(this, $scope);

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        // on page load, deafult view will be listing.
        $scope.state = {
            mode: 'LIST'
        };

        $scope.onClickAdd = function () {
            $scope.mapping = {};
            $scope.state.mode = 'ADD';
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

        /**
         * @return {undefined} undefined
         */
        function resetAllEdits() {
            $scope.data.map(function (mapping) {
                mapping.editing = false;
            });
        }

        /**
         * @example titleCase('hello_world') should return 'Hello World'
         * @param s
         * @returns {string}
         */
        function titleCase(s) {
            return s.charAt(0).toUpperCase() + s.slice(1).replace(/(\_\w)/g, function (m) {
                return ' ' + m[1].toUpperCase();
            });
        }

        $scope.mappingTypeText = function (name) {
            return _.find($scope.state.mappingTypes, function (obj) {
                return obj.name === name;
            }).text;
        };

        $scope.mappingValueText = function (mappingType, mappingValue) {
            var text = "";
            var item = {};

            if (mappingType === 'charge_code') {
                item = _.find($scope.state.chargeCodes, function (obj) {
                    return obj.charge_code === mappingValue;
                });
                text = item.charge_code + ' - ' + item.description;

            } else if (mappingType === 'payment_charge_code') {
                item = _.find($scope.state.paymentChargeCodes, function (obj) {
                    return obj.charge_code === mappingValue;
                });
                text = item.charge_code + ' - ' + item.description;
            } else if (mappingType === 'posting_account') {
                item = _.find($scope.state.postingAccounts, function (obj) {
                    return obj.posting_accounts_number === mappingValue;
                });
                text = item.posting_accounts_number + ' - ' + item.posting_accounts_name;
            }
            return text;
        };

        $scope.onClickSaveNew = function () {
            $scope.callAPI(adVectronSetupSrv.saveMapping, {
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
                fetchSuccessOfItemList = function (response) {
                    $scope.$emit('hideLoader');
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = response.total_count;
                    $scope.totalPage = Math.ceil(response.total_count / $scope.displyCount);
                    $scope.data = response.data;
                    $scope.currentPage = params.page();
                    params.total(response.total_count);
                    $defer.resolve($scope.data);
                };

            $scope.invokeApi(adVectronSetupSrv.fetchMappings, getParams, fetchSuccessOfItemList);
        };

        $scope.onClickDelete = function (mapping) {
            $scope.callAPI(adVectronSetupSrv.deleteMapping, {
                params: mapping.id,
                onSuccess: function () {
                    $scope.reloadTable();
                    $scope.state.mode = 'LIST';
                }
            });
        };

        $scope.onEditMapping = function (mapping) {
            resetAllEdits();
            if (!$scope.state.chargeCodes) {
                $scope.callAPI(adVectronSetupSrv.getAllChargeCodes, {
                    successCallBack: function (response) {
                        $scope.state.chargeCodes = response.data.charge_codes;
                    }
                });
            }
            $scope.mapping = angular.copy(mapping);
            mapping.editing = true;
            $scope.state.mode = 'EDIT';
        };


        $scope.onClickUpdate = function () {
            $scope.callAPI(adVectronSetupSrv.updateMapping, {
                params: _.omit($scope.mapping, ['editing']),
                onSuccess: function () {
                    $scope.reloadTable();
                    $scope.state.mode = 'LIST';
                }
            });
        };

        $scope.loadTable = function () {
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount // count per page
            }, {
                total: 0, // length of data
                getData: $scope.fetchTableData
            });
        };

        (function () {
            $scope.totalCount = 0;
            $scope.mapping = fetchEmptyMapping();
            $scope.callAPI(adVectronSetupSrv.fetchMeta, {
                successCallBack: function (meta) {
                    $scope.state.chargeCodes = meta.charge_codes;
                    $scope.state.paymentChargeCodes = meta.payment_charge_codes;
                    $scope.state.postingAccounts = meta.posting_accounts;
                    var dict = [];

                    _.each(meta.mapping_types, function (data) {
                        dict.push({
                            name: data,
                            text: titleCase(data)
                        });
                    });
                    $scope.state.mappingTypes = dict;
                    $scope.loadTable();
                }
            });
        })();
    }
]);
