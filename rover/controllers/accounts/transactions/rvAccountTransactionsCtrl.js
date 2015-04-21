sntRover.controller('rvAccountTransactionsCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'ngDialog', 'rvAccountsConfigurationSrv', 'RVReservationSummarySrv', 'rvAccountTransactionsSrv', 'RVChargeItems','RVPaymentSrv','RVReservationCardSrv', 'RVBillCardSrv', 'rvPermissionSrv','$timeout', '$window',
	function($scope, $rootScope, $filter, $stateParams, ngDialog, rvAccountsConfigurationSrv, RVReservationSummarySrv, rvAccountTransactionsSrv, RVChargeItems,RVPaymentSrv,RVReservationCardSrv, RVBillCardSrv,rvPermissionSrv, $timeout, $window) {


		BaseCtrl.call(this, $scope);

		var initAccountTransactionsView = function() {
			//Scope variable to set active bill
			$scope.currentActiveBill = 0;
			$scope.dayRates = -1;
			$scope.showPayButton = false;
			$scope.setScroller('registration-content');
			$scope.setScroller ('transaction-bill-tab-scroller', {scrollX: true});
			$scope.setScroller('billDays', {scrollX: true});

			getTransactionDetails();

			$scope.renderData =  {}; //payment modal data - naming so as to reuse HTML
			//TODO: Fetch accoutn transactions
			$scope.paymentModalOpened = false;

		};

		var getTransactionDetails = function() {

			var onTransactionFetchSuccess = function(data) {

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
		$scope.getWidthForBillTabsScroll = function() {
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

		$scope.showActiveBill = function(index) {

			var activeBillClass = "";
			if (index == $scope.currentActiveBill) {
				activeBillClass = "ui-tabs-active ui-state-active";
			}
			return activeBillClass;
		};


		/*
		 * Set clicked bill active and show corresponding days/packages/addons calender
		 * @param {int} index of bill
		 */
		$scope.setActiveBill = function(billIndex) {

			$scope.currentActiveBill = billIndex;
		};

		
		// Refresh registration-content scroller.
		$scope.calculateHeightAndRefreshScroll = function() {
			$timeout(function() {
				$scope.refreshScroller('registration-content');
			}, 500);
		};


		initAccountTransactionsView();



		$scope.openPostCharge = function(activeBillNo) {

			// pass on the reservation id
			$scope.account_id = "797";
			$scope.reservationBillData = {};
			$scope.reservationBillData.bills = ["1", "2", "3"];
			// $scope.passActiveBillNo = "2";

			// pass down active bill no
			activeBillNo = "2";
			//$scope.passActiveBillNo = activeBillNo;

			$scope.billNumber = activeBillNo;
			// Also passing the available bills to the post charge modal
			$scope.fetchTotalBal = false;
			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.fetchedData = data;
				var bills = [];
				for (var i = 0; i < $scope.reservationBillData.bills.length; i++)
					bills.push(i + 1);

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

		var fetchPaymentMethods = function(directBillNeeded){
			
			var directBillNeeded = directBillNeeded ==="directBillNeeded" ? true:false;
			var onPaymnentFetchSuccess = function(data) {
				$scope.renderData =  data; 
				$scope.creditCardTypes = [];
				angular.forEach($scope.renderData, function(item, key) {
					if(item.name === 'CC'){
						$scope.creditCardTypes = item.values;
					};					
				});	
			},
			onPaymnentFetchFailure = function(errorMessage) {
				$scope.errorMessage = errorMessage;
			};
			$scope.callAPI(RVPaymentSrv.renderPaymentScreen, {
				successCallBack: onPaymnentFetchSuccess,
				failureCallBack: onPaymnentFetchFailure,
				params: {
					direct_bill: directBillNeeded
				}
			});
		};

		var getPassData = function(){
			 var passData = {
	 		"account_id": "797",
	 		"is_swiped": false ,
	 		"details":{
	 			"firstName":"",
	 			"lastName":""
	 			}
	 		};
	 		return passData;
		};



		$scope.showPayemntModal = function(){
			$scope.passData = getPassData();
				 	ngDialog.open({
			              template: '/assets/partials/accounts/transactions/rvAccountPaymentModal.html',
			              className: '',
			              controller: 'RVAccountsTransactionsPaymentCtrl',
			              closeByDocument: false,
			              scope: $scope
			          });
			$scope.paymentModalOpened = true;
		};



		//To update paymentModalOpened scope - To work normal swipe in case if payment screen opened and closed - CICO-8617
		$scope.$on('HANDLE_MODAL_OPENED', function(event) {
			$scope.paymentModalOpened = false;
			//$scope.billingInfoModalOpened = false;
		});
	/*
	 *	MLI SWIPE actions
	 */
		var processSwipedData = function(swipedCardData){

	 			//Current active bill is index - adding 1 to get billnumber
	 			var billNumber = "1";
	 			var passData = getPassData();
  	 			var swipeOperationObj = new SwipeOperation();
				var swipedCardDataToRender = swipeOperationObj.createSWipedDataToRender(swipedCardData);
				passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
				if(swipedCardDataToRender.swipeFrom === "payButton") {
					$scope.$broadcast('SHOW_SWIPED_DATA_ON_PAY_SCREEN', swipedCardDataToRender);
				}
				// else if(swipedCardDataToRender.swipeFrom === "billingInfo") {
				// 	$scope.$broadcast('SHOW_SWIPED_DATA_ON_BILLING_SCREEN', swipedCardDataToRender);
				// }

		};

		/*
		  * Handle swipe action in bill card
		  */

		 $scope.$on('SWIPE_ACTION', function(event, swipedCardData) {
		 	
		 	    if($scope.paymentModalOpened){
					swipedCardData.swipeFrom = "payButton";
				// } else if ($scope.billingInfoModalOpened) {
				// 	swipedCardData.swipeFrom = "billingInfo";
				} else {
					swipedCardData.swipeFrom = "viewBill";
				}
				var swipeOperationObj = new SwipeOperation();
				var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
				var tokenizeSuccessCallback = function(tokenValue){
					$scope.$emit('hideLoader');
					swipedCardData.token = tokenValue;
					processSwipedData(swipedCardData);
				};
				$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
		});


		/**
		* function to check whether the user has permission
		* to make payment
		* @return {Boolean}
		*/
		$scope.hasPermissionToMakePayment = function() {
			return rvPermissionSrv.getPermissionValue ('MAKE_PAYMENT');
		};

		//Whatever permission of Make Payment we are assigning that
		//removing standalone thing here
		$scope.showPayButton = $scope.hasPermissionToMakePayment() && $rootScope.isStandAlone;


		/*------------- edit/remove/split starts here --------------*/

		/**
		* function to check whether the user has permission
		* to Edit/Split/Move/Delete charges
		* @return {Boolean}
		*/
		$scope.hasPermissionToChangeCharges = function() {
			return rvPermissionSrv.getPermissionValue ('EDIT_SPLIT_DELETE_CHARGE');
		};

		/**
		* function to decide whether to show Edit charge button
		* @param {String} - Fees type value
		* @return {Boolean}
		*/
		$scope.showEditChargeButton = function(feesType){
			return ($rootScope.isStandAlone && 
					feesType!== 'TAX' && 
					$scope.hasPermissionToChangeCharges());
		};
	
		/*
		 *  set default values for split/edit/remove popups
		 *  We reuse the HTMLs used in reservation bill screen
		 *  However here the postings are against the <account_id> we use seperate controllers
		 */
		$scope.splitTypeisAmount = true;
		$scope.chargeCodeActive = false;
		$scope.selectedChargeCode = {};

		var fetchChargeCodesSuccess = function(data) {
			$scope.chargeCodeData = data.results;
			$scope.availableChargeCodes = data.results;
		};

		$scope.callAPI(RVBillCardSrv.fetchChargeCodes, {
			successCallBack: fetchChargeCodesSuccess,
			params: {}
		});

		$scope.getAllchargeCodes = function(callback) {
			callback($scope.chargeCodeData);
		};

		$scope.setchargeCodeActive = function(bool) {
			$scope.chargeCodeActive = bool;
		};

		/*
		 * open popup for selecting edit/split/remove transaction
		 */
		$scope.openActionsPopup = function(id, desc, amount, type, credits) {

			$scope.errorMessage = "";
			//hide edit and remove options in case type is  payment
			// $scope.hideRemoveAndEdit  = (type == "PAYMENT") ? true : false;
			$scope.selectedTransaction = {};
			$scope.selectedTransaction.id = id;
			$scope.selectedTransaction.desc = desc;

			if (amount) {
				$scope.selectedTransaction.amount = amount;
			} else if (credits) {
				$scope.selectedTransaction.amount = credits;
			};

			ngDialog.open({
				template: '/assets/partials/bill/rvBillActionsPopup.html',
				className: '',
				scope: $scope
			});
		};

		/*
		 * popup individual popups based on selection
		 */

		$scope.callActionsPopupAction = function(action) {

			ngDialog.close();
			if (action === "remove") {
				$scope.openRemoveChargePopup();
			} else if (action === "split") {
				$scope.openSplitChargePopup();
			} else if (action === "edit") {
				$scope.openEditChargePopup();
			};

		};

		/*
		 * open popup for remove transaction
		 * We are using same controller for split/edit and remove as those needs just one function each
		 *
		 */

		$scope.openRemoveChargePopup = function() {
			ngDialog.open({
				template: '/assets/partials/bill/rvRemoveChargePopup.html',
				controller: 'RVAccountTransactionsPopupCtrl',
				className: '',
				scope: $scope
			});
		};

		/*
		 * open popup for split transaction
		 */

		$scope.openSplitChargePopup = function() {
			ngDialog.open({
				template: '/assets/partials/bill/rvSplitChargePopup.html',
				controller: 'RVAccountTransactionsPopupCtrl',
				className: '',
				scope: $scope
			});
		};

		/*
		 * open popup for edit transaction
		 */

		$scope.openEditChargePopup = function() {
			$scope.selectedChargeCode = {
				"id": "",
				"name": "",
				"description": "",
				"associcated_charge_groups": []
			};
			ngDialog.open({
				template: '/assets/partials/bill/rvEditPostingPopup.html',
				className: '',
				controller: 'RVAccountTransactionsPopupCtrl',
				scope: $scope
			});
			$scope.setScroller('chargeCodesList');
		};



		/*----------- edit/remove/split ends here ---------------*/
		//CICO-13903
		$scope.printInvoice = function() {



			$('.nav-bar').addClass('no-print');
			$('.cards-header').addClass('no-print');
			$('.card-tabs-nav').addClass('no-print');

			// this will show the popup with full report
			$timeout(function() {

				/*
				 *	=====[ PRINTING!! JS EXECUTION IS PAUSED ]=====
				 */

				$window.print();
				if (sntapp.cordovaLoaded) {
					cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
				};

				$('.nav-bar').removeClass('no-print');
				$('.cards-header').removeClass('no-print');
				$('.card-tabs-nav').removeClass('no-print');

			}, 100);
		}

	}
]);