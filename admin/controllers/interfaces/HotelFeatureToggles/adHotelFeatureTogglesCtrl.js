admin.controller('adHotelFeatureTogglesCtrl', [
    '$scope',
    '$state',
    'ADHotelListSrv',
    'ngTableParams',
    '$filter',
    function($scope, $state, ADHotelListSrv, ngTableParams, $filter) {
        $scope.fetchSuccess = function (data) {
            $scope.data = data;
            $scope.$emit('hideLoader');

            // REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hide or pull-right
            $scope.tableParams = new ngTableParams({
                // show first page
                page: 1,
                // count per page - Need to change when on pagination implemntation
                count: $scope.data.hotels.length,
                sorting: {
                    // initial sorting
                    hotel_name: 'asc'
                }
            }, {
                // length of data
                total: $scope.data.hotels.length,
                getData: function ($defer, params)
                {
                    if (params.settings().$scope === null) {
                        params.settings().$scope = $scope;
                    }
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.data.hotels, params.orderBy()) :
                        $scope.data.hotels;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            $scope.tableParams.reload();
        };

        $scope.edit = function(hotel) {
            // Further requests should be for the specific property
            ADHotelListSrv.setselectedProperty(hotel.uuid);

            $state.go("admin.hotel_feature_toggles_edit", {
                id: hotel.id
            });
        };

        $scope.fetchHotelDetails = function() {
            $scope.invokeApi(ADHotelListSrv.fetch, { features: true, integrations: true }, $scope.fetchSuccess);
        };

        (function () {
            BaseCtrl.call(this, $scope);
            ADBaseTableCtrl.call(this, $scope, ngTableParams);

            $scope.searchWords = [];
            $scope.fetchHotelDetails();
        }());
}]);
