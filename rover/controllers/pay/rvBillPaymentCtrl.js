sntRover.controller('RVBillPayCtrl',['$scope', 'RVBillPaymentSrv','RVPaymentSrv','RVGuestCardSrv','RVReservationCardSrv', 'ngDialog', '$rootScope', function($scope, RVBillPaymentSrv, RVPaymentSrv, RVGuestCardSrv, RVReservationCardSrv, ngDialog, $rootScope){
	BaseCtrl.call(this, $scope);
	
	var setupbasicBillData = function(){
		$scope.renderData = {};
		$scope.saveData = {};
		$scope.errorMessage = '';
		$scope.saveData.payment_type_id = '';
		$scope.guestPaymentList = {};
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
		$scope.feeData = {};
		$scope.feeData.feesInfo = $scope.billsArray[$scope.currentActiveBill].credit_card_details.fees_information;
	};

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
		if($scope.guestPaymentList.length >0){
		// $scope.showInitalPaymentScreen = false;
			$scope.showExistingAndAddNewPayments = true;
			$scope.showExistingGuestPayments = true;
			$scope.showOnlyAddCard = false;
			$scope.cardsList = $scope.guestPaymentList;
			$scope.refreshScroller('cardsList');
			$scope.addmode = false;
		} else {
			$scope.showOnlyAddCard = true;
			$scope.addmode = true;
		};		
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
			checkReferencetextAvailable();
		};

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
	$scope.guestPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		if(data.length == 0){
			$scope.guestPaymentList = [];
		} else {
			var cardsList = [];
			angular.forEach(data, function(value, key) {
				if(value.credit_card_type_id !== null){
					cardsList.push(value);
				};
			});
			cardsList.forEach(function(card) {
					   card.is_credit_card = true;
					   delete card.credit_card_type_id;
			});
			$scope.guestPaymentList = cardsList;
			angular.forEach($scope.guestPaymentList, function(value, key) {
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
		$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.guestInfoToPaymentModal.user_id, $scope.guestPaymentListSuccess, '', 'NONE');
	};

	// CICO-9457 : To calculate fee - for standalone only
	$scope.calculateFee = function(){

		if($scope.isStandAlone){
			var feesInfo = $scope.feeData.feesInfo;
			var amountSymbol = "";
			var zeroAmount = parseFloat("0.00").toFixed(2);
			if(typeof feesInfo != 'undefined' && feesInfo!= null) amountSymbol = feesInfo.amount_symbol;

			var totalAmount = ($scope.renderData.defaultPaymentAmount == "") ? zeroAmount :
							parseFloat($scope.renderData.defaultPaymentAmount);
			var feePercent  = parseFloat($scope.renderData.actualFees);

			if($scope.isStandAlone && amountSymbol == "%"){
				var calculatedFee = parseFloat(totalAmount * (feePercent/100));
				$scope.renderData.calculatedFee = parseFloat(calculatedFee).toFixed(2);
				$scope.renderData.totalOfValueAndFee = parseFloat(calculatedFee + totalAmount).toFixed(2);
			}
			else{
				$scope.renderData.totalOfValueAndFee = parseFloat(totalAmount + feePercent).toFixed(2);
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

		var zeroAmount = parseFloat("0.00").toFixed(2);
		var defaultAmount = $scope.billsArray[$scope.currentActiveBill].total_fees.length >0 ?
			$scope.billsArray[$scope.currentActiveBill].total_fees[0].balance_amount : zeroAmount;
		$scope.renderData.defaultPaymentAmount = parseFloat(defaultAmount).toFixed(2);

		// CICO-9457 : Setup fees details initilaly - for standalone only
		if($scope.isStandAlone){
			var feesInfo = $scope.feeData.feesInfo;
			console.log("feesInfo :");console.log(feesInfo);
			if(typeof feesInfo != 'undefined' && feesInfo!= null){
				
				var amountSymbol = feesInfo.amount_symbol;
				var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount).toFixed(2) : zeroAmount;
				$scope.renderData.actualFees = feesAmount;
				
				if(amountSymbol == "%") $scope.calculateFee();
				else{
					$scope.renderData.calculatedFee = feesAmount;
					$scope.renderData.totalOfValueAndFee = parseFloat(parseFloat(feesAmount) + parseFloat(defaultAmount)).toFixed(2);
				}
			}
			else{
				$scope.renderData.actualFees = zeroAmount;
				$scope.renderData.calculatedFee = zeroAmount;
				$scope.renderData.totalOfValueAndFee = zeroAmount;
			}
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
			console.log(dataToSrv);

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
		$scope.defaultPaymentTypeCard = retrieveCardtype();		
		$scope.defaultPaymentTypeCardNumberEndingWith = retrieveCardNumber();
		$scope.defaultPaymentTypeCardExpiry =retrieveExpiryDate();
		var selectedBillIndex = parseInt($scope.renderData.billNumberSelected) - parseInt(1);
		
		$scope.billsArray[selectedBillIndex].credit_card_details.card_code = retrieveCardtype();
		$scope.billsArray[selectedBillIndex].credit_card_details.card_expiry = retrieveExpiryDate();
		$scope.billsArray[selectedBillIndex].credit_card_details.card_number = retrieveCardNumber();
		
		$scope.saveData.payment_type_id = data.id;
		angular.forEach($scope.guestPaymentList, function(value, key) {
			value.isSelected = false;
		});

		if($scope.newPaymentInfo.addToGuestCard){
			var cardCode = retrieveCardtype();
			var cardNumber = retrieveCardNumber();
			var dataToGuestList = {
				"card_code": cardCode,
				"mli_token": cardNumber,
				"card_expiry": retrieveExpiryDate(),
				"card_name": $scope.newPaymentInfo.cardDetails.userName,
				"id": data.id,
				"isSelected": true,
				"is_primary":false,
				"payment_type":data.payment_name,
				"payment_type_id": 1
			};
			$scope.guestPaymentList.push(dataToGuestList);
			$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', dataToGuestList);
		}
		$scope.showCCPage = false;
		$scope.showCreditCardInfo = true;
		$scope.$broadcast("clearCardDetails");
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
		
	    $scope.invokeApi(RVPaymentSrv.savePaymentDetails, dataToSave,successNewPayment);
	};

	/*
		*  card selection action
		*/
	$scope.setCreditCardFromList = function(index){
		$scope.isExistPaymentType = true;
		$scope.showCreditCardInfo = true;
		$scope.defaultPaymentTypeCard = $scope.guestPaymentList[index].card_code.toLowerCase();
		$scope.defaultPaymentTypeCardNumberEndingWith = $scope.guestPaymentList[index].mli_token;
		$scope.defaultPaymentTypeCardExpiry = $scope.guestPaymentList[index].card_expiry;
		angular.forEach($scope.guestPaymentList, function(value, key) {
			value.isSelected = false;
		});
		$scope.guestPaymentList[index].isSelected = true;
		$scope.saveData.payment_type_id =  $scope.guestPaymentList[index].id;
		$scope.showCCPage = false;
		console.log("card clicked from bill pay");
		$scope.feeData.feesInfo = $scope.guestPaymentList[index].fees_information;
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

}]);