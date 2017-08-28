
sntRover.controller('RvArAllocatedController', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', '$stateParams', 'ngDialog', '$state', '$vault', '$window', 'RVReservationCardSrv', '$filter',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv, $filter) {

		BaseCtrl.call(this, $scope);

		var ALLOCATED_LIST_SCROLLER = 'allocated-list-scroller';

		// Get the request parameters for fetching the allocated ar transactions
		var getRequestParams = function () {
			var dataToSend = {
				account_id: $stateParams.id,
				getParams : {
					page: 1,
					per_page: 50,
					transaction_type: 'PAYMENTS',
					allocated: false
				}
			};

			return dataToSend;			
		};

		// Refreshes the scroller for the allocated lists
		var refreshScroll = function() {
	        $timeout(function() {
	            $scope.refreshScroller(ALLOCATED_LIST_SCROLLER);
	        }, 1500);
    	};

    	// Refresh scroller while updating the results from parent controller
    	$scope.$on( 'REFRESH_ALLOCATED_LIST_SCROLLER' , function () {
    		refreshScroll();
    	});

		// Initialize the controller
		var init = function () {
			$scope.setScroller(ALLOCATED_LIST_SCROLLER);
			$scope.fetchTransactions( getRequestParams() );
		};

		init();

		
		
}]);
