hkRover.controller('HKDashboardCtrl',['$scope', 'hkDashboardSrv',  function($scope, hkDashboardSrv){

	// setting up few default values
	$scope.data = {};
	$scope.data.occupied = 'NA';
	$scope.data.vacant_clean_room_count = 'NA';
	$scope.data.vacant_dirty_room_count = 'NA';
	$scope.data.out_of_order_rooms_count = 'NA';
	
	hkDashboardSrv.fetch().then(function(messages) {
        $scope.data = messages;
	});

}]);

hkRover.controller('HKRootCtrl',['$rootScope', '$scope', function($rootScope, $scope){
	$scope.menuOpen = false;
	
	$scope.$on("navc", function(event){
		$scope.menuOpen = $scope.menuOpen ? false : true;
	})
}]);

    
