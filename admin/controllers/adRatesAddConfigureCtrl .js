admin.controller('ADRatesAddConfigureCtrl',['$scope', 'ADRatesConfigureSrv','ADRatesAddRoomTypeSrv', function($scope, ADRatesConfigureSrv, ADRatesAddRoomTypeSrv){
   $scope.sets = "";
   $scope.currentClickedSet = -1;
 	
    $scope.fetchSetsInDateRangeSuccessCallback = function(data){
    	$scope.$emit('hideLoader');
    	$scope.data = data;
    	
    };
    $scope.fetchSetsInDateRangeFailureCallback = function(errorMessage){
    	$scope.$emit('hideLoader');
    	// $scope.sets = data;
    };
    $scope.setCurrentClickedSet = function(index){
    	console.log("=============="+index);
    	$scope.currentClickedSet = index;
    };
    
  
    $scope.fetchRoomTypesSuccessCallback = function(data){
			$scope.data.room_rates = data.results;
			// angular.forEach($scope.data.sets, function(value, key){
           		// value.room_types = $scope.data.room_rates;
     		// });
			$scope.$emit('hideLoader');
		};
		$scope.fetchRoomTypesFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
    $scope.fetchData = function(){
    	
    	$scope.invokeApi(ADRatesConfigureSrv.fetchSetsInDateRange, {},$scope.fetchSetsInDateRangeSuccessCallback,$scope.fetchSetsInDateRangeFailureCallback);	
		$scope.invokeApi(ADRatesAddRoomTypeSrv.fetchRoomTypes, {}, $scope.fetchRoomTypesSuccessCallback, $scope.fetchRoomTypesFailureCallback);	
    	
    };
    $scope.fetchData();
    $scope.saveSet = function(index){
    	console.log(JSON.stringify($scope.data.sets[index]));
    	console.log(JSON.stringify($scope.data.room_rates));
    };
 
}]);
