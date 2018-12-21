(function() {
	var sntIDScanUseMobileCtrl = function($scope, $rootScope, $state, $stateParams) {

		$scope.proceedWithoutIdScan = function() {
			$rootScope.idScanComplete = true;
			$rootScope.idScanSkipped = true;
			if($stateParams.is_external_verification === 'true'){
				$state.go('externalCheckinVerification');
			} else if($stateParams.skip_checkin_verification === 'true') {
				$state.go('checkinReservationDetails');
			} else{
				$state.go('checkinConfirmation');
			}
		};
	};

	var dependencies = [
		'$scope', '$rootScope','$state','$stateParams',
		sntIDScanUseMobileCtrl
	];

	sntGuestWeb.controller('sntIDScanUseMobileCtrl', dependencies);
})();