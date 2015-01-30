sntRover.controller('rvOccupancyRevenueReportCtrl', [
'$scope',
'$rootScope',
'$filter',
'RVreportsSrv',
'$timeout',
function($scope, $rootScope, $filter, RVreportsSrv, $timeout) {
	$scope.occupanyRevenueState = {
		name: "Occupancy & Revenue Summary"
	}
}])