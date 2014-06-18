hkRover.controller('HKDashboardCtrl',['$scope', 'dashboardData',  function($scope, dashboardData){

	//dashboradData is prefetched in the router using resolve method.
	$scope.data = dashboardData;

	// stop bounce effect only on the login container
	var dashboardEl = document.getElementById( '#dashboard' );
	angular.element( dashboardEl )
		.bind( 'ontouchmove', function(e) {
			e.stopPropagation();
		});
}]);

    
