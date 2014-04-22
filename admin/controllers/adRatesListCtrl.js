admin.controller('ADRatesListCtrl',['$scope', '$state', 'ADRatesSrv', 'ngTableParams','$filter',  function($scope, $state, ADRatesSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	ADBaseTableCtrl.call(this, $scope, ngTableParams);

	$scope.isConnectedToPMS = true;

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
			$scope.totalCount = data.total_count;
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
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

	$scope.importFromPms = function(){
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			console.log("sucess");
		};
		$scope.invokeApi(ADRatesSrv.importRates, {}, fetchSuccessOfItemList);	
		console.log("importFromPms");
		//TODO: call import API
	}


}]);

