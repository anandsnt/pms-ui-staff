/*
	Early Checkin options Ctrl 
	There are two options 1) purcahase an early checkin 2) change the arrival time to a later time.
*/

(function() {
	var earlyCheckinOptionsController = function($scope, $rootScope, $state, $stateParams) {

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

			$scope.nextButtonClicked = function() {
				var stateParams = {
					'time': $scope.checkinTime,
					'charge': $stateParams.charge,
					'id': offerId,
					'isFromCheckinNow': !!$stateParams.isFromCheckinNow
				};
				$state.go('earlyCheckinFinal', stateParams);
			};

			var changeArrivalTime = function() {
				$state.go('laterArrival', {
					'time': $scope.checkinTime,
					'isearlycheckin': true
				});
			}

			$scope.changeArrivalTime = function() {
				changeArrivalTime();
			};
		}
	};

	var dependencies = [
		'$scope', '$rootScope', '$state', '$stateParams',
		earlyCheckinOptionsController
	];

	sntGuestWeb.controller('earlyCheckinOptionsController', dependencies);
})();