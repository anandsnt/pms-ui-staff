sntRover.controller('RVAccountsTransactionsPaymentCtrl',	[
	'$scope',
	'$rootScope','RVPaymentSrv','ngDialog',
	function($scope, $rootScope,RVPaymentSrv,ngDialog) {

		BasePaymentCtrl.call(this, $scope);
		$scope.renderData = {};
		var isSixPayment  = false;
		var tokenDetails  = {};
		var cardDetails   = {};
		var zeroAmount = parseFloat("0.00");

		/*
		* to check if reference is present for payment type
		*/
		var checkReferencetextAvailable = function(){
			//call utils fn	
			$scope.referenceTextAvailable = checkIfReferencetextAvailable($scope.renderData.paymentTypes,$scope.saveData.paymentType);
		};
		var checkReferencetextAvailableForCC = function(){
			//call utils fn	
			$scope.referenceTextAvailable = checkIfReferencetextAvailableForCC($scope.renderData.paymentTypes,$scope.defaultPaymentTypeCard);
		}

		var init = function(){
			$scope.saveData = {};	
			$scope.renderData = {};
			$scope.errorMessage = '';
			$scope.saveData.payment_type_id = '';
			$scope.newPaymentInfo = {};
			$scope.renderData.billNumberSelected = '';
			$scope.renderData.defaultPaymentAmount = '';
			$scope.defaultRefundAmount = 0;
			//We are passing $scope from bill to this modal
			$scope.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
			$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
			$scope.billsArray = $scope.transactionsDetails.bills;
			//common payment model items
			$scope.passData = {};
			$scope.passData.details = {};							  
			$scope.renderData.referanceText = "";
			$scope.swipedCardDataToSave  = {};
			$scope.cardData = {};
			$scope.newCardAdded = false;
			$scope.shouldShowWaiting = false;
			$scope.depositPaidSuccesFully = false;		
			$scope.saveData.paymentType = '';
			$scope.defaultPaymentTypeOfBill = '';	
		};
		init();


		/*
		 * Show guest credit card list
		 */
		$scope.showCardAddmode = function(){
			$scope.showCCPage = true;	
		};
		

		/**
		 * change payment type action - override parent's method so as to deal with referance and fees
		 */
		$scope.changePaymentType = function(){
			if($scope.saveData.paymentType == "CC"&& $scope.paymentGateway !== 'sixpayments'){
				($scope.isExistPaymentType) ? $scope.showCreditCardInfo = true :$scope.showCardAddmode();		
			} else {
				$scope.showCreditCardInfo = false;
			};
			checkReferencetextAvailable();
		};

   	  /*
	 	* Close dialog and update the parent
	 	*/
		$scope.closeDialog = function(){
			$scope.paymentModalOpened = false;
			$scope.$emit('HANDLE_MODAL_OPENED');
			ngDialog.close();
		};


	  /*
		* Initial screen - filled with deafult amount on bill
		* If any payment type attached to that bill then that credit card can be viewed in initial screen
		* Default payment method attached to that bill can be viewed in initial screen
		*/
		var renderDefaultValues = function(){
			var ccExist = false;
			if($scope.renderData.paymentTypes.length > 0){

				var paymentData = $scope.transactionsDetails.bills[$scope.currentActiveBill].payment_details;
				if(!isEmptyObject(paymentData)){
					$scope.defaultPaymentTypeOfBill = paymentData.payment_type.toUpperCase();
					$scope.saveData.payment_type_id = paymentData.payment_id;
					angular.forEach($scope.renderData.paymentTypes, function(value, key) {
						if(value.name == "CC"){
							ccExist = true;
						}
					});
					$scope.saveData.paymentType = $scope.defaultPaymentTypeOfBill;
					if($scope.defaultPaymentTypeOfBill == 'CC'){
						if(!ccExist){
							$scope.saveData.paymentType = '';
						}
						$scope.isExistPaymentType = true;
						$scope.showCreditCardInfo = true;
						$scope.isfromBill = true;
						$scope.defaultPaymentTypeCard = paymentData.card_code.toLowerCase();
						$scope.defaultPaymentTypeCardNumberEndingWith = paymentData.card_number;
						$scope.defaultPaymentTypeCardExpiry = paymentData.card_expiry;
						if($rootScope.paymentGateway == "sixpayments"){
							$scope.isManual = true;
						}
					}
				}
			   ($scope.defaultPaymentTypeOfBill === "CC") ? checkReferencetextAvailableForCC():checkReferencetextAvailable();
			   
			    var defaultAmount = $scope.billsArray[$scope.currentActiveBill].total_fees.length >0 ?
									$scope.billsArray[$scope.currentActiveBill].total_fees[0].balance_amount : zeroAmount;
				$scope.renderData.defaultPaymentAmount = parseFloat(defaultAmount).toFixed(2);
				$scope.defaultRefundAmount = (-1)*parseFloat($scope.renderData.defaultPaymentAmount);
				$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
			};

		};
		/*
		* Action - On bill selection 
		*/
		$scope.billNumberChanged = function(){
			$scope.currentActiveBill = parseInt($scope.renderData.billNumberSelected) - parseInt(1);
			renderDefaultValues();
		};


	  /*
		* Retrive data to be displayed in the payment screen - payment types and credit card types
		*
		*/

		var fetchPaymentMethods = function(directBillNeeded){
			
			var onPaymnentFetchSuccess = function(data) {
				$scope.renderData.paymentTypes =  data; 
				$scope.creditCardTypes = [];
				angular.forEach($scope.renderData.paymentTypes, function(item, key) {
					if(item.name === 'CC'){
						$scope.creditCardTypes = item.values;
					};					
				});	
				renderDefaultValues();
			},
			onPaymnentFetchFailure = function(errorMessage) {
				$scope.errorMessage = errorMessage;
			};
			$scope.callAPI(RVPaymentSrv.renderPaymentScreen, {
				successCallBack: onPaymnentFetchSuccess,
				failureCallBack: onPaymnentFetchFailure,
				params: {
					direct_bill: false
				}
			});
		};
		fetchPaymentMethods();

		/*
		 * Success call back of save new card
		 */
		 var successNewPayment = function(data){

		 	$scope.$emit("hideLoader");

		 	var cardType = retrieveCardtype(isSixPayment,tokenDetails,cardDetails);		
		 	var cardNumberEndingWith = retrieveCardNumber(isSixPayment,tokenDetails,cardDetails);	
		 	var cardExpiry = retrieveCardExpiryDate(isSixPayment,tokenDetails,cardDetails);	

		 	$scope.defaultPaymentTypeCard = cardType;
		 	$scope.defaultPaymentTypeCardNumberEndingWith = cardNumberEndingWith;
		 	$scope.defaultPaymentTypeCardExpiry = cardExpiry;


		 	checkReferencetextAvailableForCC();


		 	$scope.saveData.payment_type_id = data.id;
		 	$scope.showCCPage = false;
		 	$scope.showCreditCardInfo = true;
		 	$scope.newCardAdded = true;
		 };

		/*
		 * To save new card
		 */
		 var savePayment = function(data){

			isSixPayment  = angular.copy($scope.newPaymentInfo.tokenDetails.isSixPayment);
			tokenDetails  = angular.copy($scope.newPaymentInfo.tokenDetails);
			cardDetails   = angular.copy($scope.newPaymentInfo.cardDetails);

			var cardToken   = !isSixPayment ? tokenDetails.session:data.tokenDetails.token_no;	
			var expiryMonth = isSixPayment ? tokenDetails.expiry.substring(2, 4) :cardDetails.expiryMonth;
			var expiryYear  = isSixPayment ? tokenDetails.expiry.substring(0, 2) :cardDetails.expiryYear;
			var expiryDate  = (expiryMonth && expiryYear )? ("20"+expiryYear+"-"+expiryMonth+"-01"):"";
			var cardCode = 	isSixPayment?
							getSixCreditCardType(tokenDetails.card_type).toLowerCase():
							cardDetails.cardType;


			$scope.callAPI(RVPaymentSrv.savePaymentDetails, {
				successCallBack: successNewPayment,
				params: {
					"card_expiry": expiryDate,
					"name_on_card": $scope.newPaymentInfo.cardDetails.userName,
					"payment_type": "CC",
					"token": cardToken,
					"card_code": cardCode
				}
			});
		};

		/**
		 * retrieve token from paymnet gateway - from cards ctrl
		 */
		$scope.$on("TOKEN_CREATED", function(e, data){
		 	$scope.newPaymentInfo = data;
		 	$scope.showCCPage = false;
		 	setTimeout(function(){
		 		savePayment(data);
		 	}, 200);
		 	runDigestCycle();
		 });

		/**
		 * MLI error - from cards ctrl
		 */
		$scope.$on("MLI_ERROR", function(e,data){
		 	$scope.errorMessage = data;
		});

		/**
		 * card selection cancelled - from cards ctrl
		 */
		$scope.$on('cancelCardSelection',function(e,data){
			$scope.showCCPage = false;
			$scope.isManual = false;
			$scope.saveData.paymentType = "";
		});

		/*
		* Success call back of MLI swipe - from cards ctrl
		*/
		$scope.$on("SHOW_SWIPED_DATA_ON_PAY_SCREEN", function(e, swipedCardDataToRender){
			//set variables to display the add mode
			$scope.showCCPage 						 = true;
			$scope.addmode                 			 = true;
			$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
		});


		/*
		* Success call back of success payment
		*/
		var successPayment = function(data){
			$scope.$emit("hideLoader");
			$scope.depositPaidSuccesFully = true;
			$scope.authorizedCode = data.authorization_code;		
			//$scope.handleCloseDialog();
			//To refresh the view bill screen 
			// data.billNumber = $scope.renderData.billNumberSelected;
			$scope.$emit('PAYMENT_SUCCESS',data);
			
		};


		/*
		* Action - On click submit payment button
		*/
		$scope.submitPayment = function(){		
				
				$scope.errorMessage = "";
				var dataToSrv = {
				};
		
				if($rootScope.paymentGateway == "sixpayments" && !$scope.isManual && $scope.saveData.paymentType == "CC"){
					dataToSrv.postData.is_emv_request = true;
					$scope.shouldShowWaiting = true;
					//Six payment SWIPE actions
					RVPaymentSrv.submitPaymentOnBill(dataToSrv).then(function(response) {
						$scope.shouldShowWaiting = false;
						successPayment(response);
					},function(error){
						$scope.errorMessage = error;
						$scope.shouldShowWaiting = false;
					});
					
				} else {
					$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToSrv, successPayment);
				}		

		};



}]);