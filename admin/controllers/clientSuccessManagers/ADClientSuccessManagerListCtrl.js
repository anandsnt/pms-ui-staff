admin.controller('ADClientSuccessManagerListCtrl', [
    '$scope',
    'ADClientSuccessManagerSrv',
    'ngTableParams',
    '$filter',  function($scope,
        ADClientSuccessManagerSrv, ngTableParams, $filter) {

    BaseCtrl.call(this, $scope);

    // Fetch the client success manager list
    var fetchClientSuccessManagerList = function() {
        var onFetchSuccess = function(data) {
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

        $scope.invokeApi(ADClientSuccessManagerSrv.fetchClientSuccessManagerList, {}, onFetchSuccess);

    };

    // Delete a client succes manager with given id
    $scope.deleteClientSuccessManager = function(id) {

        var onDeleteSuccess = function(data) {
            fetchClientSuccessManagerList();
        };

        $scope.invokeApi(ADClientSuccessManagerSrv.deleteClientSuccessManager, id, onDeleteSuccess);
    };

    // Initialize the controller
    var init = function() {
        fetchClientSuccessManagerList();
    };

    init();


}]);

