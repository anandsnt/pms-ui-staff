
sntRover.controller('RvArBalanceController', ['$scope', '$timeout', 'rvAccountsArTransactionsSrv', '$vault', '$stateParams', '$state','sntActivity',
	function($scope, $timeout, rvAccountsArTransactionsSrv, $vault, $stateParams, $state, sntActivity) {

		BaseCtrl.call(this, $scope);		

		var sumOfAllocatedAmount = 0;
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
	    /*
	     * Calculate the total amount of selected invoices - Footer
	     */
	    var calculateTotalAmount = function() {
	    	$scope.arDataObj.totalAllocatedAmount = 0;
	    	_.each($scope.arDataObj.balanceList, function (eachItem) {
		    	if (eachItem.isSelected) {				    	    
		    		$scope.arDataObj.totalAllocatedAmount = parseFloat($scope.arDataObj.totalAllocatedAmount) + parseFloat(eachItem.amount);		    		
		    	} 	    	
		    });
	    }
	    /*
	     * Changing amount in invoices
	     */
	    $scope.changeBalanceAmount = function(index) {
	    	$scope.arDataObj.balanceList[index].amount = ($scope.arDataObj.balanceList[index].amount > $scope.arDataObj.balanceList[index].initialAmount) ? $scope.arDataObj.balanceList[index].initialAmount : $scope.arDataObj.balanceList[index].amount;
	    	$scope.arDataObj.balanceList[index].balanceAfter = $scope.arDataObj.balanceList[index].initialAmount - $scope.arDataObj.balanceList[index].amount;
	    	$scope.arDataObj.balanceList[index].balanceNow = $scope.arDataObj.balanceList[index].amount;
	    	// $scope.arDataObj.totalAllocatedAmount = sumOfAllocatedAmount - $scope.arDataObj.balanceList[index].balanceAfter;
	    	calculateTotalAmount();
	    };
	    
	    /*
	     * Select individual invoices in balance tab
	     * update the selected invoices variable
	     */ 
	    var selectInvoice = function (transactionId) {

	    	_.each($scope.arDataObj.balanceList, function (eachItem) {
		    	if (eachItem.transaction_id === transactionId) {
		    		eachItem.isSelected = !eachItem.isSelected;
		    		var selectedInvoiceObj = {};
		    		selectedInvoiceObj.invoice_id = transactionId;
		    		selectedInvoiceObj.amount = eachItem.amount;
		    		if (eachItem.isSelected) { 
		    			$scope.arDataObj.selectedInvoices.push(selectedInvoiceObj);		    			
		    		} else { 
		    			
		    			$scope.arDataObj.selectedInvoices = _.filter($scope.arDataObj.selectedInvoices, function (item) {
		    				return item.invoice_id !== transactionId;
		    			})		    			
		    		}
		    	} 	    	
		    });
		    calculateTotalAmount();
		    console.log($scope.arDataObj.selectedInvoices)
	    };

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
	    		selectInvoice(clikedItem.transaction_id)
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
}]);
