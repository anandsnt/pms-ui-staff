sntRover.controller('RMFilterOptionsCtrl',['$scope','RMFilterOptionsSrv', function($scope, RMFilterOptionsSrv){
	
  	BaseCtrl.call(this, $scope);
  	//$scope.displayMode = "calendar";
  
  	/*
    * Method to fetch all filter options
    */
	$scope.fetchFilterOptions = function(){
		var fetchFilterOptionsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			console.log(data);
			$scope.data = data;
		};
		$scope.invokeApi(RMFilterOptionsSrv.fetch, {},fetchFilterOptionsSuccessCallback);
	};
	$scope.fetchFilterOptions();

  
}]);