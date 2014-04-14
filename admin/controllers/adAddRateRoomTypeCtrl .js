admin.controller('ADAddRateRoomTypeCtrl',['$scope','ADRatesAddRoomTypeSrv',  function($scope,ADRatesAddRoomTypeSrv){

	$scope.roomTypes = [];
	$scope.assignedRoomTypes = [];

	$scope.fetchData = function(){
		
		var fetchRoomTypesSuccessCallback = function(data){
			$scope.roomTypes = data.results;
			$scope.$emit('hideLoader');
		};
		var fetchRoomTypesFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADRatesAddRoomTypeSrv.fetchRoomTypes, {},fetchRoomTypesSuccessCallback,fetchRoomTypesFailureCallback);	

	};
	$scope.fetchData();

	$scope.saveStep2 = function(){
		$scope.$emit("updateIndex","2");
		
	};


}]);

