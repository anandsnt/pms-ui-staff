admin.controller('ADRatesListCtrl',['$scope', '$state', 'ADRatesSrv', 'ngTableParams','$filter',  function($scope, $state, ADRatesSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.roomTypeData = {};
	$scope.displayCountList = [1, 2, 3, 4, 5];
	$scope.displyCount = 2;
	$scope.rateType = "";
	$scope.searchTerm = "";
	/**
    * To fetch all rate types
    */
	$scope.fetchRateTypes = function(){
		var fetchSuccess = function(data) {
			$scope.rateTypeList = data;
			$scope.$emit('hideLoader');
		};

		$scope.invokeApi(ADRatesSrv.fetchRateTypes, {}, fetchSuccess);
	};

	$scope.fetchRateTypes();

	$scope.$watch("displyCount", function () {
		$scope.tableParams.reload();
	});

	$scope.$watch("rateType", function () {
		console.log("change");
		$scope.tableParams.reload();
	});

	$scope.searchClicked = function() {
		console.log($scope.searchTerm);
		$scope.tableParams.reload();
	}

	$scope.getTableData = function($defer, params){
		console.log(JSON.stringify(params.sorting()));
    	var getParams = {};
		getParams.per_page = $scope.displyCount;
		getParams.page = params.page();
		getParams.rate_type_id = $scope.rateType.id;
		getParams.query = $scope.searchTerm;
		var sortData = params.sorting();
		var sortField = Object.keys(sortData)[0]
		getParams.sort_field = sortField;
		getParams.sort_dir = sortData[sortField];


		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data.results;
        	params.total(data.total_count);
            // use build-in angular filter
    
            $defer.resolve($scope.data);
		};
		$scope.invokeApi(ADRatesSrv.fetchRates, getParams, fetchSuccessOfItemList);	
	}	
		
	//applying sorting functionality in item list
	$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: $scope.displyCount,    // count per page - Need to change when on pagination implemntation
	        sorting: {
	            rate: 'asc'     // initial sorting
	        }
	    }, {
	        total: 0, // length of data
	        getData: $scope.getTableData
	    }
	);


}]);

