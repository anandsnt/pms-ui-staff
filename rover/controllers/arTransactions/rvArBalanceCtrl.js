sntRover.controller('RvArBalanceController', ['$scope', '$timeout', 'rvAccountsArTransactionsSrv', 'RVCompanyCardSrv', '$vault', '$stateParams', '$state', 'sntActivity', 'ngDialog',
	function($scope, $timeout, rvAccountsArTransactionsSrv, RVCompanyCardSrv, $vault, $stateParams, $state, sntActivity, ngDialog) {

		BaseCtrl.call(this, $scope);	

		var scrollOptions =  {preventDefaultException: { tagName: /^(INPUT|LI)$/ }, preventDefault: false};	

		$scope.setScroller('balance-list', scrollOptions);

		var refreshScroll = function() {
			$timeout(function() { 
				$scope.refreshScroller('balance-list');
			}, 1000);
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
		};

		/*
		 * Changing amount in invoices
		 */
		$scope.changeBalanceAmount = function(index) {
			$scope.arDataObj.balanceList[index].amount = (parseFloat($scope.arDataObj.balanceList[index].amount) > parseFloat($scope.arDataObj.balanceList[index].initialAmount)) ? $scope.arDataObj.balanceList[index].initialAmount : $scope.arDataObj.balanceList[index].amount;
			$scope.arDataObj.balanceList[index].balanceAfter = $scope.arDataObj.balanceList[index].initialAmount - $scope.arDataObj.balanceList[index].amount;
			$scope.arDataObj.balanceList[index].balanceNow = $scope.arDataObj.balanceList[index].amount;

			var selectedItem = _.findWhere($scope.arDataObj.selectedInvoices, {invoice_id: $scope.arDataObj.balanceList[index].transaction_id}) ;
			
			selectedItem.amount = parseFloat($scope.arDataObj.balanceList[index].amount);

			calculateTotalAmount();
		};
		/*
		 * Adding decimals to text field
		 */
		$scope.addDecimal = function(index) {
			$scope.arDataObj.balanceList[index].amount = parseFloat($scope.arDataObj.balanceList[index].amount).toFixed(2);
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
						});
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
				selectInvoice(clikedItem.transaction_id);
			}
			else if (!element.parentElement.classList.contains('actions')) { 
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

			var successCallBackOfUnallocateData = function(data) {
				$scope.selectedUnAllocatedItem = data;
				ngDialog.open({
					template: '/assets/partials/companyCard/arTransactions/rvCompanyTravelAgentUnallocatePopup.html',
					scope: $scope
				});
			};

			var requestParams = {},
				paramsToService = {};

			requestParams.allocation_id = payment.id;
			paramsToService.account_id = $scope.arDataObj.accountId;
			paramsToService.data = requestParams;

			var options = {
				params: paramsToService,
				successCallBack: successCallBackOfUnallocateData
			};

			$scope.callAPI( rvAccountsArTransactionsSrv.unAllocateData, options );
		};
		/*
		 * Un allocate selected payment
		 */
		$scope.unAllocate = function() {
			var requestParams = {},
				paramsToService = {},
				successCallBackOfUnallocate = function () {
					$scope.$emit('REFRESH_BALANCE_LIST');
					ngDialog.close();
				};

			requestParams.allocation_id = $scope.selectedUnAllocatedItem.allocation_id;
			requestParams.credit_id = $scope.selectedUnAllocatedItem.from_bill.transaction_id;
			requestParams.debit_id = $scope.selectedUnAllocatedItem.to_payment.transaction_id;
			requestParams.amount = $scope.selectedUnAllocatedItem.amount;

			paramsToService.account_id = $scope.arDataObj.accountId;
			paramsToService.data = requestParams;

			var options = {
				params: paramsToService,
				successCallBack: successCallBackOfUnallocate
			};

			$scope.callAPI( rvAccountsArTransactionsSrv.unAllocateSelectedPayment, options );
		};
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
		/*
		 * Open dialog to post charge
		 * @param index - index of the item
		 */
		$scope.clickedPostCharge = function(index) {
			$scope.selectedItemToPostCharge = $scope.arDataObj.balanceList[index];
			ngDialog.open({
				template: '/assets/partials/companyCard/arTransactions/rvArTransactionPostCharge.html',
				controller: 'RvArPostChargeController',
				scope: $scope
			});
		}
}]);
