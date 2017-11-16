angular.module('sntRover').controller('rvOverBookingDatePickerCtrl', ['$scope', '$rootScope', 'ngDialog', '$filter', 'dateFilter', function($scope, $rootScope, ngDialog, $filter, dateFilter) {

	var minDateSelected = dateFilter(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
		maxDate = moment(tzIndependentDate($rootScope.businessDate)).day(366).format($rootScope.momentFormatForAPI);

		console.log(maxDate);

	$scope.date = dateFilter(tzIndependentDate($scope.overBookingObj.startDate), 'yyyy-MM-dd');

	$scope.setUpData = function() {
		$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate(minDateSelected),
			maxDate: tzIndependentDate(maxDate),
			yearRange: "1:+1",
			onSelect: function() {
				$scope.overBookingObj.startDate = dateFilter(tzIndependentDate($scope.date), 'yyyy-MM-dd');
				$scope.$emit('DATE_CHANGED');
				ngDialog.close();
			}
		};
	};

	$scope.setUpData();
}]);