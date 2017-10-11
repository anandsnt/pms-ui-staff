
sntRover.controller('RVCompanyCardArTransactionsMainCtrl',
	['$scope',
	'$rootScope',
	'$stateParams',
	'ngDialog',
	'$timeout',
	'rvAccountsArTransactionsSrv',
	'RVReservationCardSrv',
	'$window',
    '$filter',
    'rvPermissionSrv',
	function($scope, $rootScope, $stateParams, ngDialog, $timeout, rvAccountsArTransactionsSrv, RVReservationCardSrv, $window, $filter, rvPermissionSrv) {
		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';

		$scope.arFlags = {
			'currentSelectedArTab': 'balance',
			'isAddBalanceScreenVisible': false,
			'isArTabActive': false,
			'isPaymentSelected': false,
			'viewFromOutside': (typeof $stateParams.type !== 'undefined') ? true : false,
			'shouldShowPayAllButton': false,
			'shouldShowFooter': false,
			'insufficientAmount': false,
			'isArSynced': false,
			'isFromAddPaymentOrAllocateButton': false
		};

		$scope.filterData = {
			'query': '',
			'fromDate': '',
			'toDate': '',
			'includePayments': false,
			'statementEmailAddress': ''
		};


		/*
		 * Data Object set to handle various AR transaction lists.
		 */
		$scope.arDataObj = {
			'balanceList': [],
			'paidList': [],
			'unallocatedList': [],
			'allocatedList': [],

			'unpaidAmount': '',
			'paidAmount': '',
			'allocatedCredit': '',
			'unallocatedCredit': '',
			'company_or_ta_bill_id': '',

			'perPage': 15,
			'balancePageNo': 1,
			'paidPageNo': 1,
			'allocatePageNo': 1,
			'unallocatePageNo': 1,

			'balanceTotalCount': 0,
			'paidTotalCount': 0,
			'allocatedTotalCount': 0,
			'unallocatedTotalCount': 0,
			// Params - Balance tab
			'selectedInvoices': [],
			'totalAllocatedAmount': 0,
			'availableAmount': 0,
			'accountId': ( typeof $scope.contactInformation === 'undefined' ) ? $stateParams.id : $scope.contactInformation.id

		};
		
		/*
		 * To create the parameters which is to be passed to API
		 */

		var createParametersFetchTheData = function () {
			$scope.arDataObj.accountId = ( typeof $scope.contactInformation === 'undefined' ) ? $stateParams.id : $scope.contactInformation.id;
			var dataToSend = {
				account_id: $scope.arDataObj.accountId,
				getParams: {
					per_page: $scope.arDataObj.perPage,
					from_date: $scope.filterData.fromDate,
					to_date: $scope.filterData.toDate,
					query: $scope.filterData.query
				}
			};

			switch ($scope.arFlags.currentSelectedArTab) {
				case 'balance':
					dataToSend.getParams.transaction_type = 'CHARGES';
					dataToSend.getParams.paid = false;
					dataToSend.getParams.page = $scope.arDataObj.balancePageNo;
					break;
				case 'paid-bills':
					dataToSend.getParams.transaction_type = 'CHARGES';
					dataToSend.getParams.paid = true;
					dataToSend.getParams.page = $scope.arDataObj.paidPageNo;
					break;
				case 'unallocated':
					dataToSend.getParams.transaction_type = 'PAYMENTS';
					dataToSend.getParams.allocated = false;
					dataToSend.getParams.page = $scope.arDataObj.unallocatePageNo;
					break;
				case 'allocated':
					dataToSend.getParams.transaction_type = 'PAYMENTS';
					dataToSend.getParams.allocated = true;
					dataToSend.getParams.page = $scope.arDataObj.allocatePageNo;
					break;
				}

			return dataToSend;
		};

		// Append active class
		var appendActiveClass = function( list ) {
			_.each(list, function(obj) {
				obj.active = false;
			});
		};

		// Allocated payment object
		$scope.allocatedPayment = {};

		/*
		 * Successcallback of API after fetching Ar Transaction details.
		 * Handling data based on tabs currently active.
		 */
		var successCallbackOfFetchAPI = function( data ) {

			$scope.arDataObj.unpaidAmount = data.unpaid_amount;
			$scope.arDataObj.paidAmount = data.paid_amount;
			$scope.arDataObj.allocatedCredit = data.allocated_credit;
			$scope.arDataObj.unallocatedCredit = data.unallocated_credit;
			$scope.arDataObj.company_or_ta_bill_id = data.company_or_ta_bill_id;
			$scope.arFlags.isArSynced = data.is_ar_synced;
			// CICO-45436 : To be removed 
			if ( !$scope.arFlags.isArSynced ) {
				$scope.errorMessage = ['Your AR is being updated, please try again later. For further information please contact your system administrator.'];
			}
			else {
				$scope.errorMessage = '';
			}

			switch ($scope.arFlags.currentSelectedArTab) {
				case 'balance':
					_.each(data.ar_transactions, function (eachItem) {
						eachItem.amount = parseFloat(eachItem.amount).toFixed(2);
						eachItem.isSelected = false;
						eachItem.balanceNow = eachItem.amount;
						eachItem.balanceAfter = 0;
						eachItem.initialAmount = eachItem.amount;
					});
					$scope.arDataObj.balanceList = data.ar_transactions;
					$scope.arDataObj.balanceTotalCount = data.total_count;
					appendActiveClass($scope.arDataObj.balanceList);
					$scope.$broadcast("FETCH_COMPLETE_BALANCE_LIST");

					$timeout(function () {
						$scope.$broadcast('updatePagination', 'BALANCE' );
					}, 1000);

					break;
				case 'paid-bills':
					$scope.arDataObj.paidList = data.ar_transactions;
					$scope.arDataObj.paidTotalCount = data.total_count;
					appendActiveClass($scope.arDataObj.paidList);
					$scope.$broadcast("FETCH_COMPLETE_PAID_LIST");

					$timeout(function () {
						$scope.$broadcast('updatePagination', 'PAID' );
					}, 1000);

				break;
				case 'unallocated':
					$scope.arDataObj.unallocatedList = data.ar_transactions;
					$scope.arDataObj.unallocatedTotalCount = data.total_count;
					appendActiveClass($scope.arDataObj.unallocatedList);
					$scope.$broadcast('REFRESH_UNALLOCATED_LIST_SCROLLER');

					$timeout(function () {
						$scope.$broadcast('updatePagination', 'UNALLOCATE' );
					}, 1000);

				break;
				case 'allocated':
					$scope.arDataObj.allocatedList = data.ar_transactions;
					$scope.arDataObj.allocatedTotalCount = data.total_count;
					appendActiveClass($scope.arDataObj.allocatedList);
					$scope.$broadcast('REFRESH_ALLOCATED_LIST_SCROLLER');

					$timeout(function () {
						$scope.$broadcast('updatePagination', 'ALLOCATE' );
					}, 1000);

				break;
				}

				$scope.$emit('hideLoader');
		};

		/*
		 * Switching btw different tabs in AR transaction screen
		 * @param tab is selected tab
		 */
		$scope.switchArTransactionTab = function(tab) {
			$scope.arFlags.currentSelectedArTab = tab;
			if (tab !== 'balance') {
				$scope.arFlags.isAddBalanceScreenVisible = false;
			}
			$scope.arDataObj.balancePageNo = $scope.arDataObj.paidPageNo 
			= $scope.arDataObj.unallocatePageNo = $scope.arDataObj.allocatePageNo = 1;

			$scope.fetchTransactions();
		};
		/*
		 * Show Add balance screen
		 */
		$scope.showAddBalanceScreen = function () {
			$scope.arFlags.isAddBalanceScreenVisible = true;
			$scope.$broadcast('ADD_BALANCE_TAB');
		};

		/* Handling different date picker clicks */
		$scope.clickedFromDate = function() {
			$scope.popupCalendar('FROM');
		};

		$scope.clickedToDate = function() {
			$scope.popupCalendar('TO');
		};
		// Clear from date
		$scope.clearFromDate = function() {
			$scope.filterData.fromDate = '';
			$scope.filterChanged();
		};
		// Clear to date
		$scope.clearToDate = function() {
			$scope.filterData.toDate = '';
			$scope.filterChanged();
		};
		// To handle from date change
		$scope.$on('fromDateChanged', function() {
			$scope.filterChanged();
		});

		// To handle to date change
		$scope.$on('toDateChanged', function() {
			$scope.filterChanged();
		});
		// Show calendar popup.
		$scope.popupCalendar = function(clickedOn) {
			$scope.clickedOn = clickedOn;
			ngDialog.open({
				template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
				controller: 'RVArTransactionsDatePickerController',
				className: '',
				scope: $scope
			});
		};
		// Show payment allocate popup.
		$scope.popupPaymentForAllocation = function () {
			ngDialog.open({
				template: '/assets/partials/companyCard/arTransactions/rvCompanyTravelAgentCardArPaymentPopup.html',
				controller: 'RVArPaymentForAllocationController',
				scope: $scope
			});
		};
		// update allocated payment.
		$scope.updateAllocatedPayment = function(payment) {
			$scope.allocatedPayment = payment;
			$scope.arDataObj.availableAmount = payment.available_amount;
			$scope.arFlags.isPaymentSelected = true;
			ngDialog.close();
		};
		/*
		* Fetch transactions API
		* @param dataToSend data object to API
		*/
		$scope.fetchTransactions = function () {
			var dataToApi = createParametersFetchTheData();

			$scope.invokeApi(rvAccountsArTransactionsSrv.fetchTransactionDetails, dataToApi, successCallbackOfFetchAPI );
		};
		/*
		 * Here is the method to fetch the data in each tab
		 * Params will be different on each tab
		 */
		$scope.filterChanged = function() {
			
			switch ($scope.arFlags.currentSelectedArTab) {
				case 'balance':
					$scope.arDataObj.balancePageNo = 1;
					break;
				case 'paid-bills':
					$scope.arDataObj.paidPageNo = 1;
					break;
				case 'unallocated':
					$scope.arDataObj.unallocatePageNo = 1;
					break;
				case 'allocated':
					$scope.arDataObj.allocatePageNo = 1;
					break;
			}

			$scope.fetchTransactions();
		};
		/*
		 * Add payment method
		 */
		$scope.addPayment = function() {
			$scope.passData = getPassData();
			ngDialog.open({
				template: '/assets/partials/companyCard/arTransactions/rvArTransactionsPayCredits.html',
				controller: 'RVArTransactionsPayCreditsController',
				className: '',
				scope: $scope
			});
			$scope.paymentModalOpened = true;
		};
		/*
		 * Success callback of payment
		 */
		var successCallBackOfPayment = function() {
			$scope.arFlags.insufficientAmount = false;
			$scope.arDataObj.selectedInvoices = [];
			$scope.arFlags.isPaymentSelected = false;
			$scope.arFlags.shouldShowPayAllButton = false;
			$scope.arFlags.shouldShowFooter = false;
			$scope.arDataObj.availableAmount = 0;
						
			$scope.fetchTransactions();
		};

		/*
		 * Failure callback of payment
		 */
		var failureCallBackOfPayment = function(errorMessage) {
			// In this case - we have to show the error in footer
			if (errorMessage[0] === "Insufficient Funds.Please 'Add payment' first") {
				$scope.errorMessage = [];
				$scope.arFlags.insufficientAmount = true;
			}
		};

		/*
		 * Pay selected invoices
		 */
		$scope.paySelectedInvoices = function() {
			var postParamsToPay = {},
				postData = {};

			postData.credit_id = $scope.allocatedPayment.transaction_id;
			postData.invoices = $scope.arDataObj.selectedInvoices;
			postData.selected_amount = $scope.arDataObj.totalAllocatedAmount ;
			postData.available_amount = $scope.arDataObj.availableAmount;
			postParamsToPay.account_id = $scope.arDataObj.accountId;
			postParamsToPay.data = postData;

			var options = {
				params: postParamsToPay,
				successCallBack: successCallBackOfPayment,
				failureCallBack: failureCallBackOfPayment
			};

			$scope.callAPI(rvAccountsArTransactionsSrv.paySelected, options);			
		};
		/*
		 * Pay All Button click
		 */
		$scope.clickedPayAllButton = function() {
			var postParamsToPay = {},
				postData = {},
				totalAllocatedAmount = 0;

			$scope.arDataObj.selectedInvoices = [];
			_.each($scope.arDataObj.balanceList, function (eachItem) {
				var selectedInvoiceObj = {};

				selectedInvoiceObj.invoice_id = eachItem.transaction_id;
				selectedInvoiceObj.amount = eachItem.amount;
				$scope.arDataObj.selectedInvoices.push(selectedInvoiceObj);	   			
				totalAllocatedAmount = totalAllocatedAmount + eachItem.amount;
			});
			$scope.arDataObj.totalAllocatedAmount  = totalAllocatedAmount;

			postData.credit_id = $scope.allocatedPayment.transaction_id;
			postData.invoices = $scope.arDataObj.selectedInvoices;
			postData.selected_amount = $scope.arDataObj.totalAllocatedAmount;
			postData.available_amount = $scope.arDataObj.availableAmount;
			postParamsToPay.account_id = $scope.arDataObj.accountId;
			postParamsToPay.data = postData;
			var options = {
				params: postParamsToPay,
				successCallBack: successCallBackOfPayment,
				failureCallBack: failureCallBackOfPayment
			};

			$scope.callAPI(rvAccountsArTransactionsSrv.paySelected, options);
		};
		/*
		 * Clicked Cancel from footer
		 */
		$scope.clickCancelFromFooter = function() {
			$scope.arFlags.isPaymentSelected = false;
			$scope.arFlags.shouldShowFooter = false;
			$scope.arFlags.insufficientAmount = false;
			$scope.arFlags.shouldShowPayAllButton = false;
			$scope.arDataObj.selectedInvoices = [];
			$scope.arFlags.isFromAddPaymentOrAllocateButton = false;
			$scope.arDataObj.availableAmount = 0;
			_.each($scope.arDataObj.balanceList, function (eachItem) {
				eachItem.isSelected = false;
			});
		};
		/*
		 * Should show footer instead of pagination
		 * 2 cases - one if invoice selected 
		 *         - if selected payment from add payment or from unallocate tab
		 */
		$scope.shouldShowFooter = function() {			
			var flag = true;

			if ($scope.arDataObj.selectedInvoices.length === 0 && !$scope.arFlags.isFromAddPaymentOrAllocateButton) {
				flag = false;
			}
			return flag;
		};
		/*
		* Data object to pass to the credit pay controller
		*/
		var getPassData = function() {
			var passData = {
				"account_id": $scope.arDataObj.accountId,
				"is_swiped": false,
				"details": {
					"firstName": "",
					"lastName": ""
				}
			};

			return passData;
		};

		/*
		 *	MLI SWIPE actions
		 */
		var processSwipedData = function(swipedCardData) {

			var passData = getPassData();
			var swipeOperationObj = new SwipeOperation();
			var swipedCardDataToRender = swipeOperationObj.createSWipedDataToRender(swipedCardData);

			passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
			$scope.$broadcast('SHOW_SWIPED_DATA_ON_PAY_SCREEN', swipedCardDataToRender);

		};

		/*
		 * Handle swipe action
		 */

		$scope.$on('SWIPE_ACTION', function(event, swipedCardData) {
			if ($scope.paymentModalOpened) {
				var swipeOperationObj = new SwipeOperation();
				var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
				var tokenizeSuccessCallback = function(tokenValue) {
					$scope.$emit('hideLoader');
					swipedCardData.token = tokenValue;
					processSwipedData(swipedCardData);
				};

				$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
			} else {
				return;
			}
		});

		/*
		 * Initial loading of the screen
		 *
		 */
		var init = function() {
			$scope.fetchTransactions();
		};

		// Catch error messges from child controllers.
		$scope.$on('SHOW_ERROR_MSG', function( event, errorMessage ) {
			$scope.errorMessage = errorMessage;
		});
		// Refresh balance list - after adding new manual balance
		// and after succesfull payment with Allocate payment after posting checked
		$scope.$on('REFRESH_BALANCE_LIST', function() {
			$scope.arFlags.currentSelectedArTab = 'balance';
			$scope.fetchTransactions();			
		});
		// Refresh balance list - after adding new manual balance
		// and after succesfull payment with Allocate payment after posting checked
		$scope.$on('REFRESH_UNALLOCATED', function() {
			$scope.arFlags.currentSelectedArTab = 'unallocated';
			$scope.fetchTransactions();
		});
		// Refresh paid bills list - after adding new manual balance
		// and after succesfull payment with Allocate payment after posting checked
		$scope.$on('REFRESH_PAID_BILLS', function() {
			$scope.arFlags.currentSelectedArTab = 'paid-bills';
			$scope.fetchTransactions();
		});
		// Refresh allacated list - After unallocate
		$scope.$on('REFRESH_ALLOCATED', function() {
			$scope.arFlags.currentSelectedArTab = 'allocated';
			$scope.fetchTransactions();
		});

		// Refresh selected list
		$scope.$on("REFRESH_SELECTED_LIST", function() {
			$scope.fetchTransactions();
		});
		// Clicked allocate button from unallocated tab
		$scope.$on("CLICKED_ALLOCATE_BUTTON", function(event, selectedPaymentData) {
			$scope.arFlags.shouldShowPayAllButton = true;
			$scope.arFlags.currentSelectedArTab = 'balance';
			$scope.allocatedPayment = selectedPaymentData;
			$scope.arFlags.isPaymentSelected = true;	
			$scope.arDataObj.availableAmount = selectedPaymentData.available_amount;
			$scope.arFlags.isFromAddPaymentOrAllocateButton = true;	
			var totalAllocatedAmount = 0;

            _.each($scope.arDataObj.balanceList, function (eachItem) {
                totalAllocatedAmount = parseFloat(totalAllocatedAmount) + parseFloat(eachItem.amount);
            });
            $scope.arDataObj.totalAllocatedAmount = totalAllocatedAmount;	
		});

		/*
		 * Initial loading of this AR transactions tab
		 */
		$scope.$on("arTransactionTabActive", function() {
			init();
			$scope.arFlags.isArTabActive = true;
		});

		// -------/ PAGINATION LOGIC /----------- //

		/*
		 * Fetch transactions APIs
		 * @param pageType { String } , Page No { String }to API
		 */
		var loadAPIData = function ( pageType, pageNo ) {
			switch (pageType) {
				case 'BALANCE':
					$scope.arDataObj.balancePageNo = pageNo;
					break;
				case 'PAID':
					$scope.arDataObj.paidPageNo = pageNo;
					break;
				case 'ALLOCATE':
					$scope.arDataObj.allocatePageNo = pageNo;
					break;
				case 'UNALLOCATE':
					$scope.arDataObj.unallocatePageNo = pageNo;
					break;
				}
			$scope.invokeApi(rvAccountsArTransactionsSrv.fetchTransactionDetails, createParametersFetchTheData(), successCallbackOfFetchAPI );
		};

		// Pagination options for BALANCE
		$scope.balancePagination = {
			id: 'BALANCE',
			api: [ loadAPIData, 'BALANCE' ],
			perPage: $scope.arDataObj.perPage
		};

		// Pagination options for PAID
		$scope.paidPagination = {
			id: 'PAID',
			api: [ loadAPIData, 'PAID' ],
			perPage: $scope.arDataObj.perPage
		};

		// Pagination options for AR_BALANCE
		$scope.allocatePagination = {
			id: 'ALLOCATE',
			api: [ loadAPIData, 'ALLOCATE' ],
			perPage: $scope.arDataObj.perPage
		};

		// Pagination options for AR_BALANCE
		$scope.unallocatePagination = {
			id: 'UNALLOCATE',
			api: [ loadAPIData, 'UNALLOCATE' ],
			perPage: $scope.arDataObj.perPage
		};

		// -------/ PAGINATION LOGIC /----------- //

		// Handler for statement button click
		$scope.clickedArStatementButton = function() {

		var dataFetchSuccess = function(data) {
			$scope.statementEmailAddress = !!data.to_address ? data.to_address : '';
				ngDialog.open({
				template: '/assets/partials/companyCard/arTransactions/rvArStatementPopup.html',
				className: '',
				closeByDocument: false,
				scope: $scope
			});
		},
		dataFailureCallback = function(errorData) {
			$scope.errorMessage = errorData;
		};

		var params = { 'id': $scope.arDataObj.accountId };

		var options = {
			params: params,
			successCallBack: dataFetchSuccess,
			failureCallBack: dataFailureCallback
		};

		$scope.callAPI(rvAccountsArTransactionsSrv.fetchArStatementData, options);
		};

        // Checks whether include payment checkbox should be shown or not
        $scope.showIncludePayments = function() {
            return ( $scope.arFlags.currentSelectedArTab === 'balance' || $scope.arFlags.currentSelectedArTab === 'paid-bills' );
        };

        // Get parameters for fetch data
        var getParamsToSend = function() {
            var paramsToSend = {
                "id": $scope.arDataObj.accountId,
                "from_date": $scope.filterData.fromDate,
                "to_date": $scope.filterData.toDate,
                "query": $scope.filterData.query
            };

            if ($scope.arFlags.currentSelectedArTab === 'balance') {
                paramsToSend.paid = false;
                paramsToSend.transaction_type = 'CHARGES';
                paramsToSend.include_payments = $scope.filterData.includePayments;
            } else if ($scope.arFlags.currentSelectedArTab === 'paid-bills') {
                paramsToSend.paid = true;
                paramsToSend.transaction_type = 'CHARGES';
                paramsToSend.include_payments = $scope.filterData.includePayments;
            } else if ($scope.arFlags.currentSelectedArTab === 'unallocated') {
                paramsToSend.transaction_type = 'PAYMENTS';
                paramsToSend.allocated = false;
            } else if ($scope.arFlags.currentSelectedArTab === 'allocated') {
                paramsToSend.transaction_type = 'PAYMENTS';
                paramsToSend.allocated = true;
            }
            // CICO-10323. for hotels with single digit search,
            // If it is a numeric query with less than 3 digits, then lets assume it is room serach.

            if ($rootScope.isSingleDigitSearch &&
                !isNaN($scope.filterData.textInQueryBox) &&
                $scope.filterData.textInQueryBox.length < 3) {

                paramsToSend.room_search = true;
            }
            return paramsToSend;
        };

        // add the print orientation before printing
        var addPrintOrientation = function() {
            $( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
        };

        // add the print orientation after printing
        var removePrintOrientation = function() {
            $( '#print-orientation' ).remove();
        };

        // print AR Statement
        var printArStatement = function(params) {
            var printDataFetchSuccess = function(successData) {
                $scope.printData = successData;
                $scope.errorMessage = "";
                // hide hotel logo
                $("header .logo").addClass('logo-hide');
                // inoder to set class 'print-statement' on rvCompanyCardDetails.html
                $scope.$emit("PRINT_AR_STATEMENT", true);
                // add the orientation
                addPrintOrientation();

                /*
                *   ======[ READY TO PRINT ]======
                */
                // this will show the popup with full bill
                $timeout(function() {
                    /*
                    *   ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                    */

                    $window.print();
                    if ( sntapp.cordovaLoaded ) {
                        cordova.exec(function() {}, function() {}, 'RVCardPlugin', 'printWebView', []);
                    }
                }, 1000);

                /*
                *   ======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
                */

                $timeout(function() {
                    $("header .logo").removeClass('logo-hide');
                    // inoder to re-set/remove class 'print-statement' on rvCompanyCardDetails.html
                    $scope.$emit("PRINT_AR_STATEMENT", false);
                    // remove the orientation after similar delay
                    removePrintOrientation();
                }, 1000);
            };

            var printDataFailureCallback = function(errorData) {
                $scope.errorMessage = errorData;
            };

            var options = {
                params: params,
                successCallBack: printDataFetchSuccess,
                failureCallBack: printDataFailureCallback
            };

            $scope.callAPI(rvAccountsArTransactionsSrv.fetchArStatementPrintData, options);
        };

        // Handler for AR statement print
        $scope.pritArStatement = function () {
            var params = getParamsToSend();

            printArStatement( params );
        };

        // To show email sent callbacks
        $scope.showEmailSentStatusPopup = function() {
            ngDialog.open({
                template: '/assets/partials/popups/rvEmailSentStatusPopup.html',
                className: '',
                scope: $scope
            });
        };

        // Send email AR statement
        $scope.emailArStatement = function() {
            var params = getParamsToSend();

            params.to_address = $scope.filterData.statementEmailAddress;
            $scope.closeDialog();

            var emailSuccess = function() {
                $scope.errorMessage = "";
                $scope.statusMsg = $filter('translate')('EMAIL_SENT_SUCCESSFULLY');
                $scope.status = "success";
                $scope.showEmailSentStatusPopup();
            },
            emailFailureCallback = function(errorData) {
                $scope.errorMessage = errorData;
                $scope.statusMsg = $filter('translate')('EMAIL_SEND_FAILED');
                $scope.status = "alert";
                $scope.showEmailSentStatusPopup();
            };

            var options = {
                params: params,
                successCallBack: emailSuccess,
                failureCallBack: emailFailureCallback
            };

            $scope.callAPI(rvAccountsArTransactionsSrv.emailArStatement, options);
        };

        /**
		* function to check whether the user has permission
		* to create/edit AR Account.
		* @return {Boolean}
		*/
		$scope.hasPermissionToCreateArAccount = function() {
			return ( rvPermissionSrv.getPermissionValue ('CREATE_AR_ACCOUNT') && $scope.arFlags.isArSynced );
		};
		// CICO-45342 Handle clear search button click
		$scope.clearResults = function () {
			$scope.filterData.query = '';
			$scope.filterChanged();
		};

}]);