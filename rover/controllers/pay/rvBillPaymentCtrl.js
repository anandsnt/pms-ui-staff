sntRover.controller('RVBillPayCtrl',['$scope', 'RVBillPaymentSrv','RVPaymentSrv','RVGuestCardSrv','RVReservationCardSrv', 'ngDialog', '$rootScope', function($scope, RVBillPaymentSrv, RVPaymentSrv, RVGuestCardSrv, RVReservationCardSrv, ngDialog, $rootScope){
	BaseCtrl.call(this, $scope);
	$scope.renderData = {};
	$scope.saveData = {};
	$scope.guestPaymentList = {};
	$scope.newPaymentInfo = {};
	$scope.newPaymentInfo.addToGuestCard = false;
	$scope.billNumberSelected = '';
	// console.log($scope);
	//We are passing $scope from bill to this modal
	$scope.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
	$scope.billNumberSelected = $scope.currentActiveBillNumber;
	$scope.billsArray = $scope.reservationBillData.bills;
	//Parameter used to show credit card info - first modal
	$scope.showCreditCardInfo = false;
	$scope.isfromBill = false;
	$scope.isfromGuestCard = false;
	//Parameter used to handle ng-change of payment type 
	// if default credit card not exist show guest payment lists
	//Otherwise that screen will be viewed when click on credit card area. 
	$scope.isExistPaymentType = false;
	//same partial used to show existing payments and add new card screen
	//Inside that file seperate partials added - for add new card and listing
	$scope.showExistingAndAddNewPayments = false;
	$scope.showExistingGuestPayments = false;
	$scope.showInitalPaymentScreen = false;
	$scope.showAddNewPaymentScreen = false;
	$scope.newPaymentInfo.isSwiped = false;
	try 
	{
		HostedForm.setMerchant($rootScope.MLImerchantId);
	}
	catch(err) {
	};
	$scope.init = function(){
		$scope.showInitalPaymentScreen = true;
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, '', $scope.getPaymentListSuccess);
		$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.guestInfoToPaymentModal.user_id, $scope.guestPaymentListSuccess, '', 'NONE');
	};
	$scope.getPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.renderData = data;
		$scope.renderDefaultValues();
	};
	$scope.guestPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.guestPaymentList = data;
	};
	$scope.renderDefaultValues = function(){
		if(!isEmptyObject($scope.billsArray[$scope.currentActiveBill].credit_card_details)){
			$scope.defaultPaymentTypeOfBill = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase();
			if($scope.defaultPaymentTypeOfBill == 'CC'){
				$scope.isExistPaymentType = true;
				$scope.showCreditCardInfo = true;
				$scope.isfromBill = true;
				$scope.defaultPaymentTypeCard = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase();
				$scope.defaultPaymentTypeCardNumberEndingWith = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number;
				$scope.defaultPaymentTypeCardExpiry = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_expiry;
			}
		}
		
	};
	$scope.init();
	$scope.submitPayment = function(){
		
	};
	$scope.showHideCreditCard = function(){
		if($scope.saveData.paymentType == "CC"){
			if($scope.isExistPaymentType){
				$scope.showCreditCardInfo = true;
			} else{
				$scope.showGuestCreditCardList();
			}
			
		} else {
			$scope.showCreditCardInfo = false;
		}
	};
	$scope.showGuestCreditCardList = function(){
		$scope.showInitalPaymentScreen = false;
		$scope.showExistingAndAddNewPayments = true;
		$scope.showExistingGuestPayments = true;
	};
	$scope.showInitialScreen = function(){
		$scope.showInitalPaymentScreen = true;
		$scope.showExistingAndAddNewPayments = false;
		$scope.showExistingGuestPayments = false;
	};
	$scope.showModalClass = function(){
		var modalClass = "";
		if($scope.showExistingGuestPayments){
			modalClass = "select-card";
		} else if($scope.showAddNewPaymentScreen){
			modalClass = "new-card";
		} else if($scope.showCreditCardInfo){
			modalClass = "card-attached";
		}
		return modalClass;
	};
	$scope.showAddNewCreditCard = function(){
		$scope.showAddNewPaymentScreen = true;
		$scope.showExistingAndAddNewPayments = true;
		$scope.showInitalPaymentScreen = false;
		$scope.showExistingGuestPayments = false;
	};
	$scope.showExistingCards = function(){
		$scope.showExistingGuestPayments = true;
		$scope.showExistingAndAddNewPayments = true;
		$scope.showInitalPaymentScreen = false;
		$scope.showAddNewPaymentScreen = false;
	};
	$scope.saveNewPayment = function(){
		console.log(JSON.stringify($scope.newPaymentInfo));
		if($scope.newPaymentInfo.cardNumber.length>0){
			if($scope.newPaymentInfo.isSwiped){
				$scope.savePayment();
			} else {
				$scope.fetchMLISessionId();
			}
			
		}
		else{
			// Client side validation added to eliminate a false session being retrieved in case of empty card number
			$scope.errorMessage = ["There is a problem with your credit card"];
		}
	};
	var MLISessionId = "";
	$scope.fetchMLISessionId = function(){
		 var sessionDetails = {};
		 sessionDetails.cardNumber = $scope.newPaymentInfo.cardNumber;
		 sessionDetails.cardSecurityCode = $scope.newPaymentInfo.cardCCV;
		 sessionDetails.cardExpiryMonth = $scope.newPaymentInfo.cardExpiryMonth;
		 sessionDetails.cardExpiryYear = $scope.newPaymentInfo.cardExpiryYear;
		
		 var callback = function(response){
		 	$scope.$emit("hideLoader");
		 	if(response.status ==="ok"){
		 		MLISessionId = response.session;
		 		$scope.savePayment();
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
	var token = "";
	var swipedCardData = "";
	$scope.savePayment = function(){
		if($scope.newPaymentInfo.isSwiped){
			var dataToSave = {
		     	"reservation_id": $scope.reservationData.reservationId,
		     	"et2": swipedCardData.RVCardReadTrack2,
		     	"ksn": swipedCardData.RVCardReadTrack2KSN,
		     	"pan": swipedCardData.RVCardReadMaskedPAN,
		     	"mli_token": token,
		     	"payment_credit_type": "CC",
		     	"credit_card": swipedCardData.RVCardReadCardType,
		     	"bill_number": $scope.billNumberSelected,
		     	"add_to_guest_card": $scope.newPaymentInfo.addToGuestCard
		     };
		} else {
			var expiryDate = $scope.newPaymentInfo.cardExpiryMonth && $scope.newPaymentInfo.cardExpiryYear ? "20"+$scope.newPaymentInfo.cardExpiryYear+"-"+$scope.newPaymentInfo.cardExpiryMonth+"-01" : "";
		    var dataToSave = {
		     	"add_to_guest_card": $scope.newPaymentInfo.addToGuestCard,
		     	"bill_number": $scope.billNumberSelected,
		     	"card_expiry": expiryDate,
		     	//"credit_card": "DS", // dONT HAVE THE TYPE OF CARD IN THIS SCREEN
		     	"name_on_card": $scope.newPaymentInfo.cardHolderName,
		     	"payment_type": "CC",
		     	"reservation_id": $scope.reservationData.reservationId,
		     	"session_id": MLISessionId
		     };
		}
		
	     $scope.invokeApi(RVPaymentSrv.savePaymentDetails, dataToSave, $scope.successNewPayment);
	     
	};
	$scope.successNewPayment = function(data){
		$scope.$emit("hideLoader");
		// $scope.defaultPaymentTypeCard = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase();
		// $scope.defaultPaymentTypeCardNumberEndingWith = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number;
		// $scope.defaultPaymentTypeCardExpiry = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_expiry;
	};
	
	$scope.$on('PAYMENTSWIPEHAPPENED', function(event, data){
		 $scope.showAddNewCreditCard();
	     swipedCardData = data;
	     console.log("-------swipedat------------"+JSON.stringify(data));
		 var getTokenFrom = {
	              'et2': data.RVCardReadTrack2,
	              'ksn': data.RVCardReadTrack2KSN,
	              'pan': data.RVCardReadMaskedPAN
	           };
	    var tokenizeSuccessCallback = function(tokenData){
	    	token = tokenData;
	    	$scope.$emit("hideLoader");
	  	 	$scope.newPaymentInfo.cardNumber = "xxxx-xxxx-xxxx-"+tokenData.slice(-4);
         	$scope.newPaymentInfo.cardExpiryMonth = data.RVCardReadExpDate.slice(-2);
         	$scope.newPaymentInfo.cardExpiryYear = data.RVCardReadExpDate.substring(0, 2);
         	$scope.newPaymentInfo.cardHolderName = data.RVCardReadCardName;
         	$scope.newPaymentInfo.isSwiped = true;
     	};
     	$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);	
  	 	
		
	});
	
}]);