sntRover.controller('RMFilterOptionsCtrl',['$scope','RMFilterOptionsSrv', function($scope, RMFilterOptionsSrv){
	
  	BaseCtrl.call(this, $scope);
  	//$scope.displayMode = "calendar";
  
  	/*
    * Method to fetch all filter options
    */
	$scope.fetchFilterOptions = function(){
		var fetchFilterOptionsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
		};
		$scope.invokeApi(RMFilterOptionsSrv.fetch, {},fetchFilterOptionsSuccessCallback);
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
  
}]);