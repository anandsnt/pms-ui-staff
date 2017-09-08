
sntRover.controller('RvArAllocatedController',
        ['$scope',
         '$timeout',
	      function($scope, $timeout) {

		BaseCtrl.call(this, $scope);

        $scope.setScroller('allocated-list-scroller');

		// Refreshes the scroller for the allocated lists
		var refreshScroll = function() {
	        $timeout(function() {
	            $scope.refreshScroller('allocated-list-scroller');
	        }, 1500);
    	};

    	// Refresh scroller while updating the results from parent controller
    	$scope.$on( 'REFRESH_ALLOCATED_LIST_SCROLLER' , function () {
    		refreshScroll();
    	});

}]);
