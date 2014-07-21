admin.controller('ADiBeaconSettingsCtrl',['$scope', '$state', 'ngTableParams','adiBeaconSettingsSrv',
	function($scope, $state, ngTableParams,adiBeaconSettingsSrv){

	$scope.init = function(){
		$scope.errorMessage = "";
		$scope.successMessage = "";
		ADBaseTableCtrl.call(this, $scope, ngTableParams);
		$scope.isIpad = navigator.userAgent.match(/iPad/i) != null;
		$scope.data = [];
		////////////////////
		$scope.isIpad = true;
		////////////////////
	};
	$scope.init();

	$scope.fetchTableData = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
			$scope.data = data.results;			
			$scope.currentPage = params.page();
	        params.total(data.total_count);
	        $defer.resolve($scope.data);
		};
		var fetchFailedOfItemList = function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};
		$scope.invokeApi(adiBeaconSettingsSrv.fetchBeaconList, {}, fetchSuccessOfItemList,fetchFailedOfItemList);
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

		var toggleBeaconSuccess = function(){
			$scope.$emit('hideLoader');
			angular.forEach($scope.data, function(ibeacon, key) {
		      if(ibeacon.id === id){
		      	ibeacon.beacon_status = !ibeacon.beacon_status;
		      }
		     });
		};
		var toggleBeaconFailed = function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};
		var toggleData = {"id":id,"beacon_status":!status};

		$scope.invokeApi(adiBeaconSettingsSrv.toggleBeacon, toggleData, toggleBeaconSuccess,toggleBeaconFailed);

	};

	$scope.deleteBeacon = function(id){

		var deleteBeaconSuccess = function(){
			$scope.$emit('hideLoader');
			// angular.forEach($scope.data, function(ibeacon, key) {
		 //      if(ibeacon.id === id){
		 //      	$scope.data.splice(key,1);
		 //      }
		 //     });
			$scope.tableParams.reload();
		};
		var deleteBeaconFailed = function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};

		$scope.invokeApi(adiBeaconSettingsSrv.deleteBeacon, {"id":id}, deleteBeaconSuccess,deleteBeaconFailed);
	}


}]);