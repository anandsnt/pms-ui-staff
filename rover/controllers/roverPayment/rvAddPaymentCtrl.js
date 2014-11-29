sntRover.controller('RVPaymentAddPaymentCtrl',
	['$rootScope', 
	 '$scope', 
	 '$state', 
	 'ngDialog',
	 'RVPaymentSrv', 
	function($rootScope, $scope, $state, ngDialog, RVPaymentSrv){

   //save/select card actions
        // +-----------------+-------------------------------+
        // |                      save                       |
        // |                       +                         |
        // |                       |                         |
        // |          add new  <---+----> existing cc        |
        // |            +                                    |
        // |            |                                    |
        // |     CC <---+--->Other                           |
        // |												 |	
         // +-------------------------------------------------+
       


	BaseCtrl.call(this, $scope);
	$scope.addmode                 = true;
	$scope.savePayment = {};
	$scope.isFromGuestCard = (typeof $scope.passData.isFromGuestCard !== "undefined" && $scope.passData.isFromGuestCard) ? true:false;
	var isNewCardAdded = false;
	$scope.dataToSave = {};
	if(!isEmptyObject($scope.passData.details.swipedDataToRenderInScreen)){
		$scope.dataToSave.paymentType = "CC";
		$scope.showCCPage 			  = true;
		$scope.addmode                = true;	
		$scope.showAddtoGuestCard = ($scope.passData.details.swipedDataToRenderInScreen.swipeFrom == "guestCard") ? false : true;
	}

	$scope.successRender = function(data){
		$scope.$emit("hideLoader");
		$scope.renderData = data;
	};
	$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.successRender);

	$scope.cardsList = [];

	$scope.successPaymentList = function(data){
		$scope.$emit("hideLoader");
		//for accompany guest dont show existing cards for add payment type in bill screen CICO-9719
		$scope.hasAccompanyguest = data.has_accompanying_guests && (typeof $scope.passData.fromBill !== "undefined");
		
		if($scope.hasAccompanyguest){
			$scope.cardsList = [];
		}
		else{
			//To remove non cc payments
			angular.forEach(data.existing_payments, function(obj, index){
				if (obj.is_credit_card) {
		 		 	$scope.cardsList.push(obj);
				};
			});
		};
		
		angular.forEach($scope.cardsList, function(value, key) {
			
			value.mli_token = value.ending_with; //For common payment HTML to work - Payment modifications story
			value.card_expiry = value.expiry_date;//Same comment above
		});

		$scope.addmode = $scope.cardsList.length > 0 ? false:true;
	};
	//NO need to show existing cards in guest card model
	if(!$scope.isFromGuestCard){
		$scope.invokeApi(RVPaymentSrv.getPaymentList, $scope.passData.reservationId, $scope.successPaymentList);
	}
	else{		
		$scope.showAddtoGuestCard = false;
	};
	
	/*
	 * change payment type action - initial add payment screen
	 */
	$scope.changePaymentType = function(){
		$scope.showCCPage = ($scope.dataToSave.paymentType == "CC") ? true: false;
		$scope.addmode =($scope.dataToSave.paymentType == "CC" &&  $scope.cardsList.length === 0) ? true: false;
		$scope.showInitialScreen = ($scope.dataToSave.paymentType == "CC") ? false: true;
	};


	$scope.showCCList = function(){
		$scope.showCCPage =  true;
		$scope.addmode = false;
	};

    //retrieve card type based on paymnet gateway
	var retrieveCardtype = function(){
		var cardType = $scope.cardData.tokenDetails.isSixPayment?
					getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase():
					getCreditCardType($scope.cardData.tokenDetails.cardBrand).toLowerCase()
					;
		return cardType;
	};

	//retrieve card expiry based on paymnet gateway
	var retrieveExpiryDate = function(){

		var expiryDate = $scope.cardData.tokenDetails.isSixPayment?
					$scope.cardData.tokenDetails.expiry.substring(2, 4)+" / "+$scope.cardData.tokenDetails.expiry.substring(0, 2):
					$scope.cardData.cardDetails.expiryMonth+" / "+$scope.cardData.cardDetails.expiryYear
					;
		return expiryDate;
	};

	//retrieve card number based on paymnet gateway
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
	
	//retrieve token from paymnet gateway
	$scope.$on("TOKEN_CREATED", function(e, tokenDetails){
		$scope.cardData = tokenDetails;
		renderScreen();
		isNewCardAdded = true;
		$scope.showInitialScreen       = true; 
		$scope.$digest();
	});

	$scope.$on("MLI_ERROR", function(e,data){
		$scope.errorMessage = data;
	});


	var creditCardType = '';
	var billIndex = parseInt($scope.passData.fromBill);
	var billNumber = parseInt(billIndex) - parseInt(1);

	/*
	* Save CC and other common actions in bill screen
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

	/*
	* Save CC success in  bill screen
	*/
	var billScreenCCSaveActions = function(data){		
		$scope.paymentData.bills[billNumber].credit_card_details.card_code = creditCardType.toLowerCase();
		$scope.paymentData.bills[billNumber].credit_card_details.card_number = retrieveCardNumber();
		$scope.paymentData.bills[billNumber].credit_card_details.card_expiry = retrieveExpiryDate();
		billScreenCommonActions(data);
	};

	/*
	* Save other type success in bill screen
	*/

	var billScreenExistingCCSucess = function(data){
		$scope.paymentData.bills[billNumber].credit_card_details.card_code = $scope.renderData.creditCardType;
		$scope.paymentData.bills[billNumber].credit_card_details.card_number = $scope.renderData.endingWith;
		$scope.paymentData.bills[billNumber].credit_card_details.card_expiry = $scope.renderData.cardExpiry;
		billScreenCommonActions(data);
	};

	/*
	* Save CC success in staycard screen
	*/

	var saveNewCardSuccess = function(data){
		$scope.paymentData.reservation_card.payment_method_used = $scope.dataToSave.paymentType;
		$scope.paymentData.reservation_card.payment_details.card_type_image = creditCardType.toLowerCase()+".png";
		$scope.paymentData.reservation_card.payment_details.card_number = retrieveCardNumber();
		$scope.paymentData.reservation_card.payment_details.card_expiry = retrieveExpiryDate();	
	};
	
	/*
	* update CC success in staycard screen
	*/

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

	var saveCCToGuestCardSuccess = function(data){
	    $scope.$emit("hideLoader");
	    addToGuestCard(data);
		$scope.closeDialog();	
	};

	var saveToGuestCardSuccess = function(data){
		$scope.$emit("hideLoader");
		$scope.closeDialog();
		var dataToGuestList = {};
		if(isNewCardAdded){
			dataToGuestList = {
				"id": data.id,
				"isSelected": true,
				"is_primary":false,
				"payment_type":data.payment_name,
				"card_code": $scope.renderData.creditCardType.toLowerCase()
			};
		}
		else{
			dataToGuestList = {
				"id": data.id,
				"isSelected": true,
				"is_primary":false,
				"payment_type":data.payment_name
			};
		};
		
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

	var nonCCStayCardSuccess = function(data){
		$scope.$emit("hideLoader");
		$scope.paymentData.reservation_card.payment_method_used = $scope.dataToSave.paymentType;
		
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
			if($scope.isFromGuestCard){
				data.add_to_guest_card = true;
				data.card_code =  retrieveCardtype();
				data.user_id = $scope.passData.guest_id;
				data.card_expiry = 	$scope.cardData.tokenDetails.isSixPayment ?'' :
				($scope.cardData.cardDetails.expiryMonth && $scope.cardData.cardDetails.expiryYear ? "20" + $scope.cardData.cardDetails.expiryYear + "-" + $scope.cardData.cardDetails.expiryMonth + "-01" : "");
				$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, data,saveCCToGuestCardSuccess);
			}
			else{
				if(isNewCardAdded){	
					data.card_expiry = 	$scope.cardData.tokenDetails.isSixPayment ?'' :
						($scope.cardData.cardDetails.expiryMonth && $scope.cardData.cardDetails.expiryYear ? "20" + $scope.cardData.cardDetails.expiryYear + "-" + $scope.cardData.cardDetails.expiryMonth + "-01" : "");	
					$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, ccSaveSuccess);
				} else {
					$scope.invokeApi(RVPaymentSrv.mapPaymentToReservation, data, nonCCStayCardSuccess);  
					
				};
			};
			
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

		if($scope.isFromGuestCard){
			data.add_to_guest_card = true;
			data.user_id = $scope.passData.guest_id;
			$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, data,saveToGuestCardSuccess);
		}
		else{	
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data,savePaymentSuccess);
		};
	};

	
	$scope.addNewPayment = function(){
		if(!isEmptyObject($scope.passData.details.swipedDataToRenderInScreen)){
			saveDataFromSwipe();
		} else if(typeof $scope.dataToSave !== "undefined")
		   ($scope.dataToSave.paymentType ==='CC') ? saveNewCard():saveNewPayment();
	};
	var saveDataFromSwipe = function(){
		var data 			= $scope.swipedCardDataToSave;
		data.reservation_id =	$scope.passData.reservationId;
		
		data.payment_credit_type = $scope.swipedCardDataToSave.cardType;
		data.credit_card = $scope.swipedCardDataToSave.cardType;
		data.card_expiry = "20"+$scope.swipedCardDataToSave.cardExpiryYear+"-"+$scope.swipedCardDataToSave.cardExpiryMonth+"-01";
		//alert(JSON.stringify(data));
		if($scope.passData.details.isClickedCheckin != undefined && $scope.passData.details.isClickedCheckin){
			//savePaymentSuccess();
		} else if($scope.passData.details.swipedDataToRenderInScreen.swipeFrom == "guestCard")
		{
			data.user_id = $scope.passData.userId;
			$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, data, saveToGuestCardSuccess);
		} else {
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successSwipePayment);
		}
		
	};
	var successSwipePayment = function(data){
		$scope.$emit("hideLoader");
		if($scope.passData.fromBill == undefined){
			$scope.paymentData.reservation_card.payment_method_used = "CC";
			$scope.paymentData.reservation_card.payment_details.card_type_image = $scope.swipedCardDataToSave.cardType.toLowerCase()+".png";
			$scope.paymentData.reservation_card.payment_details.card_number = $scope.swipedCardDataToSave.cardNumber.slice(-4);
			$scope.paymentData.reservation_card.payment_details.card_expiry = $scope.swipedCardDataToSave.cardExpiryMonth+"/"+$scope.swipedCardDataToSave.cardExpiryYear;	
		} else {
			$scope.paymentData.bills[billNumber].credit_card_details.card_code = $scope.swipedCardDataToSave.cardType.toLowerCase();
			$scope.paymentData.bills[billNumber].credit_card_details.card_number = $scope.swipedCardDataToSave.cardNumber.slice(-4);
			$scope.paymentData.bills[billNumber].credit_card_details.card_expiry = $scope.swipedCardDataToSave.cardExpiryMonth+"/"+$scope.swipedCardDataToSave.cardExpiryYear;
		}
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
	$scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave){
		$scope.swipedCardDataToSave = swipedCardDataToSave;
		$scope.dataToSave.paymentType = "CC";
		$scope.showCCPage = false;
		$scope.showSelectedCreditCard  = true;
		$scope.addmode                 = false;	
		$scope.renderData.creditCardType = swipedCardDataToSave.cardType.toLowerCase();
		$scope.renderData.cardExpiry = swipedCardDataToSave.cardExpiryMonth+"/"+swipedCardDataToSave.cardExpiryYear;
		$scope.renderData.endingWith = swipedCardDataToSave.cardNumber.slice(-4);
	});

	$scope.$on('cancelCardSelection',function(e,data){
		$scope.showCCPage = false;
		$scope.dataToSave.paymentType = "";
	});

	
}]);