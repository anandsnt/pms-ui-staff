admin.controller('ADMappingDetailsCtrl', ['$scope', '$state', '$stateParams', 'ADMappingSrv',
function($scope, $state, $stateParams, ADMappingDetailsSrv) {
	BaseCtrl.call(this, $scope);
	
	
	if($stateParams.action=="edit"){
		$scope.mappingId = $stateParams.id;
		console.log("$scope.mappingId"+$scope.mappingId );
	}	
	
	if($stateParams.action=="add"){ 
		$scope.hotelId = $stateParams.id;
		console.log("$scope.hotelId"+$scope.hotelId);
		
	}
	
	

	


}]);