sntRover.controller('RVPaymentMethodCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog', 'RVGuestCardSrv', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog, RVGuestCardSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.saveData = {};
	$scope.guestPaymentList = {};
	$scope.saveData.add_to_guest_card = false;
	$scope.do_not_cc_auth = false;
	$scope.isLoading = true;
	//Set merchant ID for MLI integration
	var MLISessionId = "";
	
	try {
			HostedForm.setMerchant($rootScope.MLImerchantId);
		}
		catch(err) {};

	$scope.saveData.selected_payment_type = "null";//Only for swipe

	$scope.paymentTypeValues = "";
	$scope.saveData.card_number  = "";
	$scope.saveData.credit_card  =  "";
	$scope.saveData.name_on_card =  "";
	$scope.saveData.card_expiry_month = "";
	$scope.saveData.card_expiry_year = "";	
	$scope.shouldShowDisabled = false;
	

	$scope.successMessage = "";
	//To show/hide payment amount
	$scope.showPaymentAmount = false;
	$scope.showCreditCardDetails = true;
	
	$scope.isFromGuestCard = false;
	if($scope.passData.fromView == "guestcard"){
		$scope.isFromGuestCard = true;
	}
	
	// var scrollerOptions = {click: true, preventDefault: false, preventDefaultException:{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ }};
	// $scope.setScroller('addPayment', scrollerOptions);
	// //$scope.refreshScroll();
// 
	// $scope.refreshScroll = function(){
		// setTimeout(function() {
			// $scope.refreshScroller('addPayment');
		// }, 500);
	// };

	
	/*
	 * Render success callback
	 * Populates API with dropdown values
	 */

	$scope.errorRender = function(data){
		$scope.$emit("hideLoader");
		MLISessionId = "";
		$scope.errorMessage = data;
	};
	$scope.successRender = function(data){
		
		MLISessionId = "";
		$scope.data = data;
		
		$scope.shouldShowManualEntryDisabled = $rootScope.isManualCCEntryDisabled;
		if($scope.passData.is_swiped){
			$scope.shouldShowManualEntryDisabled = false;
			
			var selectedPaymentType = 0;
			angular.forEach($scope.data, function(value, key) {
				if(value.name == 'CC'){
					selectedPaymentType = key; 
				}
			});
			$scope.saveData.selected_payment_type = selectedPaymentType;//Only for swipe
			$scope.paymentTypeValues = $scope.data[selectedPaymentType].values;
			$scope.saveData.card_number  = $scope.passData.card_number;
			$scope.saveData.credit_card  =  $scope.passData.credit_card;
			$scope.saveData.name_on_card =  $scope.passData.name_on_card;
			$scope.saveData.card_expiry_month = $scope.passData.card_expiry.slice(-2);
			$scope.saveData.card_expiry_year = $scope.passData.card_expiry.substring(0, 2);
			//To show fields disabled on swipe
			$scope.shouldShowDisabled = true;
			
		}
		$scope.isLoading = false;
		$scope.$emit("hideLoader");
		

		$scope.paymentTypeList = data;

		$scope.paymentTypeValues = [];

		//Same popup is used to do the payment - View bill screen pay button
		if($scope.passData.fromView == "paybutton"){
			$scope.renderPayButtonDefaultValues();
		} else {
			$scope.showPaymentAmount = false;
		}
		if(!$rootScope.isStandAlone){
			$scope.saveData.selected_payment_type = 0;//CICO-9959
			$scope.renderPaymentValues();
		}
	};
	$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.successRender,$scope.errorRender);
	$scope.guestPaymentListSuccess = function(data){
		$scope.$emit("hideLoader");
		$scope.guestPaymentList = data;
	};
	/*
	 * If the current bill has any payment attached show details populated
	 */
	$scope.renderPayButtonDefaultValues = function(){
		if($scope.passData.fromView == "paybutton"){
	 		$scope.selected_bill = $scope.passData.fromBill;
			$scope.showPaymentAmount = true;
			var billIndex = parseInt($scope.passData.fromBill) - parseInt(1);
			$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.guestInformationsToPaymentModal.user_id, $scope.guestPaymentListSuccess);
			angular.forEach($scope.paymentTypeList, function(value, key) {
				if(value.name == $scope.paymentData.bills[billIndex].credit_card_details.payment_type){
					$scope.saveData.selected_payment_type = key; 
				}
			});
		
			$scope.billsArray = $scope.paymentData.bills;
			if($scope.paymentData.bills[billIndex].credit_card_details.payment_type !== "CC"){//NOT Credit card only show amount and window
				$scope.showCreditCardDetails = false;
				
			} else {
				$scope.showCreditCardDetails = true;
				$scope.paymentTypeValues = $scope.paymentTypeList[$scope.saveData.selected_payment_type].values;
				$scope.saveData.credit_card = $scope.paymentData.bills[billIndex].credit_card_details.card_code.toUpperCase();
				$scope.saveData.card_number = "xxxx-xxxx-xxxx-"+$scope.paymentData.bills[billIndex].credit_card_details.card_number;
				$scope.saveData.card_expiry_year = $scope.paymentData.bills[billIndex].credit_card_details.card_expiry.slice(-2);
				$scope.saveData.card_expiry_month = $scope.paymentData.bills[billIndex].credit_card_details.card_expiry.substring(0, 2);
				$scope.saveData.name_on_card = $scope.paymentData.bills[billIndex].credit_card_details.card_name;
				$scope.saveData.is_from_bill = true;
				$scope.saveData.id = $scope.paymentData.bills[billIndex].credit_card_details.payment_id;
			}
			// $scope.refreshScroll();
		}
	};
	
	
	/*
	 * On selecting payment type list corresponding payments
	 */
	$scope.renderPaymentValues = function(){
		if($scope.saveData.selected_payment_type !== "null"){
			$scope.paymentTypeValues = $scope.data[$scope.saveData.selected_payment_type].values;
		}
		
		if($scope.passData.fromView == "paybutton"){
			if($scope.saveData.selected_payment_type == 0){//cc
				$scope.showCreditCardDetails = true;
			} else {
				$scope.showCreditCardDetails = false;
				$scope.saveData.credit_card = "";
				$scope.saveData.card_number = "";
				$scope.saveData.card_expiry_year = "";
				$scope.saveData.card_expiry_month = "";
				$scope.saveData.name_on_card = "";
				$scope.saveData.id = "";
			}
		}
		// setTimeout(function(){
			// $scope.refreshScroller('addPayment');
		// }, 1000);
		
	};
	/*
	 * Success callback of save payment in guest card
	 * updating the list payments with new data 
	 */
	$scope.saveSuccessGuest = function(data){
		
		$scope.$emit("hideLoader");
		$scope.closeDialog();
		var cardNumber = $scope.saveData.card_number;
		var expiryDate = $scope.saveData.card_expiry_month+"/"+$scope.saveData.card_expiry_year;
		var cardCode = $scope.saveData.credit_card;
		var cardHolderName = $scope.saveData.name_on_card;
		var payment_type_id = $scope.saveData.payment_type == "CC"?1:0;
		var newDataToGuest = {
			"card_code": cardCode.toLowerCase(),
			"mli_token": cardNumber.substr(cardNumber.length - 4),
			"card_expiry":expiryDate,
			"card_name":cardHolderName,
			"is_primary":false,
			"id":data.id,
			"payment_type":data.payment_name,
			"payment_type_id":payment_type_id
		};
		$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', newDataToGuest);
	};
	/*
	 * Success callback of reservation payment
	 * updating staycard with new data
	 */
	$scope.saveSuccess = function(data){
		 
		var billIndex = parseInt($scope.passData.fromBill);		
		$scope.$emit("hideLoader");
		$scope.closeDialog();
		var cardNumber = $scope.saveData.card_number;
		var expiryDate = $scope.saveData.card_expiry_month+"/"+$scope.saveData.card_expiry_year;
		var cardCode = $scope.saveData.credit_card;
		var cardHolderName = $scope.saveData.name_on_card;
		var payment_type_id = $scope.saveData.payment_type == "CC"?1:0;

		if($scope.passData.fromView == "staycard"){
			if($scope.passData.is_swiped){
				$scope.paymentData.reservation_card.payment_details.is_swiped = true;
			}

			$scope.paymentData.reservation_card.payment_method_used = $scope.saveData.payment_type;
			$scope.paymentData.reservation_card.payment_method_description = data.payment_type;
			$scope.paymentData.reservation_card.payment_details.card_type_image = cardCode.toLowerCase()+".png";
			$scope.paymentData.reservation_card.payment_details.card_number = cardNumber.substr(cardNumber.length - 4);
			$scope.paymentData.reservation_card.payment_details.card_expiry = expiryDate;
			
		} else {
			var billNumber = parseInt(billIndex) - parseInt(1);
			if($scope.passData.is_swiped){
				$scope.paymentData.bills[billNumber].credit_card_details.is_swiped = true;
			}
			$scope.paymentData.bills[billNumber].credit_card_details.card_code = cardCode.toLowerCase();
			$scope.paymentData.bills[billNumber].credit_card_details.card_number = cardNumber.substr(cardNumber.length - 4);
			$scope.paymentData.bills[billNumber].credit_card_details.card_expiry = expiryDate;
			var dataToUpdate = {
				"balance": data.reservation_balance,
				"confirm_no" : $scope.paymentData.confirm_no 
			};
			// CICO-9739 : To update on reservation card payment section while updating from bill#1 credit card type.
			if(billNumber == 0){
				$rootScope.$emit('UPDATEDPAYMENTLIST', $scope.paymentData.bills[billNumber].credit_card_details );
			}
			$rootScope.$broadcast('BALANCECHANGED', dataToUpdate);
		}
		if($scope.saveData.add_to_guest_card){ 
			if(!data.is_already_on_guest_card){
				var newDataToGuest = {
					"card_code": cardCode.toLowerCase(),
					"mli_token": cardNumber.substr(cardNumber.length - 4),
					"card_expiry":expiryDate,
					"card_name":cardHolderName,
					"is_primary":false,
					"id": data.id,
					"payment_type":data.payment_type,
					"payment_type_id":payment_type_id
				};
				$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', newDataToGuest);
			}
		}
		$rootScope.$broadcast('paymentTypeUpdated');
		//To be implemented once the feature ready for the standalone
		// if($scope.passData.showDoNotAuthorize){
		// 	$rootScope.$broadcast('cc_auth_updated', $scope.do_not_cc_auth);
		// }
	};
	$scope.failureCallBack = function(errorMessage){
		$scope.$emit("hideLoader");
		$scope.errorMessage = errorMessage;
		$scope.successMessage = "";
	};
	/*
	 * Save new payment - GUestcard or staycard
	 */
	$scope.savePayment = function(){
		  document.activeElement.blur();
	      setTimeout(function(){
	      	 window.scrollTo(0,0);
	      }, 700);
		$scope.saveData.payment_type = "";
		if($scope.saveData.selected_payment_type != undefined){
			if(parseInt($scope.saveData.selected_payment_type)>=0){
				$scope.saveData.payment_type = $scope.data[$scope.saveData.selected_payment_type].name;
			}
		}
		
		$scope.saveData.card_expiry = $scope.saveData.card_expiry_month && $scope.saveData.card_expiry_year ? "20"+$scope.saveData.card_expiry_year+"-"+$scope.saveData.card_expiry_month+"-01" : "";
		//$scope.passData  => Gives information from which view popup opened 
		//get reservation id if it is from staycard
		if($scope.passData.fromView == "staycard" || $scope.passData.fromView == "billcard" || $scope.passData.fromView == "paybutton"){
			
			$scope.saveData.reservation_id = $scope.passData.reservationId;
			$scope.saveData.et2 = $scope.passData.et2;
			$scope.saveData.ksn = $scope.passData.ksn;
			$scope.saveData.pan = $scope.passData.pan;
			$scope.saveData.mli_token = $scope.passData.token;
			if($scope.passData.is_swiped){
				$scope.saveData.payment_credit_type = $scope.passData.credit_card;
				$scope.saveData.credit_card = $scope.passData.credit_card;
			} else {
				$scope.saveData.credit_card = $scope.saveData.credit_card;
				
			}
			if($scope.passData.fromView == "billcard"){
				$scope.saveData.bill_number = $scope.passData.fromBill;
			} else if($scope.passData.fromView == "paybutton"){
				$scope.saveData.bill_number = $scope.saveData.selected_bill;
				$scope.saveData.amount = $scope.saveData.amount;
			}
			$scope.saveData.add_to_guest_card = $scope.saveData.add_to_guest_card;
			
		} else {
			//$scope.saveData.guest_id = $scope.passData.guest_id;
			 $scope.saveData.user_id = $scope.passData.guest_id;
			if($scope.passData.is_swiped){
				$scope.saveData.credit_card = $scope.passData.credit_card;
			}
			$scope.saveData.et2 = $scope.passData.et2;
			$scope.saveData.ksn = $scope.passData.ksn;
			$scope.saveData.pan = $scope.passData.pan;
			$scope.saveData.mli_token = $scope.passData.token;
			$scope.saveData.add_to_guest_card = true;
		}
		$scope.saveData.session_id = MLISessionId;
		var unwantedKeys = ["card_expiry_year","card_expiry_month", "selected_payment_type", "selected_credit_card","card_number","cvv"];
		if($scope.passData.is_swiped){
			unwantedKeys.push("session_id");
		}
		var data = dclone($scope.saveData, unwantedKeys);
		if($scope.passData.fromView == "staycard" || $scope.passData.fromView == "billcard"  || $scope.passData.fromView == "paybutton"){
			 $scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, $scope.saveSuccess, $scope.failureCallBack);
		} else {
			//Used to update the list with new value
			var cardNumber = $scope.saveData.card_number;
			var expiryDate = $scope.saveData.card_expiry_month+"/"+$scope.saveData.card_expiry_year;
			//Created info to update the payment list in guest tab with new data
			$scope.newPaymentInfo = {
				"card_code": $scope.saveData.credit_card,
				"mli_token_display":cardNumber.substr(cardNumber.length - 4),
				"card_expiry": $scope.saveData.card_expiry,
				"card_name": $scope.saveData.name_on_card,
				"is_primary":false
			};
			$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, data, $scope.saveSuccessGuest, $scope.failureCallBack);
		}
	};
	$scope.clickCancel = function(){
		$scope.closeDialog();
	};


	/* MLI integration starts here */

     $scope.savePaymentDetails = function(){  	

    	$scope.fetchMLISessionId = function(){
			 var sessionDetails = {};
			 sessionDetails.cardNumber = $scope.saveData.card_number;
			 sessionDetails.cardSecurityCode = $scope.saveData.cvv;
			 sessionDetails.cardExpiryMonth = $scope.saveData.card_expiry_month;
			 sessionDetails.cardExpiryYear = $scope.saveData.card_expiry_year;
			
			 var callback = function(response){
			 	$scope.$emit("hideLoader");
			 	
			 	if(response.status ==="ok"){

			 		MLISessionId = response.session;
			 		$scope.savePayment();// call save payment details WS		 		
			 	}
			 	else{
			 		$scope.errorMessage = ["There is a problem with your credit card"];
			 	}			
			 	$scope.$apply(); 	
			 };

			try {
			    HostedForm.updateSession(sessionDetails, callback);	
			    $scope.$emit("showLoader");
			}
			catch(err) {
			   $scope.errorMessage = ["There was a problem connecting to the payment gateway."];
			};
			 		
		};
		$scope.directPayment = false;//To check direct save or MLI fetch save from paybutton
		if($scope.passData.fromView == "paybutton"){
			$scope.directPayment = true;
			var creditCardNumber = $scope.saveData.card_number;
			//Handling if user typed new credit cards after selecting or the data from  guest bill
			if(creditCardNumber.indexOf("xxxx") == -1){
				$scope.saveData.is_from_bill = false;
				$scope.saveData.id = "";
				$scope.saveData.is_from_guest_card = false;
				$scope.directPayment = false;
			}
		}
		 
		if($scope.passData.is_swiped || (parseInt($scope.saveData.selected_payment_type) !==0 || $scope.directPayment)){
			if($scope.saveData.selected_payment_type !== '' && $scope.saveData.selected_payment_type !== 'selectpayment'){
					$scope.savePayment();
				}else{
					// Client side validation for non CC payment types
	    			$scope.errorMessage = ["Please select the payment type"];
				}
		}
		else{
			
			/* in case the payment type is cc first we fetch MLI sesionId using card details and then save*/
			if(parseInt($scope.saveData.selected_payment_type) ===0){
				if($scope.saveData.card_number.length>0){
					$scope.fetchMLISessionId();
	    		}
	    		else{
	    			// Client side validation added to eliminate a false session being retrieved in case of empty card number
	    			$scope.errorMessage = ["There is a problem with your credit card"];
	    		}
			}	
			else{
				if($scope.saveData.selected_payment_type !== '' && $scope.saveData.selected_payment_type !== 'selectpayment'){
					$scope.savePayment();
				}else{
					// Client side validation for non CC payment types
	    			$scope.errorMessage = ["Please select the payment type"];
				}
			    
			}
		}
		

    };
    /* MLI integration ends here */
   /*
    * Render selected paymnet details - when clicks on guest card credit cards
    */
   $scope.renderSelectedPaymentDetails = function(index){
   		$scope.showCreditCardDetails = true;
		angular.forEach($scope.paymentTypeList, function(value, key) {
			if(value.name == "CC"){
				$scope.saveData.selected_payment_type = key; 
			}
		});
		$scope.paymentTypeValues = $scope.paymentTypeList[$scope.saveData.selected_payment_type].values;
		$scope.saveData.credit_card = $scope.guestPaymentList[index].card_code.toUpperCase();
		$scope.saveData.card_number = "xxxx-xxxx-xxxx-"+$scope.guestPaymentList[index].mli_token;
		$scope.saveData.card_expiry_year = $scope.guestPaymentList[index].card_expiry.slice(-2);
		$scope.saveData.card_expiry_month = $scope.guestPaymentList[index].card_expiry.substring(0, 2);
		$scope.saveData.name_on_card = $scope.guestPaymentList[index].card_name;
		$scope.saveData.is_from_guest_card = true;
		$scope.saveData.is_from_bill = false;
		$scope.saveData.id = $scope.guestPaymentList[index].id;
		// setTimeout(function(){
			// $scope.refreshScroller('addPayment');
		// }, 1000);
   };
   
}]);