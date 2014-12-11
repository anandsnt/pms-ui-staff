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
	$scope.shouldShowMakePaymentScreen = true;
	$scope.showAddtoGuestCard      = true;
	$scope.shouldCardAvailable     = false;
	$scope.depositBalanceMakePaymentData = {};
	$scope.depositBalanceMakePaymentData.amount = $scope.depositBalanceData.data.outstanding_stay_total;
	$scope.depositBalanceMakePaymentData.add_to_guest_card = false;
	$scope.makePaymentButtonDisabled = true;
	$scope.hideCancelCard = true;
	$scope.isDisplayReference = false;
	$scope.referanceText = "";
	$scope.shouldShowWaiting = false;
	//To show add to guest card checkbox
	$scope.isAddToGuestCardVisible = false;
	$scope.isSwipedCardSave = false;
	$scope.isManual = false;
	 
    
	if($scope.reservationData.reservation_card.payment_method_used == "CC"){
		$scope.shouldCardAvailable 				 = true;
		$scope.depositBalanceMakePaymentData.payment_type = "CC";
		$scope.depositBalanceMakePaymentData.card_code = $scope.reservationData.reservation_card.payment_details.card_type_image.replace(".png", "");
		$scope.depositBalanceMakePaymentData.ending_with = $scope.reservationData.reservation_card.payment_details.card_number;
		$scope.depositBalanceMakePaymentData.card_expiry = $scope.reservationData.reservation_card.payment_details.card_expiry;
	}
	if($rootScope.paymentGateway == "sixpayments"){
    	//initilayy C&P ACTIVE
    	$scope.shouldCardAvailable = false;
    	$scope.makePaymentButtonDisabled = false;
    }
	var checkReferencetextAvailableForCC = function(){
		angular.forEach($scope.depositBalanceData.data.credit_card_types, function(value, key) {
			if($scope.depositBalanceMakePaymentData.card_code.toUpperCase() === value.cardcode){
				$scope.isDisplayReference = (value.is_display_reference)? true:false;
			};					
		});				
	};
	$scope.changePaymentType = function(){
		if($scope.depositBalanceMakePaymentData.payment_type == "CC"){
			// $scope.shouldShowIframe 	   			 = false;	
			$scope.shouldShowMakePaymentScreen       = false; 
			// $scope.showAddtoGuestCard    			 = false;
			// $scope.shouldShowExistingCards  		 = false;
			$scope.shouldShowExistingCards =  ($scope.cardsList.length>0) ? true :false;
			$scope.addmode = ($scope.cardsList.length>0) ? false :true;
			// $scope.makePaymentButtonDisabled         = false;
		} else {
			$scope.shouldShowMakePaymentScreen       = true; 
				$scope.addmode                 			 = false;
				$scope.shouldShowExistingCards = false;
				$scope.shouldCardAvailable 				 = false;
		}
	};
	$scope.changeOnsiteCallIn = function(){
		$scope.shouldShowMakePaymentScreen = ($scope.isManual) ? false:true;
		$scope.shouldShowExistingCards =  ($scope.cardsList.length>0) ? true :false;
		$scope.addmode = ($scope.cardsList.length>0) ? false :true;
		//in case c&p no need to show attached CC
		$scope.shouldCardAvailable 				 = ($scope.shouldShowMakePaymentScreen) ? false: true;
		refreshCardScroll();
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
		          	"card_name" :$scope.cardValues.cardDetails.userName,
		          	"card_expiry": cardExpiry,
		          	"payment_type": "CC"
		   };

		    
		} else {
			
			//To render the selected card data
			$scope.depositBalanceMakePaymentData.card_code = getSixCreditCardType($scope.cardValues.tokenDetails.card_type).toLowerCase();
			 $scope.depositBalanceMakePaymentData.ending_with = $scope.cardValues.tokenDetails.token_no.substr($scope.cardValues.tokenDetails.token_no.length - 4);;
			 
		     var dataToApiToAddNewCard = {
		          	"token" : $scope.cardValues.tokenDetails.token_no,
		          	"card_name" :$scope.passData.details.firstName+" "+$scope.passData.details.lastName,
		          	"card_expiry": cardExpiry,
		          	"payment_type": "CC"
		   };
		}
		
		$scope.depositBalanceMakePaymentData.card_expiry = $scope.cardValues.tokenDetails.isSixPayment?
					$scope.cardValues.tokenDetails.expiry.substring(2, 4)+" / "+$scope.cardValues.tokenDetails.expiry.substring(0, 2):
					$scope.cardValues.cardDetails.expiryMonth+" / "+$scope.cardValues.cardDetails.expiryYear;
      	$scope.invokeApi(RVPaymentSrv.savePaymentDetails, dataToApiToAddNewCard, $scope.successSavePayment);
		
		
	});
	
	$scope.$on("MLI_ERROR", function(e,data){
		$scope.errorMessage = data;
	});

	$scope.feeData = {};
	var zeroAmount = parseFloat("0.00");

	// CICO-11591 : To show or hide fees calculation details.
	$scope.isShowFees = function(){
		var isShowFees = false;
		var feesData = $scope.feeData;
		if(typeof feesData == 'undefined' || typeof feesData.feesInfo == 'undefined' || feesData.feesInfo == null){
			isShowFees = false;
		}
		else if((feesData.defaultAmount  > feesData.minFees) && $scope.isStandAlone && feesData.feesInfo.amount){
			isShowFees = true;
		}
		return isShowFees;
	};

	// CICO-9457 : To calculate fee
	$scope.calculateFee = function(){
		if($scope.isStandAlone){
			
			var feesInfo = $scope.feeData.feesInfo;
			var amountSymbol = "";
			var feePercent  = zeroAmount;
			var minFees = zeroAmount;

			if (typeof feesInfo != 'undefined' && feesInfo != null){
				amountSymbol = feesInfo.amount_symbol;
				feePercent  = feesInfo.amount ? parseFloat(feesInfo.amount) : zeroAmount;
				minFees = feesInfo.minimum_amount_for_fees ? parseFloat(feesInfo.minimum_amount_for_fees) : zeroAmount;
			}

			var totalAmount = ($scope.depositBalanceMakePaymentData.amount == "") ? zeroAmount :
							parseFloat($scope.depositBalanceMakePaymentData.amount);

			$scope.feeData.minFees = minFees;
			$scope.feeData.defaultAmount = totalAmount;

			if($scope.isShowFees()){
				if(amountSymbol == "percent"){
					var calculatedFee = parseFloat(totalAmount * (feePercent/100));
					$scope.feeData.calculatedFee = parseFloat(calculatedFee).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(calculatedFee + totalAmount).toFixed(2);
				}
				else{
					$scope.feeData.calculatedFee = parseFloat(feePercent).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(totalAmount + feePercent).toFixed(2);
				}
			}
		}
	};
	
	// CICO-9457 : Data for fees details.
	$scope.setupFeeData = function(){
		
		var feesInfo = $scope.feeData.feesInfo ? $scope.feeData.feesInfo : {};
		var defaultAmount = $scope.depositBalanceMakePaymentData ?
		 	parseFloat($scope.depositBalanceMakePaymentData.amount) : zeroAmount;
		
		var minFees = feesInfo.minimum_amount_for_fees ? parseFloat(feesInfo.minimum_amount_for_fees) : zeroAmount;
		$scope.feeData.minFees = minFees;
		$scope.feeData.defaultAmount = defaultAmount;

		if($scope.isShowFees()){
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
		}
	};
	
	// CICO-9457 : Data for fees details - standalone only.	
	if($scope.isStandAlone)	{
		$scope.feeData.feesInfo = $scope.depositBalanceData.data.selected_payment_fees_details;
		$scope.setupFeeData();
	}
	// $scope.successChipAndPinToken = function(){
		// alert("hahaha")
	// };
	/*
	 * call make payment API on clicks select payment
	 */
	$scope.clickedMakePayment = function(){


			
			var dataToSrv = {
				"postData": {
					"payment_type": "CC",//FOR NOW - Since there is no drop down to select another payment type
					"amount": $scope.depositBalanceMakePaymentData.amount,
					"payment_type_id": $scope.paymentId,
					"credit_card_type" : $scope.depositBalanceMakePaymentData.card_code.toUpperCase(),
				},
				"reservation_id": $scope.reservationData.reservation_card.reservation_id
			};
			if($scope.isAddToGuestCardVisible){
			  dataToSrv.postData.add_to_guest_card	= $scope.depositBalanceMakePaymentData.add_to_guest_card;
			}
			if($scope.isDisplayReference){
				dataToSrv.postData.reference_text = $scope.referanceText;
			};
			if($scope.isStandAlone){
				if($scope.feeData.calculatedFee)
					dataToSrv.postData.fees_amount = $scope.feeData.calculatedFee;
				if($scope.feeData.feesInfo)
					dataToSrv.postData.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
			}
		
			if($rootScope.paymentGateway == "sixpayments" && !$scope.isManual){
				dataToSrv.postData.is_emv_request = true;
				
				
				
				$scope.shouldShowWaiting = true;

				
				RVPaymentSrv.submitPaymentOnBill(dataToSrv).then(function(response) {
					$scope.shouldShowWaiting = false;
					$scope.closeDialog();
				},function(error){
					$scope.errorMessage = error;
					$scope.shouldShowWaiting = false;
				});
// 				
				// setTimeout(function(){
					// ngDialog.close("firstDialog");
				// }, 3000);
				
				
				
				
			} else {
				$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToSrv, $scope.successMakePayment);
			}
			
		// }


	};
	/*
	 * On saving new card success
	 * show the make payment screen and make payment button active
	 * setting payment id 
	 */
	$scope.successSavePayment = function(data){
		console.log("====="+JSON.stringify(data));
		$scope.$emit("hideLoader");
		$scope.shouldShowIframe 	   			 = false;	
		$scope.shouldShowMakePaymentScreen       = true; 
		$scope.showAddtoGuestCard    			 = false;
		$scope.shouldShowExistingCards  		 = false;
		$scope.addmode                 			 = false;
		$scope.makePaymentButtonDisabled         = false;
		$scope.paymentId = data.id;
		$scope.shouldCardAvailable 				 = true;
		$scope.isAddToGuestCardVisible 			 = true;
		
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
		
		
		if($scope.isAddToGuestCardVisible){
			var cardCode = $scope.depositBalanceMakePaymentData.card_code.toLowerCase();
			var cardNumber = $scope.depositBalanceMakePaymentData.ending_with;
			var cardName = "";
			if($scope.isSwipedCardSave){
				cardName = $scope.swipedCardHolderName;
			} else {
				cardName = ($scope.cardValues.tokenDetails.isSixPayment) ? $scope.passData.details.firstName+" "+$scope.passData.details.lastName: $scope.cardValues.cardDetails.userName;
			}
			
			var dataToGuestList = {
				"card_code": cardCode,
				"mli_token": cardNumber,
				"card_expiry": $scope.depositBalanceMakePaymentData.card_expiry,
				"card_name": cardName,
				"id": $scope.paymentId,
				"isSelected": true,
				"is_primary":false,
				"payment_type":"CC",
				"payment_type_id": 1
			};
			$scope.cardsList.push(dataToGuestList);
			$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', dataToGuestList);
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
		$scope.shouldCardAvailable 				 = true;
		$scope.isAddToGuestCardVisible 			 = false;
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
		//Not good
		$scope.swipedCardHolderName = swipedCardDataToRender.nameOnCard;
	});
	$scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave){
		$scope.depositBalanceMakePaymentData.card_code   = swipedCardDataToSave.cardType.toLowerCase();
		$scope.depositBalanceMakePaymentData.ending_with = swipedCardDataToSave.cardNumber.slice(-4);
		$scope.depositBalanceMakePaymentData.card_expiry  = swipedCardDataToSave.cardExpiryMonth+"/"+swipedCardDataToSave.cardExpiryYear;
 		
		$scope.isSwipedCardSave = true;
		
		var data 			= swipedCardDataToSave;
		data.payment_credit_type = swipedCardDataToSave.cardType;
		data.credit_card = swipedCardDataToSave.cardType;
		data.card_expiry = "20"+swipedCardDataToSave.cardExpiryYear+"-"+swipedCardDataToSave.cardExpiryMonth+"-01";
		
		$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, $scope.successSavePayment);
		
		
	});

}]);