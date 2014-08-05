admin.controller('ADiBeaconSettingsCtrl',['$scope', '$state', 'ngTableParams','adiBeaconSettingsSrv',
	function($scope, $state, ngTableParams,adiBeaconSettingsSrv){

	$scope.init = function(){
		$scope.errorMessage = "";
		$scope.successMessage = "";
		ADBaseTableCtrl.call(this, $scope, ngTableParams);
		$scope.isIpad = navigator.userAgent.match(/iPad/i) != null;
		$scope.isIpad = true;
		$scope.data = [];
	};
	$scope.init();

	$scope.fetchTableData = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
			$scope.proximityId = data.proximity_id;
			$scope.majorId = data.major_id;
			$scope.data = data.results;	
			$scope.totalCount = data.total_count;		
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
		      if(ibeacon.beacon_id === id){
		      	ibeacon.status = !ibeacon.status;
		      }
		     });
		};
		var toggleBeaconFailed = function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};
		var toggleData = {"id":id,"status":!status};

		$scope.invokeApi(adiBeaconSettingsSrv.toggleBeacon, toggleData, toggleBeaconSuccess,toggleBeaconFailed);

	};

	$scope.deleteBeacon = function(id){

		var deleteBeaconSuccess = function(){
			$scope.$emit('hideLoader');
			$scope.tableParams.reload();
		};
		var deleteBeaconFailed = function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};

		$scope.invokeApi(adiBeaconSettingsSrv.deleteBeacon, {"id":id}, deleteBeaconSuccess,deleteBeaconFailed);
	}


}]);