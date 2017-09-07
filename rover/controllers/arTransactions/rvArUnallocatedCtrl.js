
sntRover.controller('RvArUnallocatedController',
	['$scope',
	 '$timeout',
	 'rvAccountsArTransactionsSrv',
	  function($scope, $timeout, rvAccountsArTransactionsSrv) {

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

    	// Handle Unallocated tab expansion api call.
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
            
            $scope.invokeApi(rvAccountsArTransactionsSrv.expandAllocateAndUnallocatedList, dataToSend, successCallbackOfExpansionAPI, failureCallbackOfExpansionAPI );
        };

        // Handle Toggle button click to expand list item
        $scope.clickedUnallocatedListItem = function( index ) {
            var clikedItem = $scope.arDataObj.unallocatedList[index];

            if (!clikedItem.active) {
                // callExpansionAPI(clikedItem);
                clikedItem.active = true;
            }
            else {
                clikedItem.active = false;
            }
        };

        // Handle unallocate button click.
        $scope.clickedUnallocateButton = function() {
            console.log('clickedUnallocateButton');
        };

}]);
