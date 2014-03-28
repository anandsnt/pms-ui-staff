admin.controller('ADMappingCtrl', ['$scope', '$state', '$stateParams', 'ADMappingSrv',
function($scope, $state, $stateParams, ADMappingSrv) {
	BaseCtrl.call(this, $scope);
	console.log("$stateParams.id")
	console.log($stateParams.id);
	$scope.id = $stateParams.id
	

	var fetchSuccess = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	
	var fetchFailed = function(){
		console.log("fetchFailed");
		$scope.$emit('hideLoader');
	};
	
	$scope.invokeApi(ADMappingSrv.fetch, {'id':$scope.id}, fetchSuccess, fetchFailed);
		
	
	

}]);
