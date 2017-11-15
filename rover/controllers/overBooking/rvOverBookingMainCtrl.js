angular.module('sntRover').controller('RvOverBookingMainCtrl', [
	'$scope',
	'rvOverBookingSrv',
	'$rootScope',
	'ngDialog',
	'$filter',
	'$timeout',
	'completeRoomTypeListData',
	'overBookingGridData',
	function($scope, rvOverBookingSrv, $rootScope, ngDialog, $filter, $timeout, completeRoomTypeListData, overBookingGridData) {

	BaseCtrl.call(this, $scope);

	$scope.overBookingObj = {
		roomTypeList: completeRoomTypeListData,
		overBookingGridData: overBookingGridData,
		selectedDate: $rootScope.businessDate,
		formattedSelectedDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat)
	};
console.log($scope.overBookingObj);
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

}]);
