sntRover.controller('RVNightlyDiaryUnassignedListDatePickerController', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog) {

	var minDateSelected = $scope.diaryData.fromDate;

	$scope.date = $scope.diaryData.arrivalDate;

	$scope.setUpData = function() {
		$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: minDateSelected,
			yearRange: "-100:+5",
			onSelect: function() {
				$scope.diaryData.arrivalDate = $scope.date;
				$scope.$emit('UNASSIGNED_LIST_DATE_CHANGED');
				ngDialog.close();
			}
		};
	};

	$scope.setUpData();
}]);