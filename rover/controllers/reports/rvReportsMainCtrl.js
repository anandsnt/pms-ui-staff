sntRover.controller('RVReportsMainCtrl', [
	'$rootScope',
	'$scope',
	'reportsResponse',
	function($rootScope, $scope, reportsResponse) {

		BaseCtrl.call(this, $scope);

		$scope.setTitle( 'Stats & Reports' );

		$scope.$emit("updateRoverLeftMenu", "reports");

		$scope.reportList = reportsResponse.results;

		$scope.reportCount = reportsResponse.total_count;
	}
]);