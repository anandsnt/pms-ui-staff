admin.controller('ADServiceProviderListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADServiceProviderSrv','ngTableParams', '$filter',  function($scope, $state,$rootScope, $stateParams, ADServiceProviderSrv, ngTableParams, $filter){
    BaseCtrl.call(this, $scope);

    var fetchServiceProviderList = function() {
        var onFetchSuccess = function(data){
            $scope.data = data;
            $scope.$emit('hideLoader');

            // REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
            $scope.tableParams = new ngTableParams({
                // show first page
                page: 1,
                // count per page - Need to change when on pagination implemntation
                count: $scope.data.length,
                sorting: {
                    // initial sorting
                    name: 'asc'
                }
            }, {
                // length of data
                total: $scope.data.length,
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                                        $filter('orderBy')($scope.data, params.orderBy()) :
                                        $scope.data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        };
        $scope.invokeApi(ADServiceProviderSrv.fetchServiceProviderList, {}, onFetchSuccess);

    };

    //Delete a service provide with given id
    $scope.deleteServiceProvider = function(serviceProviderId) {
        var onDeleteSuccess = function(data) {
            fetchServiceProviderList();
        }
        $scope.invokeApi(ADServiceProviderSrv.deleteServiceProvider, serviceProviderId, onDeleteSuccess);
    };

    var init = function() {
        fetchServiceProviderList();
    };

    init();


}]);