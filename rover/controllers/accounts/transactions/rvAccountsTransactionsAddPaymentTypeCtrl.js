sntRover.controller('RVAccountsTransactionsAddPaymentTypeCtrl',	[
	'$scope',
	'$rootScope',
	function($scope, $rootScope) {

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


}]);