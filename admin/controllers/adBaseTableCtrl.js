function ADBaseTableCtrl($scope, ngTableParams){	
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

    $scope.$watch("displyCount", function () {
        $scope.tableParams.count($scope.displyCount);
        $scope.reloadTable();
    });

    $scope.$watch("data", function () {
        $scope.startCount = (($scope.currentPage - 1) * $scope.displyCount )+ 1;
        $scope.endCount = $scope.startCount + $scope.data.length - 1;
    });

    $scope.$watch("filterType", function () {
        $scope.reloadTable();
        /*$scope.tableParams.page(1);
    	$scope.tableParams.reload();*/       
    });

    $scope.searchEntered = function() {
        $scope.reloadTable();
        /*$scope.tableParams.page(1);
    	$scope.tableParams.reload();*/
    };

    $scope.reloadTable = function(){
        $scope.tableParams.page(1);
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
		getParams.sort_dir = sortData[sortField] === "desc"? false :true;

		return getParams;

    }
    $scope.fetchTableData = function(){

    };

}