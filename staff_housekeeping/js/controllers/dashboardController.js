hkRover.controller('DashboardController',['$scope', 'DashboardService',  function($scope, DashboardService){
	/*$scope.data = {
		"guests_duein": "144",
		"guests_inhouse": "1",
		"guests_dueout": "1",
		"rooms_occupied": "20",
		"rooms_clean": "2",
		"rooms_dirty": "23"
	}*/

	$scope.data = DashboardService.data;



}]);

    