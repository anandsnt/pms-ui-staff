sntRover.controller('RVInvoiceSearchController',
	['$scope',
	'$rootScope',
	'$timeout',
	'RVInvoiceSearchSrv',
	'ngDialog',
	'$filter',
	'RVBillCardSrv',
	'$window',
	'$state',
	'$stateParams',
	'$vault',
	'rvAccountTransactionsSrv',
	'rvAccountsConfigurationSrv',
	'filterOptions',
	'RVCompanyCardSrv',
	function($scope, $rootScope, $timeout, RVInvoiceSearchSrv, ngDialog, 
		$filter, RVBillCardSrv, $window, $state, $stateParams, $vault, 
		rvAccountTransactionsSrv, rvAccountsConfigurationSrv, filterOptions, RVCompanyCardSrv) {

		BaseCtrl.call(this, $scope);

		const scrollOptions =  {preventDefaultException: { tagName: /^(INPUT|LI)$/ }, preventDefault: false},
			that = this,
			PER_PAGE = 10;
			
		$scope.currentActivePage = 1;	

		$scope.invoiceSearchData = {};
		$scope.invoiceSearchData.filter_id = (_.first($scope.filterOptions)).id;
		$scope.paymentDataArray = [];

		$scope.shouldShowInvoices =  function() {
			return (_.findWhere($scope.filterOptions, {"name": "Invoices"})).id === $scope.invoiceSearchData.filter_id;
		};

		$scope.shouldShowReceipts =  function() {
			return (_.findWhere($scope.filterOptions, {"name": "Receipts"})).id === $scope.invoiceSearchData.filter_id;
		};

		$scope.setScroller('invoice-list', scrollOptions);
		/**
		* function to set Headinng
		* @return - {None}
		*/
		$scope.setTitleAndHeading = function(title) {
 
			$scope.setTitle(title);
			$scope.$parent.heading = title;
		};
		/**
		* function navigate to staycard/accounts
		* @param {integer} parentIndex int index of the item
		* @returns nothing to return
		*/
		$scope.clickedItem = function(parentIndex) {
			$vault.set('searchQuery', $scope.invoiceSearchData.query);
			if ($scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.type === 'RESERVATION') {
				$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
					id: $scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.item_id,
					confirmationId: $scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.number,
					isrefresh: true,
					searchQuery: $scope.invoiceSearchData.query
				});
			} else {
				$state.go('rover.accounts.config', {
					id: $scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.item_id,
					activeTab: 'ACCOUNT'
				});
			}		
		};		

		// To refresh the scroll
		const refreshScroll = function() {
			$timeout(function() { 
				$scope.refreshScroller('invoice-list');
			}, 1000);
		};

		/*
		 * To clear the results and search term when clicks close button in search field
		 */ 
		$scope.clearQuery = () => {
			$scope.invoiceSearchFlags.showFindInvoice = true;
			$scope.invoiceSearchData.query = '';
			$scope.invoiceSearchFlags.isQueryEntered = false;
			$scope.totalResultCount = 0;
			$scope.invoiceSearchData.reservationsList = [];
			refreshScroll();
		};
		/*
		 * Method to search invoice
		 * @param page is page number of pagination
		 */
		$scope.searchInvoice = (page) => {
			$scope.currentActivePage = page || 1;
			if ($scope.invoiceSearchData.query.length > 0) {
				$scope.invoiceSearchFlags.isQueryEntered = true;
				const successCallBackOfSearchInvoice = (data) => {						
						$scope.invoiceSearchFlags.showFindInvoice = false;
						$scope.invoiceSearchData.reservationsList = data.data;
						angular.forEach($scope.invoiceSearchData.reservationsList.results, function(item, itemIndex) {
							angular.forEach(item.bills, function(billItem, billitemIndex) {
								billItem.isOpened = false;
								billItem.billIndex = billitemIndex;
							});
							item.itemIndex = itemIndex;
						});
						$scope.totalResultCount = data.data.total_count;
						if ($scope.totalResultCount === 0) {
							$scope.invoiceSearchFlags.showFindInvoice = true;
						}
						$timeout (function() {
							$scope.$broadcast('updatePagination', 'INVOICE_SEARCH');
						}, 800);	
						refreshScroll();
					},
					params = {
						'query': $scope.invoiceSearchData.query,
						'filter_id': $scope.invoiceSearchData.filter_id,
						'page_no': page || 1,
						'per_page': PER_PAGE,
						'from_date': $scope.invoiceSearchData.from_date,
						'to_date': $scope.invoiceSearchData.to_date
					};

					if ($scope.shouldShowInvoices) {
						params.no_folio_number_only = $scope.invoiceSearchData.no_folio_number_only;
					}
					if ($scope.shouldShowReceipts) {
						params.no_qr_code_only = $scope.invoiceSearchData.no_qr_code_only;
					}

					var options = {
						params: params,
						successCallBack: successCallBackOfSearchInvoice
					};

				$scope.callAPI(RVInvoiceSearchSrv.searchForInvoice, options);
			} else {
				$scope.totalResultCount = 0;
				$scope.invoiceSearchData.reservationsList = [];
				$scope.invoiceSearchFlags.isQueryEntered = false;
				$scope.invoiceSearchFlags.showFindInvoice = true;
			}
		};

		/*
		 * Expand Bill
		 * @param itemIndex index of selected account/reservation
		 * @param billIndex index of transaction
		 */
		$scope.expandBill = function(itemIndex, billIndex) {
			$scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].isOpened = !$scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].isOpened;
			if ($scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].isOpened) {
				var successCallBackOfExpandBill = function(response) {
					angular.forEach(response.transactions, function(item, transactionItemIndex) {
						item.isChecked = false;
						item.bill_id = $scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].bill_id;
					});					
					$scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].transactions = response.transactions;
					refreshScroll();
				},
				options = {
					params: {
						"bill_id": $scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].bill_id,
						"payments_only": true,
						"no_qr_code_only": $scope.invoiceSearchData.no_qr_code_only
					},
					successCallBack: successCallBackOfExpandBill
				};

				$scope.callAPI(RVCompanyCardSrv.fetchTransactionDetails, options);
			}			
		};

		$scope.openRetriggerMessagePopup = function() {
			ngDialog.open({
					template: '/assets/partials/financials/invoiceSearch/rvRetriggerSuccessMessagePopup.html',
					className: '',
					scope: $scope
			});
		};

		/*
		 * Retrigger payment
		 */
		$scope.reTriggerPaymentReceipt = function() {
			var successCallBackOfRetrigger = function(response) {
					$scope.isSuccess = true;
					$scope.retriggerMessage = response.message;
					$scope.openRetriggerMessagePopup();
				},
				failureCallBackOfRetrigger = function(errorResponse) {
					$scope.isSuccess = false;
					$scope.retriggerMessage = errorResponse.errors;
					$scope.openRetriggerMessagePopup();
				},
				options = {
					params: {
						"transactions": $scope.paymentDataArray
					},
					successCallBack: successCallBackOfRetrigger,
					failureCallBack: failureCallBackOfRetrigger
				};

			$scope.callAPI(RVInvoiceSearchSrv.triggerPaymentReceipt, options);						
		};

		/*
		 * Retrigger cancel 
		 */
		$scope.clickedCancelOfRetrigger = function() {
			$scope.paymentDataArray = [];
			angular.forEach($scope.invoiceSearchData.reservationsList.results, function(item, itemIndex) {
				angular.forEach(item.bills, function(billItem, billItemIndex) {
					angular.forEach(billItem.transactions, function(transactionItem, transactionItemIndex) {
						transactionItem.isChecked = false;
					});
				});				
			});
		};

		/*
		 * clicked transaction checkboxes
		 * @param transactionId transaction id
		 * @param itemIdex index of selected account/reservation
		 * @param billIndex index of transaction
		 */
		$scope.clickedTransactionCheckbox = function(transactionId, billIndex, transactionIndex, itemIndex) {
			var paymentData = {};

			paymentData.transaction_id = transactionId;
			paymentData.bill_id = $scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].transactions[transactionIndex].bill_id;

			$scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].transactions[transactionIndex].isChecked = !$scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].transactions[transactionIndex].isChecked;
			if ($scope.invoiceSearchData.reservationsList.results[itemIndex].bills[billIndex].transactions[transactionIndex].isChecked) {

				$scope.paymentDataArray.push(paymentData);
			} else {
				$scope.paymentDataArray.pop(paymentData);
			}			
		};
		/*
		 * Update informational invoice flag
		 * Based on checkbox in popup
		 */
		var updateInformationalInvoiceListener = $scope.$on("UPDATE_INFORMATIONAL_INVOICE", function(event, isInformationalInvoice) {
			$scope.isInformationalInvoice = isInformationalInvoice;
		});

		/*
	     * Function to get invoice button class
	     */
		$scope.getInvoiceButtonClass = function(parentIndex, billIndex) {

			var invoiceButtonClass = "blue";

			if (!$scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_active && $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_folio_number_exists && $scope.roverObj.noReprintReEmailInvoice) {
				if ($scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_printed_once && $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_emailed_once) {
					invoiceButtonClass = "grey";
				}
			}
			return invoiceButtonClass;
		};
		/*
	     * Function to get invoice button class
	     */
		$scope.isInvoiceButtonDisabled = function(parentIndex, billIndex) {

			var isDisabledInvoice = false;

			if (!$scope.transactionsDetails.bills[$scope.currentActiveBill].is_active && $scope.transactionsDetails.bills[$scope.currentActiveBill].is_folio_number_exists && $scope.roverObj.noReprintReEmailInvoice) {
				if ($scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_printed_once && $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_emailed_once) {
					isDisabledInvoice = true;
				}
			}
			return isDisabledInvoice;
		};
		
		/*
		 * Opens the popup which have the option to choose the bill layout while print/email
		 * @param billNo boolean bill no
		 * @param isActiveBill boolean is bill active or not
		 */
		$scope.showFormatBillPopup = function(parentIndex, billIndex) {
			$scope.billNo = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].bill_no;
			$scope.billFormat = {};
			$scope.billFormat.isInformationalInvoice = false;
			$scope.currentActiveBill = billIndex;
			$scope.currentSelectedItem = parentIndex;
			$scope.reservationBillData = {
				"is_bill_lock_enabled": $scope.invoiceSearchData.reservationsList.is_bill_lock_enabled,
				"no_of_original_emails": $scope.invoiceSearchData.reservationsList.no_of_original_emails,
				"no_of_original_invoices": $scope.invoiceSearchData.reservationsList.no_of_original_invoices
			};
			$scope.reservationBillData.bills = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills;
			
			if ($scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.type === 'RESERVATION') {
				$scope.invoiceSearchFlags.isClickedReservation = true;
				$scope.reservationBillData.reservation_id = $scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.item_id;

			} else {
				// We have to show toggle in popup
				$scope.isFromInvoiceSearchScreen = true;
				$scope.clickedInvoiceData = $scope.invoiceSearchData.reservationsList.results[parentIndex];
				$scope.invoiceSearchFlags.isClickedReservation = false;
			}

			if ($scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_transactions_exist 
				&& $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].balance === 0 
				&& $scope.invoiceSearchData.reservationsList.is_bill_lock_enabled 
				&& $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_active 
				&& ($scope.invoiceSearchFlags.isClickedReservation ? 
					$scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.reservation_status === 'CHECKING_OUT' 
					|| $scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.reservation_status === 'CHECKEDIN' 
					: true)) {
				$scope.isInvoiceStepOneActive = true;
				$scope.isInvoiceStepThreeActive = false;
				$scope.shouldGenerateFinalInvoice = true;
			} else {
				$scope.isInvoiceStepOneActive = false;
				$scope.isInvoiceStepThreeActive = true;
				$scope.shouldGenerateFinalInvoice = false;
			}
			$scope.isInvoiceStepTwoActive = false;
			$scope.isInvoiceStepFourActive = false;
			$scope.isInvoiceStepFiveActive = false;
			$scope.isSettledBill = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_active;
			$scope.isEmailedOnce = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_emailed_once;
			$scope.isPrintedOnce = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_printed_once;
			$scope.isFolioNumberExists = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_folio_number_exists;
			ngDialog.open({
					template: '/assets/partials/popups/billFormat/rvBillFormatPopup.html',
					controller: 'rvBillFormatPopupCtrl',
					className: '',
					scope: $scope
			});
		};
		/*
		 * Settle invoice
		 */
		var finalInvoiceSettlement = function(data, isPrint) {
			var settleInvoiceSuccess = function() {
					$scope.shouldGenerateFinalInvoice = false;
					if (isPrint) {
						that.printBill(data);
					} else {
						$scope.clickedEmail(data);
					}				
				},
				options = {
					params: {
					"bill_id": $scope.invoiceSearchData.reservationsList.results[$scope.currentSelectedItem].bills[$scope.currentActiveBill].bill_id
					},
					successCallBack: settleInvoiceSuccess
				};

			$scope.callAPI(RVBillCardSrv.settleFinalInvoice, options);
		};

		// add the print orientation before printing
		var addPrintOrientation = function() {
			$( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
		};

		// add the print orientation after printing
		var removePrintOrientation = function() {
			$( '#print-orientation' ).remove();
		};

		var invoiceSearchPrintCompleted = function() {
			// CICO-9569 to solve the hotel logo issue
			$("header .logo").removeClass('logo-hide');
			$("header .h2").addClass('text-hide');
			$scope.$parent.addNoPrintClass = false;

			// remove the orientation after similar delay
			removePrintOrientation();
			$scope.searchInvoice($scope.currentActivePage);
		};

		// print the page
		that.printBill = function(data) {
			if ($scope.shouldGenerateFinalInvoice && !$scope.billFormat.isInformationalInvoice) {
				finalInvoiceSettlement(data, true);
			} else {
				var getCopyCount = function(successData) {
						var copyCount = "";

						if (successData.is_copy_counter) {
							copyCount = parseInt(successData.print_counter, 10) - parseInt(successData.no_of_original_invoices, 10);					
						}
						return copyCount;
					},
					printDataFetchSuccess = function(successData) {
						var copyCount = "",
							arInvoiceNumberActivatedDate = moment(successData.print_ar_invoice_number_activated_at, "YYYY-MM-DD"),
							arTransactionDate = moment(successData.ar_transaction_date, "YYYY-MM-DD"),
							dateDifference = arTransactionDate.diff(arInvoiceNumberActivatedDate, 'days');

						$scope.shouldShowArInvoiceNumber = true;
						if (dateDifference < 0) {
							$scope.shouldShowArInvoiceNumber = false;
						}

						if (!$scope.invoiceSearchFlags.isClickedReservation) {
							successData = successData.data;
						}
						if ($scope.billFormat.isInformationalInvoice) {
							successData.invoiceLabel = successData.translation.information_invoice;
						}
						else if (successData.no_of_original_invoices === null && !successData.is_void_bill) {
							successData.invoiceLabel = successData.translation.invoice;
						} 
						else if (successData.is_void_bill) {
							if ((successData.no_of_original_invoices === null || parseInt(successData.print_counter, 10) <= parseInt(successData.no_of_original_invoices, 10))) {
								successData.invoiceLabel = successData.translation.void_invoice;
							} 
							else if (parseInt(successData.print_counter, 10) > parseInt(successData.no_of_original_invoices, 10)) {
								copyCount = getCopyCount(successData);
								successData.invoiceLabel = successData.translation.copy_of_void_invoice.replace("#count", copyCount);
							}
						} 
						else if (($scope.reservationBillData.is_bill_lock_enabled 
							&& parseInt(successData.print_counter, 10) <= parseInt(successData.no_of_original_invoices, 10)) 
							|| (!$scope.reservationBillData.is_bill_lock_enabled 
								&& parseInt(successData.print_counter, 10) <= parseInt(successData.no_of_original_invoices, 10))) 
						{
							successData.invoiceLabel = successData.translation.invoice;
						} 
						else if (($scope.reservationBillData.is_bill_lock_enabled 
							&& parseInt(successData.print_counter, 10) > parseInt(successData.no_of_original_invoices, 10))
								|| (!$scope.reservationBillData.is_bill_lock_enabled 
									&& parseInt(successData.print_counter, 10) > parseInt(successData.no_of_original_invoices, 10)))
						{
							var copyCount = "";

							if (successData.is_copy_counter) {
								copyCount = parseInt(successData.print_counter, 10) - parseInt(successData.no_of_original_invoices, 10);					
							}
							successData.invoiceLabel = successData.translation.copy_of_invoice.replace("#count", copyCount);
						}
						
						$scope.printData = successData;						
						
						$scope.errorMessage = "";
						// CICO-9569 to solve the hotel logo issue
						$("header .logo").addClass('logo-hide');
						$("header .h2").addClass('text-hide');
						$scope.$parent.addNoPrintClass = true;

						// add the orientation
						addPrintOrientation();

						/*
						*	======[ READY TO PRINT ]======
						*/
						// this will show the popup with full bill
						$timeout(function() {
							/*
							*	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
							*/

							if (sntapp.cordovaLoaded) {
								cordova.exec(invoiceSearchPrintCompleted,
									function(error) {
										invoiceSearchPrintCompleted();
									}, 'RVCardPlugin', 'printWebView', []);
							}
							else
							{
								window.print();
								invoiceSearchPrintCompleted();
							}
						}, 1000);

					},
					printDataFailureCallback = function(errorData) {
						$scope.errorMessage = errorData;
					}, 
					options = {
						params: data,
						successCallBack: printDataFetchSuccess,
						failureCallBack: printDataFailureCallback
					};

				if ($scope.invoiceSearchFlags.isClickedReservation) {
					$scope.callAPI(RVBillCardSrv.fetchBillPrintData, options);				
				} else {
					$scope.callAPI(rvAccountTransactionsSrv.fetchAccountBillsForPrint, options);				
				}
			}		
		};

		// print bill
		$scope.clickedPrint = function(requestData) {
			$scope.closeDialog();
			that.printBill(requestData);
		};
		/*
		 * To send email
		 */
		$scope.clickedEmail = function(data) {
			$scope.closeDialog();
			if ($scope.shouldGenerateFinalInvoice && !$scope.billFormat.isInformationalInvoice) {
				finalInvoiceSettlement(data, false);
			} else { 
				var sendEmailSuccessCallback = function() {
						$scope.statusMsg = $filter('translate')('EMAIL_SENT_SUCCESSFULLY');
						$scope.status = "success";
						$scope.showEmailSentStatusPopup();
					},
					sendEmailFailureCallback = function() {
						$scope.statusMsg = $filter('translate')('EMAIL_SEND_FAILED');
						$scope.status = "alert";
						$scope.showEmailSentStatusPopup();
					},
					options = {
						params: data,
						successCallBack: sendEmailSuccessCallback,
						failureCallBack: sendEmailFailureCallback
					};

				if ($scope.invoiceSearchFlags.isClickedReservation) {
					$scope.callAPI(RVBillCardSrv.sendEmail, options);				
				} else {
					$scope.callAPI(rvAccountsConfigurationSrv.emailInvoice, options);				
				}
			}
		};

		$scope.clickedReceiptIcon = function(type, transactionId, billId) {

			$scope.entityType = type;
			$scope.isFromBillCard = (type === 'RESERVATION');
			$scope.transactionId = transactionId;
			$scope.billId = billId;

			ngDialog.open({
				template: '/assets/partials/popups/rvReceiptPopup.html',
				controller: 'RVReceiptPopupController',
				className: '',
				scope: $scope
			});
		};


		$scope.addListener('PRINT_RECEIPT', function(event, receiptPrintData) {

			$scope.printReceiptActive = true;
			$scope.receiptPrintData = receiptPrintData;
			$scope.errorMessage = "";

			// CICO-9569 to solve the hotel logo issue
			$("header .logo").addClass('logo-hide');
			$("header .h2").addClass('text-hide');
			$("body #loading").html("");// CICO-56119
			$scope.$parent.addNoPrintClass = true;

			// add the orientation
			addPrintOrientation();

			/*
			*	======[ READY TO PRINT ]======
			*/
			// this will show the popup with full bill
			$timeout(function() {

				if (sntapp.cordovaLoaded) {
					cordova.exec(billCardPrintCompleted,
						function(error) {
							receiptPrintCompleted();
						}, 'RVCardPlugin', 'printWebView', []);
				}
				else
				{
					window.print();
					receiptPrintCompleted();
				}
			}, 700);
		});

		/*
		 * Initialization
		 */
		that.init = () => {
			$scope.invoiceSearchData.query = $stateParams.isFromStayCard ? $vault.get('searchQuery') : '';
			$scope.invoiceSearchFlags = {};
			$scope.invoiceSearchFlags.showFindInvoice = true;
			$scope.invoiceSearchFlags.isQueryEntered = false;
			$scope.invoiceSearchFlags.isClickedReservation = true;
			$scope.invoiceSearchData.no_folio_number_only = false;
			$scope.totalResultCount = 0;
			$scope.printData = {};
			$scope.invoiceSearchPagination = {
				id: 'INVOICE_SEARCH',
				api: $scope.searchInvoice,
				perPage: PER_PAGE
			};

			$scope.invoiceSearchDateFromOptions = {
	            dateFormat: $rootScope.jqDateFormat,
	            maxDate: ($scope.invoiceSearchData.to_date && $scope.invoiceSearchData.to_date && ($scope.invoiceSearchData.to_date < $scope.invoiceSearchData.from_date)) ? tzIndependentDate($scope.invoiceSearchData.to_date) : tzIndependentDate($rootScope.businessDate)
	        };

	        $scope.invoiceSearchDateToOptions = {
	            dateFormat: $rootScope.jqDateFormat,
	            maxDate: ($scope.invoiceSearchData.to_date && $scope.invoiceSearchData.to_date && ($scope.invoiceSearchData.from_date > $scope.invoiceSearchData.to_date)) ? tzIndependentDate($scope.invoiceSearchData.from_date) : tzIndependentDate($rootScope.businessDate)
	        };
			if ($scope.shouldShowInvoices) {
				$scope.searchPlaceHolder = $filter('translate')('SEARCH_PLACE_HOLDER_WITH_FOLIO_NUMBER');
			}
			if ($scope.shouldShowReceipts) {
				$scope.searchPlaceHolder = $filter('translate')('SEARCH_PLACE_HOLDER_WITH_RECEIPTS');
			}
			var title = $filter('translate')('FIND_INVOICE');

			$scope.setTitleAndHeading(title);
			$scope.searchInvoice(1);

		};
		
		that.init();

		$scope.$on('$destroy', updateInformationalInvoiceListener);
}]);