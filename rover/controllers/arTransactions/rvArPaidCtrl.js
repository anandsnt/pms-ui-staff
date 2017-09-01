
sntRover.controller('RvArPaidController', ['$scope', '$timeout', 'rvAccountsArTransactionsSrv',
	function($scope, $timeout, rvAccountsArTransactionsSrv) {

		BaseCtrl.call(this, $scope);

		$scope.setScroller('paid-list');
	    var refreshScroll = function() {
	        $timeout(function() { 
	            $scope.refreshScroller('paid-list');
	        }, 2000);
	    };
	    // Refresh scroll after completing fetch data
	    $scope.$on("FETCH_COMPLETE_PAID_LIST", function() {
	    	refreshScroll();
	    });

	    // Handle paid tab expansion api call.
		var callExpansionAPI = function( item ) {

			var successCallbackOfExpansionAPI = function() {
				$scope.$emit('hideLoader');
				item.active = true;
			},
			failureCallbackOfExpansionAPI = function( errorMessage ) {
				$scope.$emit('hideLoader');
				$scope.$emit('SHOW_ERROR_MSG', errorMessage);
			};

			var dataToSend = {
				'id': item.transaction_id,
				'account_id': $scope.arDataObj.accountId
			};
			
			$scope.invokeApi(rvAccountsArTransactionsSrv.expandPaidAndUnpaidList, dataToSend, successCallbackOfExpansionAPI, failureCallbackOfExpansionAPI );
			
		};

	    // Handle Toggle button click to expand list item
	    $scope.clickedPaidListItem = function( index ) {
	    	var clikedItem = $scope.arDataObj.paidList[index];

	    	if (!clikedItem.active) {
	    		// callExpansionAPI(clikedItem);
	    		clikedItem.active = true;
	    	}
	    	else {
	    		clikedItem.active = false;
	    	}
	    };
		
}]);
