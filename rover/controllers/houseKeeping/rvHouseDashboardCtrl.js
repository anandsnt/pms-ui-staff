sntRover.controller('RVHouseDashboardCtrl', [
	'$scope',
	'rvHouseDashboardSrv',
	function($scope, rvHouseDashboardSrv) {

		BaseCtrl.call(this, $scope);

		$scope.heading = "Dashboard";

		//$scope.data = rvHouseDashboardSrv;

		rvHouseDashboardSrv.fetch()
			.then(function(data) {
				$scope.data = data;
			});
	}
]);