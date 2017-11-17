angular.module('sntRover').controller('rvOverBookingDatePickerCtrl', ['$scope', '$rootScope', 'ngDialog', '$filter', 'dateFilter', function($scope, $rootScope, ngDialog, $filter, dateFilter) {

	var minDateSelected = moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
		maxDate = moment(tzIndependentDate($rootScope.businessDate)).add(1, 'y').format($rootScope.momentFormatForAPI);

	$scope.date = minDateSelected;

	$scope.setUpData = function() {
		$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate(minDateSelected),
			maxDate: tzIndependentDate(maxDate),
			yearRange: "1:+1",
			onSelect: function() {
				$scope.overBookingObj.startDate = moment(tzIndependentDate($scope.date)).format($rootScope.momentFormatForAPI);
				$scope.$emit('DATE_CHANGED');
				ngDialog.close();
			}
		};
	};

	$scope.setUpData();
}]);