sntRover.controller('RVNightlyDiaryTopFilterDatePickerController', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog) {

	var minDateSelected = '';

	$scope.date = $scope.diaryData.fromDate;

	$scope.setUpData = function() {
		$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: minDateSelected,
			yearRange: "-100:+5",
			onSelect: function() {
				$scope.diaryData.fromDate = $scope.date;
				$scope.$emit('DATE_CHANGED');
				ngDialog.close();
			}
		};
	};

	$scope.setUpData();
}]);