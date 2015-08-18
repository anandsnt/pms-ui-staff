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
	};


	$scope.loadTable = function(){
		console.log("loadTable");
		$scope.data = [];
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount, // count per page
		        sorting: {
		            name: 'asc' // initial sorting
		        }
		    }, {
		        total: 0, // length of data
		        getData: $scope.fetchTableData
		    }
		);
	};

	$scope.editCampaign = function(id , index){
		$state.go('admin.addCampaign', {'id' : id, 'type': 'EDIT'});
	};

	$scope.deleteCampaign = function(id, index){

		var deleteSuccess = function(){
			$scope.$emit('hideLoader');

			for(var i in $scope.data){
				if($scope.data[i].id === id){
					$scope.data.splice(i, 1);
					break;
				}
			}

			$scope.reloadTable();
		};
		var params = {"id" : id};
		$scope.invokeApi(ADCampaignSrv.deleteCampaign, params, deleteSuccess);
	};

	$scope.getTimeConverted = function(time) {
		if (time === null || time === undefined) {
			return "";
		}
		var timeDict = tConvert(time);
		return (timeDict.hh + ":" + timeDict.mm + " " + timeDict.ampm);
	};

	$scope.loadTable();


}]);

