/*
	Early Checkin final Ctrl 
	The early checkin purcahse is done here on entering to this page itself.
*/
(function() {
	var earlyCheckinFinalController = function($scope, $rootScope, $state, $stateParams, earlyCheckinService) {


		$scope.pageValid = false;

		if ($rootScope.isCheckedin) {
			$state.go('checkinSuccess');
		} else if ($rootScope.isCheckedout) {
			$state.go('checkOutStatus');
		} else {
			$scope.pageValid = true;
		}

		if ($scope.pageValid) {
			$scope.checkinTime = $stateParams.time;
			$scope.earlyCheckinCharge = $stateParams.charge;
			var offerId = $stateParams.id;
			$scope.isPosting = true;
			var dataTosend = {
				'reservation_id': $rootScope.reservationID,
				'early_checkin_offer_id': offerId
			};
			earlyCheckinService.applyEarlyCheckin(dataTosend).then(function(response) {
				$scope.isPosting = false;
			}, function() {
				$scope.netWorkError = true;
				$scope.isPosting = false;
			});

			$stateParams.isFromCheckinNow = $stateParams.isFromCheckinNow === 'true' ? true : false;

			$scope.nextButtonClicked = function() {
				// check if checkin now is selected 
				if ($stateParams.isFromCheckinNow){
					$rootScope.isAutoCheckinOn = false;// turn off for applying direct checkin
					$state.go('checkinKeys');
				} else {
					$state.go('preCheckinStatus');
				}
			};
		}
	};

	var dependencies = [
		'$scope', '$rootScope', '$state', '$stateParams', 'earlyCheckinService',
		earlyCheckinFinalController
	];

	sntGuestWeb.controller('earlyCheckinFinalController', dependencies);
})();