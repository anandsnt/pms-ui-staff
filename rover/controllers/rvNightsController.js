sntRover.controller('contractedNightsCtrl',[ '$rootScope','$scope', function($rootScope, $scope){
	BaseCtrl.call(this, $scope);
	
	$scope.updateAllNights = function(){
		angular.forEach($scope.contractData.occupancy,function(item, index) {
			item.contracted_occupancy = $scope.contractData.allNights;
       	});
	};
}]);