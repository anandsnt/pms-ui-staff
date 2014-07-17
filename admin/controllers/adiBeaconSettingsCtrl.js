admin.controller('ADiBeaconSettingsCtrl',['$scope', '$state', 'ngTableParams',
	function($scope, $state, ngTableParams){

	$scope.errorMessage = '';
	$scope.successMessage = "";
	ADBaseTableCtrl.call(this, $scope, ngTableParams);
	

	$scope.isIpad = navigator.userAgent.match(/iPad/i) != null;
	$scope.isIpad = true;

	$scope.fetchTableData = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		// var fetchSuccessOfItemList = function(data){
		// 	$scope.$emit('hideLoader');
		//
		data= {};
		//
			$scope.totalCount = data.total_count = 2;
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
			//$scope.data = data.results;
			$scope.ibeacons = [{"type":"type1","id":"0"},{"type":"type2","id":"1"},{"type":"type3","id":"3"}];

			$scope.data = [{"location":"bar",
							"id":"000",
							"selectedType":"0",
							"status":false},
							{"location":"spa",
							"id":"001",
							"selectedType":"1",
							"status":true}]
			
			$scope.currentPage = params.page();
        	params.total(data.total_count);
            $defer.resolve($scope.data);
		// };
		// $scope.invokeApi(ADRatesSrv.fetchRates, getParams, fetchSuccessOfItemList);
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


	$scope.toggleActive = function(id,status){

		angular.forEach($scope.data, function(ibeacon, key) {
		      if(ibeacon.id === id){
		      	ibeacon.status = !ibeacon.status;
		      }
		     });

	};


}]);