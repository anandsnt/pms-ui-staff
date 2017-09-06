
sntRover.controller('RvArUnallocatedController',
	['$scope',
	 '$timeout',
	  function($scope, $timeout) {

		BaseCtrl.call(this, $scope);

        $scope.setScroller('unallocated-list-scroller');

		// Refreshes the scroller for the unallocated lists
		var refreshScroll = function() {
	        $timeout(function() {
	            $scope.refreshScroller('unallocated-list-scroller');
	        }, 1500);
    	};

    	// Refresh scroller while updating the results from parent controller
    	$scope.$on( 'REFRESH_UNALLOCATED_LIST_SCROLLER' , function () {
    		refreshScroll();
    	});

}]);
