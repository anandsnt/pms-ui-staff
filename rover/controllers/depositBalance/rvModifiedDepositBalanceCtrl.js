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

	// $scope.$emit("UPDATE_DEPOSIT_BALANCE_FLAG");
	
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
	
	$scope.depositBalanceMakePaymentData = {};
	$scope.depositBalanceMakePaymentData.amount = $scope.depositBalanceData.data.outstanding_stay_total;
	$scope.$on("TOKEN_CREATED", function(e, tokenDetails){
		
		$scope.cardValues = tokenDetails;
		
		console.log("---->>------------TOKEN----------------"+$scope.cardValues.cardDetails.addToGuestCard);
		
		
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
		$scope.depositBalanceMakePaymentData.card_expiry = cardExpiry;
		console.log("----------------TOKEN----------------"+$scope.cardValues.cardDetails.addToGuestCard);
		console.log(JSON.stringify(dataToApiToAddNewCard));
      	$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, dataToApiToAddNewCard, $scope.successSavePayment);
		
		
	});
	
	
	
	
	
	//$scope.depositBalanceData = $scope.
	// var MLISessionId = "";
	// var swipedData = {};
	// var selectedPaymentIdFromList = '';
	//$scope.addCardActive = true;
	// try {
			// HostedForm.setMerchant($rootScope.MLImerchantId);
		// }
	// catch(err) {};
	//$scope.depositBalanceNewCardData = {};
	//$scope.isSwiped = false;
	//$scope.makePaymentData = {};
	
	//$scope.makePaymentButtonActive = false;
	//$scope.setScroller('available_cards', { click:true});
	
	
	/*
	 * Function to handle click on make payment button
	 * If new card is added, then first we need to add the credit card and on success we make the payment
	 * We should handle manual entry of new card, swiped card and select already existing cards
	 */
	// $scope.clickedMakePayment = function(){
// 
// 
		// if($scope.isSwiped){
			// //$scope.handleSwipedData();
// 
			// $scope.savePayment("swiped");
// 
		// } else if($scope.addCardActive){
// 
			// $scope.handleMLISessionId();
		// } else {
// 
			// $scope.savePayment("selectedCard");
		// }
// 
	// };
	/*
	 * Manual entry cards - MLI session integration
	 */
	// $scope.handleMLISessionId = function(){
		// if($scope.depositBalanceNewCardData.cardNumber.length>0){
			// $scope.fetchMLISessionId();
		// }
		// else{
			// // Client side validation added to eliminate a false session being retrieved in case of empty card number
			// $scope.errorMessage = ["There is a problem with your credit card"];
		// }
	// };
	/*
	 * Fetch MLI session Id
	 */
	// $scope.fetchMLISessionId = function(){
		 // var sessionDetails = {};
		 // sessionDetails.cardNumber = $scope.depositBalanceNewCardData.cardNumber;
		 // sessionDetails.cardSecurityCode = $scope.depositBalanceNewCardData.ccv;
		 // sessionDetails.cardExpiryMonth = $scope.depositBalanceNewCardData.expiryMonth;
		 // sessionDetails.cardExpiryYear = $scope.depositBalanceNewCardData.expiryYear;
// 
		 // var callback = function(response){
		 	// $scope.$emit("hideLoader");
// 
		 	// if(response.status ==="ok"){
// 
		 		// MLISessionId = response.session;
		 		// $scope.savePayment('manual');// call save payment details WS
		 	// }
		 	// else{
		 		// $scope.errorMessage = ["There is a problem with your credit card"];
		 	// }
		 	// $scope.$apply();
		 // };
// 
		// try {
		    // HostedForm.updateSession(sessionDetails, callback);
		    // $scope.$emit("showLoader");
		// }
		// catch(err) {
		   // $scope.errorMessage = ["There was a problem connecting to the payment gateway."];
		// };
// 
	// };
	/*
	 * Function to save payment
	 */
//	$scope.savePayment = function(type){
// 
		// if(type === "manual"){
			  // var cardExpiry = ($scope.depositBalanceNewCardData.expiryMonth!=='' && $scope.depositBalanceNewCardData.expiryYear!=='') ? "20"+$scope.depositBalanceNewCardData.expiryYear+"-"+$scope.depositBalanceNewCardData.expiryMonth+"-01" : "";
              // var dataToApiToAddNewCard = {
	              	// "session_id" : MLISessionId,
	              	// "user_id" :$scope.guestCardData.userId,
	              	// "card_expiry": cardExpiry,
	              	// "is_deposit": true,
	              	// "add_to_guest_card": $scope.makePaymentData.addToGuestCard
              // };
              // $scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, dataToApiToAddNewCard, $scope.successSavePayment);
		// } else if(type == "swiped"){
// 
// 
			// var cardExpiry = ($scope.depositBalanceNewCardData.expiryMonth!=='' && $scope.depositBalanceNewCardData.expiryYear!=='') ? "20"+$scope.depositBalanceNewCardData.expiryYear+"-"+$scope.depositBalanceNewCardData.expiryMonth+"-01" : "";
// 
			// var dataToApiToAddNewCard = {
				    // card_expiry: cardExpiry,
				    // name_on_card: $scope.depositBalanceNewCardData.cardHolderName,
				    // payment_type: "CC",
				    // payment_credit_type: swipedData.credit_card,
				    // credit_card: swipedData.credit_card,
					// mli_token: swipedData.token,
				    // et2: swipedData.et2,
					// ksn: swipedData.ksn,
					// pan: swipedData.pan,
					// etb: swipedData.etb,
					// user_id :$scope.guestCardData.userId,
					// is_deposit: true,
					// add_to_guest_card: $scope.makePaymentData.addToGuestCard
			    // };
			// $scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, dataToApiToAddNewCard, $scope.successSavePayment);
		 // } else if(type === "selectedCard"){
		 	// var dataToMakePaymentApi = {
				// "guest_payment_id": selectedPaymentIdFromList,
				// "reservation_id": $scope.reservationData.reservation_card.reservation_id,
				// "amount": $scope.makePaymentData.amount
			// };
// 
		// //	alert(JSON.stringify(dataToMakePaymentApi));
			 // $scope.invokeApi(RVPaymentSrv.makePaymentOnDepositBalance, dataToMakePaymentApi, $scope.successMakePayment);
		 // }
		 // dataToApiToAddNewCard
		 // add_to_guest_card

//	};
	/*
	 * Success callback of save payment.
	 * Do make payment on success
	 */
	$scope.successSavePayment = function(data){
		$scope.shouldShowIframe 	   			 = false;	
		$scope.shouldShowMakePaymentScreen       = true; 
		$scope.showAddtoGuestCard    			 = false;
		$scope.shouldShowExistingCards  		 = false;
		$scope.addmode                 			 = false;
		
		var paymentId = '';
		// if($scope.isSwiped){
			// paymentId = data.id;
		// } else {
			paymentId = data.data.id;
		// }
		//alert("------pay----------"+paymentId)
		//$scope.makePaymentData.amount
		var dataToMakePaymentApi = {
			"guest_payment_id": paymentId,
			"reservation_id": $scope.reservationData.reservation_card.reservation_id,
			"amount": $scope.depositBalanceMakePaymentData.amount
		};

		alert(JSON.stringify(dataToMakePaymentApi));
		 $scope.invokeApi(RVPaymentSrv.makePaymentOnDepositBalance, dataToMakePaymentApi, $scope.successMakePayment);
	};
	/*
	 * To render the values on fields during swipe
	 * Disable fields on swipe
	 */
	// $scope.$on("SHOW_SWIPED_DATA_ON_DEPOSIT_BALANCE_SCREEN", function(event, data){
		// //alert(JSON.stringify(data));
		// swipedData = data;
		// $scope.isSwiped = true;
		// $scope.addCardActive = true;
		// $scope.makePaymentButtonActive = true;
		// $scope.depositBalanceNewCardData.cardNumber  = data.card_number;
		// $scope.depositBalanceNewCardData.expiryMonth = data.card_expiry.slice(-2);;
		// $scope.depositBalanceNewCardData.expiryYear  = data.card_expiry.substring(0, 2);;
		// $scope.depositBalanceNewCardData.cardHolderName  = data.name_on_card;
// 
		// $scope.$emit("hideLoader");
// 
	// });
	/*
	 * Show Add Card Active and show screen
	 */
	// $scope.clickedAddCard = function(){		
		// $scope.addCardActive = true;
		// $scope.isSwiped = false;
		// $scope.makePaymentButtonActive = false;
		// $scope.depositBalanceNewCardData.cardNumber  = "";
		// $scope.depositBalanceNewCardData.expiryMonth = "";
		// $scope.depositBalanceNewCardData.expiryYear  = "";
		// $scope.depositBalanceNewCardData.cardHolderName  = "";
		// angular.forEach($scope.depositBalanceData.data.existing_payments, function(value, key) {
			// value.isSelected = false;
		// });
	// };
	/*
	 * Show existing payments Active and show screen
	 */
	// $scope.clickedShowExistingCard = function(){
// 
		// $scope.refreshScroller('available_cards');
// 
		// $scope.addCardActive = false;
		// $scope.isSwiped = false;
		// $scope.makePaymentButtonActive = false;
		// $scope.depositBalanceNewCardData.cardNumber  = "";
		// $scope.depositBalanceNewCardData.expiryMonth = "";
		// $scope.depositBalanceNewCardData.expiryYear  = "";
		// $scope.depositBalanceNewCardData.cardHolderName  = "";
// 	
	// };
	// $scope.selectPayment = function(paymentId){
		// selectedPaymentIdFromList = paymentId;
		// $scope.isSwiped = false;
		// $scope.makePaymentButtonActive = true;
		// angular.forEach($scope.depositBalanceData.data.existing_payments, function(value, key) {
			// value.isSelected = false;
			// if(value.value === selectedPaymentIdFromList){
				// value.isSelected = true;
			// }
		// });
// 
	// };
	// $scope.showMakePaymentButtonStatus = function(){
		// var buttonClass = "";
		// if($scope.makePaymentButtonActive){
			// buttonClass = "green";
		// } else {
			// buttonClass = "grey";
		// }
		// return buttonClass;
	// };
	// $scope.showMakePaymentButtonActive = function(){
		// //Commenting - CICO-9959
		// // if($scope.depositBalanceNewCardData.cardNumber !== ""){
			// // $scope.makePaymentButtonActive = true;
		// // } else {
			// $scope.makePaymentButtonActive = false;
		// //}
	// };

	$scope.closeDepositModal = function(){
		$scope.isDepositBalanceScreenOpened = false;
		$scope.closeDialog();
	};
	// $scope.successMakePayment = function(){
		// $scope.$emit("hideLoader");
// 		
		// if($scope.reservationData.reservation_card.is_rates_suppressed === "false" || $scope.reservationData.reservation_card.is_rates_suppressed === false){
			// console.log(";;;;;;;;;;;;;");
			// $scope.reservationData.reservation_card.deposit_attributes.outstanding_stay_total = parseInt($scope.reservationData.reservation_card.deposit_attributes.outstanding_stay_total) - parseInt($scope.makePaymentData.amount);
			// $scope.$apply();
		// }
// 		
		// $scope.closeDepositModal();
	// };


}]);