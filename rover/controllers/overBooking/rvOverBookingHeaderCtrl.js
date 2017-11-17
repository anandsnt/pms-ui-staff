angular.module('sntRover').controller('RvOverBookingHeaderCtrl', [
	'$scope',
	'$rootScope',
	'ngDialog',
	function($scope, $rootScope, ngDialog) {

	BaseCtrl.call(this, $scope);

	// To popup contract start date
	$scope.showDatePicker = function() {
		ngDialog.open({
			template: '/assets/partials/common/rvDatePicker.html',
			controller: 'rvOverBookingDatePickerCtrl',
			className: '',
			scope: $scope,
			closeByDocument: true
		});
	};

    // Catching event from date picker controller while date is changed.
    $scope.$on('DATE_CHANGED', function () {
        var currentStartDate = $scope.overBookingObj.startDate;

        $scope.overBookingObj.endDate = moment(tzIndependentDate(currentStartDate)).add(13, 'd').format($rootScope.momentFormatForAPI);
        $scope.$emit('REFRESH_OVERBOOKING_GRID');
    });

	$scope.clickedShowRoomsLeftTosell = function() {
		$scope.overBookingObj.isShowRoomsLeftToSell = !$scope.overBookingObj.isShowRoomsLeftToSell;
		$scope.$emit('REFRESH_OVERBOOKING_GRID');
	};

	$scope.clickedPrevDateButton = function() {
		var currentStartDate = $scope.overBookingObj.startDate;

		$scope.overBookingObj.startDate = moment(tzIndependentDate(currentStartDate)).add(-13, 'd').format($rootScope.momentFormatForAPI);
		$scope.overBookingObj.endDate = moment(tzIndependentDate(currentStartDate)).format($rootScope.momentFormatForAPI);
		$scope.$emit('REFRESH_OVERBOOKING_GRID');
	};

	$scope.clickedNextDateButton = function() {
		var currentEndDate = $scope.overBookingObj.endDate;

		$scope.overBookingObj.startDate = moment(tzIndependentDate(currentEndDate)).format($rootScope.momentFormatForAPI);
		$scope.overBookingObj.endDate = moment(tzIndependentDate(currentEndDate)).add(13, 'd').format($rootScope.momentFormatForAPI);
		$scope.$emit('REFRESH_OVERBOOKING_GRID');
	};

}]);
