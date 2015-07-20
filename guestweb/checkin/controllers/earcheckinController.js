
(function() {
	var earlyCheckinOptionsController = function($scope,$rootScope,$state,$stateParams) {

	
	$scope.pageValid = false;

	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else if($rootScope.isCheckedout ){
		$state.go('checkOutStatus');
	}
	else{
		$scope.pageValid = true;
	}		

	if($scope.pageValid){
		
		$scope.checkinTime = $stateParams.time;
		$scope.earlyCheckinCharge = $stateParams.charge;
		$scope.nextButtonClicked = function(){
			$state.go('earlyCheckinFinal',{'time':'4 PM','charge':'40'});
		};
		$scope.changeArrivalTime = function(){
			$state.go('laterArrival',{'time':'4 PM'});
		};
	}
};

var dependencies = [
'$scope','$rootScope','$state','$stateParams',
earlyCheckinOptionsController
];

snt.controller('earlyCheckinOptionsController', dependencies);
})();