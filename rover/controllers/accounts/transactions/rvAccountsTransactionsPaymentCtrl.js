sntRover.controller('RVAccountsTransactionsPaymentCtrl',	[
	'$scope',
	'$rootScope','RVPaymentSrv','ngDialog',
	function($scope, $rootScope,RVPaymentSrv,ngDialog) {

		BasePaymentCtrl.call(this, $scope);
		$scope.renderData = {};
		var isSixPayment  = false;
		var tokenDetails  = {};
		var cardDetails   = {};

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
			
			$scope.defaultPaymentTypeOfBill = "CC";
			$scope.saveData.paymentType  = "CC";
			if($scope.defaultPaymentTypeOfBill === "CC"){
				$scope.showCreditCardInfo = true;
				

				//to delete and add actual
				$scope.defaultPaymentTypeCard = "MA";
				$scope.defaultPaymentTypeCardNumberEndingWith = "5556";
		 		$scope.defaultPaymentTypeCardExpiry = "22/12";

		 		///
		 		checkReferencetextAvailableForCC();

			}
			else{
				checkReferencetextAvailable();

				$scope.defaultPaymentTypeCard = "";
				$scope.defaultPaymentTypeCardNumberEndingWith = "";
		 		$scope.defaultPaymentTypeCardExpiry = "";
			}
			
		};


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
		* Retrive data to be displayed in the payment screen - payment types and credit card types
		*
		*/

		var fetchPaymentMethods = function(directBillNeeded){
			
			var onPaymnentFetchSuccess = function(data) {
				$scope.renderData.paymentTypes =  data; 
				init();
				$scope.creditCardTypes = [];
				angular.forEach($scope.renderData.paymentTypes, function(item, key) {
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