sntRover.controller('rvAccountTransactionsCtrl', ['$scope', '$rootScope', '$filter', '$stateParams', 'rvAccountsConfigurationSrv', 'RVReservationSummarySrv', 'rvAccountTransactionsSrv',
	function($scope, $rootScope, $filter, $stateParams, rvAccountsConfigurationSrv, RVReservationSummarySrv, rvAccountTransactionsSrv) {
		BaseCtrl.call(this, $scope);
		
		var initAccountTransactionsView = function(){

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
		/*$scope.accountSummaryData = {
			promptMandatoryDemographics: false,
			isDemographicsPopupOpen: false,
			newNote: "",
			demographics: null			
		}*/


		/*var initAccountSummaryView = function() {
			// Have a handler to update the summary - IFF in edit mode
			if (!$scope.isInAddMode()) {
				$scope.$on("OUTSIDECLICKED", function(event, targetElement) {
					if (!angular.equals(summaryMemento, $scope.accountConfigData.summary) && !$scope.accountSummaryData.isDemographicsPopupOpen) {
						//data has changed
						summaryMemento = angular.copy($scope.accountConfigData.summary);
						//call the updateGroupSummary method from the parent controller
						$scope.updateAccountSummary();
					}
				});
			}
		}*/

		

		initAccountTransactionsView();
	}
]);