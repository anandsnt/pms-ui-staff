admin.controller('adStaahMappingCtrl', [
    '$scope', 'adStaahSetupSrv', 'ngTableParams',
    function ($scope, adStaahSetupSrv, ngTableParams) {
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

            if (mappingType === 'rate') {
                item = _.find($scope.state.rates, function (obj) {
                    return obj.id.toString() === mappingValue;
                });
                text = item.name;
            } else if (mappingType === 'room_type') {
                item = _.find($scope.state.roomTypes, function (obj) {
                    return obj.id.toString() === mappingValue;
                });
                text = item.name;
            } else if (mappingType === 'addon') {
                item = _.find($scope.state.addons, function(obj) {
                    return obj.id.toString() === mappingValue;
                });
                text = item.name;
            } else if (mappingType === 'payment_charge_code') {
                item = _.find($scope.staahPaymentCodes, function(obj) {
                    return obj.code.toString() === mappingValue;
                })
                text = item.code + '-' + item.name;
            }
            return text;
        };

        $scope.mappingExternalValueText = function (mappingType, mappingValue) {
            var text = "";
            var item = {};

            if (mappingType === 'rate') {
                item = _.find($scope.state.staahMappings.rates, function (obj) {
                    return obj.id === mappingValue;
                });
                text = item.name;
            } else if (mappingType === 'room_type') {
                item = _.find($scope.state.staahMappings.room_types, function (obj) {
                    return obj.id === mappingValue;
                });
                text = item.name;
            } else if (mappingType === 'addon') {
                item = _.find($scope.data, function(obj) {
                    return obj.external_value === mappingValue;
                });
                text = item.external_value;
            } else if (mappingType === 'payment_charge_code') {
                item = _.find($scope.state.payment_codes, function(obj) {
                    return obj.charge_code === mappingValue;
                });
                text = item.charge_code + '-' + item.description;
            }
            return text;
        };

        $scope.onClickSaveNew = function () {
            if($scope.mapping.typeof === 'payment_charge_code') {
                dup = _.select($scope.data, function (obj) {
                    return obj.external_value === $scope.mapping.external_value
                })
                if (dup.length > 0) {
                    $scope.errorMessage = ['Mapping value already in use - please select a different value'];
                    return;
                }
            }
            $scope.callAPI(adStaahSetupSrv.saveMapping, {
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

            $scope.invokeApi(adStaahSetupSrv.fetchMappings, getParams, fetchSuccessOfItemList);
        };

        $scope.onClickDelete = function (mapping) {
            $scope.callAPI(adStaahSetupSrv.deleteMapping, {
                params: mapping.id,
                onSuccess: function () {
                    $scope.reloadTable();
                    $scope.state.mode = 'LIST';
                }
            });
        };

        $scope.onEditMapping = function (mapping) {
            resetAllEdits();
            if (!$scope.state.rates) {
                $scope.callAPI(adStaahSetupSrv.getAllRates, {
                    successCallBack: function (response) {
                        $scope.state.rates = response.results;
                    }
                });
            }
            $scope.mapping = angular.copy(mapping);
            mapping.editing = true;
            $scope.state.mode = 'EDIT';
        };


        $scope.onClickUpdate = function () {
            $scope.callAPI(adStaahSetupSrv.updateMapping, {
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
            $scope.staahPaymentCodes = [
                { code: "VI", name: "Visa" },
                { code: "AX", name: "American Express" },
                { code: "BC", name: "BankCard" },
                { code: "MC", name: "MasterCard" },
                { code: "DN", name: "Diners Club" },
                { code: "CB", name: "Carte Blanche" },
                { code: "CU", name: "China Union Pay" },
                { code: "DS", name: "Disccover" },
                { code: "E", name: "Electron" },
                { code: "JC", name: "Japan Credit Bureau" },
                { code: "MA", name: "Maestro" },
                { code: "T", name: "Carat Si" },
                { code: "R", name: "Carte Bleue" },
                { code: "N", name: "Dnakort" },
                { code: "L", name: "Delta" }
            ];
            $scope.totalCount = 0;
            $scope.mapping = fetchEmptyMapping();
            $scope.callAPI(adStaahSetupSrv.fetchMeta, {
                successCallBack: function (meta) {
                    $scope.state.rates = meta.rates;
                    $scope.state.roomTypes = meta.room_types;
                    $scope.state.addons = meta.addons;
                    $scope.state.payment_codes = meta.payment_codes;
                    $scope.state.staahMappings = meta.staah_mappings;
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
