
sntRover.controller('RVCompanyCardArTransactionsMainCtrl', 
	['$scope', 
	'$rootScope', 
	'$stateParams',
	'ngDialog',
	'rvAccountsArTransactionsSrv', 
	function($scope, $rootScope, $stateParams, ngDialog, rvAccountsArTransactionsSrv) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';

		$scope.arFlags = {
			'currentSelectedArTab': 'balance',
			'isAddBalanceScreenVisible': false
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
			'unallocatedCredit': ''
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
			        break;
			    case 'paid-bills':
			        $scope.arDataObj.paidList = data.ar_transactions;
			        break;
			    case 'unallocated':
			        $scope.arDataObj.unallocatedList = data.ar_transactions;
			        break;
			    case 'allocated':
			        $scope.arDataObj.allocatedList = data.ar_transactions;
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
		};
		/*
		 * Show Add balance screen
		 */			
		$scope.showAddBalanceScreen = function () {
			$scope.arFlags.isAddBalanceScreenVisible = true;
		};	
		/*
		 * Show Add balance screen - Cancel action
		 */
		$scope.clickedCancelAddBalance = function () {
			$scope.arFlags.isAddBalanceScreenVisible = false;
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
		$scope.fetchTransactions = function (dataToSend) {
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
					per_page: 50,
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
					page: 1,
					per_page: 50,
					transaction_type: 'CHARGES',
					paid: false
				}
			};

			$scope.fetchTransactions(dataToSend);
			
		};

		/*
		 * Initial loading of this AR transactions tab
		 */

		$rootScope.$on("arTransactionTabActive", function(event) {
			init();
		});
		
}]);
