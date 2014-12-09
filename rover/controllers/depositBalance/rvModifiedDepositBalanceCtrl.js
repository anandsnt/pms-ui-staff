sntRover.controller('RVDepositBalanceCtrl',[
					'$scope',
					'ngDialog',
					'$rootScope',
					'RVDepositBalanceSrv',
					'RVPaymentSrv',
					'$stateParams',
		function($scope,
				ngDialog,
				$rootScope,
				RVDepositBalanceSrv,
				RVPaymentSrv,
				$stateParams){
					
	BaseCtrl.call(this, $scope);

	$scope.$emit("UPDATE_DEPOSIT_BALANCE_FLAG", true);
	//console.log($scope.depositBalanceData.data.existing_payments)
	angular.forEach($scope.depositBalanceData.data.existing_payments, function(value, key) {
		value.isSelected = false;
		value.mli_token = value.ending_with; //For common payment HTML to work - Payment modifications story
		value.card_expiry = value.expiry_date;//Same comment above
	});
	
	
	$scope.shouldShowExistingCards = true;
	$scope.shouldShowAddNewCard   = true;
	$scope.showExistingAndAddNewPayments = true;
	$scope.showOnlyAddCard = false;
	$scope.cardsList = $scope.depositBalanceData.data.existing_payments;
	$scope.addmode = ($scope.cardsList.length>0) ? false :true;
	$scope.shouldShowMakePaymentScreen = false;
	$scope.showAddtoGuestCard      = true;
	$scope.shouldCardAvailable     = false;
	$scope.depositBalanceMakePaymentData = {};
	$scope.depositBalanceMakePaymentData.amount = $scope.depositBalanceData.data.outstanding_stay_total;
	$scope.makePaymentButtonDisabled = true;
	$scope.hideCancelCard = true;
	$scope.isDisplayReference = false;
	$scope.referanceText = "";


	var checkReferencetextAvailableForCC = function(){
		angular.forEach($scope.depositBalanceData.data.credit_card_types, function(value, key) {
			if($scope.depositBalanceMakePaymentData.card_code.toUpperCase() === value.cardcode){
				$scope.isDisplayReference = (value.is_display_reference)? true:false;
			};					
		});				
	};

	/*
	 * on succesfully created the token
	 */
	$scope.$on("TOKEN_CREATED", function(e, tokenDetails){
		
		$scope.cardValues = tokenDetails;
		
	    var cardExpiry = ($scope.cardValues.cardDetails.expiryMonth!=='' && $scope.cardValues.cardDetails.expiryYear!=='') ? "20"+$scope.cardValues.cardDetails.expiryYear+"-"+$scope.cardValues.cardDetails.expiryMonth+"-01" : "";
	    if(!$scope.cardValues.tokenDetails.isSixPayment){
	    	//To render the selected card data 
	    	$scope.depositBalanceMakePaymentData.card_code = getCreditCardType($scope.cardValues.tokenDetails.cardBrand).toLowerCase();
	    	checkReferencetextAvailableForCC();
	    	$scope.depositBalanceMakePaymentData.ending_with = $scope.cardValues.cardDetails.cardNumber.substr($scope.cardValues.cardDetails.cardNumber.length - 4);;
		    var dataToApiToAddNewCard = {
		          	"token" : $scope.cardValues.tokenDetails.session,
		          	"user_id" :$scope.guestCardData.userId,
		          	"card_expiry": cardExpiry,
		          	"is_deposit": true,
		          	"add_to_guest_card": $scope.cardValues.cardDetails.addToGuestCard,
		    };
		} else {
			
			//To render the selected card data
			$scope.depositBalanceMakePaymentData.card_code = getSixCreditCardType($scope.cardValues.tokenDetails.card_type).toLowerCase();
			 $scope.depositBalanceMakePaymentData.ending_with = $scope.cardValues.tokenDetails.token_no.substr($scope.cardValues.tokenDetails.token_no.length - 4);;
			 var dataToApiToAddNewCard = {
		          	"token" : $scope.cardValues.tokenDetails.token_no,
		          	"user_id" :$scope.guestCardData.userId,
		          	"card_expiry": cardExpiry,
		          	"is_deposit": true,
		          	"add_to_guest_card": $scope.cardValues.cardDetails.addToGuestCard,
		          
		    };
		}
		$scope.depositBalanceMakePaymentData.card_expiry = $scope.cardValues.tokenDetails.isSixPayment?
					$scope.cardValues.tokenDetails.expiry.substring(2, 4)+" / "+$scope.cardValues.tokenDetails.expiry.substring(0, 2):
					$scope.cardValues.cardDetails.expiryMonth+" / "+$scope.cardValues.cardDetails.expiryYear;
      	$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, dataToApiToAddNewCard, $scope.successSavePayment);
		
		
	});
	
	$scope.$on("MLI_ERROR", function(e,data){
		$scope.errorMessage = data;
	});

	$scope.feeData = {};
	var zeroAmount = parseFloat("0.00");
	
	// CICO-9457 : To calculate fee
	$scope.calculateFee = function(){
		if($scope.isStandAlone){
			
			var feesInfo = $scope.feeData.feesInfo;
			var amountSymbol = "";
			if(typeof feesInfo != 'undefined' && feesInfo!= null) amountSymbol = feesInfo.amount_symbol;

			var totalAmount = ($scope.depositBalanceMakePaymentData.amount == "") ? zeroAmount :
							parseFloat($scope.depositBalanceMakePaymentData.amount);
			var feePercent  = parseFloat($scope.feeData.actualFees);

			if(amountSymbol == "percent"){
				var calculatedFee = parseFloat(totalAmount * (feePercent/100));
				$scope.feeData.calculatedFee = parseFloat(calculatedFee).toFixed(2);
				$scope.feeData.totalOfValueAndFee = parseFloat(calculatedFee + totalAmount).toFixed(2);
			}
			else{
				$scope.feeData.totalOfValueAndFee = parseFloat(totalAmount + feePercent).toFixed(2);
			}
		}
	};

	// CICO-9457 : Data for fees details.
	$scope.setupFeeData = function(){
		
		var feesInfo = $scope.feeData.feesInfo ? $scope.feeData.feesInfo : {};
		var defaultAmount = $scope.depositBalanceMakePaymentData ?
		 	parseFloat($scope.depositBalanceMakePaymentData.amount) : zeroAmount;
		
		if(typeof feesInfo.amount != 'undefined' && feesInfo!= null){
			
			var amountSymbol = feesInfo.amount_symbol;
			var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount) : zeroAmount;
			$scope.feeData.actualFees = feesAmount;
			
			if(amountSymbol == "percent") $scope.calculateFee();
			else{
				$scope.feeData.calculatedFee = parseFloat(feesAmount).toFixed(2);
				$scope.feeData.totalOfValueAndFee = parseFloat(feesAmount + defaultAmount).toFixed(2);
			}
		}
	};
	
	// CICO-9457 : Data for fees details - standalone only.	
	if($scope.isStandAlone)	{
		$scope.feeData.feesInfo = $scope.depositBalanceData.data.selected_payment_fees_details;
		$scope.setupFeeData();
	}

	/*
	 * call make payment API on clicks select payment
	 */
	$scope.clickedMakePayment = function(){


		// var dataToMakePaymentApi = {
			// "guest_payment_id": $scope.paymentId,
			// "reservation_id": $scope.reservationData.reservation_card.reservation_id,
			// "amount": $scope.depositBalanceMakePaymentData.amount
		// };
		var dataToSrv = {
			"postData": {
				"payment_type": "CC",//FOR NOW - Since there is no drop down to select another payment type
				"amount": $scope.depositBalanceMakePaymentData.amount,
				"payment_type_id": $scope.paymentId,
				"credit_card_type" : $scope.depositBalanceMakePaymentData.card_code.toUpperCase()
			},
			"reservation_id": $scope.reservationData.reservation_card.reservation_id
		};
		if($scope.isDisplayReference){
			dataToSrv.postData.reference_text = $scope.referanceText;
		};
		if($scope.isStandAlone){
			if($scope.feeData.calculatedFee)
				dataToSrv.postData.fees_amount = $scope.feeData.calculatedFee;
			if($scope.feeData.feesInfo)
				dataToSrv.postData.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
		}
		//alert(JSON.stringify(dataToMakePaymentApi));
		$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToSrv, $scope.successMakePayment);

	};
	/*
	 * On saving new card success
	 * show the make payment screen and make payment button active
	 * setting payment id 
	 */
	$scope.successSavePayment = function(data){
		$scope.$emit("hideLoader");
		$scope.shouldShowIframe 	   			 = false;	
		$scope.shouldShowMakePaymentScreen       = true; 
		$scope.showAddtoGuestCard    			 = false;
		$scope.shouldShowExistingCards  		 = false;
		$scope.addmode                 			 = false;
		$scope.makePaymentButtonDisabled         = false;
		$scope.paymentId = data.id;
		$scope.shouldCardAvailable 				 = true;
		if($scope.cardValues.cardDetails.addToGuestCard){
			var cardCode = $scope.depositBalanceMakePaymentData.card_code.toLowerCase();
			var cardNumber = $scope.depositBalanceMakePaymentData.ending_with;
			var dataToGuestList = {
				"card_code": cardCode,
				"mli_token": cardNumber,
				"card_expiry": $scope.depositBalanceMakePaymentData.card_expiry,
				"card_name": $scope.cardValues.cardDetails.userName,
				"id": data.id,
				"isSelected": true,
				"is_primary":false,
				"payment_type":"CC",
				"payment_type_id": 1
			};
			$scope.cardsList.push(dataToGuestList);
			$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', dataToGuestList);
		}
	
		
	};
	/*
	 * class based on the make payment button status
	 */
	$scope.showMakePaymentButtonStatus = function(){
		var buttonClass = "";
		if($scope.makePaymentButtonDisabled){
			buttonClass = "grey";
		} else {
			buttonClass = "green";
		}
		return buttonClass;
	};


	$scope.closeDepositModal = function(){
		$scope.$emit("UPDATE_DEPOSIT_BALANCE_FLAG", false);
		$scope.closeDialog();
	};
	/*
	 * Make payment button success
	 * Update balance data in staycard
	 * closing the modal
	 */
	$scope.successMakePayment = function(){
		$scope.$emit("hideLoader");
		
		if($scope.reservationData.reservation_card.is_rates_suppressed === "false" || $scope.reservationData.reservation_card.is_rates_suppressed === false){
			$scope.reservationData.reservation_card.deposit_attributes.outstanding_stay_total = parseInt($scope.reservationData.reservation_card.deposit_attributes.outstanding_stay_total) - parseInt($scope.depositBalanceMakePaymentData.amount);
			$scope.$apply();
		}
		
		$scope.closeDepositModal();
	};
	
	/*
	 * Show the selected cards list in make payment screen
	 */
	$scope.setCreditCardFromList = function(index){
		$scope.shouldShowIframe 	   			 = false;	
		$scope.shouldShowMakePaymentScreen       = true; 
		$scope.showAddtoGuestCard    			 = false;
		$scope.shouldShowExistingCards  		 = false;
		$scope.addmode                 			 = false;
		$scope.makePaymentButtonDisabled         = false;
	
		$scope.paymentId = $scope.depositBalanceData.data.existing_payments[index].value;
		
		$scope.depositBalanceMakePaymentData.card_code = $scope.depositBalanceData.data.existing_payments[index].card_code;
		$scope.depositBalanceMakePaymentData.ending_with  = $scope.depositBalanceData.data.existing_payments[index].ending_with;
		$scope.depositBalanceMakePaymentData.card_expiry = $scope.depositBalanceData.data.existing_payments[index].card_expiry;
		checkReferencetextAvailableForCC();
		
		if($scope.isStandAlone){
			// Setup fees info
			$scope.feeData.feesInfo = dclone($scope.depositBalanceData.data.existing_payments[index].fees_information,[]);;
			$scope.setupFeeData();
		}
	};

	/*
	 * Card selected from centralized controler 
	 */
	$scope.$on('cardSelected',function(e,data){
		$scope.shouldCardAvailable 				 = true;
		$scope.setCreditCardFromList(data.index);
	});
	
	$scope.showAddCardSection = function(){
		$scope.shouldShowIframe 	   			 = false;	
		$scope.shouldShowMakePaymentScreen       = false; 
		$scope.showAddtoGuestCard    			 = false;
		$scope.shouldShowExistingCards  		 = true;
		$scope.addmode                 			 = false;
		$scope.makePaymentButtonDisabled         = false;
	};
	$scope.$on('cancelCardSelection',function(e,data){
		$scope.shouldShowMakePaymentScreen       = true; 
		//$scope.shouldShowExistingCards  		 = false;
		$scope.addmode                 			 = false;
	});
	
	$scope.$on("SHOW_SWIPED_DATA_ON_DEPOSIT_BALANCE_SCREEN", function(e, swipedCardDataToRender){
		$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
	});
	$scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave){
		$scope.depositBalanceMakePaymentData.card_code   = swipedCardDataToSave.cardType.toLowerCase();
		$scope.depositBalanceMakePaymentData.ending_with = swipedCardDataToSave.cardNumber.slice(-4);
		$scope.depositBalanceMakePaymentData.card_expiry  = swipedCardDataToSave.cardExpiryMonth+"/"+swipedCardDataToSave.cardExpiryYear;
		var data 			= swipedCardDataToSave;
		data.reservation_id =	$scope.reservationData.reservation_card.reservation_id;
		
		data.payment_credit_type = swipedCardDataToSave.cardType;
		data.credit_card = swipedCardDataToSave.cardType;
		
		data.user_id = $scope.guestCardData.userId;
		$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, data, $scope.successSavePayment);
		
		//$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, dataToApiToAddNewCard, $scope.successSavePayment);
		
		
	});

}]);