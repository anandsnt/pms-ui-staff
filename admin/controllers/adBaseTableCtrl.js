function ADBaseTableCtrl($scope, ngTableParams) {
    BaseCtrl.call(this, $scope);

    $scope.displayCountList = [10, 25, 50, 100];
    $scope.displyCount = 10;
    $scope.rateType = "";
    $scope.searchTerm = "";
    $scope.filterType = {};
    $scope.totalCount = 1;
    $scope.totalPage = 1;
    $scope.startCount = 1;
    $scope.endCount = 1;
    $scope.currentPage = 0;
    $scope.data = [];

    // After a watcher is registered with the scope, 
    // the listener fn is called asynchronously (via $evalAsync) to initialize the watcher. 
    // In rare cases, this is undesirable because the listener is called when the result of watchExpression didn't change. 
    // To detect this scenario within the listener fn, you can compare the newVal and oldVal. 
    // If these two values are identical (===) then the listener was called due to initialization.
    // 
    // -- https://docs.angularjs.org/api/ng/type/$rootScope.Scope

    $scope.$watch("displyCount", function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.tableParams.count($scope.displyCount);
        }
    });

    $scope.$watch("data", function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.startCount = (($scope.currentPage - 1) * $scope.displyCount ) + 1;
            $scope.endCount = $scope.startCount + $scope.data.length - 1;
        }
    }, true);

    $scope.$watch("filterType", function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.reloadTable();
        }
    });

    $scope.searchEntered = function() {
        $scope.reloadTable();
    };

    $scope.reloadTable = function(pageNumber) {
        $scope.tableParams.page(pageNumber || 1);
        $scope.tableParams.reload();
    };

    $scope.filterFetchSuccess = function(data) {
        $scope.filterList = data;
        $scope.$emit('hideLoader');
    };

    $scope.calculateGetParams = function(tableParams) {

        var getParams = {};

        getParams.per_page = $scope.displyCount;
        getParams.page = tableParams.page();
        if ($scope.filterType !== null && typeof $scope.filterType !== "undefined") {
            getParams.rate_type_id = $scope.filterType.id;
        }
        getParams.query = $scope.searchTerm;
        var sortData = tableParams.sorting();

        var sortField = Object.keys(sortData)[0];

        getParams.sort_field = sortField;
        getParams.sort_dir = sortData[sortField] === "desc" ? false : true;

        return getParams;

    };

    $scope.fetchTableData = function() {

    };

}
