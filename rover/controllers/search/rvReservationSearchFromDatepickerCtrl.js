sntRover.controller('RVReservationSearchFromDatepickerCtrl', ['$scope', 'ngDialog',
	function($scope, ngDialog) {
		$scope.setUpData = function() {
			$scope.datePicked = $scope.fromDate;
			$scope.dateOptions = {
				changeYear: true,
				changeMonth: true,
				yearRange: "-5:+5",
				onSelect: function(dateText, inst) {
					$scope.onFromDateChanged($scope.datePicked);
					ngDialog.close();
				}
			};
		};
		$scope.setUpData();
	}
]);