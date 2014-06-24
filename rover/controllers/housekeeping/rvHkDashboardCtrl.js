sntRover.controller('RVHkDashboardCtrl', [
	'$scope',
	'RVHkDashboardSrv',
	function($scope, RVHkDashboardSrv) {

		BaseCtrl.call(this, $scope);

		$scope.heading = "Dashboard";

		//$scope.data = RVHkDashboardSrv;

		RVHkDashboardSrv.fetch()
			.then(function(data) {
				$scope.data = data;
			});
	}
]);