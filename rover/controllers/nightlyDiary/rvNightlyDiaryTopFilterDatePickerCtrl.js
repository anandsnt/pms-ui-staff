sntRover.controller('RVNightlyDiaryTopFilterDatePickerController', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog) {

	var minDateSelected = '',
		maxDateSelected = '';

	if ($scope.clickedFrom === 'MAIN_FILTER') {
		$scope.date = $scope.diaryData.fromDate;
	}
	else if ($scope.clickedFrom === 'BOOK_FILTER_ARRIVAL') {
		$scope.date = $scope.diaryData.bookRoomViewFilter.fromDate;

		// Logic to set minDateSelected.
		var businessDateMinusOne = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days')
                .format($rootScope.momentFormatForAPI);

        if ($scope.diaryData.fromDate === businessDateMinusOne) {
            minDateSelected = $rootScope.businessDate;
        }
        else {
            minDateSelected = $scope.diaryData.fromDate;
        }

		// Logic to set maxDateSelected.
		var dateDiff = moment($scope.diaryData.bookRoomViewFilter.toDate)
                        .diff(moment($scope.diaryData.toDate), 'days');

        // Selected book filter to-date is greater than the visible dates in diary.
        // So we cannot show BOOK bar if data available, so resets from-date.
        if (dateDiff > 0) {
            maxDateSelected = $scope.diaryData.toDate;
        }
        else {
            maxDateSelected = $scope.diaryData.bookRoomViewFilter.toDate;
        }
	}
	else if ($scope.clickedFrom === 'BOOK_FILTER_DEPARTURE') {
		$scope.date = $scope.diaryData.bookRoomViewFilter.toDate;
		minDateSelected = $scope.diaryData.bookRoomViewFilter.fromDate;
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