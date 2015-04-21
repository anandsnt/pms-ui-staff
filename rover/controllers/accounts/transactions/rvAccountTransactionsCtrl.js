sntRover.controller('rvAccountTransactionsCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'ngDialog', 'rvAccountsConfigurationSrv', 'RVReservationSummarySrv', 'rvAccountTransactionsSrv', 'RVChargeItems', 'RVBillCardSrv', '$timeout', '$window',
	function($scope, $rootScope, $filter, $stateParams, ngDialog, rvAccountsConfigurationSrv, RVReservationSummarySrv, rvAccountTransactionsSrv, RVChargeItems, RVBillCardSrv, $timeout, $window) {
		BaseCtrl.call(this, $scope);

		var initAccountTransactionsView = function() {
			//Scope variable to set active bill
			$scope.currentActiveBill = 0;
			$scope.dayRates = -1;
			$scope.setScroller('registration-content');

			console.log("init accoutn transactions");
			getTransactionDetails();
			//TODO: Fetch accoutn transactions

		}

		var getTransactionDetails = function() {

			var onTransactionFetchSuccess = function(data) {

				console.log("successCallBack");
				$scope.$emit('hideloader');
				$scope.transactionsDetails = data;
				$scope.setScroller('transaction-bill-tab-scroller', {
					scrollX: true
				});
				$scope.setScroller('billDays', {
					scrollX: true
				});
				$scope.refreshScroller('registration-content');



			}
			$scope.callAPI(rvAccountTransactionsSrv.fetchTransactionDetails, {
				successCallBack: onTransactionFetchSuccess,
				params: {}
			});
		}

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


		/* TODO : verify unwanted params
		 * Remove class hidden for day rates
		 * @param {int} index of calender days
		 * @param {string} clickedDate
		 * @param {string} checkoutDate
		 */
		$scope.showDayRates = function(dayIndex, clickedDate) {
			//In this condition show the last clicked days item
			//OR if checkout date clicked first do not show anything
			//TODO: verify with krishobh

			/*if(clickedDate == checkoutDate){
				if(numberOfNights == 0){
					$scope.dayRates = dayIndex;
				} else {
					$scope.dayRates = $scope.dayRates;
				}

			} else if($scope.dayRates != dayIndex) {
				$scope.dayRates = dayIndex;

			}else{
				$scope.dayRates = -1;
			}*/
			$scope.showAddonIndex = -1;
			$scope.showGroupItemIndex = -1;
			$scope.calculateHeightAndRefreshScroll();

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
			/*$scope.showActiveBillFeesDetails = billIndex;
			$scope.calculateHeightAndRefreshScroll();*/
		};

		/*$state
		 * Show Addons
		 * @param {int} addon index
		 */
		$scope.showAddons = function(addonIndex) {
			$scope.showAddonIndex = ($scope.showAddonIndex != addonIndex) ? addonIndex : -1;
			$scope.dayRates = -1;
			$scope.showGroupItemIndex = -1;
			$scope.calculateHeightAndRefreshScroll();
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

			// translating this logic as such from old Rover
			// api post param 'fetch_total_balance' must be 'false' when posted from 'staycard'
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



		/*------------- edit/remove/split starts here --------------*/

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