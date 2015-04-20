sntRover.controller('RVTransactionsAddPaymentCtrl',	[
	'$scope',
	'$rootScope',
	function($scope, $rootScope) {


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

			$scope.isFromAccounts = true;
			$scope.shouldShowWaiting = false;
			$scope.addmode         = true;
			$scope.savePayment     = {};
			$scope.isNewCardAdded  = false;
			$scope.isManual        = false;
			$scope.dataToSave      = {};
			$scope.showCCPage	   = false;
			$scope.cardsList       = [];//guess no need to show existing cards
			$scope.errorMessage    = "";

		};	
		init();

		/*
		 * change payment type action - initial add payment screen
		 */
		$scope.changePaymentType = function(){

			if($scope.paymentGateway !== 'sixpayments'){
				$scope.showCCPage = ($scope.dataToSave.paymentType == "CC") ? true: false;
				$scope.addmode = true;
				// $scope.addmode =($scope.dataToSave.paymentType == "CC" &&  $scope.cardsList.length === 0) ? true: false;
				// $scope.showInitialScreen = ($scope.dataToSave.paymentType == "CC") ? false: true;
				refreshCardsList();
			}else{
				$scope.isNewCardAdded = ($scope.dataToSave.paymentType == "CC" && !$scope.isManual) ? true : false;
				return;
			};
		};

		var renderScreen = function(){
			$scope.showCCPage = false;
			$scope.showSelectedCreditCard  = true;
			$scope.addmode                 = false;	
			var isSixPayment  = angular.copy($scope.cardData.tokenDetails.isSixPayment);
			var tokenDetails  = angular.copy($scope.cardData.tokenDetails);
			var cardDetails   = angular.copy($scope.cardData.cardDetails)
			//call utils functions to retrieve data		
			$scope.renderData.creditCardType = (!isSixPayment)?
											getCreditCardType(cardDetails.cardType).toLowerCase() : 
											getSixCreditCardType(tokenDetails.card_type).toLowerCase();
			$scope.renderData.cardExpiry = retrieveCardExpiryDate(isSixPayment,tokenDetails,cardDetails); 
			$scope.renderData.endingWith = retrieveCardNumber(isSixPayment,tokenDetails,cardDetails); 		
		};

		//retrieve token from paymnet gateway
		$scope.$on("TOKEN_CREATED", function(e, tokenDetails){
			$scope.cardData = tokenDetails;
			renderScreen();
			$scope.isNewCardAdded = true;			
			$scope.showInitialScreen       = true; 
			runDigestCycle();
		});

		$scope.$on("MLI_ERROR", function(e,data){
			$scope.errorMessage = data;
		});

}]);