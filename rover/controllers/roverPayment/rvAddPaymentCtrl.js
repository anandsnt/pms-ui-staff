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
			$scope.shouldShowAddNewCard    = true;
			$scope.showInitialScreen       = false; 
		} else {
			$scope.shouldShowAddNewCard    = false;
			$scope.showInitialScreen       = true; 
		}
	};
	
	
	$scope.$on("TOKEN_CREATED", function(e, tokenDetails){
		console.log(tokenDetails);
		$scope.cardDetails = tokenDetails;
		
	});
	$scope.saveNewCard = function(){
		
		if(!$scope.cardDetails.tokenDetails.isSixPayment){
			console.log("++++++++++++++++++");
			console.log($scope.cardDetails);
			var creditCardType = getCreditCardType($scope.cardDetails.tokenDetails.cardBrand);
			var data = {
				"add_to_guest_card": $scope.savePayment.addToGuest,
				"token": $scope.cardDetails.tokenDetails.session,
				"reservation_id": $scope.passData.reservationId,
				"credit_card": creditCardType,
				"payment_type": $scope.dataToSave.paymentType
			};
		}
		
		$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data);
	};
	
	
	
}]);