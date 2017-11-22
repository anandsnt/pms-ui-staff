angular.module('sntRover').controller('RvOverBookingHeaderCtrl', [
	'$scope',
	'$rootScope',
	'ngDialog',
	'$timeout',
	function($scope, $rootScope, ngDialog, $timeout) {

	BaseCtrl.call(this, $scope);
	$scope.setScroller('roomTypeFilterList');
	$scope.businessDate = $rootScope.businessDate;

	// To popup contract start date
	$scope.showDatePicker = function() {
		ngDialog.open({
			template: '/assets/partials/overBooking/rvOverBookingDatePicker.html',
			controller: 'rvOverBookingDatePickerCtrl',
			className: '',
			scope: $scope,
			closeByDocument: true
		});
	};
    // Catching event from date picker controller while date is changed.
    var listenerDateChanged = $scope.$on('DATE_CHANGED', function () {
        var currentStartDate = $scope.overBookingObj.startDate;

        $scope.overBookingObj.endDate = moment(tzIndependentDate(currentStartDate)).add(13, 'd')
            .format($rootScope.momentFormatForAPI);
        $scope.$emit('REFRESH_OVERBOOKING_GRID');
    });
    
    // Handle SHOW ROOMS LEFT TO SELL button click action
	$scope.clickedShowRoomsLeftTosell = function() {
		$scope.$emit('REFRESH_SCROLLBARS');
		$timeout(function() {
			$scope.overBookingObj.isShowRoomsLeftToSell = !$scope.overBookingObj.isShowRoomsLeftToSell;
			$scope.$emit('REFRESH_OVERBOOKING_GRID');
        }, 300);
	};
	// Handle PREV DATE button click action
	$scope.clickedPrevDateButton = function() {
		var currentStartDate = $scope.overBookingObj.startDate;

		$scope.overBookingObj.startDate = moment(tzIndependentDate(currentStartDate)).add(-13, 'd')
				.format($rootScope.momentFormatForAPI);
		$scope.overBookingObj.endDate = moment(tzIndependentDate(currentStartDate))
				.format($rootScope.momentFormatForAPI);
		$scope.$emit('REFRESH_OVERBOOKING_GRID');
	};
	// Handle NEXT DATE button click action
	$scope.clickedNextDateButton = function() {
		var currentEndDate = $scope.overBookingObj.endDate;

		$scope.overBookingObj.startDate = moment(tzIndependentDate(currentEndDate))
				.format($rootScope.momentFormatForAPI);
		$scope.overBookingObj.endDate = moment(tzIndependentDate(currentEndDate)).add(13, 'd')
				.format($rootScope.momentFormatForAPI);
		$scope.$emit('REFRESH_OVERBOOKING_GRID');
	};
	// Handle ROOM TYPE FILTER toggle.
	$scope.toggleRoomTypeFilter = function() {
		$scope.overBookingObj.isShowRoomTypeFilter = !$scope.overBookingObj.isShowRoomTypeFilter;
		$scope.refreshScroller('roomTypeFilterList');
	};
	// Handle click action on each checkbox inside filter.
	$scope.clickedRoomTypeCheckbox = function ( index ) {
		var item = $scope.overBookingObj.roomTypeList[index];

		item.isChecked = !item.isChecked;
		$scope.$emit('REFRESH_OVERBOOKING_GRID');
	};
	// Logic for Disable PREV DATE button.
	$scope.disablePrevDateButton = function() {
		var dateLimit =  moment(tzIndependentDate($rootScope.businessDate)).add(13, 'd'),
            currentDate = moment(tzIndependentDate($scope.overBookingObj.startDate)),
            disablePrevDateButton = false;

        if (dateLimit > currentDate ) {
           disablePrevDateButton = true;
        }

        return disablePrevDateButton;
	};

	// Cleaning listener.
    $scope.$on('$destroy', listenerDateChanged);

}]);
