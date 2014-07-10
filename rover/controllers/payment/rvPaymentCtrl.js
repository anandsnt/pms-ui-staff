sntRover.controller('RVPaymentMethodCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.saveData = {};
	$scope.saveData.add_to_guest_card = false;
	
	//Set merchant ID for MLI integration
	var MLISessionId = "";
	
	try {
			HostedForm.setMerchant($rootScope.MLImerchantId);
		}
		catch(err) {};

	$scope.saveData.selected_payment_type = "selectpayment";//Only for swipe

	$scope.paymentTypeValues = "";
	$scope.saveData.card_number  = "";
	$scope.saveData.credit_card  =  "";
	$scope.saveData.name_on_card =  "";
	$scope.saveData.card_expiry_month = "";
	$scope.saveData.card_expiry_year = "";	
	$scope.shouldShowDisabled = false;

	$scope.successMessage = "";
	
	$scope.isFromGuestCard = false;
	if($scope.passData.fromView == "guestcard"){
		$scope.isFromGuestCard = true;
	}
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
		$scope.$emit("hideLoader");
		MLISessionId = "";
		$scope.data = data;

		$scope.paymentTypeValues = [];
		if($scope.passData.is_swiped){
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
	};
	$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.successRender,$scope.errorRender);
	/*
	 * On selecting payment type list corresponding payments
	 */
	$scope.renderPaymentValues = function(){
		$scope.paymentTypeValues = $scope.data[$scope.saveData.selected_payment_type].values;
	};
	/*
	 * Success callback of save payment in guest card
	 * updating the list payments with new data 
	 */
	$scope.saveSuccessGuest = function(data){
		
		$scope.$emit("hideLoader");
		ngDialog.close();
		var cardNumber = $scope.saveData.card_number;
		var expiryDate = $scope.saveData.card_expiry_month+"/"+$scope.saveData.card_expiry_year;
		var cardCode = $scope.saveData.credit_card;
		var cardHolderName = $scope.saveData.name_on_card;
		var newDataToGuest = {
			"card_code": cardCode.toLowerCase(),
			"mli_token": cardNumber.substr(cardNumber.length - 4),
			"card_expiry":expiryDate,
			"card_name":cardHolderName,
			"is_primary":false,
			"id":data.id
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
		ngDialog.close();
		var cardNumber = $scope.saveData.card_number;
		var expiryDate = $scope.saveData.card_expiry_month+"/"+$scope.saveData.card_expiry_year;
		var cardCode = $scope.saveData.credit_card;
		var cardHolderName = $scope.saveData.name_on_card;
		if($scope.passData.fromView == "staycard"){
			$scope.paymentData.reservation_card.payment_method_used = 'CC';
			$scope.paymentData.reservation_card.payment_details.card_type_image = cardCode.toLowerCase()+".png";
			$scope.paymentData.reservation_card.payment_details.card_number = cardNumber.substr(cardNumber.length - 4);
			$scope.paymentData.reservation_card.payment_details.card_expiry = expiryDate;
		} else {
			$scope.paymentData.bills[billIndex].credit_card_details.card_code = cardCode.toLowerCase();
			$scope.paymentData.bills[billIndex].credit_card_details.card_number = cardNumber.substr(cardNumber.length - 4);
			$scope.paymentData.bills[billIndex].credit_card_details.card_expiry = expiryDate;
		}
		if($scope.saveData.add_to_guest_card){ 
			if(!data.is_already_on_guest_card){
				var newDataToGuest = {
					"card_code": cardCode.toLowerCase(),
					"mli_token": cardNumber.substr(cardNumber.length - 4),
					"card_expiry":expiryDate,
					"card_name":cardHolderName,
					"is_primary":false,
					"id": data.id
				};
				$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', newDataToGuest);
			}
			
		}
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
	
		// console.log(JSON.stringify($scope.data));
		// console.log($scope.saveData.selected_payment_type);
		$scope.saveData.payment_type = "";
		if($scope.saveData.selected_payment_type != undefined){
			if(parseInt($scope.saveData.selected_payment_type)>=0){
				$scope.saveData.payment_type = $scope.data[$scope.saveData.selected_payment_type].name;
			}
		}
		
		$scope.saveData.card_expiry = $scope.saveData.card_expiry_month && $scope.saveData.card_expiry_year ? "20"+$scope.saveData.card_expiry_year+"-"+$scope.saveData.card_expiry_month+"-01" : "";
		//$scope.passData  => Gives information from which view popup opened 
		//get reservation id if it is from staycard
		if($scope.passData.fromView == "staycard" || $scope.passData.fromView == "billcard"){
			
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
			}
			$scope.saveData.add_to_guest_card = $scope.saveData.add_to_guest_card;
			
		} else {
			$scope.saveData.guest_id = $scope.passData.guest_id;
			$scope.saveData.user_id = $scope.passData.user_id;
			if($scope.passData.is_swiped){
				$scope.saveData.credit_card = $scope.passData.credit_card;
			}
			$scope.saveData.et2 = $scope.passData.et2;
			$scope.saveData.ksn = $scope.passData.ksn;
			$scope.saveData.pan = $scope.passData.pan;
			$scope.saveData.mli_token = $scope.passData.token;
		}
		$scope.saveData.session_id = MLISessionId;
		var unwantedKeys = ["card_expiry_year","card_expiry_month", "selected_payment_type", "selected_credit_card","card_number","cvv"];
		if($scope.passData.is_swiped){
			unwantedKeys.push("session_id");
		}
		var data = dclone($scope.saveData, unwantedKeys);
		if($scope.passData.fromView == "staycard" || $scope.passData.fromView == "billcard"){
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
		ngDialog.close();
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
			 	$scope.$apply();
			 	if(response.status ==="ok"){

			 		MLISessionId = response.session;
			 		$scope.savePayment();// call save payment details WS		 		
			 	}
			 	else{
			 		$scope.errorMessage = ["There is a problem with your credit card"];
			 	}			 	
			 }

			try {
			    HostedForm.updateSession(sessionDetails, callback);	
			    $scope.$emit("showLoader");
			}
			catch(err) {
			   $scope.errorMessage = ["MLI Merchant ID is not set"];
			};
			 		
		}
		if($scope.passData.is_swiped || (parseInt($scope.saveData.selected_payment_type) !==0 )){
			$scope.savePayment();
		}
		else{
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
			    $scope.savePayment();
			}
		}
		

    }


    /* MLI integration ends here */
	
}]);