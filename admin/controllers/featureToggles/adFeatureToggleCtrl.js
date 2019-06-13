angular.module('admin')
    .controller('ADFeatureToggleListCtrl', ['$scope', '$state', 'ngTableParams', 'ADFeatureToggleSrv',
        function ($scope, $state, ngTableParams, ADFeatureToggleSrv) {

            ADBaseTableCtrl.call(this, $scope, ngTableParams);

            $scope.fetchTableData = function ($defer, params) {
                var getParams = $scope.calculateGetParams(params),
                    fetchSuccessOfItemList = function (results) {
                        var data = {
                            results: results,
                            totalCount: results.length
                        };

                        $scope.currentClickedElement = -1;
                        $scope.totalCount = parseInt(data.totalCount);
                        $scope.totalPage = Math.ceil($scope.totalCount / $scope.displyCount);
                        $scope.data = data.results;

                        $scope.currentPage = params.page();
                        params.total($scope.totalCount);
                        $defer.resolve($scope.data);

                    };

                $scope.callAPI(ADFeatureToggleSrv.fetch, {
                    params: getParams,
                    onSuccess: fetchSuccessOfItemList
                });
            };

            $scope.selectFeature = function (featureName) {
                $state.go('admin.configFeature', {
                    feature: featureName
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
