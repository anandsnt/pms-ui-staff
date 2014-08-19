sntRover.controller('RVBillPayCtrl',['$scope', 'RVBillPaymentSrv','RVPaymentSrv','RVGuestCardSrv','RVReservationCardSrv', 'ngDialog', '$rootScope', function($scope, RVBillPaymentSrv, RVPaymentSrv, RVGuestCardSrv, RVReservationCardSrv, ngDialog, $rootScope){
	BaseCtrl.call(this, $scope);
	$scope.renderData = {};
	$scope.saveData = {};
	
	$scope.guestPaymentList = {};
	$scope.newPaymentInfo = {};
	$scope.newPaymentInfo.addToGuestCard = false;
	$scope.billNumberSelected = '';
	$scope.renderData.defaultPaymentAmount = '';
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
	//To set merchant id
	try 
	{
		HostedForm.setMerchant($rootScope.MLImerchantId);
	}
	catch(err) {
	};
	/*
	 * Initial function - To render screen with data
	 * Initial screen - filled with deafult amount on bill
	 * If any payment type attached to that bill then that credit card can be viewed in initial screen
	 * Default payment method attached to that bill can be viewed in initial screen
	 */
	$scope.init = function(){
		$scope.showInitalPaymentScreen = true;
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, '', $scope.getPaymentListSuccess);
		$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.guestInfoToPaymentModal.user_id, $scope.guestPaymentListSuccess, '', 'NONE');
	};
	/*
	 * Success call back - for initial screen
	 */
	$scope.getPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.renderData = data;
		$scope.renderDefaultValues();
	};
	/*
	 * Success call back for guest payment list screen
	 */
	$scope.guestPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		if(data.length == 0){
			$scope.guestPaymentList = [];
		} else {
			$scope.guestPaymentList = data;
			angular.forEach($scope.guestPaymentList, function(value, key) {
				$scope.guestPaymentList.isSelected = false;
			});
		}
		
	};
	/*
	 * Initial screen - filled with deafult amount on bill
	 * If any payment type attached to that bill then that credit card can be viewed in initial screen
	 * Default payment method attached to that bill can be viewed in initial screen
	 */
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
		var defaultAmount = $scope.billsArray[$scope.currentActiveBill].total_amount;
		$scope.renderData.defaultPaymentAmount = defaultAmount;
		
	};
	$scope.init();
	/*
	 * Action - On click submit payment button
	 */
	$scope.submitPayment = function(){
		
		var dataToSrv = {
			"postData": {
				"bill_number": $scope.billNumberSelected,
			    "payment_type": "CC",
			    "credit_card_type": $scope.defaultPaymentTypeCard.toUpperCase(),//Onlyifpayment_typeisCC
			    "amount": $scope.renderData.defaultPaymentAmount
			},
			"reservation_id": $scope.reservationData.reservationId
		};
		$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToSrv, $scope.successPayment);
	};
	/*
	 * Success call back of success payment
	 */
	$scope.successPayment = function(){
		$scope.$emit("hideLoader");
		$scope.handleCloseDialog();
		//To refresh the view bill screen 
		$scope.$emit('PAYMENT_SUCCESS');
	};
	/*
	 * Show/Hide credit card in initial screen
	 */
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
	/*
	 * Show guest credit card list
	 */
	$scope.showGuestCreditCardList = function(){
		$scope.showInitalPaymentScreen = false;
		$scope.showExistingAndAddNewPayments = true;
		$scope.showExistingGuestPayments = true;
	};
	/*
	 * Show initial screen - On click cancel button from add new card, and from guest payment list
	 */
	$scope.showInitialScreen = function(){
		$scope.showExistingAndAddNewPayments = false;
		$scope.showExistingGuestPayments = false;
		$scope.showInitalPaymentScreen = true;
		$scope.showAddNewPaymentScreen = false;
	};
	/*
	 * Depends on screens - apply different classes for popup
	 */
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
	/*
	 * Show Add new screen
	 */
	$scope.showAddNewCreditCard = function(fromWhere){
		if(fromWhere == '' || fromWhere == undefined){
			$scope.newPaymentInfo.isSwiped = false;
		}
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
	/*
	 * To add new card to the bill - either swipe or manual
	 */
	$scope.saveNewPayment = function(){
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
	/*
	 * To fetch MLI sessionId
	 */
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
	/*
	 * To save new card
	 */
	$scope.savePayment = function(){
		var expiryDate = $scope.newPaymentInfo.cardExpiryMonth && $scope.newPaymentInfo.cardExpiryYear ? "20"+$scope.newPaymentInfo.cardExpiryYear+"-"+$scope.newPaymentInfo.cardExpiryMonth+"-01" : "";
		if($scope.newPaymentInfo.isSwiped){
			var dataToSave = {
		     	"reservation_id": $scope.reservationData.reservationId,
		     	"et2": swipedCardData.RVCardReadTrack2,
		     	"ksn": swipedCardData.RVCardReadTrack2KSN,
		     	"pan": swipedCardData.RVCardReadMaskedPAN,
		     	"mli_token": token,
		     	"payment_type": "CC",
		     	"credit_card": swipedCardData.RVCardReadCardType,
		     	"payment_credit_type": swipedCardData.RVCardReadCardType,
		     	"bill_number": $scope.billNumberSelected,
		     	"add_to_guest_card": $scope.newPaymentInfo.addToGuestCard,
		     	"card_expiry": expiryDate
		     };
		} else {
			
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
	/*
	 * Success call back of save new card
	 */
	$scope.successNewPayment = function(data){
		$scope.$emit("hideLoader");
		$scope.isExistPaymentType = true;
		$scope.showCreditCardInfo = true;
		$scope.defaultPaymentTypeCard = data.credit_card_type.toLowerCase();
		$scope.defaultPaymentTypeCardNumberEndingWith = $scope.newPaymentInfo.cardNumber.slice(-4);
		$scope.defaultPaymentTypeCardExpiry = $scope.newPaymentInfo.cardExpiryMonth+"/"+$scope.newPaymentInfo.cardExpiryYear;
		var selectedBillIndex = parseInt($scope.billNumberSelected) - parseInt(1);
		$scope.billsArray[selectedBillIndex].credit_card_details.card_code = data.credit_card_type.toLowerCase();
		$scope.billsArray[selectedBillIndex].credit_card_details.card_expiry = $scope.newPaymentInfo.cardExpiryMonth+"/"+$scope.newPaymentInfo.cardExpiryYear;
		$scope.billsArray[selectedBillIndex].credit_card_details.card_number = $scope.newPaymentInfo.cardNumber.slice(-4);
		if($scope.newPaymentInfo.addToGuestCard){
			var dataToGuestList = {
				"card_code": data.credit_card_type.toLowerCase(),
				"mli_token": $scope.newPaymentInfo.cardNumber.slice(-4),
				"card_expiry": $scope.newPaymentInfo.cardExpiryMonth+"/"+$scope.newPaymentInfo.cardExpiryYear,
				"card_name": $scope.newPaymentInfo.cardHolderName
			};
			$scope.guestPaymentList.push(dataToGuestList);
		}
		
		$scope.showInitialScreen();
	};
	
	$scope.$on('PAYMENTSWIPEHAPPENED', function(event, data){
		 $scope.showAddNewCreditCard('swipe');
	     swipedCardData = data;
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
	
	$scope.setCreditCardFromList = function(index){
		$scope.isExistPaymentType = true;
		$scope.showCreditCardInfo = true;
		$scope.defaultPaymentTypeCard = $scope.guestPaymentList[index].card_code.toLowerCase();
		$scope.defaultPaymentTypeCardNumberEndingWith = $scope.guestPaymentList[index].mli_token;
		$scope.defaultPaymentTypeCardExpiry = $scope.guestPaymentList[index].card_expiry;
		$scope.guestPaymentList[index].isSelected = true;
		$scope.showInitialScreen();
	};
	$scope.handleCloseDialog = function(){
		$scope.paymentModalOpened = false;
		$scope.$emit('HANDLE_MODAL_OPENED');
		$scope.closeDialog();
	};
}]);