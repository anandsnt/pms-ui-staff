admin.controller('ADCampaignsListCtrl',['$scope', '$state', 'ADRatesSrv', 'ADCampaignSrv', 'ngTableParams','$filter','$timeout', '$location', '$anchorScroll',
	function($scope, $state, ADRatesSrv, ADCampaignSrv, ngTableParams, $filter, $timeout, $location, $anchorScroll){

	$scope.errorMessage = '';
	$scope.successMessage = "";
	ADBaseTableCtrl.call(this, $scope, ngTableParams);


	$scope.fetchTableData = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			//No expanded rate view
			$scope.currentClickedElement = -1;
			$scope.totalCount = data.total_count;
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
			$scope.data = data.results;
			$scope.currentPage = params.page();
        	params.total(data.total_count);
            $defer.resolve($scope.data);
		};
		$scope.invokeApi(ADCampaignSrv.fetchCampaigns, getParams, fetchSuccessOfItemList);
	}


	$scope.loadTable = function(){
		console.log("loadTable");
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount, // count per page
		        /*sorting: {
		            rate: 'asc' // initial sorting
		        }*/
		    }, {
		        total: 0, // length of data
		        getData: $scope.fetchTableData
		    }
		);
	}

	$scope.loadTable();


}]);

