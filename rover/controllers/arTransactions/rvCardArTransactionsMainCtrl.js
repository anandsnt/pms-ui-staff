
sntRover.controller('RVCompanyCardArTransactionsMainCtrl',
	['$scope',
	'$rootScope',
	'$stateParams',
	'ngDialog',
	'$timeout',
	'rvAccountsArTransactionsSrv',
	'RVReservationCardSrv',
	function($scope, $rootScope, $stateParams, ngDialog, $timeout, rvAccountsArTransactionsSrv, RVReservationCardSrv) {

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
			'insufficientAmount': false
		};

		$scope.filterData = {
			'query': '',
			'fromDate': '',
			'toDate': ''
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

			'perPage': 5,
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
			'accountId': ( !!$stateParams.isFromCards ) ? $scope.contactInformation.id : $stateParams.id
		};

		/*
		 * To create the parameters which is to be passed to API
		 */

		var createParametersFetchTheData = function () {
			var dataToSend = {
				account_id: $scope.arDataObj.accountId,
				getParams : {
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
			_.each( list , function(obj) {
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

			switch ($scope.arFlags.currentSelectedArTab) {
			    case 'balance':
			    	_.each(data.ar_transactions, function (eachItem) {
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
        }
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
			$scope.fetchTransactions();
		};
		/*
		 * Failure callback of payment
		 */
		var failureCallBackOfPayment = function(errorMessage) {
			// In this case - we have to show the error in footer
			if(errorMessage[0] === "Insufficient Funds.Please 'Add payment' first") {
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
			//$scope.invokeApi(rvAccountsArTransactionsSrv.paySelected, postParamsToPay);
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
			$scope.arDataObj.selectedInvoices = [];
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
			var flag = ($scope.arFlags.shouldShowPayAllButton) ? true : ($scope.arDataObj.selectedInvoices.length === 0) ? false : true;
			
			return flag;
		};
		/*
		 * To create the parameters which is to be passed to API
		 */

		var createParametersFetchTheData = function () {
			var dataToSend = {
				account_id: $scope.arDataObj.accountId,
				getParams : {
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

	    /*
		* Data object to pass to the credit pay controller
		*/
	    var getPassData = function() {
			var passData = {
				"account_id": $stateParams.id,
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
        //Refresh balance list - after adding new manual balance
        // and after succesfull payment with Allocate payment after posting checked
        $scope.$on('REFRESH_UNALLOCATED', function() {
            $scope.arFlags.currentSelectedArTab = 'unallocated';
            $scope.fetchTransactions();
        });
        // Refresh balance list - after adding new manual balance
        // and after succesfull payment with Allocate payment after posting checked
        $scope.$on('REFRESH_PAID_BILLS', function() {
            $scope.arFlags.currentSelectedArTab = 'paid-bills';
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
		});

		/*
		 * Initial loading of this AR transactions tab
		 */
		$scope.$on("arTransactionTabActive", function() {
			// CICO-44250 : Added timeout to fix loading issue back from staycard.
            if ($stateParams.isBackFromStaycard) {
				$timeout(function() {
					init();
				}, 1000);
			}
			else {
				init();
			}
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
}]);
