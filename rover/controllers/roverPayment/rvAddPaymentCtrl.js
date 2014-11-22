sntRover.controller('RVPaymentAddPaymentCtrl',
	['$rootScope', 
	 '$scope', 
	 '$state', 
	 'ngDialog',
	 'RVPaymentSrv', 
	function($rootScope, $scope, $state, ngDialog, RVPaymentSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.shouldShowExistingCards = false;
	$scope.shouldShowAddNewCard    = false;
	$scope.showInitialScreen       = true; 
	$scope.showSelectedCreditCard  = false;
	$scope.addmode                 = true;
	$scope.savePayment = {};
	console.log($scope);
	$scope.successRender = function(data){
		$scope.$emit("hideLoader");
		$scope.renderData = data;
		//console.log(JSON.stringify($scope.renderData));
	};
	$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.successRender);
	/*
	 * change payment type action - initial add payment screen
	 */
	$scope.changePaymentType = function(){
		if($scope.dataToSave.paymentType == "CC"){
			$scope.addmode                 = true;
			$scope.shouldShowAddNewCard    = true;
			$scope.showInitialScreen       = false; 
			$scope.showSelectedCreditCard  = false;
		} else {
			$scope.addmode                 = false;
			$scope.shouldShowAddNewCard    = false;
			$scope.showInitialScreen       = true; 
		}
	};
	
	
	$scope.$on("TOKEN_CREATED", function(e, tokenDetails){
		console.log("----------------TOKEN----------------");
		console.log(tokenDetails)
		$scope.cardData = tokenDetails;
		$scope.showInitialScreen       = true; 
		$scope.shouldShowAddNewCard    = false;
		$scope.showSelectedCreditCard  = true;
		$scope.addmode                 = false;
		if(!$scope.cardData.tokenDetails.isSixPayment){
			console.log("MLI")
			$scope.renderData.creditCardType = getCreditCardType($scope.cardData.tokenDetails.cardBrand).toLowerCase();
			$scope.renderData.cardExpiry = $scope.cardData.cardDetails.expiryMonth+" / "+$scope.cardData.cardDetails.expiryYear;
			$scope.renderData.endingWith = $scope.cardData.cardDetails.cardNumber.substr($scope.cardData.cardDetails.cardNumber.length - 4);
		} else {
			console.log("IFRAME==")
			
			$scope.renderData.creditCardType = getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();
			$scope.renderData.cardExpiry = $scope.cardData.tokenDetails.expiry_month+" / "+$scope.cardData.tokenDetails.expiry_year;
			$scope.renderData.endingWith = $scope.cardData.tokenDetails.token_no.substr($scope.cardData.tokenDetails.token_no.length - 4);
		}
		$scope.$digest();
	});
	$scope.saveNewCard = function(){
		
			console.log($scope.cardDetails);
			var creditCardType = '';
			if(!$scope.cardData.tokenDetails.isSixPayment){
				creditCardType = getCreditCardType($scope.cardData.tokenDetails.cardBrand);
				var data = {
					"add_to_guest_card": $scope.savePayment.addToGuest,
					"token": $scope.cardData.tokenDetails.session,
					"reservation_id": $scope.passData.reservationId,
					//"credit_card": creditCardType,
					//"payment_type": $scope.dataToSave.paymentType
				};
			} else {
				creditCardType = getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();
				var data = {
					"add_to_guest_card": $scope.savePayment.addToGuest,
					"token": $scope.cardData.tokenDetails.token_no,
					"reservation_id": $scope.passData.reservationId,
					//"credit_card": creditCardType,
					//"payment_type": $scope.dataToSave.paymentType
				};
			}
			
	
		$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data);
	};
	
	
	
}]);