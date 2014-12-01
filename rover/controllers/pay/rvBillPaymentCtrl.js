sntRover.controller('RVBillPayCtrl',['$scope', 'RVBillPaymentSrv','RVPaymentSrv','RVGuestCardSrv','RVReservationCardSrv', 'ngDialog', '$rootScope', function($scope, RVBillPaymentSrv, RVPaymentSrv, RVGuestCardSrv, RVReservationCardSrv, ngDialog, $rootScope){
	BaseCtrl.call(this, $scope);
	
	var setupbasicBillData = function(){
		$scope.renderData = {};
		$scope.saveData = {};
		$scope.errorMessage = '';
		$scope.saveData.payment_type_id = '';
		$scope.cardsList = {};
		$scope.newPaymentInfo = {};
		$scope.newPaymentInfo.addToGuestCard = false;
		$scope.renderData.billNumberSelected = '';
		$scope.renderData.defaultPaymentAmount = '';
		//We are passing $scope from bill to this modal
		$scope.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
		$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
		$scope.billsArray = $scope.reservationBillData.bills;
		//common payment model items
		$scope.passData = {};
		$scope.passData.details ={};
		$scope.passData.details.firstName = $scope.guestCardData.contactInfo.first_name;
		$scope.passData.details.lastName = $scope.guestCardData.contactInfo.last_name;
		$scope.setScroller('cardsList');
		$scope.showAddtoGuestCard = true;
		$scope.showCancelCardSelection = true;
		$scope.renderData.referanceText = "";
		$scope.swipedCardDataToSave  = {};
		$scope.cardData = {};
		
	};

	$scope.feeData = {};
	//$scope.feeData.feesInfo = {};
	var zeroAmount = parseFloat("0.00").toFixed(2);

	$scope.handleCloseDialog = function(){
		$scope.paymentModalOpened = false;
		$scope.$emit('HANDLE_MODAL_OPENED');
		$scope.closeDialog();
	};

	/*
	* Show guest credit card list
	*/
	$scope.showGuestCreditCardList = function(){
		$scope.showCCPage = true;	
	};

	var checkReferencetextAvailable = function(){
		angular.forEach($scope.renderData, function(value, key) {
			if(value.name == $scope.saveData.paymentType){
				$scope.referenceTextAvailable = (value.is_display_reference)? true:false;
			}
		});

	};

	$scope.showHideCreditCard = function(){
		if($scope.saveData.paymentType == "CC"){
			($scope.isExistPaymentType) ? $scope.showCreditCardInfo = true :$scope.showGuestCreditCardList();
		} else {
			$scope.showCreditCardInfo = false;
		};
		checkReferencetextAvailable();

		//$scope.referenceTextAvailable = (value.is_display_reference)? true:false;
	};

	/*
	* Success call back - for initial screen
	*/
	$scope.getPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.renderData = data;
		$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
		$scope.renderDefaultValues();
	};
	/*
	* Success call back for guest payment list screen
	*/
	$scope.cardsListSuccess = function(data){
		$scope.$emit('hideLoader');
		if(data.length == 0){
			$scope.cardsList = [];
		} else {
			$scope.cardsList = [];
			angular.forEach(data.existing_payments, function(obj, index){
				if (obj.is_credit_card) {
		 		 	$scope.cardsList.push(obj);
				};
			});
			angular.forEach($scope.cardsList, function(value, key) {
			
				value.mli_token = value.ending_with; //For common payment HTML to work - Payment modifications story
				value.card_expiry = value.expiry_date;//Same comment above

				delete value.ending_with;
				delete value.expiry_date;
		    });

		    $scope.addmode = $scope.cardsList.length > 0 ? false:true;
			angular.forEach($scope.cardsList, function(value, key) {
				value.isSelected = false;
				if(!isEmptyObject($scope.billsArray[$scope.currentActiveBill].credit_card_details)){
					if($scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase() == "CC"){
						if(($scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number == value.mli_token) && ($scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase() == value.card_code.toLowerCase() )) {
							value.isSelected = true;
						} 
					}
				}

			});
		}

	};
	/*
	* Initial function - To render screen with data
	* Initial screen - filled with deafult amount on bill
	* If any payment type attached to that bill then that credit card can be viewed in initial screen
	* Default payment method attached to that bill can be viewed in initial screen
	*/
	$scope.init = function(){
		setupbasicBillData();
		$scope.referenceTextAvailable = false;
		$scope.showInitalPaymentScreen = true;
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, '', $scope.getPaymentListSuccess);
		//$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.guestInfoToPaymentModal.user_id, $scope.cardsListSuccess, '', 'NONE');
		$scope.invokeApi(RVPaymentSrv.getPaymentList, $scope.reservationData.reservationId, $scope.cardsListSuccess);
	};

	// CICO-9457 : To calculate fee - for standalone only
	$scope.calculateFee = function(){

		if($scope.isStandAlone){
			var feesInfo = $scope.feeData.feesInfo;
			var amountSymbol = "";
			if(typeof feesInfo != 'undefined' && feesInfo!= null) amountSymbol = feesInfo.amount_symbol;

			var totalAmount = ($scope.renderData.defaultPaymentAmount == "") ? zeroAmount :
							parseFloat($scope.renderData.defaultPaymentAmount);
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

	$scope.setupFeeData = function(){
		// CICO-9457 : Setup fees details initilaly - for standalone only
		if($scope.isStandAlone){
			
			var feesInfo = $scope.feeData.feesInfo ? $scope.feeData.feesInfo : {};
			var defaultAmount = $scope.renderData ?
			 	$scope.renderData.defaultPaymentAmount : zeroAmount;
			
			if(typeof feesInfo.amount != 'undefined' && feesInfo!= null){
				
				var amountSymbol = feesInfo.amount_symbol;
				var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount).toFixed(2) : zeroAmount;
				$scope.feeData.actualFees = feesAmount;
				
				if(amountSymbol == "percent") $scope.calculateFee();
				else{
					$scope.feeData.calculatedFee = feesAmount;
					$scope.feeData.totalOfValueAndFee = parseFloat(parseFloat(feesAmount) + parseFloat(defaultAmount)).toFixed(2);
				}
			}
		}
	};

	/*
	* Initial screen - filled with deafult amount on bill
	* If any payment type attached to that bill then that credit card can be viewed in initial screen
	* Default payment method attached to that bill can be viewed in initial screen
	*/
	$scope.renderDefaultValues = function(){
		var ccExist = false;
		if($scope.renderData.length > 0){
			if(!isEmptyObject($scope.billsArray[$scope.currentActiveBill].credit_card_details)){
				$scope.defaultPaymentTypeOfBill = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase();
				$scope.saveData.payment_type_id = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_id;
				angular.forEach($scope.renderData, function(value, key) {
					if(value.name == "CC"){
						ccExist = true;
					}
				});

				$scope.saveData.paymentType = $scope.defaultPaymentTypeOfBill;
				checkReferencetextAvailable();
				if($scope.defaultPaymentTypeOfBill == 'CC'){
					if(!ccExist){
						$scope.saveData.paymentType = '';
					}
					$scope.isExistPaymentType = true;
					$scope.showCreditCardInfo = true;
					$scope.isfromBill = true;
					$scope.defaultPaymentTypeCard = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase();
					$scope.defaultPaymentTypeCardNumberEndingWith = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number;
					$scope.defaultPaymentTypeCardExpiry = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_expiry;
				}
			}
		}
		
		var defaultAmount = $scope.billsArray[$scope.currentActiveBill].total_fees.length >0 ?
			$scope.billsArray[$scope.currentActiveBill].total_fees[0].balance_amount : zeroAmount;
		$scope.renderData.defaultPaymentAmount = parseFloat(defaultAmount).toFixed(2);
		
		if($scope.isStandAlone){
			$scope.feeData.feesInfo = $scope.billsArray[$scope.currentActiveBill].credit_card_details.fees_information;
			console.log($scope.feeData);
			$scope.setupFeeData();
		}
	};
	$scope.init();

	
	/*
	* Action - On bill selection 
	*/
	$scope.billNumberChanged = function(){
		$scope.currentActiveBill = parseInt($scope.renderData.billNumberSelected) - parseInt(1);
		$scope.renderDefaultValues();
	};

	/*
	* Success call back of success payment
	*/
	var successPayment = function(){
		$scope.$emit("hideLoader");
		$scope.handleCloseDialog();
		//To refresh the view bill screen 
		$scope.$emit('PAYMENT_SUCCESS');
	};

	/*
	* Action - On click submit payment button
	*/
	$scope.submitPayment = function(){

		if($scope.saveData.paymentType == '' || $scope.saveData.paymentType == null){
			$scope.errorMessage = ["Please select payment type"];
		} else if($scope.renderData.defaultPaymentAmount == '' || $scope.renderData.defaultPaymentAmount == null){
			$scope.errorMessage = ["Please enter amount"];
		} else {
			$scope.errorMessage = "";
			var dataToSrv = {
				"postData": {
					"bill_number": $scope.renderData.billNumberSelected,
					"payment_type": $scope.saveData.paymentType,
					"amount": $scope.renderData.defaultPaymentAmount,
					"payment_type_id":$scope.saveData.payment_type_id
				},
				"reservation_id": $scope.reservationData.reservationId
			};
			
			if($scope.isStandAlone){
				if($scope.feeData.calculatedFee)
					dataToSrv.postData.fees_amount = $scope.feeData.calculatedFee;
				if($scope.feeData.feesInfo)
					dataToSrv.postData.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
			}

			if($scope.referenceTextAvailable){
				dataToSrv.postData.reference_text = $scope.renderData.referanceText;
			};
			if($scope.saveData.paymentType == "CC"){
				if(!$scope.showCreditCardInfo){
					$scope.errorMessage = ["Please select/add credit card"];
					$scope.showHideCreditCard();
					return false;
				} else {
					$scope.errorMessage = "";
					dataToSrv.postData.credit_card_type = $scope.defaultPaymentTypeCard.toUpperCase();//Onlyifpayment_type is CC
				}
			}
			$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToSrv,successPayment);
		}

	};

	var retrieveCardtype = function(){
		var cardType = $scope.newPaymentInfo.tokenDetails.isSixPayment?
					getSixCreditCardType($scope.newPaymentInfo.tokenDetails.card_type).toLowerCase():
					getCreditCardType($scope.newPaymentInfo.tokenDetails.cardBrand).toLowerCase()
					;
		return cardType;
	};

	var retrieveCardNumber = function(){
		var cardNumber = $scope.newPaymentInfo.tokenDetails.isSixPayment?
				$scope.newPaymentInfo.tokenDetails.token_no.substr($scope.newPaymentInfo.tokenDetails.token_no.length - 4):
				$scope.newPaymentInfo.cardDetails.cardNumber.slice(-4);
		return cardNumber;
	};

	var retrieveExpiryDate = function(){
		var expiryMonth =  $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(2, 4) :$scope.newPaymentInfo.cardDetails.expiryMonth;
		var expiryYear  =  $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(0, 2) :$scope.newPaymentInfo.cardDetails.expiryYear;
		var expiryDate = expiryMonth+" / "+expiryYear;
		return expiryDate;
	};

	/*
	* Success call back of save new card
	*/
	var successNewPayment = function(data){
		$scope.$emit("hideLoader");
		var selectedBillIndex = parseInt($scope.renderData.billNumberSelected) - parseInt(1);
		if(!isEmptyObject($scope.swipedCardDataToSave)){
			var cardType =  $scope.swipedCardDataToSave.cardType.toLowerCase();		
			var cardNumberEndingWith = $scope.swipedCardDataToSave.cardNumber.slice(-4);
			var cardExpiry = $scope.swipedCardDataToSave.cardExpiryMonth+"/"+$scope.swipedCardDataToSave.cardExpiryYear;
		} else {
			var cardType = retrieveCardtype();		
			var cardNumberEndingWith = retrieveCardNumber();
			var cardExpiry = retrieveExpiryDate();
		}
		//To update popup
		$scope.defaultPaymentTypeCard = cardType;
		$scope.defaultPaymentTypeCardNumberEndingWith = cardNumberEndingWith;
		$scope.defaultPaymentTypeCardExpiry = cardExpiry;
		//To update bill screen
		$scope.billsArray[selectedBillIndex].credit_card_details.card_expiry = cardExpiry;
		$scope.billsArray[selectedBillIndex].credit_card_details.card_code = cardType;
		$scope.billsArray[selectedBillIndex].credit_card_details.card_number = cardNumberEndingWith;
		
		$scope.saveData.payment_type_id = data.id;
		
		angular.forEach($scope.cardsList, function(value, key) {
			value.isSelected = false;
		});

		if($scope.newPaymentInfo.addToGuestCard){
			var cardCode = $scope.defaultPaymentTypeCard;
			var cardNumber = $scope.defaultPaymentTypeCardNumberEndingWith;
			var dataToGuestList = {
				"card_code": cardCode,
				"mli_token": cardNumber,
				"card_expiry": $scope.defaultPaymentTypeCardExpiry,
				"card_name": $scope.newPaymentInfo.cardDetails.userName,
				"id": data.id,
				"isSelected": true,
				"is_primary":false,
				"payment_type":data.payment_name,
				"payment_type_id": 1
			};
			$scope.cardsList.push(dataToGuestList);
			$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', dataToGuestList);
		}
		$scope.showCCPage = false;
		$scope.showCreditCardInfo = true;
		$scope.$broadcast("clearCardDetails");

		if($scope.isStandAlone)	{
			$scope.feeData.feesInfo = data.fees_information;
			$scope.setupFeeData();
		}
	};
	/*
	* To save new card
	*/
	var savePayment = function(data){
		var cardToken   = !data.tokenDetails.isSixPayment ? data.tokenDetails.session:data.tokenDetails.token_no;	
		var expiryMonth = data.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(2, 4) :$scope.newPaymentInfo.cardDetails.expiryMonth;
		var expiryYear  = data.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(0, 2) :$scope.newPaymentInfo.cardDetails.expiryYear;
		var expiryDate  = (expiryMonth && expiryYear )? ("20"+expiryYear+"-"+expiryMonth+"-01"):"";

		var dataToSave = {
				"add_to_guest_card": $scope.newPaymentInfo.cardDetails.addToGuestCard,
				"bill_number": $scope.renderData.billNumberSelected,
				"card_expiry": expiryDate,
				//"credit_card": "DS", // dONT HAVE THE TYPE OF CARD IN THIS SCREEN
				"name_on_card": $scope.newPaymentInfo.cardDetails.userName,
				"payment_type": "CC",
				"reservation_id": $scope.reservationData.reservationId,
				"token": cardToken
		};
		
	    $scope.invokeApi(RVPaymentSrv.savePaymentDetails, dataToSave, successNewPayment);
	};
	
	$scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave){
		
		$scope.swipedCardDataToSave = swipedCardDataToSave;
		var data 			= swipedCardDataToSave;
		data.reservation_id =	$scope.reservationData.reservationId;
		
		data.payment_credit_type = swipedCardDataToSave.cardType;
		data.credit_card = swipedCardDataToSave.cardType;
		data.card_expiry = "20"+swipedCardDataToSave.cardExpiryYear+"-"+swipedCardDataToSave.cardExpiryMonth+"-01";
		data.add_to_guest_card = $scope.cardData.addToGuestCard;
		
		$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successNewPayment);
	
		
	});

	/*
		*  card selection action
		*/
	$scope.setCreditCardFromList = function(index){
		$scope.isExistPaymentType = true;
		$scope.showCreditCardInfo = true;
		$scope.defaultPaymentTypeCard = $scope.cardsList[index].card_code.toLowerCase();
		$scope.defaultPaymentTypeCardNumberEndingWith = $scope.cardsList[index].mli_token;
		$scope.defaultPaymentTypeCardExpiry = $scope.cardsList[index].card_expiry;
		angular.forEach($scope.cardsList, function(value, key) {
			value.isSelected = false;
		});
		$scope.cardsList[index].isSelected = true;
		$scope.saveData.payment_type_id =  $scope.cardsList[index].id;
		$scope.showCCPage = false;
		if($scope.isStandAlone)	{
			$scope.feeData.feesInfo = $scope.cardsList[index].fees_information;
			$scope.setupFeeData();
		}
	};

	$scope.$on('cardSelected',function(e,data){
		$scope.setCreditCardFromList(data.index);
	});

	$scope.$on("TOKEN_CREATED", function(e,data){
		console.log(data);
		$scope.newPaymentInfo = data;
		savePayment(data);
	});

	$scope.$on("MLI_ERROR", function(e,data){
		$scope.errorMessage = data;
	});
	$scope.$on('cancelCardSelection',function(e,data){
		$scope.showCCPage = false;
	});
	
	$scope.$on("SHOW_SWIPED_DATA_ON_PAY_SCREEN", function(e, swipedCardDataToRender){
		$scope.showCCPage 						 = true;
		$scope.addmode                 			 = true;
		$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
	});

}]);