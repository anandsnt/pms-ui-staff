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
	console.log("---------------------------------++**********-----"+$scope.passData.fromBill);
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
			$scope.renderData.creditCardType = getCreditCardType($scope.cardData.tokenDetails.cardBrand).toLowerCase();
			$scope.renderData.cardExpiry = $scope.cardData.cardDetails.expiryMonth+" / "+$scope.cardData.cardDetails.expiryYear;
			$scope.renderData.endingWith = $scope.cardData.cardDetails.cardNumber.substr($scope.cardData.cardDetails.cardNumber.length - 4);
		} else {
			
			$scope.renderData.creditCardType = getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();
			$scope.renderData.cardExpiry = $scope.cardData.tokenDetails.expiry_month+" / "+$scope.cardData.tokenDetails.expiry_year;
			$scope.renderData.endingWith = $scope.cardData.tokenDetails.token_no.substr($scope.cardData.tokenDetails.token_no.length - 4);
		}
		$scope.$digest();
	});


	var creditCardType = '';
	var billIndex = parseInt($scope.passData.fromBill);
	var billNumber = parseInt(billIndex) - parseInt(1);
	/*
	* Save CC success bill screen
	*/
	var billScreenCCSaveActions = function(data){
		

		$scope.paymentData.bills[billNumber].credit_card_details.payment_type = $scope.dataToSave.paymentType;
		$scope.paymentData.bills[billNumber].credit_card_details.card_code = creditCardType.toLowerCase();

		if(!$scope.cardData.tokenDetails.isSixPayment){
			$scope.paymentData.bills[billNumber].credit_card_details.card_number = $scope.cardData.cardDetails.cardNumber.substr($scope.cardData.cardDetails.cardNumber.length - 4);
			$scope.paymentData.bills[billNumber].credit_card_details.card_expiry = $scope.cardData.cardDetails.expiryMonth+" / "+$scope.cardData.cardDetails.expiryYear;
		} else {
			$scope.paymentData.bills[billNumber].credit_card_details.card_number = $scope.cardData.tokenDetails.token_no.substr($scope.cardData.tokenDetails.token_no.length - 4);
			$scope.paymentData.bills[billNumber].credit_card_details.card_expiry = $scope.cardData.tokenDetails.expiry_month+" / "+$scope.cardData.tokenDetails.expiry_year;;
		};
		var dataToUpdate = {
			"balance": data.reservation_balance,
			"confirm_no" : $scope.paymentData.confirm_no 
		};
		// CICO-9739 : To update on reservation card payment section while updating from bill#1 credit card type.
		if(billNumber == 0){
			$rootScope.$emit('UPDATEDPAYMENTLIST', $scope.paymentData.bills[billNumber].credit_card_details );
		};
		$rootScope.$broadcast('BALANCECHANGED', dataToUpdate);	
	};

	/*
	* Save CC success staycard screen
	*/

	var saveNewCardSuccess = function(data){
		$scope.paymentData.reservation_card.payment_method_used = $scope.dataToSave.paymentType;
		//$scope.paymentData.reservation_card.payment_method_description = data.payment_type;
		$scope.paymentData.reservation_card.payment_details.card_type_image = creditCardType.toLowerCase()+".png";
		if(!$scope.cardData.tokenDetails.isSixPayment){
			$scope.paymentData.reservation_card.payment_details.card_number = $scope.cardData.cardDetails.cardNumber.substr($scope.cardData.cardDetails.cardNumber.length - 4);
			$scope.paymentData.reservation_card.payment_details.card_expiry = $scope.cardData.cardDetails.expiryMonth+" / "+$scope.cardData.cardDetails.expiryYear;
		} else {
			$scope.paymentData.reservation_card.payment_details.card_number = $scope.cardData.tokenDetails.token_no.substr($scope.cardData.tokenDetails.token_no.length - 4);
			$scope.paymentData.reservation_card.payment_details.card_expiry = $scope.cardData.tokenDetails.expiry_month+" / "+$scope.cardData.tokenDetails.expiry_year;;
		};		
	};

	var ccSaveSuccess = function(data){
		$scope.$emit("hideLoader");
		(typeof $scope.passData.fromBill == "undefined")?saveNewCardSuccess(data):billScreenCCSaveActions(data);
		$scope.closeDialog();	
	};
	/*
	* Save CC
	*/
	var saveNewCard = function(){
			console.log($scope.cardDetails);
			var data =  {
							"add_to_guest_card": $scope.savePayment.addToGuest,
							"reservation_id": $scope.passData.reservationId
					    };
			
			if(!$scope.cardData.tokenDetails.isSixPayment){
				creditCardType = getCreditCardType($scope.cardData.tokenDetails.cardBrand);
				 data.token = $scope.cardData.tokenDetails.session;
			} else {
				creditCardType = getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();
				data.token = $scope.cardData.tokenDetails.token_no;
			};	

			if(typeof $scope.passData.fromBill == "undefined"){
				data.bill_number = $scope.passData.fromBill;	
			};			
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, ccSaveSuccess);
	};

    var savePaymentSuccess = function(data){
    	$scope.$emit("hideLoader");
    	(typeof $scope.passData.fromBill == "undefined")?
    		$scope.paymentData.reservation_card.payment_method_description = data.payment_type:
    		$scope.paymentData.bills[billNumber].credit_card_details.payment_type_description = data.payment_type;
    	$scope.closeDialog();
    };
    /*
    * save non CC
    */
	var saveNewPayment = function(){
		var data =  {};
		data = {
				"add_to_guest_card": $scope.savePayment.addToGuest,
				"reservation_id": $scope.passData.reservationId,
				"payment_type": $scope.dataToSave.paymentType
			   };
		if($scope.passData.fromBill){
			data.bill_number = $scope.passData.fromBill;	
		};				
		$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data,savePaymentSuccess);
	};

	
	$scope.addNewPayment = function(){
		($scope.dataToSave.paymentType ==='CC') ? saveNewCard():saveNewPayment();
	};
	
}]);