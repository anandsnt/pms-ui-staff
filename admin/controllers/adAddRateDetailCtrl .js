admin.controller('ADaddRatesDetailCtrl',['$scope','ADRatesAddDetailsSrv',  function($scope,ADRatesAddDetailsSrv){

	$scope.init = function(){
		$scope.rateTypes = [];
		$scope.basedOn = [];
		$scope.basedOnRateList = [];
		$scope.basedOnRateTypeSelected = '';
	}
	$scope.init();

	$scope.fetchData = function(){
		
		var fetchRateTypesSuccessCallback = function(data){
			$scope.rateTypes = data.results;
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADRatesAddDetailsSrv.fetchRateTypes, {},fetchRateTypesSuccessCallback);	

		var fetchBasedOnSuccessCallback = function(data){
			$scope.basedOn=data.results;
			$scope.$emit('hideLoader');
			angular.forEach($scope.basedOn,function(item, index) {
 			if (item.rate_type !== null) {
 				$scope.basedOnRateList.push(item);
 			}
 		});

		};
		$scope.invokeApi(ADRatesAddDetailsSrv.fetchBasedOnTypes, {},fetchBasedOnSuccessCallback);	
	}	

	$scope.fetchData();

	$scope.saveStep1 = function(){
		$scope.$emit("updateIndex","1");
		
	}

}]);

