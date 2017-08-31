
sntRover.controller('RvArBalanceController', ['$scope', '$timeout', 'rvAccountsArTransactionsSrv',
	function($scope, $timeout, rvAccountsArTransactionsSrv) {

		BaseCtrl.call(this, $scope);

		$scope.setScroller('balance-list');
	    var refreshScroll = function() {
	        $timeout(function() { 
	            $scope.refreshScroller('balance-list');
	        }, 2000);
	    };
        // Refresh scroll after completing fetch data
	    $scope.$on("FETCH_COMPLETE_BALANCE_LIST", function() {
	    	refreshScroll();
	    });

	    // Handle balance tab toggle action.
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
				'id': item.transaction_id
			};
			
			$scope.invokeApi(rvAccountsArTransactionsSrv.expandPaidAndUnpaidList, dataToSend, successCallbackOfExpansionAPI, failureCallbackOfExpansionAPI );
			
		};

	    // Handle Toggle button click to expand list item
	    $scope.clickedBalanceListItem = function( index ) {
	    	var clikedItem = $scope.arDataObj.balanceList[index];

	    	if (!clikedItem.active) {
	    		// callExpansionAPI(clikedItem);
	    		clikedItem.active = true;
	    	}
	    	else {
	    		clikedItem.active = false;
	    	}
	    };
}]);
