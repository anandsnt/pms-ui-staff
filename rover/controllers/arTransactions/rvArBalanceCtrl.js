
sntRover.controller('RvArBalanceController', ['$scope', '$timeout', 'rvAccountsArTransactionsSrv', '$vault', '$stateParams', '$state',
	function($scope, $timeout, rvAccountsArTransactionsSrv, $vault, $stateParams, $state) {

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

	    // Handle balance tab api call.
		var callExpansionAPI = function( item ) {

			var successCallbackOfExpansionAPI = function() {
				$scope.$emit('hideLoader');
				item.active = true;
				refreshScroll();
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
	    $scope.clickedBalanceListItem = function( index ) {
	    	var clikedItem = $scope.arDataObj.balanceList[index];

	    	if (!clikedItem.active) {
	    		callExpansionAPI(clikedItem);
	    	}
	    	else {
	    		clikedItem.active = false;
	    		refreshScroll();
	    	}
	    };

	    /*
		 * function to execute on clicking on each result
		 */
		$scope.goToReservationDetails = function(index) {

			var item = $scope.arDataObj.balanceList[index];

			if ($scope.arFlags.viewFromOutside) {
				$vault.set('cardId', $stateParams.id);
				$vault.set('type', $stateParams.type);
				$vault.set('query', $stateParams.query);

				var associatedType = item.associated_type,
					associatedId = item.associated_id;

				if (associatedType === 'Reservation') {
					$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
						id: associatedId,
						confirmationId: item.reservation_confirm_no,
						isrefresh: true,
						isFromCards: true
					});
				} 
				else if (associatedType === 'PostingAccount') {
					$state.go('rover.accounts.config', {
						id: associatedId,
						activeTab: 'ACCOUNT',
						isFromArTransactions: true
					});
				}
			}
		};

		// Handle unallocate button click.
		$scope.clickedUnallocateButton = function() {
			console.log('clickedUnallocateButton');
		};
}]);
