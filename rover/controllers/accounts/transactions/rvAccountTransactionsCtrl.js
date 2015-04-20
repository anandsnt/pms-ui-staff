sntRover.controller('rvAccountTransactionsCtrl', ['$scope', '$rootScope', '$filter', '$stateParams','ngDialog', 'rvAccountsConfigurationSrv', 'RVReservationSummarySrv', 'rvAccountTransactionsSrv','RVChargeItems', '$timeout',
	function($scope, $rootScope, $filter, $stateParams,ngDialog, rvAccountsConfigurationSrv, RVReservationSummarySrv, rvAccountTransactionsSrv,RVChargeItems, $timeout) {
		BaseCtrl.call(this, $scope);
		
		var initAccountTransactionsView = function(){
			//Scope variable to set active bill
			$scope.currentActiveBill = 0;
			$scope.dayRates = -1;
			$scope.setScroller('registration-content');
			$scope.setScroller ('transaction-bill-tab-scroller', {scrollX: true});
			$scope.setScroller('billDays', {scrollX: true});

			getTransactionDetails();

		};

		var getTransactionDetails = function(){

			var onTransactionFetchSuccess = function(data){

				$scope.$emit('hideloader');
				$scope.transactionsDetails = data;
				$scope.refreshScroller('registration-content');
				$scope.refreshScroller('transaction-bill-tab-scroller');
				$scope.refreshScroller('billDays');

			}
			var params = {"account_id" : $scope.accountConfigData.summary.posting_account_id}
			$scope.callAPI(rvAccountTransactionsSrv.fetchTransactionDetails, {
				successCallBack: onTransactionFetchSuccess,
				params: params
			});
		};

		$scope.createNewBill = function(){
			var billData ={
				"account_id" : $scope.accountConfigData.summary.posting_account_id,
				"bill_number" : $scope.transactionsDetails.bills.length + 1
			};
			var createBillSuccessCallback = function(data){
				$scope.$emit('hideLoader');
				//Fetch data again to refresh the screen with new data
				getTransactionDetails();
			};

			$scope.invokeApi(rvAccountTransactionsSrv.createAnotherBill, billData, createBillSuccessCallback);
		};



		//Calculate the scroll width for bill tabs in all the cases
		$scope.getWidthForBillTabsScroll = function(){
			/*var width = 0;
			if($scope.routingArrayCount > 0)
				width = width + 200;
			if($scope.incomingRoutingArrayCount > 0)
				width = width + 275;
			if($scope.clickedButton == 'checkinButton')
				width = width + 230;
			if($scope.reservationBillData.bills.length < 10)
				width = width + 50;
			width =  133 * $scope.reservationBillData.bills.length + 10 + width;
			return width;*/
			return 2200;
		};
		

		$scope.showDayRates = function(dayIndex){
			
			if($scope.dayRates != dayIndex) {
				$scope.dayRates = dayIndex;

			}else{
				$scope.dayRates = -1;
			}
		};

		$scope.showActiveBill = function(index){

			var activeBillClass = "";
			if(index == $scope.currentActiveBill){
				activeBillClass = "ui-tabs-active ui-state-active";
			}
			return activeBillClass;
		};


		/*
		 * Set clicked bill active and show corresponding days/packages/addons calender
		 * @param {int} index of bill
		 */
		$scope.setActiveBill = function(billIndex){

			$scope.currentActiveBill = billIndex;
			
		};

		
		// Refresh registration-content scroller.
		$scope.calculateHeightAndRefreshScroll = function() {
			$timeout(function(){
				$scope.refreshScroller('registration-content');
			}, 500);
		};
			

		initAccountTransactionsView();




		$scope.openPostCharge = function(activeBillNo) {

			// pass on the reservation id
			$scope.account_id = "797";
			$scope.reservationBillData = {};
			$scope.reservationBillData.bills = ["1","2","3"];
			// $scope.passActiveBillNo = "2";

			// pass down active bill no
			activeBillNo = "2";
			//$scope.passActiveBillNo = activeBillNo;

			$scope.billNumber = activeBillNo;

			// translating this logic as such from old Rover
			// api post param 'fetch_total_balance' must be 'false' when posted from 'staycard'
			// Also passing the available bills to the post charge modal
			$scope.fetchTotalBal = false;
			var callback = function(data) {
			    $scope.$emit( 'hideLoader' );

			    $scope.fetchedData = data;
			    var bills = [];
			    for(var i = 0; i < $scope.reservationBillData.bills.length; i++ )
			    	bills.push(i+1);

			    $scope.fetchedData.bill_numbers = bills;

	    		ngDialog.open({
	        		template: '/assets/partials/postCharge/postCharge.html',
	        		controller: 'RVPostChargeController',
	        		className: '',
	        		scope: $scope
	        	});
			};

			$scope.invokeApi(RVChargeItems.fetch, $scope.reservation_id, callback);
		};
	}
]);