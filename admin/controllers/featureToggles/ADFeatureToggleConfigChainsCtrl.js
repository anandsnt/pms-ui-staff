angular.module('admin')
    .controller('ADFeatureToggleConfigChainsCtrl', ['$scope', '$state', 'ngTableParams', 'ADFeatureToggleSrv', 'sntActivity',
        function ($scope, $state, ngTableParams, ADFeatureToggleSrv, sntActivity) {

            ADBaseTableCtrl.call(this, $scope, ngTableParams);

            $scope.fetchTableData = function ($defer, params) {
                var getParams = $scope.calculateGetParams(params),
                    fetchSuccessOfItemList = function (data) {
                        sntActivity.start('GET_STATUS_OF_HOTELS');
                        $scope.data = data.results;
                        fetchStatus();
                        $scope.currentClickedElement = -1;
                        $scope.totalCount = parseInt(data.total_count);
                        $scope.totalPage = Math.ceil($scope.total_count / $scope.displyCount);
                        $scope.currentPage = params.page();
                        params.total($scope.totalCount);
                        $defer.resolve($scope.data);
                    };

                $scope.callAPI(ADFeatureToggleSrv.getChains, {
                    params: getParams,
                    onSuccess: fetchSuccessOfItemList
                });
            };


            $scope.toggleFeatureChain = function (chain) {
                $scope.callAPI(ADFeatureToggleSrv.toggle, {
                    params: {
                        chain_uuid: chain.uuid,
                        feature: $scope.feature.name
                    }
                });
            };

            var fetchStatus = function () {
                $scope.callAPI(ADFeatureToggleSrv.fetchChainStatus, {
                    params: {
                        chains: _.pluck($scope.data, 'uuid'),
                        feature: $scope.feature.name
                    },
                    onSuccess: function (result) {
                        _.each($scope.data, function (hotel) {
                            hotel.featureStatus = result[hotel.uuid];
                        });
                        sntActivity.stop('GET_STATUS_OF_HOTELS');
                    },
                    onFailure: function () {
                        sntActivity.stop('GET_STATUS_OF_HOTELS');
                    }
                });
            };

            var loadTable = function () {
                $scope.tableParams = new ngTableParams(
                    {
                        page: 1,  // show first page
                        count: $scope.displyCount, // count per page
                        sorting: {
                            name: 'asc' // initial sorting
                        }
                    }, {
                        total: 0, // length of data
                        getData: $scope.fetchTableData
                    }
                );
            };


            (function () {
                loadTable();
            })();

        }
    ]);
