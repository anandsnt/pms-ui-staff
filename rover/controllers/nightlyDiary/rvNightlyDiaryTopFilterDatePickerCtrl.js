sntRover.controller('RVNightlyDiaryTopFilterDatePickerController', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog) {

	var minDateSelected = '',
		maxDateSelected = '';

	if ($scope.clickedFrom === 'MAIN_FILTER') {
		$scope.date = $scope.diaryData.fromDate;
	}
	else if ($scope.clickedFrom === 'BOOK_FILTER_ARRIVAL') {
		$scope.date = $scope.diaryData.bookRoomViewFilter.fromDate;
		minDateSelected = $scope.diaryData.fromDate;
		maxDateSelected = $scope.diaryData.toDate;
	}
	else if ($scope.clickedFrom === 'BOOK_FILTER_DEPARTURE') {
		$scope.date = $scope.diaryData.bookRoomViewFilter.toDate;
		minDateSelected = $scope.diaryData.bookRoomViewFilter.fromDate;
		maxDateSelected = $scope.diaryData.toDate;
	}

	$scope.setUpData = function() {
		$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate(minDateSelected),
            maxDate: tzIndependentDate(maxDateSelected),
			yearRange: "-100:+5",
			onSelect: function() {

				if ($scope.clickedFrom === 'MAIN_FILTER') {
					$scope.diaryData.fromDate = $scope.date;
				}
				else if ($scope.clickedFrom === 'BOOK_FILTER_ARRIVAL') {
					$scope.diaryData.bookRoomViewFilter.fromDate = $scope.date;
				}
				else if ($scope.clickedFrom === 'BOOK_FILTER_DEPARTURE') {
					$scope.diaryData.bookRoomViewFilter.toDate = $scope.date;
				}
				
				$scope.$emit('DATE_CHANGED', $scope.clickedFrom);
				ngDialog.close();
			}
		};
	};

	$scope.setUpData();
}]);