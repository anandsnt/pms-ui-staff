angular.module('admin')
    .controller('ADFeatureToggleConfigHotelsCtrl', ['$scope', '$state', 'ngTableParams', 'ADFeatureToggleSrv', 'sntActivity',
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

                $scope.callAPI(ADFeatureToggleSrv.getHotels, {
                    params: getParams,
                    onSuccess: fetchSuccessOfItemList
                });
            };

            $scope.selectFeature = function (featureName) {
                $state.go('admin.configFeature', {
                    feature: featureName
                });
            };

            $scope.toggleFeatureHotel = function (hotel) {
                console.log('hotel_uuid', hotel);
            };

            var fetchStatus = function () {
                $scope.callAPI(ADFeatureToggleSrv.fetchHotelStatus, {
                    params: {
                        hotels: _.pluck($scope.data, 'uuid'),
                        feature: $scope.feature.name
                    },
                    onSuccess: function () {
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
