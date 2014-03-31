admin.controller('ADMappingDetailsCtrl', ['$scope', '$state', '$stateParams', 'ADMappingDetailsSrv',
function($scope, $state, $stateParams, ADMappingDetailsSrv) {
	BaseCtrl.call(this, $scope);
	
	
	if($stateParams.action == "add"){
		$scope.isAdd = true;
		$scope.hotelId = $stateParams.id;
		console.log("$scope.hotelId---"+$scope.hotelId);
		var fetchSuccess = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
			$scope.$emit('hideLoader');
		};
		
		$scope.invokeApi(ADMappingDetailsSrv.fetchAddData, {'id':$scope.hotelId }, fetchSuccess, fetchFailed);
	}
	if($stateParams.action == "edit"){
		
		$scope.mappingId = $stateParams.id;
		console.log("$scope.mappingId----"+$scope.mappingId );

		
		var fetchSuccess = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADMappingDetailsSrv.fetchEditData, {'id':$scope.mappingId }, fetchSuccess, fetchFailed);
	}


}]);