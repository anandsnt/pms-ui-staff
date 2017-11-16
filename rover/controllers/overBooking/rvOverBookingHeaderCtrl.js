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

        $scope.overBookingObj.endDate = moment(tzIndependentDate(currentStartDate)).day(14).format($rootScope.momentFormatForAPI);
        $scope.$emit('REFRESH_OVERBOOKING_GRID');
    });

	$scope.clickedShowRoomsLeftTosell = function() {
		$scope.overBookingObj.isShowRoomsLeftToSell = !$scope.overBookingObj.isShowRoomsLeftToSell;
		$scope.$emit('REFRESH_OVERBOOKING_GRID');
	};

	$scope.clickedPrevDateButton = function() {
		var currentStartDate = $scope.overBookingObj.startDate;

		$scope.overBookingObj.startDate = moment(tzIndependentDate(currentStartDate)).day(-14).format($rootScope.momentFormatForAPI);
		$scope.overBookingObj.endDate = moment(tzIndependentDate(currentStartDate)).format($rootScope.momentFormatForAPI);
		$scope.$emit('REFRESH_OVERBOOKING_GRID');
		console.log("STRAT DATE =", $scope.overBookingObj.startDate);
		console.log("END DATE =", $scope.overBookingObj.endDate);
	};

	$scope.clickedNextDateButton = function() {
		var currentEndDate = $scope.overBookingObj.endDate;

		$scope.overBookingObj.startDate = moment(tzIndependentDate(currentEndDate)).format($rootScope.momentFormatForAPI);
		$scope.overBookingObj.endDate = moment(tzIndependentDate(currentEndDate)).day(14).format($rootScope.momentFormatForAPI);
		$scope.$emit('REFRESH_OVERBOOKING_GRID');
		console.log("STRAT DATE =", $scope.overBookingObj.startDate);
		console.log("END DATE =", $scope.overBookingObj.endDate);
	};

}]);
