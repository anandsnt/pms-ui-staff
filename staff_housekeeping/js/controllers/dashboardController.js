hkRover.controller('DashboardController',['$scope', 'DashboardService',  function($scope, DashboardService){

	DashboardService.fetch().then(function(messages) {
		console.log(messages);
	      $scope.data = messages;
	});

}]);

    