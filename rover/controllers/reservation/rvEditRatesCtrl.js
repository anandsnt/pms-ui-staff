sntRover.controller('RVEditRatesCtrl', ['$scope', '$rootScope', '$stateParams', 'ngDialog',
	function($scope, $rootScope, $stateParams, ngDialog) {
		$scope.save = function(room, index) {
			$scope.reservationData.rooms[index] = room;
			$scope.computeTotalStayCost();
			if ($stateParams.id) { // IN STAY CARD .. Reload staycard
				$scope.saveReservation('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $scope.reservationData.reservationId || $scope.reservationParentData.reservationId,
					"confirmationId": $scope.reservationData.confirmNum || $scope.reservationParentData.confirmNum,
					"isrefresh": false
				});
			} else {
				$scope.saveReservation();
			}
			$scope.closeDialog();
		}
		
		$scope.pastDay = function(date) {
			return tzIndependentDate($rootScope.businessDate) > new tzIndependentDate(date);
		}

	}
]);