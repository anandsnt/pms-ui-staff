sntRover.controller('RVBillPayCtrl',['$scope', 'RVBillPaymentSrv','RVPaymentSrv','RVGuestCardSrv','RVReservationCardSrv', 'ngDialog', '$rootScope','$timeout','$filter', function($scope, RVBillPaymentSrv, RVPaymentSrv, RVGuestCardSrv, RVReservationCardSrv, ngDialog, $rootScope,$timeout,$filter){
	BaseCtrl.call(this, $scope);

	var setupbasicBillData = function(){
		$scope.renderData = {};
		$scope.saveData = {};
		$scope.errorMessage = '';
		$scope.saveData.payment_type_id = '';
		$scope.cardsList = [];
		$scope.newPaymentInfo = {};
		$scope.newPaymentInfo.addToGuestCard = false;
		$scope.renderData.billNumberSelected = '';
		$scope.renderData.defaultPaymentAmount = '';
		$scope.defaultRefundAmount = 0;
		//We are passing $scope from bill to this modal
		$scope.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
		$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
		$scope.billsArray = $scope.reservationBillData.bills;
		//common payment model items
		$scope.passData = {};
		$scope.passData.details ={};
		$scope.passData.details.firstName = $scope.guestCardData.contactInfo.first_name;
		$scope.passData.details.lastName = $scope.guestCardData.contactInfo.last_name;
		$scope.setScroller('cardsList',{'click':true, 'tap':true});
		$scope.showCancelCardSelection = true;
		$scope.renderData.referanceText = "";
		$scope.swipedCardDataToSave  = {};
		$scope.cardData = {};
		$scope.newCardAdded = false;
		$scope.shouldShowWaiting = false;
		$scope.depositPaidSuccesFully = false;
		$scope.saveData.paymentType = '';
		$scope.defaultPaymentTypeOfBill = '';
		$scope.shouldShowMakePaymentButton = true;

	};


	$scope.disableMakePayment = function(){
		 if($scope.saveData.paymentType.length > 0){
			return false
		}
		else{
			return true;
		};
	};

	var refreshCardsList = function() {
		$timeout(function() {
			$scope.refreshScroller('cardsList');
		}, 2000);
	};

	$scope.feeData = {};
	var zeroAmount = parseFloat("0.00");

	// CICO-11591 : To show or hide fees calculation details.
	$scope.isShowFees = function(){
		var isShowFees = false;
		var feesData = $scope.feeData;
		if(typeof feesData === 'undefined' || typeof feesData.feesInfo === 'undefined' || feesData.feesInfo === null){
			isShowFees = false;
		}
		else if((feesData.defaultAmount  >= feesData.minFees) && $scope.isStandAlone && feesData.feesInfo.amount){
			if($scope.renderData.defaultPaymentAmount >= 0){
				isShowFees = (($rootScope.paymentGateway !== 'sixpayments' || $scope.isManual || $scope.saveData.paymentType !=='CC') && $scope.saveData.paymentType !=="") ? true :false;
			}

		}
		return isShowFees;
	};

	// CICO-9457 : To calculate fee - for standalone only
	$scope.calculateFee = function(){

		if($scope.isStandAlone){
			var feesInfo = $scope.feeData.feesInfo;
			var amountSymbol = "";
			var feePercent  = zeroAmount;
			var minFees = zeroAmount;

			if (typeof feesInfo !== 'undefined' && feesInfo !== null){
				amountSymbol = feesInfo.amount_symbol;
				feePercent  = feesInfo.amount ? parseFloat(feesInfo.amount) : zeroAmount;
				minFees = feesInfo.minimum_amount_for_fees ? parseFloat(feesInfo.minimum_amount_for_fees) : zeroAmount;
			}

			var totalAmount = ($scope.renderData.defaultPaymentAmount === "") ? zeroAmount :
							parseFloat($scope.renderData.defaultPaymentAmount);

			$scope.feeData.minFees = minFees;
			$scope.feeData.defaultAmount = totalAmount;

			if($scope.isShowFees()){
				if(amountSymbol === "percent"){
					var calculatedFee = parseFloat(totalAmount * (feePercent/100));
					$scope.feeData.calculatedFee = parseFloat(calculatedFee).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(calculatedFee + totalAmount).toFixed(2);
				}
				else{
					$scope.feeData.calculatedFee = parseFloat(feePercent).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(totalAmount + feePercent).toFixed(2);
				}
			}
			if($scope.renderData.defaultPaymentAmount < 0){
				$scope.defaultRefundAmount = (-1)*parseFloat($scope.renderData.defaultPaymentAmount);
				$scope.shouldShowMakePaymentButton = false;
			} else {
				$scope.shouldShowMakePaymentButton = true;
			}
		}
	};

	$scope.setupFeeData = function(){
		// CICO-9457 : Setup fees details initilaly - for standalone only
		if($scope.isStandAlone){

			var feesInfo = $scope.feeData.feesInfo ? $scope.feeData.feesInfo : {};
			var defaultAmount = $scope.renderData ?
			 	parseFloat($scope.renderData.defaultPaymentAmount) : zeroAmount;

			var minFees = feesInfo.minimum_amount_for_fees ? parseFloat(feesInfo.minimum_amount_for_fees) : zeroAmount;
			$scope.feeData.minFees = minFees;
			$scope.feeData.defaultAmount = defaultAmount;

			if($scope.isShowFees()){
				if(typeof feesInfo.amount !== 'undefined' && feesInfo!== null){

					var amountSymbol = feesInfo.amount_symbol;
					var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount) : zeroAmount;
					$scope.feeData.actualFees = feesAmount;

					if(amountSymbol === "percent") {
						$scope.calculateFee();
					}
					else{
						$scope.feeData.calculatedFee = parseFloat(feesAmount).toFixed(2);
						$scope.feeData.totalOfValueAndFee = parseFloat(feesAmount + defaultAmount).toFixed(2);
					}
				}
			}
		}
	};

	// CICO-12408 : To calculate Total of fees and amount to pay.
	$scope.calculateTotalAmount = function(amount) {
		var feesAmount  = (typeof $scope.feeData.calculatedFee == 'undefined' || $scope.feeData.calculatedFee == '' || $scope.feeData.calculatedFee == '-') ? zeroAmount : parseFloat($scope.feeData.calculatedFee);
		var amountToPay = (typeof amount == 'undefined' || amount =='') ? zeroAmount : parseFloat(amount);
		$scope.feeData.totalOfValueAndFee = parseFloat(amountToPay + feesAmount).toFixed(2);
	};

	$scope.handleCloseDialog = function(){
		$scope.reservationBillData.isCheckout = false;
		$scope.paymentModalOpened = false;
		$scope.$emit('HANDLE_MODAL_OPENED');
		$scope.closeDialog();
	};

	/*
	* Show guest credit card list
	*/
	$scope.showGuestCreditCardList = function(){
		$scope.showCCPage = true;
		refreshCardsList();
	};



	$scope.changeOnsiteCallIn = function(){
		 $scope.isManual ? $scope.showGuestCreditCardList() : "";
		 refreshCardsList();
	};

	var checkReferencetextAvailable = function(){
		angular.forEach($scope.renderData.paymentTypes, function(value, key) {
			if(value.name === $scope.saveData.paymentType){
				$scope.referenceTextAvailable = (value.is_display_reference)? true:false;
				// To handle fees details on reservation summary,
				// While we change payment methods
				// Handling Credit Cards seperately.
				if(value.name !== "CC"){
					$scope.feeData.feesInfo = value.charge_code.fees_information;
				}
				$scope.setupFeeData();
			}
		});

	};

	$scope.showHideCreditCard = function(){

		if($scope.saveData.paymentType === "CC"){
			if($scope.paymentGateway !== 'sixpayments'){
				($scope.isExistPaymentType) ? $scope.showCreditCardInfo = true :$scope.showGuestCreditCardList();
				 refreshCardsList();
			}
		} else {
			$scope.showCreditCardInfo = false;
		};
		checkReferencetextAvailable();
	};

	/*
	* Success call back - for initial screen
	*/
	$scope.getPaymentListSuccess = function(data){

		$scope.$emit('hideLoader');
		$scope.renderData.paymentTypes = data;
		$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
		$scope.renderDefaultValues();
		$scope.creditCardTypes = [];
		angular.forEach($scope.renderData.paymentTypes, function(item, key) {
			if(item.name === 'CC'){
				$scope.creditCardTypes = item.values;
			};
		});
		$scope.showHideCreditCard();
	};


	var checkReferencetextAvailableForCC = function(){
		angular.forEach($scope.renderData.paymentTypes, function(paymentType, key) {
			if(paymentType.name === 'CC'){
				angular.forEach(paymentType.values, function(value, key) {
					if($scope.defaultPaymentTypeCard.toUpperCase() === value.cardcode){
						$scope.referenceTextAvailable = (value.is_display_reference)? true:false;
					};
				});
			}
		});
	};
	/*
	* Success call back for guest payment list screen
	*/
	$scope.cardsListSuccess = function(data){
		$scope.$emit('hideLoader');
		if(data.length === 0){
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
					if($scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase() === "CC"){
						if(($scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number === value.mli_token) && ($scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase() === value.card_code.toLowerCase() )) {
							value.isSelected = true;
							checkReferencetextAvailableForCC();
						}
					}
				}

			});
			refreshCardsList();
		}
	};
	$scope.resetSplitPaymentDetail = function(){
		$scope.splitBillEnabled = (typeof($scope.splitBillEnabled) === "undefined") ? false : !$scope.splitBillEnabled;
		$scope.splitePaymentDetail = {
			totalNoOfsplits:1,
			completedSplitPayments:0,
			totalAmount:0,
			splitAmount:0,
			carryAmount:0
		};
		$scope.messageOfSuccessSplitPayment
		='';
		$scope.paymentErrorMessage ='';

	};
	/*
	* Initial function - To render screen with data
	* Initial screen - filled with deafult amount on bill
	* If any payment type attached to that bill then that credit card can be viewed in initial screen
	* Default payment method attached to that bill can be viewed in initial screen
	*/
	$scope.init = function(){

		$scope.resetSplitPaymentDetail();
		// CICO-12067 Handle the case when reservationId field is undefined.
		if(typeof $scope.reservationData.reservationId === 'undefined'){
			$scope.reservationData.reservationId = $scope.reservationData.reservation_id;
		}

		setupbasicBillData();

		$scope.referenceTextAvailable = false;
		$scope.showInitalPaymentScreen = true;
		// changes for CICO-13763
		var reservationData = { "reservation_id":$scope.reservationData.reservationId ,"is_checkout":$scope.reservationBillData.isCheckout}
		var paymentParams = $scope.reservationBillData.isCheckout ? reservationData : '';
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, paymentParams, $scope.getPaymentListSuccess);
		//$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.guestInfoToPaymentModal.user_id, $scope.cardsListSuccess, '', 'NONE');
		$scope.invokeApi(RVPaymentSrv.getPaymentList, $scope.reservationData.reservationId , $scope.cardsListSuccess);
	};

	$scope.init();

	/*
	* Initial screen - filled with deafult amount on bill
	* If any payment type attached to that bill then that credit card can be viewed in initial screen
	* Default payment method attached to that bill can be viewed in initial screen
	*/
	$scope.renderDefaultValues = function(){
		var ccExist = false;
		if($scope.renderData.paymentTypes.length > 0){
			if(!isEmptyObject($scope.billsArray[$scope.currentActiveBill].credit_card_details)){
				$scope.defaultPaymentTypeOfBill = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase();
				$scope.saveData.payment_type_id = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_id;
				angular.forEach($scope.renderData.paymentTypes, function(value, key) {
					if(value.name === "CC"){
						ccExist = true;
					}
				});
				$scope.saveData.paymentType = $scope.defaultPaymentTypeOfBill;
				checkReferencetextAvailable();
				if($scope.defaultPaymentTypeOfBill === 'CC'){
					if(!ccExist){
						$scope.saveData.paymentType = '';
					}
					$scope.isExistPaymentType = true;
					$scope.showCreditCardInfo = true;
					$scope.isfromBill = true;
					$scope.defaultPaymentTypeCard = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase();
					$scope.defaultPaymentTypeCardNumberEndingWith = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number;
					$scope.defaultPaymentTypeCardExpiry = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_expiry;
					if($rootScope.paymentGateway === "sixpayments"){
						$scope.isManual = true;
					}
				}
			}
		}

		var currentBillTotalFees = $scope.billsArray[$scope.currentActiveBill].total_fees;
		var defaultAmount = zeroAmount;
		if(currentBillTotalFees.length <= 0 ){
			defaultAmount = zeroAmount;
		}
		else if(currentBillTotalFees[0].balance_amount === "SR"){
			defaultAmount = currentBillTotalFees[0].masked_balance_amount;
		}
		else{
			defaultAmount =  currentBillTotalFees[0].balance_amount
		};

		$scope.renderData.defaultPaymentAmount = parseFloat(defaultAmount).toFixed(2);
		$scope.splitePaymentDetail["totalAmount"] = parseFloat(defaultAmount).toFixed(2);
		$scope.defaultRefundAmount = (-1)*parseFloat($scope.renderData.defaultPaymentAmount);


		if($scope.renderData.defaultPaymentAmount < 0 ){
			$scope.shouldShowMakePaymentButton = false;
		}

		if($scope.isStandAlone){
			$scope.feeData.feesInfo = $scope.billsArray[$scope.currentActiveBill].credit_card_details.fees_information;
			$scope.setupFeeData();
		}
	};

	/*
	* Action - On bill selection
	*/
	$scope.billNumberChanged = function(){
		$scope.currentActiveBill = parseInt($scope.renderData.billNumberSelected) - parseInt(1);
		$scope.renderDefaultValues();
	};

	$scope.splitSelected = false;
	var startingAmount = 0;

	/*
	* Params - Index of clicked button starting from 1.
	* Return - null - Updates totalNoOfsplits.
	*/
	$scope.spliteButtonClicked = function(index){

	
		$scope.splitePaymentDetail["totalNoOfsplits"] = index;	

		if(!$scope.splitSelected){
			$scope.splitSelected = true;
			startingAmount = angular.copy($scope.renderData.defaultPaymentAmount);
		};
		calulateSplitAmount();
		$scope.calculateFee();
	};
	/*
	* Calculates split amount. 
	*/
	var calulateSplitAmount = function(){
		//Amount spliting logic goes here, say total amount is 100 and no of split is 3,
		//So split = 33.33 ie totalAmount = 33.33*3 = 99.99 so carry = 100-99.99 = 0.01 
		//this carry is added with first split amount 
		$scope.splitePaymentDetail["splitAmount"] = parseFloat($filter("number")((startingAmount/$scope.splitePaymentDetail["totalNoOfsplits"]),2));
		$scope.splitePaymentDetail["carryAmount"] = parseFloat($filter("number")((startingAmount - ($scope.splitePaymentDetail["splitAmount"] *$scope.splitePaymentDetail["totalNoOfsplits"])),2));
		//For first payment , carry amount is added with split amount.
		$scope.renderData.defaultPaymentAmount = parseFloat($filter("number")(($scope.splitePaymentDetail["splitAmount"] + $scope.splitePaymentDetail["carryAmount"]),2));
	}
	/*
	* Updates SplitPaymentDetail. 
	*/
	var updateSplitPaymentDetail = function(){
		$scope.splitePaymentDetail["completedSplitPayments"] += 1;
		if($scope.splitePaymentDetail["completedSplitPayments"] === $scope.splitePaymentDetail["totalNoOfsplits"]){
			$scope.depositPaidSuccesFully = true;
		};
	};
	/*
	* Param - index - index of button start from 1.
	* return - String classname. 
	*/
	$scope.classForPaymentSplitButton = function(index){
		if(index === 1 && $scope.splitePaymentDetail["completedSplitPayments"]===0){
			return "checked";
		}else if(index <= $scope.splitePaymentDetail["completedSplitPayments"]){
			return "paid";
		}else if(index <= $scope.splitePaymentDetail["totalNoOfsplits"]){
			return "checked";
		}else{
			return "disabled";
		};
	};
	/*
	* Updates success payment detail.
	*/
	var updateSuccessMessage = function(){
		$scope.messageOfSuccessSplitPayment = $scope.messageOfSuccessSplitPayment +"SPLIT # "+$scope.splitePaymentDetail["completedSplitPayments"]+" OF "
		+$scope.renderData.defaultPaymentAmount+" PAID SUCCESSFULLY !"+"<br/>";
		//Clears older failure messages.
		$scope.clearPaymentErrorMessage(); 
	}
	/*
	* updates DefaultPaymentAmount
	*/
	var updateDefaultPaymentAmount = function(){
	$scope.renderData.defaultPaymentAmount = $scope.splitePaymentDetail["splitAmount"];
	}
	/*
	* Success call back of success payment
	*/
	var successPayment = function(data){
		$scope.$emit("hideLoader");
		$scope.authorizedCode = data.authorization_code;
		updateSplitPaymentDetail();
		updateSuccessMessage();
		updateDefaultPaymentAmount();
		data.billNumber = $scope.renderData.billNumberSelected;
		$scope.$emit('PAYMENT_SUCCESS',data);
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
				"payment_type":"CC",
				"payment_type_id": 1
			};
			$scope.cardsList.push(dataToGuestList);
			$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', dataToGuestList);
		};
	};
	/*
	* Failure call back of submitpayment
	*/
	var failedPayment = function(data){
		$scope.$emit("hideLoader");
		$scope.paymentErrorMessage = "SPLIT # "+($scope.splitePaymentDetail["completedSplitPayments"]+1)+" PAYMENT OF "+$scope.renderData.defaultPaymentAmount+" FAILED !"+"<br/>";
	};
	/*
	* Clears paymentErrorMessage
	*/
	$scope.clearPaymentErrorMessage = function(){
		$scope.paymentErrorMessage = '';
	};

	/*
	* Action - On click submit payment button
	*/
	$scope.submitPayment = function(){
	
		if($scope.saveData.paymentType === '' || $scope.saveData.paymentType === null){
			$timeout(function() {
				$scope.errorMessage = ["Please select payment type"];
			}, 1000);
		} else if($scope.renderData.defaultPaymentAmount === '' || $scope.renderData.defaultPaymentAmount === null){
			$timeout(function() {
				$scope.errorMessage = ["Please enter amount"];
			}, 1000);
		} else {

			$scope.errorMessage = "";
			var dataToSrv = {
				"postData": {
					"bill_number": $scope.renderData.billNumberSelected,
					"payment_type": $scope.saveData.paymentType,
					"amount": $scope.renderData.defaultPaymentAmount,
					"payment_type_id": ($scope.saveData.paymentType === 'CC') ? $scope.saveData.payment_type_id : null
				},
				"reservation_id": $scope.reservationData.reservationId
			};

			// add to guest card only if new card is added and checkbox is selected
			if($scope.newCardAdded){
				dataToSrv.postData.add_to_guest_card =  $scope.newPaymentInfo.addToGuestCard;
			}
			else{
				dataToSrv.postData.add_to_guest_card =  false;
			};


			if($scope.isShowFees()){
				if($scope.feeData.calculatedFee) {
					dataToSrv.postData.fees_amount = $scope.feeData.calculatedFee;
				}
				if($scope.feeData.feesInfo) {
					dataToSrv.postData.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
				}
			}

			if($scope.referenceTextAvailable){
				dataToSrv.postData.reference_text = $scope.renderData.referanceText;
			};
			if($scope.saveData.paymentType === "CC"){
				if(!$scope.showCreditCardInfo){
					$scope.errorMessage = ["Please select/add credit card"];
					$scope.showHideCreditCard();
				} else {
					$scope.errorMessage = "";
					dataToSrv.postData.credit_card_type = $scope.defaultPaymentTypeCard.toUpperCase();//Onlyifpayment_type is CC
				}
			}
			if($rootScope.paymentGateway === "sixpayments" && !$scope.isManual && $scope.saveData.paymentType === "CC"){
				dataToSrv.postData.is_emv_request = true;
				$scope.shouldShowWaiting = true;
				RVPaymentSrv.submitPaymentOnBill(dataToSrv).then(function(response) {
					$scope.shouldShowWaiting = false;
					successPayment(response);
				},function(error){
					$scope.errorMessage = error;
					$scope.shouldShowWaiting = false;
					failedPayment(error);
				});

			} else {
				$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToSrv, successPayment, failedPayment);
			}
			//$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToSrv,successPayment);
		}

	};

	var retrieveCardtype = function(){
		var cardType = $scope.newPaymentInfo.tokenDetails.isSixPayment?
					getSixCreditCardType($scope.newPaymentInfo.tokenDetails.card_type).toLowerCase():
					getCreditCardType($scope.newPaymentInfo.cardDetails.cardType).toLowerCase()
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

		checkReferencetextAvailableForCC();
		//To update bill screen
		$scope.billsArray[selectedBillIndex].credit_card_details.card_expiry = cardExpiry;
		$scope.billsArray[selectedBillIndex].credit_card_details.card_code = cardType;
		$scope.billsArray[selectedBillIndex].credit_card_details.card_number = cardNumberEndingWith;

		$scope.saveData.payment_type_id = data.id;

		angular.forEach($scope.cardsList, function(value, key) {
			value.isSelected = false;
		});
		$scope.showCCPage = false;
		$scope.showCreditCardInfo = true;
		$scope.$broadcast("clearCardDetails");

		if($scope.isStandAlone)	{
			$scope.feeData.feesInfo = data.fees_information;
			$scope.setupFeeData();
		}
		$scope.newCardAdded = true;
	};
	/*
	* To save new card
	*/
	var savePayment = function(data){
		var cardToken   = !data.tokenDetails.isSixPayment ? data.tokenDetails.session:data.tokenDetails.token_no;
		var expiryMonth = data.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(2, 4) :$scope.newPaymentInfo.cardDetails.expiryMonth;
		var expiryYear  = data.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(0, 2) :$scope.newPaymentInfo.cardDetails.expiryYear;
		var expiryDate  = (expiryMonth && expiryYear )? ("20"+expiryYear+"-"+expiryMonth+"-01"):"";
    	var cardCode = $scope.newPaymentInfo.tokenDetails.isSixPayment?
					   getSixCreditCardType($scope.newPaymentInfo.tokenDetails.card_type).toLowerCase():
					   $scope.newPaymentInfo.cardDetails.cardType;
    	// we will not attach new payment to reservation
		var dataToSave = {
				"card_expiry": expiryDate,
				"name_on_card": $scope.newPaymentInfo.cardDetails.userName,
				"payment_type": "CC",
				"token": cardToken,
				"card_code": cardCode
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
		$scope.saveData.payment_type_id =  $scope.cardsList[index].value;
		$scope.showCCPage = false;
		if($scope.isStandAlone)	{
			$scope.feeData.feesInfo = $scope.cardsList[index].fees_information;
			$scope.setupFeeData();
		}
		checkReferencetextAvailableForCC();
		$scope.newCardAdded = false;
	};

	$scope.$on('cardSelected',function(e,data){
		$scope.setCreditCardFromList(data.index);
	});

	$scope.$on("TOKEN_CREATED", function(e,data){

		$scope.newPaymentInfo = data;
		$scope.showCCPage = false;
		setTimeout(function(){
			savePayment(data);
		}, 200);


	});

	$scope.$on("MLI_ERROR", function(e,data){
		$scope.errorMessage = data;
	});

	$scope.$on('cancelCardSelection',function(e,data){
		$scope.showCCPage = false;
		$scope.isManual = false;
		$scope.saveData.paymentType = "";
	});

	$scope.$on("SHOW_SWIPED_DATA_ON_PAY_SCREEN", function(e, swipedCardDataToRender){
		$scope.showCCPage 						 = true;
		$scope.addmode                 			 = true;
		$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
	});

}]);