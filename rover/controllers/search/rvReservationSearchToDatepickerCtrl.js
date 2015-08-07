sntRover.controller('RVReservationSearchToDatepickerCtrl', ['$scope', 'ngDialog',
	function($scope, ngDialog) {
		$scope.setUpData = function() {
			$scope.datePicked = $scope.toDate;
			$scope.dateOptions = {
				changeYear: true,
				changeMonth: true,
				yearRange: "-5:+5",
				onSelect: function(dateText, inst) {
					$scope.onToDateChanged($scope.datePicked);
					ngDialog.close();
				}
			};
		};
		$scope.setUpData();
	}
]);