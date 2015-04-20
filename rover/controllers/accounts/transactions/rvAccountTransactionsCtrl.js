sntRover.controller('rvAccountTransactionsCtrl', ['$scope', '$rootScope', '$filter', '$stateParams','ngDialog', 'rvAccountsConfigurationSrv', 'RVReservationSummarySrv', 'rvAccountTransactionsSrv','RVChargeItems','RVPaymentSrv','RVReservationCardSrv',
	function($scope, $rootScope, $filter, $stateParams,ngDialog, rvAccountsConfigurationSrv, RVReservationSummarySrv, rvAccountTransactionsSrv,RVChargeItems,RVPaymentSrv,RVReservationCardSrv) {
		BaseCtrl.call(this, $scope);
		
		var initAccountTransactionsView = function(){

			console.log("init accoutn transactions");
			getTransactionDetails();
			$scope.renderData =  {}; //payment modal data - naming so as to reuse HTML
			//TODO: Fetch accoutn transactions
			$scope.paymentModalOpened = false;

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

		var addPaymentMethod = function(passData){
		   
	 		$scope.passData = passData;
	 		fetchPaymentMethods("directBillNeeded"); 

		    ngDialog.open({
		        template: '/assets/partials/roverPayment/rvAddPayment.html',
		        controller: 'RVAccountsTransactionsAddPaymentTypeCtrl',
		        scope: $scope
		    });
		};


		$scope.openAddPaymentPopup = function(){
		    var passData = getPassData();
			addPaymentMethod(passData);
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
	 *	SWIPE actions
	 */
		var processSwipedData = function(swipedCardData){

	 			//Current active bill is index - adding 1 to get billnumber
	 			var billNumber = "1";
	 			var passData = getPassData();
  	 			var swipeOperationObj = new SwipeOperation();
				var swipedCardDataToRender = swipeOperationObj.createSWipedDataToRender(swipedCardData);
				passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
				if(swipedCardDataToRender.swipeFrom !== "payButton" && swipedCardDataToRender.swipeFrom !== 'billingInfo'){
					addPaymentMethod(passData);					
				} else if(swipedCardDataToRender.swipeFrom === "payButton") {
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

	}
]);