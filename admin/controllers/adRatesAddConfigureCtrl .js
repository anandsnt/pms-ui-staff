admin.controller('ADRatesAddConfigureCtrl',['$scope', 'ADRatesConfigureSrv', function($scope, ADRatesConfigureSrv){
   $scope.sets = "";
   $scope.currentClickedSet = 0;
   

 	var dateRangeId = $scope.$parent.step.id;
    $scope.fetchSetsInDateRangeSuccessCallback = function(data){
    	$scope.$emit('hideLoader');
    	$scope.data = data;
    	 angular.forEach($scope.data.sets, function(value, key){
			 value.room_types = data.room_types;
		 });
		 var unwantedKeys = ["room_types"];
		$scope.data = dclone($scope.data, unwantedKeys);
    	console.log(JSON.stringify($scope.data));
    };
    $scope.fetchSetsInDateRangeFailureCallback = function(errorMessage){
    	$scope.$emit('hideLoader');
    	// $scope.sets = data;
    };
    $scope.setCurrentClickedSet = function(index){
    	console.log("=============="+index);
    	$scope.currentClickedSet = index;
    };
    
  
    // $scope.fetchRoomTypesSuccessCallback = function(data){
			// $scope.data.room_rates = data.results;
			// // angular.forEach($scope.data.sets, function(value, key){
           		// // value.room_types = $scope.data.room_rates;
     		// // });
			// $scope.$emit('hideLoader');
		// };
		// $scope.fetchRoomTypesFailureCallback = function(data){
			// $scope.$emit('hideLoader');
		// };
    $scope.fetchData = function(){
    	
    	$scope.invokeApi(ADRatesConfigureSrv.fetchSetsInDateRange, {"id":dateRangeId},$scope.fetchSetsInDateRangeSuccessCallback,$scope.fetchSetsInDateRangeFailureCallback);	
		// $scope.invokeApi(ADRatesAddRoomTypeSrv.fetchRoomTypes, {}, $scope.fetchRoomTypesSuccessCallback, $scope.fetchRoomTypesFailureCallback);	
    	
    };
    $scope.fetchData();
    $scope.saveSetSuccessCallback = function(){
    	 $scope.$emit('hideLoader');
    };
    $scope.saveSetFailureCallback = function(errorMessage){
    	 $scope.$emit('hideLoader');
    	 $scope.errorMessage = errorMessage;
    	 $scope.$emit("errorReceived",errorMessage);
    };
    $scope.cancelClick = function(){
    	$scope.currentClickedSet = -1;
    };
    $scope.saveSet = function(index){

    	var	unwantedKeys = ["room_types"];
    	var setData = dclone($scope.data.sets[index], unwantedKeys);
    	$scope.updateData = setData;
    	$scope.updateData.room_rates = $scope.data.sets[index].room_types;
    	
    	$scope.invokeApi(ADRatesConfigureSrv.saveSet, $scope.updateData, $scope.saveSetSuccessCallback, $scope.saveSetFailureCallback);
    	
    };
    $scope.moveAllSingleToDouble = function(index){
    	 angular.forEach($scope.data.sets[index].room_types, function(value, key){
			 value.double = value.single;
		 });
    };
    $scope.moveSingleToDouble = function(parentIndex, index){
    	$scope.data.sets[parentIndex].room_types[index].double = $scope.data.sets[parentIndex].room_types[index].single;
    };
    $scope.deleteSet = function(id){
    	console.log("++++++++++++++"+id)
    };
    $scope.checkFieldEntered = function(index){
    	var enableSetUpdateButton = false;
    	 angular.forEach($scope.data.sets[index].room_types, function(value, key){
			 console.log(value.single);
			 if(!value.single || value.single ==="" ){
			 	enableSetUpdateButton =true;
			 }
		 });
		 return enableSetUpdateButton;
		
    };
    $scope.saveWholeData = function(){
    	 angular.forEach($scope.data.sets, function(value, key){
			 $scope.saveSet(key);
		 });
    };
 
}]);
