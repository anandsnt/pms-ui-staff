function ADBaseTableCtrl($scope, ngTableParams){	
    BaseCtrl.call(this, $scope);

    $scope.displayCountList = [10, 25, 50, 100];
    $scope.displyCount = 10;
    $scope.rateType = "";
    $scope.searchTerm = "";
    $scope.filterType = {};

    $scope.$watch("displyCount", function () {
    	$scope.tableParams.reload();
    });

    $scope.$watch("filterType", function () {
    	$scope.tableParams.reload();
    });

    $scope.searchEntered = function() {
    	$scope.tableParams.reload();
    };

    $scope.filterFetchSuccess = function(data){
    	$scope.filterList = data;
    	$scope.$emit('hideLoader');
    };

   	$scope.calculateGetParams = function(tableParams){
    	var getParams = {};
		getParams.per_page = $scope.displyCount;
		getParams.page = tableParams.page();
		if($scope.filterType != null && typeof $scope.filterType != "undefined")
			getParams.rate_type_id = $scope.filterType.id;
		getParams.query = $scope.searchTerm;
		var sortData = tableParams.sorting();
		var sortField = Object.keys(sortData)[0]
		getParams.sort_field = sortField;
		getParams.sort_dir = sortData[sortField];

		return getParams;

    }
    $scope.fetchTableData = function(){

    };

    $scope.loadTable = function(){

    	$scope.tableParams = new ngTableParams({
    	        page: 1,  // show first page
    	        count: $scope.displyCount, // count per page 
    	        sorting: {
    	            rate: 'asc' // initial sorting
    	        }
    	    }, {
    	        total: 0, // length of data
    	        getData: $scope.fetchTableData
    	    }
    	);

    }
}