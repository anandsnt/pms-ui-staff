sntRover.controller('RvArBalanceController', ['$scope', '$timeout', 'rvAccountsArTransactionsSrv', 'RVCompanyCardSrv', '$vault', '$stateParams', '$state','sntActivity', 'ngDialog',
	function($scope, $timeout, rvAccountsArTransactionsSrv, RVCompanyCardSrv, $vault, $stateParams, $state, sntActivity, ngDialog) {

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

	    	var selectedItem = _.findWhere($scope.arDataObj.selectedInvoices, {invoice_id: $scope.arDataObj.balanceList[index].transaction_id}) ;
	    	
	    	selectedItem.amount = parseFloat($scope.arDataObj.balanceList[index].amount);

	    	calculateTotalAmount();
	    };
	    
	    /*
	     * Select individual invoices in balance tab
	     * update the selected invoices variable
	     */ 
	    var selectInvoice = function (transactionId) {
	    	$scope.arFlags.insufficientAmount = false;
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

	    	if (element.parentElement.classList.contains('checkbox') || element.classList.contains('checkbox')) {
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
	    	
			if ( !clikedItem.is_manual_balance || ( clikedItem.is_manual_balance && clikedItem.is_partially_paid) ) {
		    	if (!clikedItem.active) {
		    		callExpansionAPI(clikedItem);
		    	}
		    	else {
		    		clikedItem.active = false;
		    		refreshScroll();
		    	}
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

            /*
             * Handle unallocate button click
             */
        $scope.clickedUnallocateButton = function( payment ) {
            var dataToSend = {
                invoice_id: 56,
                credit_id: 11,
                amount: 777
            }, successCallback = function(data){
                console.log(data);
                ngDialog.open({
                    template: '/assets/partials/companyCard/arTransactions/rvCompanyTravelAgentUnallocatePopup.html',
                    //controller: 'RVArUnAllocationController',
                    scope: $scope
                });
            };
            // $scope.invokeApi(rvAccountsArTransactionsSrv.getUnAllocateDetails, dataToSend, successCallback);
            ngDialog.open({
                template: '/assets/partials/companyCard/arTransactions/rvCompanyTravelAgentUnallocatePopup.html',
                // controller: 'RVArUnAllocationController',
                scope: $scope
            });
        };
        /*
         * Un allocate selected payment
         */
        $scope.unAllocate = function(){
            console.log("unallocate");
            var dataToSend = {
                invoice_id: 56,
                credit_id: 11,
                amount: 777
            }, successCallback = function () {
                console.log("Handle Succes unallocation");
            };
            $scope.invokeApi(rvAccountsArTransactionsSrv.unAllocateSelectedPayment, dataToSend, successCallback);
        }
		/*
		 *Function which fetches and returns the charge details of a grouped charge.
		*/
		$scope.expandGroupedCharge = function(item) {

			// If the flag for toggle is false, perform api call to get the data.
			if (!item.isExpanded) {
				$scope.callAPI(RVCompanyCardSrv.groupChargeDetailsFetch, {
					params: {
						'reference_number': item.reference_number,
						'date': item.date,
						'bill_id': item.bill_id
					},
					successCallBack: function(data) {
						item.light_speed_data = data.data;
						item.isExpanded = true;
						refreshScroll();
					},
					failureCallBack: function(errorMessage) {
						$scope.errorMessage = errorMessage;
					}
				});
			} else {
				// If the flag for toggle is true, then it is simply reverted to hide the data.
				item.isExpanded = false;
				refreshScroll();
			}
		};
}]);
