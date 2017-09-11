
sntRover.controller('RvArBalanceController', ['$scope', '$timeout', 'rvAccountsArTransactionsSrv', 'RVCompanyCardSrv', '$vault', '$stateParams', '$state','sntActivity',
	function($scope, $timeout, rvAccountsArTransactionsSrv, RVCompanyCardSrv, $vault, $stateParams, $state, sntActivity) {

		BaseCtrl.call(this, $scope);

		$scope.setScroller('balance-list');
	    var refreshScroll = function() {
	        $timeout(function() { 
	            $scope.refreshScroller('balance-list');
	        }, 500);
	    };

        // Refresh scroll after completing fetch data
	    $scope.$on("FETCH_COMPLETE_BALANCE_LIST", function() {
	    	refreshScroll();
	    });

	    // Handle balance tab api call.
		var callExpansionAPI = function( item ) {
			sntActivity.start('EXPAND_BALANCE');
			var successCallbackOfExpansionAPI = function(data) {
				sntActivity.stop('EXPAND_BALANCE');
				item.active = true;
				item.debits = data.debits;
				item.payments = data.payments;
				refreshScroll();
			},
			failureCallbackOfExpansionAPI = function( errorMessage ) {
				sntActivity.stop('EXPAND_BALANCE');
				$scope.$emit('SHOW_ERROR_MSG', errorMessage);
			};

			var dataToSend = {
				'id': item.transaction_id,
				'account_id': $scope.arDataObj.accountId
			};
			
			$scope.invokeApi(rvAccountsArTransactionsSrv.expandPaidAndUnpaidList, dataToSend, successCallbackOfExpansionAPI, failureCallbackOfExpansionAPI );
		};

		// Handle click events on balance list
		$scope.clickedOnParentList = function( event, index ) {
			var clikedItem = $scope.arDataObj.balanceList[index],
	    		element = event.target;	

	    	event.stopImmediatePropagation();
  			event.stopPropagation();

	    	if (element.parentElement.classList.contains('checkbox') || element.classList.contains('checkbox')){
	    		// Checkbox selection logic will be called here..
	    	}
	    	else if ( element.parentElement.classList.contains('has-arrow') || element.classList.contains('has-arrow')) {
	    		clickedBalanceListItem(index);
	    	}
		};

	    // Handle Toggle button click to expand list item
	    var clickedBalanceListItem = function( index ) {
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
		};

		/*
		 *Function which fetches and returns the charge details of a grouped charge.
		*/
		$scope.expandGroupedCharge = function(item) {
			// Success callback for the charge detail fetch for grouped charges.
			var fetchChargeDataSuccessCallback = function(data) {
				item.light_speed_data = data.data;
				item.isExpanded = true;
				$scope.$emit('hideLoader');
				refreshScroll();
			};
			// Failure callback for the charge detail fetch for grouped charges.
			var fetchChargeDataFailureCallback = function(errorMessage) {
				$scope.errorMessage = errorMessage;
				$scope.emit('hideLoader');
			};

			// If the flag for toggle is false, perform api call to get the data.
			if (!item.isExpanded) {
				var params = {
					'reference_number': item.reference_number,
					'date': item.date,
					'bill_id': item.bill_id
				};

				$scope.invokeApi(RVCompanyCardSrv.groupChargeDetailsFetch, params, fetchChargeDataSuccessCallback, fetchChargeDataFailureCallback);
			}
			else {
				// If the flag for toggle is true, then it is simply reverted to hide the data.
				item.isExpanded = false;
				refreshScroll();
			}
		};
}]);
