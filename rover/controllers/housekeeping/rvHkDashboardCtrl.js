sntRover.controller('RVHkDashboardCtrl', [
	'$scope',
	'$rootScope',
	'RVHkDashboardSrv',
	'dashboardData',
	function($scope, $rootScope, RVHkDashboardSrv, dashboardData) {

		BaseCtrl.call(this, $scope);

		$scope.heading = "Dashboard";

		$scope.data = dashboardData;

		// dashboardData

		// RVHkDashboardSrv.fetch()
		// 	.then(function(data) {
		// 		$scope.data = data;
		// 	});
	}
]);