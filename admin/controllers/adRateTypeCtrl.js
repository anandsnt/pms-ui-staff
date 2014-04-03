admin.controller('ADRateTypeCtrl', ['$scope', '$rootScope', 'ADRateTypeSrv',
function($scope, $rootScope, ADRateTypeSrv) {

	var fetchSuccess = function(){
		$scope.data = data;
		console.log("fetchSuccess");
		console.log($scope.data);
		$scope.$emit('hideLoader');
	};
	
	var fetchFailed = function(){
		console.log("fetchFailed");
		$scope.$emit('hideLoader');
	};
	
	$scope.invokeApi(ADRateTypeSrv.fetch, {}, fetchSuccess, fetchFailed);
		
}]); 