sntRover.controller('rvAccountTransactionsCtrl', ['$scope', '$rootScope', '$filter', '$stateParams','ngDialog', 'rvAccountsConfigurationSrv', 'RVReservationSummarySrv', 'rvAccountTransactionsSrv','RVChargeItems','RVPaymentSrv',
	function($scope, $rootScope, $filter, $stateParams,ngDialog, rvAccountsConfigurationSrv, RVReservationSummarySrv, rvAccountTransactionsSrv,RVChargeItems,RVPaymentSrv) {
		BaseCtrl.call(this, $scope);
		
		var initAccountTransactionsView = function(){

			console.log("init accoutn transactions");
			getTransactionDetails();
			$scope.renderData =  {}; //payment modal data - naming so as to reuse HTML
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

		$scope.addPaymentMethod = function(){
		   
	 		$scope.passData = getPassData();
	 		fetchPaymentMethods("directBillNeeded"); 

		    ngDialog.open({
		        template: '/assets/partials/roverPayment/rvAddPayment.html',
		        controller: 'RVTransactionsAddPaymentCtrl',
		        scope: $scope
		    });
		};



		$scope.showPayemntModal = function(){
			$scope.passData = getPassData();
		 	ngDialog.open({
	              template: '/assets/partials/accounts/transactions/rvAccountPaymentModal.html',
	              className: '',
	              controller: 'RVTransactionsPaymentCtrl',
	              closeByDocument: false,
	              scope: $scope
	          });
		};

	}
]);