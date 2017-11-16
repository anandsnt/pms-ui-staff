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

    $scope.heading = $filter('translate')('MENU_OVER_BOOKING');
    $scope.setTitle($filter('translate')('MENU_OVER_BOOKING'));
    $scope.$emit('updateRoverLeftMenu', 'overbooking');

	$scope.overBookingObj = {
		roomTypeList: completeRoomTypeListData,
		overBookingGridData: overBookingGridData,
		selectedDate: $rootScope.businessDate,
		startDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
		endDate: moment(tzIndependentDate($rootScope.businessDate)).day(14).format($rootScope.momentFormatForAPI),
		isShowRoomsLeftToSell: false
	};

	$scope.$on('REFRESH_OVERBOOKING_GRID', function() {
		console.log('REFRESH_OVERBOOKING_GRID');
	});

}]);
