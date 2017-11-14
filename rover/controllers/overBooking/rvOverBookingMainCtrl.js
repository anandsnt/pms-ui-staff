angular.module('sntRover').controller('RVOverBookingMainCtrl', [
	'$scope',
	'rvOverBookingSrv',
	'$rootScope',
	'ngDialog',
	'$filter',
	'$timeout',
	function($scope, rvOverBookingSrv, $rootScope, ngDialog, $filter, $timeout) {

	BaseCtrl.call(this, $scope);

	$scope.data = {};

	// default date value
	$scope.data.selectedDate = $rootScope.businessDate;
	$scope.data.formattedSelectedDate = $filter('date')($scope.data.selectedDate, $rootScope.dateFormat);

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
