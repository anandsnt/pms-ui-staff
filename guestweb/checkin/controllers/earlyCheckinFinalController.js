
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
		$scope.checkinTime = $stateParams.time;
		$scope.earlyCheckinCharge = $stateParams.charge;
		var offerId= $stateParams.id;
		$scope.isPosting = true;
		var dataTosend = {'reservation_id':$rootScope.reservationID,'early_checkin_offer_id':offerId};
		earlyCheckinService.applyEarlyCheckin(dataTosend).then(function(response) {
			$scope.isPosting = false;
		},function(){
			$scope.netWorkError = true;
			$scope.isPosting = false;
		});

		$scope.nextButtonClicked =  function(){
			$state.go('preCheckinStatus');
		};
	}
};

var dependencies = [
'$scope','$rootScope','$state','$stateParams','earlyCheckinService',
earlyCheckinFinalController
];

snt.controller('earlyCheckinFinalController', dependencies);
})();