
sntRover.controller('RvArPaidController', ['$scope', '$timeout', 'rvAccountsArTransactionsSrv', '$vault', '$stateParams', '$state',
	function($scope, $timeout, rvAccountsArTransactionsSrv, $vault, $stateParams, $state) {

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

			var successCallbackOfExpansionAPI = function(data) {
				$scope.$emit('hideLoader');
				item.active = true;
				item.debits = data.debits;
				item.payments = data.payments;
				$scope.$emit("FETCH_COMPLETE_PAID_LIST");
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
	    		callExpansionAPI(clikedItem);
	    	}
	    	else {
	    		clikedItem.active = false;
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
		
}]);
