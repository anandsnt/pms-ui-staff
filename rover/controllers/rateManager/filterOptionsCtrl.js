sntRover.controller('RMFilterOptionsCtrl',['$scope','RMFilterOptionsSrv', function($scope, RMFilterOptionsSrv){
	
  	BaseCtrl.call(this, $scope);
  	//$scope.displayMode = "calendar";
  	$scope.data = {};
  	$scope.selectedRatesList = [];
  	$scope.data.rates = [];
  	$scope.data.rate_types = [];
  	/*
    * Method to fetch all filter options
    */
	$scope.fetchFilterOptions = function(){
		var fetchFilterOptionsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
		};
		$scope.invokeApi(RMFilterOptionsSrv.fetch, {},fetchFilterOptionsSuccessCallback);
		var fetchRatesSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data.rates = data.results;
		};
		$scope.invokeApi(RMFilterOptionsSrv.fetchRates, {},fetchRatesSuccessCallback);
		var fetchRateTypesSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data.rate_types = data;
		};
		$scope.invokeApi(RMFilterOptionsSrv.fetchRateTypes, {},fetchRateTypesSuccessCallback);
	};
	$scope.fetchFilterOptions();

	$scope.clickedAllRates = function(){
		if($scope.data.is_checked_all_rates == "true"){
			$scope.data.is_checked_all_rates = "false";
		}
		else{
			$scope.data.is_checked_all_rates = "true";
		}
	};
	
	$scope.showRates = function(){
		console.log("showRates");
	};
	
	$scope.$watch('data.rate_selected', function() {
		var isDataExists = false;
		angular.forEach($scope.selectedRatesList,function(item, index) {
       		if (item.id == $scope.data.rate_selected) {
       			isDataExists = true;
		 	}
       	});
		if(!isDataExists){
			angular.forEach($scope.data.rates,function(item, index) {
	       		if (item.id == $scope.data.rate_selected) {
	       			$scope.selectedRatesList.push(item);
			 	}
	       });
	    }
   	});
   	
	$scope.deleteRate = function(id){
		angular.forEach($scope.selectedRatesList,function(item, index) {
       		if (item.id == id) {
       			$scope.selectedRatesList.splice(index, 1);
		 	}
       	});
	};
  
}]);