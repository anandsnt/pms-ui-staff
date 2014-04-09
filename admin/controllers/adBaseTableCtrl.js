function ADBaseTableCtrl($scope, ngTableParams){	
	console.log("in base controller");
    BaseCtrl.call(this, $scope);

    $scope.displayCountList = [2, 10, 25, 50, 100];
    $scope.displyCount = 2;
    $scope.rateType = "";
    $scope.searchTerm = "";

    $scope.$watch("displyCount", function () {
    	$scope.tableParams.reload();
    });

    $scope.$watch("filterType", function () {
    	$scope.tableParams.reload();
    });

    $scope.searchEntered = function() {
    	$scope.tableParams.reload();
    };

    $scope.fetchTableData = function(){

    };

    $scope.fetchSuccessOfTableData = function(){
		$scope.$emit('hideLoader');
		$scope.data = data.results;
    	params.total(data.total_count);
        $defer.resolve($scope.data);

    };

    $scope.getTableParams = function(){
    	var getParams = {};
		getParams.per_page = $scope.displyCount;
		getParams.page = params.page();
		getParams.rate_type_id = $scope.rateType.id;
		getParams.query = $scope.searchTerm;
		var sortData = params.sorting();
		var sortField = Object.keys(sortData)[0]
		getParams.sort_field = sortField;
		getParams.sort_dir = sortData[sortField];

		return getParams;
    }

    $scope.getTableData = function($defer, params){
    	
    	


		/*var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data.results;
        	params.total(data.total_count);
            $defer.resolve($scope.data);
		};*/

		$scope.fetchTableData();

    };
    //applying sorting functionality in item list
    $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: $scope.displyCount,    // count per page - Need to change when on pagination implemntation
            sorting: {
                rate: 'asc'     // initial sorting
            },
        }, {
            total: 0, // length of data
            getData: $scope.getTableData
        }
    );


}