sntRover.controller('RVAccountsTransactionsAddPaymentTypeCtrl',	[
	'$scope',
	'$rootScope','RVPaymentSrv',
	function($scope, $rootScope,RVPaymentSrv) {

		BasePaymentCtrl.call(this, $scope);
		/**
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
		 var runDigestCycle = function() {
		 	if (!$scope.$$phase) {
		 		$scope.$digest();
		 	}
		 };

		 var init = function(){
			//to render data in case of swiped card
			if(!isEmptyObject($scope.passData.details.swipedDataToRenderInScreen)){
				$scope.dataToSave.paymentType = "CC";
				$scope.showCCPage = true;
				$scope.addmode    = true;
			}

		};	
		init();


		var isSixPayment  = false;
		var tokenDetails  = {};
		var cardDetails   = {};




		/**
		 * Retrive data to be displayed in the initial screen 
		 *
		 */
		 var renderScreen = function(){
		 	$scope.showCCPage = false;
		 	$scope.showSelectedCreditCard  = true;
		 	$scope.addmode                 = false;	
			//set variable defined in BasePaymentCtrl
			isSixPayment  = angular.copy($scope.cardData.tokenDetails.isSixPayment);
			tokenDetails  = angular.copy($scope.cardData.tokenDetails);
			cardDetails   = angular.copy($scope.cardData.cardDetails);
			//call utils functions to retrieve data		
			$scope.renderData.creditCardType = (!isSixPayment)?
												getCreditCardType(cardDetails.cardType).toLowerCase() : 
												getSixCreditCardType(tokenDetails.card_type).toLowerCase();
			$scope.renderData.cardExpiry = retrieveCardExpiryDate(isSixPayment,tokenDetails,cardDetails); 
			$scope.renderData.endingWith = retrieveCardNumber(isSixPayment,tokenDetails,cardDetails); 		
		};

		/**
		 *retrieve token from paymnet gateway
		 */
		 $scope.$on("TOKEN_CREATED", function(e, tokenDetails){
		 	$scope.cardData = tokenDetails;
		 	renderScreen();
		 	$scope.isNewCardAdded = true;			
		 	$scope.showInitialScreen  = true; 
		 	runDigestCycle();
		 });

		$scope.$on("MLI_ERROR", function(e,data){
		 	$scope.errorMessage = data;
		});
		$scope.$on('cancelCardSelection',function(e,data){
			$scope.showCCPage = false;
			$scope.dataToSave.paymentType = "";
			$scope.isManual = false;
		});

		/*
		 *	Six payment SWIPE actions
		 */
		var successSixSwipe = function(response){
			$scope.$emit("hideLoader");
			var cardType = getSixCreditCardType(response.card_type).toLowerCase();
			var endingWith = response.ending_with;
			var expiryDate = response.expiry_date.slice(-2)+"/"+response.expiry_date.substring(0, 2);
			$scope.closeDialog();
			//TODO : update bill screen
		
		};

		var sixPaymentSwipe = function(){
			
			var data = {};
			data.account_id = "";
			
			$scope.shouldShowWaiting = true;
			RVPaymentSrv.chipAndPinGetToken(data).then(function(response) {
				$scope.shouldShowWaiting = false;
				successSixSwipe(response);
			},function(error){
				$scope.errorMessage = error;
				$scope.shouldShowWaiting = false;
			});
		};

		/*
		* There are 3 means of add payment a.six payment swipe b.MLI swipe and c.manual (CC and non CC)
		*/
		$scope.addNewPayment = function(){
			if(!$scope.isManual && $rootScope.paymentGateway == "sixpayments" && $scope.dataToSave.paymentType ==='CC'){
				sixPaymentSwipe();
			} else if(!isEmptyObject($scope.passData.details.swipedDataToRenderInScreen)){
				saveDataFromSwipe();
			} else if(typeof $scope.dataToSave !== "undefined"){
				($scope.dataToSave.paymentType ==='CC') ? saveNewCard():saveNewPayment();
			}			   
		};


}]);