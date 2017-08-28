
sntRover.controller('RVCompanyCardArTransactionsMainCtrl', 
	['$scope', 
	'$rootScope', 
	'$stateParams',
	'ngDialog',
	'$timeout', 
	'rvAccountsArTransactionsSrv', 
	function($scope, $rootScope, $stateParams, ngDialog, $timeout, rvAccountsArTransactionsSrv) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';

		$scope.arFlags = {
			'currentSelectedArTab': 'balance',
			'isAddBalanceScreenVisible': false,
			'isArTabActive': false
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

			'perPage': 50,
			'balancePageNo': 1,
			'paidPageNo': 1,
			'allocatePageNo': 1,
			'unallocatePageNo': 1,

			'balanceTotalCount': 0,
			'paidTotalCount': 0,
			'allocatedTotalCount': 0,
			'unallocatedTotalCount': 0
		};

		/*
		 * Successcallback of API after fetching Ar Transaction details.
		 * Handling data based on tabs currently active.
		 */
		var successCallbackOfFetchAPI = function( data ) {

			$scope.arDataObj.unpaidAmount = data.unpaid_amount;
			$scope.arDataObj.paidAmount = data.paid_amount;
			$scope.arDataObj.allocatedCredit = data.allocated_credit;
			$scope.arDataObj.unallocatedCredit = data.unallocated_credit;
            
			switch($scope.arFlags.currentSelectedArTab) {
			    case 'balance':
			        $scope.arDataObj.balanceList = data.ar_transactions;
			        $scope.arDataObj.balanceTotalCount = data.total_count;
			        $scope.$broadcast("FETCH_COMPLETE_BALANCE_LIST");

		            $timeout(function () {                
		                 $scope.$broadcast('updatePagination', 'BALANCE' );                
		            }, 1000);

			        break;
			    case 'paid-bills':
			        $scope.arDataObj.paidList = data.ar_transactions;
			        $scope.arDataObj.paidTotalCount = data.total_count;
			        $scope.$broadcast("FETCH_COMPLETE_PAID_LIST");

			        $timeout(function () {                
		                 $scope.$broadcast('updatePagination', 'PAID' );                
		            }, 1000);
			        
			        break;
			    case 'unallocated':
			        $scope.arDataObj.unallocatedList = data.ar_transactions;
			        $scope.arDataObj.unallocatedTotalCount = data.total_count;
			        $scope.$broadcast('updatePagination', 'UNALLOCATE' );
			        break;
			    case 'allocated':
			        $scope.arDataObj.allocatedList = data.ar_transactions;
			        $scope.arDataObj.allocatedTotalCount = data.total_count;
			        $scope.$broadcast('updatePagination', 'ALLOCATE' );
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

			var dataToSend = {
				account_id: $stateParams.id,
				getParams : {
					per_page: $scope.arDataObj.perPage,
					from_date: $scope.filterData.fromDate,
					to_date: $scope.filterData.toDate,
					query: $scope.filterData.query
				}
			}

			switch($scope.arFlags.currentSelectedArTab) {
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
			        $scope.arDataObj.unallocatedList = data.ar_transactions;
			        break;
			    case 'allocated':
			        $scope.arDataObj.allocatedList = data.ar_transactions;
			        break;
			}

			$scope.fetchTransactions(dataToSend);
		};
		/*
		 * Show Add balance screen
		 */			
		$scope.showAddBalanceScreen = function () {
			$scope.arFlags.isAddBalanceScreenVisible = true;
		};			

		/* Handling different date picker clicks */
		$scope.clickedFromDate = function() {
			$scope.popupCalendar('FROM');
		};
		$scope.clickedToDate = function() {
			$scope.popupCalendar('TO');
		};
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
	    /*
	     * Fetch transactions API
	     * @param dataToSend data object to API
	     */
		$scope.fetchTransactions = function (dataToSend, pageNo) {
			dataToSend.getParams.page = pageNo ? pageNo : 1;
			$scope.invokeApi(rvAccountsArTransactionsSrv.fetchTransactionDetails, dataToSend, successCallbackOfFetchAPI );
		};
		/*
		 * Here is the method to fetch the data in each tab
		 * Params will be different on each tab
		 */

		$scope.filterChanged = function() {
			// Params need to change while doing the stories on each area
			var dataToSend = {
				account_id: $stateParams.id,
				getParams : {
					page: 1,
					per_page: $scope.arDataObj.perPage,
					transaction_type: 'CHARGES',
					paid: false,
					from_date: $scope.filterData.fromDate,
					to_date: $scope.filterData.toDate,
					query: $scope.filterData.query
				}
			}
			$scope.fetchTransactions(dataToSend);
		};

		/*
		 * Initial loading of the screen
		 *
		 */
		var init = function() {
			var dataToSend = {
				account_id: $stateParams.id,
				getParams : {
					per_page: $scope.arDataObj.perPage,
					transaction_type: 'CHARGES',
					paid: false
				}
			};	
		};

		// Catch error messges from child controllers.
		$scope.$on('SHOW_ERROR_MSG', function( errorMessage ) {
			$scope.errorMessage = errorMessage;
		});

		/*
		 * Initial loading of this AR transactions tab
		 */

		$rootScope.$on("arTransactionTabActive", function(event) {
			//init();
			$scope.arFlags.isArTabActive = true;
		});


		// -------/ PAGINATION LOGIC /----------- //

		var getDataToSend = function() {

			var dataToSend = {
				account_id: $stateParams.id,
				getParams : {
					per_page: $scope.arDataObj.perPage,
					transaction_type: 'CHARGES',
					paid: false,
					page: $scope.arDataObj.balancePageNo
				}
			};

			return dataToSend;
		};

		/*
	     * Fetch transactions APIs
	     * @param pageType { String } , Page No { String }to API
	     */
		var loadAPIData = function ( pageType, pageNo ) {
			
			if ( pageType === 'BALANCE' ) {
				$scope.arDataObj.balancePageNo = pageNo;
			}

			$scope.invokeApi(rvAccountsArTransactionsSrv.fetchTransactionDetails, getDataToSend(), successCallbackOfFetchAPI );

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

	    loadAPIData('BALANCE', 1);

	    // -------/ PAGINATION LOGIC /----------- //
}]);
