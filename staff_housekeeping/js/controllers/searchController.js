hkRover.controller('searchController',['$scope', 'HKSearchSrv', function($scope, HKSearchSrv){
	HKSearchSrv.fetch().then(function(messages) {
	      $scope.data = messages;
	});

}]);

