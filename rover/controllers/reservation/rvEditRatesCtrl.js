sntRover.controller('RVEditRatesCtrl', ['$scope', '$rootScope', '$stateParams', 'ngDialog',
	function($scope, $rootScope, $stateParams, ngDialog) {
		$scope.save = function(room, index) {
			
			_.each(room.stayDates, function(stayDate) {
				stayDate.rateDetails.modified_amount = parseFloat(stayDate.rateDetails.modified_amount).toFixed(2);
				if (isNaN(stayDate.rateDetails.modified_amount)) {
					stayDate.rateDetails.modified_amount = parseFloat(stayDate.rateDetails.actual_amount).toFixed(2);
				}
			});

			$scope.reservationData.rooms[index] = room;

			if ($scope.reservationData.isHourly && !$stateParams.id) {
				$scope.computeHourlyTotalandTaxes();
			} else {
				$scope.computeTotalStayCost();
			}

			if ($stateParams.id) { // IN STAY CARD .. Reload staycard
				$scope.saveReservation('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $scope.reservationData.reservationId || $scope.reservationParentData.reservationId,
					"confirmationId": $scope.reservationData.confirmNum || $scope.reservationParentData.confirmNum,
					"isrefresh": false
				});
			} else {
				$scope.saveReservation('', '', index);
			}
			$scope.closeDialog();
		};

		$scope.pastDay = function(date) {
			return tzIndependentDate($rootScope.businessDate) > new tzIndependentDate(date);
		};

	}
]);