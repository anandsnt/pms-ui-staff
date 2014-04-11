admin.controller('ADaddRatesDetailCtrl',['$scope','ADRatesAddDetailsSrv',  function($scope,ADRatesAddDetailsSrv){

	$scope.init = function(){
		$scope.rateTypes = [];
		$scope.basedOn = [];
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
		};
		$scope.invokeApi(ADRatesAddDetailsSrv.fetchBasedOnTypes, {},fetchBasedOnSuccessCallback);	
	}	

	$scope.fetchData();

	$scope.saveStep1 = function(){
		$scope.$emit("updateIndex","1");
		
	}

}]);

