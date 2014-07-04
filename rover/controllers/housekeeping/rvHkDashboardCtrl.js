sntRover.controller('RVHkDashboardCtrl', [
	'$scope',
	'$rootScope',
	'RVHkDashboardSrv',
	'dashboardData',
	function($scope, $rootScope, RVHkDashboardSrv, dashboardData) {
		$scope.heading = "Dashboard";
		$scope.data = dashboardData;
	}
]);