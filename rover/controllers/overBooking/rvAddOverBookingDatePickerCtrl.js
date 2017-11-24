angular.module('sntRover').controller('rvAddOverBookingDatePickerCtrl', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog) {

	var minDateSelected = moment(tzIndependentDate($rootScope.businessDate))
				.format($rootScope.momentFormatForAPI),
		type = $scope.addOverBookingObj.type;

    if ( type === 'FROM') {
    	$scope.date = $scope.addOverBookingObj.fromDate;
    }
    else if (type === 'TO') {
    	$scope.date = $scope.addOverBookingObj.toDate;
    }

	$scope.setUpData = function() {
		$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate(minDateSelected),
			yearRange: "1:+5",
			onSelect: function() {
				$scope.$emit('DATE_CHANGED', type, $scope.date);
			}
		};
	};

	$scope.setUpData();
}]);