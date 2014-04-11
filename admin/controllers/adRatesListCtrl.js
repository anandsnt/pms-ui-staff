admin.controller('ADRatesListCtrl',['$scope', '$state', 'ADRatesSrv', 'ngTableParams','$filter',  function($scope, $state, ADRatesSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	ADBaseTableCtrl.call(this, $scope, ngTableParams);

	/**
    * To fetch all rate types
    */
	$scope.fetchFilterTypes = function(){
		$scope.invokeApi(ADRatesSrv.fetchRateTypes, {}, $scope.filterFetchSuccess);
	};

	$scope.fetchFilterTypes();

	$scope.fetchTableData = function($defer, params){
 
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data.results;
        	params.total(data.total_count);
            // use build-in angular filter
    
            $defer.resolve($scope.data);
		};
		$scope.invokeApi(ADRatesSrv.fetchRates, getParams, fetchSuccessOfItemList);	
	}	


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
		
	$scope.loadTable();

}]);

