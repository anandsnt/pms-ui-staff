angular.module('sntRover').controller('rvAddOverBookingPopupCtrl', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog) {

	var init = function() {
		$scope.addOverBookingObj = {
			fromDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
			toDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
			weekDayList: [
				{ name: 'MON', value: 1, isChecked: true },
				{ name: 'TUE', value: 2, isChecked: true },
				{ name: 'WED', value: 3, isChecked: true },
				{ name: 'THU', value: 4, isChecked: true },
				{ name: 'FRI', value: 5, isChecked: true },
				{ name: 'SAT', value: 6, isChecked: true },
				{ name: 'SUN', value: 0, isChecked: true }
			],
			applyForHouse: true,
			applyForRoomTypes: false,
			limitType: 'RMS',
			roomTypeList: [],
			limitValue: ''
		};
	};

	$scope.clickedApplyForHouse = function() {
		$scope.addOverBookingObj.applyForHouse = !$scope.addOverBookingObj.applyForHouse;
	};

	$scope.clickedApplyForRoomTypes = function() {
		$scope.addOverBookingObj.applyForRoomTypes = !$scope.addOverBookingObj.applyForRoomTypes;
	};

	init();
}]);