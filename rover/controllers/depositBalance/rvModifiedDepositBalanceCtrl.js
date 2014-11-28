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
	
	$scope.addmode = true;
	$scope.shouldShowExistingCards = true;
	$scope.shouldShowAddNewCard   = true;
	$scope.showExistingAndAddNewPayments = true;
	$scope.showOnlyAddCard = false;
	$scope.cardsList = $scope.depositBalanceData.data.existing_payments;
	$scope.shouldShowMakePaymentScreen = false;
	$scope.showAddtoGuestCard      = true;
	$scope.shouldCardAvailable     = false;
	$scope.depositBalanceMakePaymentData = {};
	$scope.depositBalanceMakePaymentData.amount = $scope.depositBalanceData.data.outstanding_stay_total;
	$scope.makePaymentButtonDisabled = true;

	/*
	 * on succesfully created the token
	 */
	$scope.$on("TOKEN_CREATED", function(e, tokenDetails){
		
		$scope.cardValues = tokenDetails;
		
	    var cardExpiry = ($scope.cardValues.cardDetails.expiryMonth!=='' && $scope.cardValues.cardDetails.expiryYear!=='') ? "20"+$scope.cardValues.cardDetails.expiryYear+"-"+$scope.cardValues.cardDetails.expiryMonth+"-01" : "";
	    if(!$scope.cardValues.tokenDetails.isSixPayment){
	    	//To render the selected card data 
	    	$scope.depositBalanceMakePaymentData.card_code = getCreditCardType($scope.cardValues.tokenDetails.cardBrand).toLowerCase();
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
	
	// CICO-9457 : To calculate fee
	$scope.calculateFee = function(){
		if($scope.isStandAlone){
			
			var feesInfo = $scope.feeData.feesInfo;
			var amountSymbol = "";
			var zeroAmount = parseFloat("0.00").toFixed(2);
			if(typeof feesInfo != 'undefined' && feesInfo!= null) amountSymbol = feesInfo.amount_symbol;

			var totalAmount = ($scope.depositBalanceMakePaymentData.amount == "") ? zeroAmount :
							parseFloat($scope.depositBalanceMakePaymentData.amount);
			var feePercent  = parseFloat($scope.feeData.actualFees);

			if($scope.isStandAlone && amountSymbol == "%"){
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
		$scope.feeData = {};
		$scope.feeData.feesInfo = $scope.depositBalanceData.data.selected_payment_fees_details;
		var feesInfo = $scope.feeData.feesInfo;
		var zeroAmount = parseFloat("0.00").toFixed(2);
		var defaultAmount = $scope.depositBalanceMakePaymentData ?
		 	$scope.depositBalanceMakePaymentData.amount : zeroAmount;
		console.log("feesInfo :");console.log(feesInfo);
		if(typeof feesInfo != 'undefined' && feesInfo!= null){
			
			var amountSymbol = feesInfo.amount_symbol;
			var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount).toFixed(2) : zeroAmount;
			$scope.feeData.actualFees = feesAmount;
			
			if(amountSymbol == "%") $scope.calculateFee();
			else{
				$scope.feeData.calculatedFee = feesAmount;
				$scope.feeData.totalOfValueAndFee = parseFloat(parseFloat(feesAmount) + parseFloat(defaultAmount)).toFixed(2);
			}
		}
		else{
			$scope.feeData.actualFees = zeroAmount;
			$scope.feeData.calculatedFee = zeroAmount;
			$scope.feeData.totalOfValueAndFee = zeroAmount;
		}
	};
	// CICO-9457 : Data for fees details - standalone only.	
	if($scope.isStandAlone)	$scope.setupFeeData();

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
		if($scope.isStandAlone){
			if($scope.feeData.calculatedFee)
				dataToSrv.postData.fees_amount = $scope.feeData.calculatedFee;
			if($scope.feeData.feesInfo)
				dataToSrv.postData.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
		}
		console.log(dataToSrv);
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
		console.log("card clicked from deposit");
		$scope.feeData.feesInfo = dclone($scope.depositBalanceData.data.existing_payments[index].fees_information,[]);
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

}]);