sntRover.controller('RVPaymentAddPaymentCtrl',
	['$rootScope', 
	 '$scope', 
	 '$state', 
	 'ngDialog',
	 'RVPaymentSrv', 
	function($rootScope, $scope, $state, ngDialog, RVPaymentSrv){
	BaseCtrl.call(this, $scope);
	$scope.showInitialScreen       = true; 
	$scope.showSelectedCreditCard  = false;
	$scope.addmode                 = true;
	$scope.shouldShowIframe 	   = false;	
	$scope.savePayment = {};
	$scope.showAddtoGuestCard      = true;
	var isNewCardAdded = false;
	$scope.successRender = function(data){
		$scope.$emit("hideLoader");
		$scope.renderData = data;
	};
	$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.successRender);
	$scope.cardsList = [];
	$scope.successPaymentList = function(data){
		$scope.$emit("hideLoader");
		$scope.cardsList = data.existing_payments;
		console.log($scope.cardsList);
		angular.forEach($scope.cardsList, function(value, key) {
			
			value.mli_token = value.ending_with; //For common payment HTML to work - Payment modifications story
			value.card_expiry = value.expiry_date;//Same comment above
		});
	};
	$scope.invokeApi(RVPaymentSrv.getPaymentList, $scope.passData.reservationId, $scope.successPaymentList);
	/*
	 * change payment type action - initial add payment screen
	 */
	$scope.changePaymentType = function(){
		$scope.showCCPage = ($scope.dataToSave.paymentType == "CC") ? true: false;
		$scope.addmode =($scope.dataToSave.paymentType == "CC" &&  $scope.cardsList.length === 0) ? true: false;
		$scope.showInitialScreen       =  ($scope.dataToSave.paymentType == "CC") ? false: true;
	};


	$scope.showCCList = function(){
		$scope.showCCPage =  true;
		$scope.addmode = false;
		$scope.showInitialScreen       = false;
	};


	var retrieveCardtype = function(){
		var cardType = $scope.cardData.tokenDetails.isSixPayment?
					getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase():
					getCreditCardType($scope.cardData.tokenDetails.cardBrand).toLowerCase()
					;
		return cardType;
	};


	var retrieveExpiryDate = function(){
		var expiryDate = $scope.cardData.tokenDetails.isSixPayment?
					$scope.cardData.tokenDetails.expiry_month+" / "+$scope.cardData.tokenDetails.expiry_year:
					$scope.cardData.cardDetails.expiryMonth+" / "+$scope.cardData.cardDetails.expiryYear
					;
		return expiryDate;
	};

	var retrieveCardNumber = function(){
		var cardNumber = $scope.cardData.tokenDetails.isSixPayment?
				$scope.cardData.tokenDetails.token_no.substr($scope.cardData.tokenDetails.token_no.length - 4):
				$scope.cardData.cardDetails.cardNumber.slice(-4);
		return cardNumber;
	};

	var renderScreen = function(){
		$scope.showCCPage = false;
		$scope.showSelectedCreditCard  = true;
		$scope.addmode                 = false;			
		$scope.renderData.creditCardType = retrieveCardtype();
		$scope.renderData.cardExpiry = retrieveExpiryDate();
		$scope.renderData.endingWith = retrieveCardNumber();		
	};
	
	
	$scope.$on("TOKEN_CREATED", function(e, tokenDetails){
		$scope.cardData = tokenDetails;
		console.log($scope.cardData)
		renderScreen();
		isNewCardAdded = true;
		$scope.showInitialScreen       = true; 
		$scope.$digest();
	});


	var creditCardType = '';
	var billIndex = parseInt($scope.passData.fromBill);
	var billNumber = parseInt(billIndex) - parseInt(1);

	/*
	* Save CC success bill screen
	*/
	var billScreenCommonActions = function(data){
		$scope.paymentData.bills[billNumber].credit_card_details.payment_type = $scope.dataToSave.paymentType;
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
	var billScreenCCSaveActions = function(data){		
		$scope.paymentData.bills[billNumber].credit_card_details.card_code = creditCardType.toLowerCase();
		$scope.paymentData.bills[billNumber].credit_card_details.card_number = retrieveCardNumber();
		$scope.paymentData.bills[billNumber].credit_card_details.card_expiry = retrieveExpiryDate();
		billScreenCommonActions(data);
	};

	/*
	* Save CC success staycard screen
	*/

	var saveNewCardSuccess = function(data){
		$scope.paymentData.reservation_card.payment_method_used = $scope.dataToSave.paymentType;
		$scope.paymentData.reservation_card.payment_details.card_type_image = creditCardType.toLowerCase()+".png";
		$scope.paymentData.reservation_card.payment_details.card_number = retrieveCardNumber();
		$scope.paymentData.reservation_card.payment_details.card_expiry = retrieveExpiryDate();	
	};
	var billScreenExistingCCSucess = function(data){
		$scope.paymentData.bills[billNumber].credit_card_details.card_code = $scope.renderData.creditCardType;
		$scope.paymentData.bills[billNumber].credit_card_details.card_number = $scope.renderData.endingWith;
		$scope.paymentData.bills[billNumber].credit_card_details.card_expiry = $scope.renderData.cardExpiry;
		billScreenCommonActions(data);
	};

	var existingCardSuccess = function(data){
		$scope.paymentData.reservation_card.payment_method_used = $scope.dataToSave.paymentType;
		$scope.paymentData.reservation_card.payment_details.card_type_image = $scope.renderData.creditCardType+".png";
		$scope.paymentData.reservation_card.payment_details.card_number = $scope.renderData.endingWith;
		$scope.paymentData.reservation_card.payment_details.card_expiry = $scope.renderData.cardExpiry;
	};

	var addToGuestCard = function(data){
		var cardCode = retrieveCardtype();
		var cardNumber = retrieveCardNumber();
		var cardExpiry = retrieveExpiryDate();
		var dataToGuestList = {
			"card_code": creditCardType,
			"mli_token": cardNumber,
			"card_expiry":cardExpiry,
			"card_name": '',
			"id": data.id,
			"isSelected": true,
			"is_primary":false,
			"payment_type":data.payment_name,
			"payment_type_id": 1
		};
		$scope.cardsList.push(dataToGuestList);
		$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', dataToGuestList);
	};

	var ccSaveSuccess = function(data){
		$scope.$emit("hideLoader");
		if(isNewCardAdded){
			if($scope.savePayment.addToGuest){
				addToGuestCard(data);
			};
			(typeof $scope.passData.fromBill == "undefined")?saveNewCardSuccess(data):billScreenCCSaveActions(data);
		}
		else{
			(typeof $scope.passData.fromBill == "undefined")?existingCardSuccess(data):billScreenExistingCCSucess(data);
		};
		
		$scope.closeDialog();	
	};
	/*
	* Save CC
	*/
	var saveNewCard = function(){
			var data = {
				"reservation_id":	$scope.passData.reservationId
			};
			// var data =  {
							// "add_to_guest_card": $scope.savePayment.addToGuest,
							// "reservation_id": $scope.passData.reservationId
					    // };	

			if(isNewCardAdded){
				creditCardType =
								(!$scope.cardData.tokenDetails.isSixPayment)? 
								getCreditCardType($scope.cardData.tokenDetails.cardBrand):
								getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();
				data.token = 
								(!$scope.cardData.tokenDetails.isSixPayment)?
								$scope.cardData.tokenDetails.session :
								$scope.cardData.tokenDetails.token_no;
				data.add_to_guest_card = $scope.cardData.cardDetails.addToGuestCard;

			}
			else{
				creditCardType = $scope.renderData.creditCardType;
				data.user_payment_type_id = $scope.renderData.value;
			};
			data.payment_type = $scope.dataToSave.paymentType;
			if(typeof $scope.passData.fromBill !== "undefined"){
				data.bill_number = $scope.passData.fromBill;	
			};	
			if(isNewCardAdded){		
				$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, ccSaveSuccess);
			} else {
				$scope.invokeApi(RVPaymentSrv.mapPaymentToReservation, data, ccSaveSuccess);  
				
			}
	};

    var savePaymentSuccess = function(data){
    	$scope.$emit("hideLoader");
    	(typeof $scope.passData.fromBill == "undefined")?
    		$scope.paymentData.reservation_card.payment_method_description = data.payment_type:
    		$scope.paymentData.bills[billNumber].credit_card_details.payment_type_description = data.payment_type;
    	if(typeof $scope.passData.fromBill !== "undefined"){
     		$scope.paymentData.bills[billNumber].credit_card_details.payment_type = $scope.dataToSave.paymentType;
		};
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

		/*
		*  card selection action
		*/
	var setCreditCardFromList = function(index){

		$scope.renderData.creditCardType =  $scope.cardsList[index].card_code.toLowerCase();
		$scope.renderData.cardExpiry = $scope.cardsList[index].card_expiry;
		$scope.renderData.endingWith = $scope.cardsList[index].mli_token;
		$scope.renderData.value = $scope.cardsList[index].value;
		$scope.showCCPage = false;
		$scope.showSelectedCreditCard  = true;
		$scope.addmode                 = false;	
		isNewCardAdded = false;
	};

	$scope.$on('cardSelected',function(e,data){
		$scope.showInitialScreen       = true;
		setCreditCardFromList(data.index);
	});

	$scope.$on('cancelCardSelection',function(e,data){
		$scope.showCCPage = false;
	});

	
}]);