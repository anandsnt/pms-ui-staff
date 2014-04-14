admin.controller('ADAddRateRoomTypeCtrl',['$scope','ADRatesAddRoomTypeSrv',  function($scope,ADRatesAddRoomTypeSrv){

	$scope.nonAssignedroomTypes = [];
	$scope.assignedRoomTypes = [];

	$scope.fetchData = function(){
		
		var fetchRoomTypesSuccessCallback = function(data){
			$scope.nonAssignedroomTypes = data.results;
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

	/**
	 * To handle drop success event
	 *
	 */
	$scope.dropSuccessHandler = function($event, index, array) {
		array.splice(index, 1);
	};
	/**
	 * To handle on drop event
	 *
	 */

	$scope.onDrop = function($event, $data, array) {

		
		array.push($data);
	};

	$scope.anyRoomSelected = function(){

		if($scope.assignedRoomTypes.length >0)
			return true;
		else
			return false;
	}


}]);

