sntRover.controller('rvAccountTransactionsCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'rvAccountsConfigurationSrv', 'RVReservationSummarySrv', 'rvAccountTransactionsSrv',
	function($scope, $rootScope, $filter, $stateParams, rvAccountsConfigurationSrv, RVReservationSummarySrv, rvAccountTransactionsSrv) {
		BaseCtrl.call(this, $scope);
		
		var initAccountTransactionsView = function(){
			//Scope variable to set active bill
			$scope.currentActiveBill = 0;
			$scope.dayRates = -1;
			console.log("init accoutn transactions");
			getTransactionDetails();
			//TODO: Fetch accoutn transactions

		}

		var getTransactionDetails = function(){

			var onTransactionFetchSuccess = function(data){

				console.log("successCallBack");
				$scope.$emit('hideloader');
				$scope.transactionsDetails = data;
				$scope.setScroller ('transaction-bill-tab-scroller', {scrollX: true});
				$scope.setScroller('billDays', {scrollX: true});
				$scope.setScroller('registration-content');


			}
			$scope.callAPI(rvAccountTransactionsSrv.fetchTransactionDetails, {
				successCallBack: onTransactionFetchSuccess,
				params: {}
			});
		}

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
		

		/* TODO : verify unwanted params
		 * Remove class hidden for day rates
		 * @param {int} index of calender days
		 * @param {string} clickedDate
		 * @param {string} checkoutDate
		 */
		$scope.showDayRates = function(dayIndex, clickedDate){
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

		/*$state
		 * Show Addons
		 * @param {int} addon index
		 */
		$scope.showAddons = function(addonIndex){
			$scope.showAddonIndex = ($scope.showAddonIndex != addonIndex)?addonIndex:-1;
			$scope.dayRates = -1;
			$scope.showGroupItemIndex = -1;
			$scope.calculateHeightAndRefreshScroll();
		};

		// Refresh registration-content scroller.
		$scope.calculateHeightAndRefreshScroll = function() {
			$timeout(function(){
				$scope.refreshScroller('registration-content');
			}, 500);
		};
		//TODO: verify the commented code
		$scope.getDaysClass = function(index, dayDate, businessDate){
			var dayClass = "";
			//TODO: y?
			if(index!=0){
				dayClass = "hidden";
			}
			/*if(dayDate == checkinDate){
				dayClass = "check-in active";
			} */
			//if(dayDate != checkoutDate){
				if(dayDate <= businessDate){
					dayClass = "active";
				}
			//}
			/*if(dayDate == checkoutDate && dayDate != checkinDate){
				if(reservationBillData.bills[$scope.currentActiveBill]){
					if(reservationBillData.bills[$scope.currentActiveBill].addons != undefined && reservationBillData.bills[$scope.currentActiveBill].addons.length >0){
						dayClass = "check-out last";
					} else {
						dayClass = "check-out";
					}
				}
			}*/
			return dayClass;
		};

		

		initAccountTransactionsView();
	}
]);