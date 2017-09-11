
sntRover.controller('RvArUnallocatedController',
	['$scope',
	 '$timeout',
	 'rvAccountsArTransactionsSrv','sntActivity',
	  function($scope, $timeout, rvAccountsArTransactionsSrv, sntActivity) {

		BaseCtrl.call(this, $scope);

        $scope.setScroller('unallocated-list-scroller');

		// Refreshes the scroller for the unallocated lists
		var refreshScroll = function() {
	        $timeout(function() {
	            $scope.refreshScroller('unallocated-list-scroller');
	        }, 500);
    	};

    	// Refresh scroller while updating the results from parent controller
    	$scope.$on( 'REFRESH_UNALLOCATED_LIST_SCROLLER' , function () {
    		refreshScroll();
    	});

    	// Handle Unallocated tab expansion api call.
        var callExpansionAPI = function( item ) {
            sntActivity.start('EXPAND_UNALLOCATED');
            var successCallbackOfExpansionAPI = function() {
                sntActivity.stop('EXPAND_UNALLOCATED');
                item.transactions = data.allocated_transactions;
                item.active = true;
                refreshScroll();
            },
            failureCallbackOfExpansionAPI = function( errorMessage ) {
                sntActivity.stop('EXPAND_UNALLOCATED');
                $scope.$emit('SHOW_ERROR_MSG', errorMessage);
            };

            var dataToSend = {
                'id': item.transaction_id,
                'account_id': $scope.arDataObj.accountId
            };
            
            $scope.invokeApi(rvAccountsArTransactionsSrv.expandAllocateAndUnallocatedList, dataToSend, successCallbackOfExpansionAPI, failureCallbackOfExpansionAPI );
        };

        // Handle Toggle button click to expand list item
        $scope.clickedUnallocatedListItem = function( index ) {
            var clikedItem = $scope.arDataObj.unallocatedList[index];

            if (!clikedItem.active) {
                callExpansionAPI(clikedItem);
            }
            else {
                clikedItem.active = false;
                refreshScroll();
            }
        };

        // Handle allocate button click.
        $scope.clickedAllocateButton = function(index) {
            event.cancelBubble = true;
            if(event.stopPropagation) event.stopPropagation();
            console.log($scope.arDataObj.unallocatedList[index]);
            console.log("----")
            $scope.$emit("CLICKED_ALLOCATE_BUTTON", $scope.arDataObj.unallocatedList[index]);
        };

}]);
