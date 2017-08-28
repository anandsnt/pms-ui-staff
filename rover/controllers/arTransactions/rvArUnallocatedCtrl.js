
sntRover.controller('RvArUnallocatedController',
			 ['$scope',
			  '$rootScope',
			  'RVCompanyCardSrv', 
			  '$timeout',
			  '$stateParams',
			  'ngDialog',
			  '$state',
			  '$vault',
			  '$window',
			  'RVReservationCardSrv', 
			  '$filter',
			  'rvAccountsArTransactionsSrv',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv, $filter) {

		BaseCtrl.call(this, $scope);
		var UNALLOCATED_LIST_SCROLLER = 'unallocated-list-scroller';

		// Get the request parameters for fetching the unallocated ar transactions
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

		// Refreshes the scroller for the unallocated lists
		var refreshScroll = function() {
	        $timeout(function() {
	            $scope.refreshScroller(UNALLOCATED_LIST_SCROLLER);
	        }, 1500);
    	};

    	// Refresh scroller while updating the results from parent controller
    	$scope.$on( 'REFRESH_UNALLOCATED_LIST_SCROLLER' , function () {
    		refreshScroll();
    	});

		// Initialize the controller
		var init = function () {
			$scope.setScroller(UNALLOCATED_LIST_SCROLLER);
			$scope.fetchTransactions( getRequestParams() );
		};

		init();


		
		
}]);
