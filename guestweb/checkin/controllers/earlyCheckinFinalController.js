
(function() {
	var earlyCheckinFinalController = function($scope,$rootScope,$state,$stateParams,earlyCheckinService) {

	
	$scope.pageValid = false;

	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else if($rootScope.isCheckedout){
		$state.go('checkOutStatus');
	}
	else{
		$scope.pageValid = true;
	}		

	if($scope.pageValid){
		console.log($stateParams);
		$scope.checkinTime = $stateParams.time;
		$scope.earlyCheckinCharge = $stateParams.charge;
		console.log($stateParams);
		$scope.nextButtonClicked = function(){
		//	$scope.isPosting = true;
		// var data = {'reservation_id':$rootScope.reservationID,'early_checkin_offer_id':};
		// 	earlyCheckinService.applyEarlyCheckin(dataTosend).then(function(response) {				
		// 		$state.go('preCheckinStatus');
		// 	},function(){
		// 		$scope.netWorkError = true;
		// 		$scope.isPosting = false;
		// 	});
		// };
		}
	}
}

var dependencies = [
'$scope','$rootScope','$state','$stateParams','earlyCheckinService',
earlyCheckinFinalController
];

snt.controller('earlyCheckinFinalController', dependencies);
})();