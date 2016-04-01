sntRover.controller('RVArTransactionsPayCreditsController',['$scope','RVPaymentSrv', 'ngDialog', '$rootScope','$timeout','$filter','rvAccountTransactionsSrv', function($scope, RVPaymentSrv, ngDialog, $rootScope,$timeout,$filter,rvAccountTransactionsSrv){
	BaseCtrl.call(this, $scope);

	$scope.feeData = {};
	var zeroAmount = parseFloat("0.00");
	$scope.saveData = {'paymentType':''};
	$scope.renderData = {};
	$scope.renderData.defaultPaymentAmount = $scope.arTransactionDetails.amount_owing;
    var bill_id = $scope.arTransactionDetails.company_or_ta_bill_id;
    //Added for CICO-26730
    $scope.cardsList =[];
    var isSixPayment  = false;
	var tokenDetails  = {};
	var cardDetails   = {};
	$scope.addmode = ($scope.cardsList.length > 0) ? false : true;
	/*
	* if no payment type is selected disable payment button
	*/
	$scope.disableMakePayment = function(){
		if($scope.saveData.paymentType.length > 0){
			return false;
		}
		else{
			return true;
		};
	};
	$scope.handleCloseDialog = function(){
		$scope.$emit('HANDLE_MODAL_OPENED');
		$scope.closeDialog();

	};
	/*
	* Fee setup starts here
	*/
	$scope.isShowFees = function(){
		var isShowFees = false;
		var feesData = $scope.feeData;
		if(typeof feesData === 'undefined' || typeof feesData.feesInfo === 'undefined' || feesData.feesInfo === null){
			isShowFees = false;
		}
		else if((feesData.defaultAmount  >= feesData.minFees) && $scope.isStandAlone && feesData.feesInfo.amount){
			if($scope.renderData.defaultPaymentAmount >= 0){
				isShowFees = ($scope.saveData.paymentType !=="") ? true :false;
			}
		}
		return isShowFees;

	};

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
	$scope.calculateTotalAmount = function(amount) {
		var feesAmount  = (typeof $scope.feeData.calculatedFee === 'undefined' || $scope.feeData.calculatedFee === '' || $scope.feeData.calculatedFee === '-') ? zeroAmount : parseFloat($scope.feeData.calculatedFee);
		var amountToPay = (typeof amount === 'undefined' || amount === '') ? zeroAmount : parseFloat(amount);
		$scope.feeData.totalOfValueAndFee = parseFloat(amountToPay + feesAmount).toFixed(2);
	};
	/*
	* Fee setup ends here
	*/
	var checkReferencetextAvailable = function(){
		angular.forEach($scope.renderData.paymentTypes, function(value, key) {
			if(value.name === $scope.saveData.paymentType){
				$scope.referenceTextAvailable = (value.is_display_reference)? true:false;
				$scope.feeData.feesInfo = value.charge_code.fees_information;
				$scope.setupFeeData();
			}
		});
	};
	/*
	* Get invoked when payment type is changed
	*/
	$scope.paymentTypeChanged =  function(){

		if($scope.saveData.paymentType === "CC" && $scope.paymentGateway !== 'sixpayments'){
				($scope.isExistPaymentType) ? $scope.showCreditCardInfo = true :$scope.showCardAddmode();
                    if ($rootScope.isStandAlone){
                        $rootScope.$broadcast('CLICK_ADD_NEW_CARD');
                    }
			} else {
				$scope.showCreditCardInfo = false;
			};
            console.info('$scope.saveData.paymentType: '+$scope.saveData.paymentType)
            if ($scope.saveData.paymentType === "GIFT_CARD"){
                $rootScope.$broadcast('giftCardSelectedFromGroups');
                $scope.isGiftCardPmt = true;
            } else {
                $scope.isGiftCardPmt = false;
            }
			checkReferencetextAvailable();
			checkforFee();
	};
	/*
	* Success call back - for initial screen
	*/
	$scope.getPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.renderData.paymentTypes = data;
		$scope.creditCardTypes = [];
		angular.forEach($scope.renderData.paymentTypes, function(item, key) {
			if(item.name === 'CC'){
				$scope.creditCardTypes = item.values;
			};
		});
		renderDefaultValues();
		checkReferencetextAvailable();
	};
	var init = function(){
		$scope.referenceTextAvailable = false;
		$scope.showInitalPaymentScreen = true;
		$scope.depositPaidSuccesFully = false;
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.getPaymentListSuccess);
	};
	init();
	/*
	* Success call back of success payment
	*/
	var successPayment = function(data){
		$scope.$emit("hideLoader");
		$scope.depositPaidSuccesFully = true;
		$scope.arTransactionDetails.amount_owing = parseFloat(data.amount_owing).toFixed(2);
        $scope.arTransactionDetails.available_credit = parseFloat(data.available_credit).toFixed(2);
        $scope.depositPaidSuccesFully = true;
		$scope.authorizedCode = data.authorization_code;
        //Reload the ar transaction listing after payment
        $scope.reloadARTransactionListing();
	};
	/*
	* Failure call back of submitpayment
	*/
	var failedPayment = function(data){
		$scope.$emit("hideLoader");
		$scope.errorMessage = data;
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
				"data_to_pass": {
					"bill_number": 1,
					"payment_type": $scope.saveData.paymentType,
					"amount": $scope.renderData.defaultPaymentAmount,
					"payment_method_id" : $scope.saveData.payment_type_id
				},
				"bill_id":bill_id
			};
			if($scope.isShowFees()){
				if($scope.feeData.calculatedFee) {
					dataToSrv.data_to_pass.fees_amount = $scope.feeData.calculatedFee;
				}
				if($scope.feeData.feesInfo) {
					dataToSrv.data_to_pass.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
				}
			}

			if($scope.referenceTextAvailable){
				dataToSrv.data_to_pass.reference_text = $scope.renderData.referanceText;
			};

			if($rootScope.paymentGateway === "sixpayments" && !$scope.isManual && $scope.saveData.paymentType === "CC"){
				dataToSrv.data_to_pass.is_emv_request = true;
				$scope.shouldShowWaiting = true;
				//Six payment SWIPE actions
				rvAccountTransactionsSrv.submitPaymentOnBill(dataToSrv).then(function(response) {
					$scope.shouldShowWaiting = false;
					successPayment(response);
				},function(error){
					$scope.errorMessage = error;
					$scope.shouldShowWaiting = false;
				});
			} else {
				$scope.invokeApi(rvAccountTransactionsSrv.submitPaymentOnBill, dataToSrv, successPayment, failedPayment);
			}

		}
	};

	$scope.showCardAddmode = function(){
		$scope.showCCPage = true;
        $scope.swippedCard = true;
	};

	/**
	* Checks and set up fees if available for the selected payment type
	*/
	var checkforFee = function(){
		_.each($scope.renderData.paymentTypes, function(value) {
			  if(value.name !== "CC" 	&& value.name === $scope.saveData.paymentType){
					$scope.feeData.feesInfo = value.charge_code.fees_information;
					$scope.setupFeeData();
			  };
		});
	};

	/**
	* card selection cancelled - from cards ctrl
	*/
	$scope.$on('cancelCardSelection',function(e,data){
		$scope.showCCPage = false;
        $scope.swippedCard = false;
		$scope.isManual = false;
		$scope.saveData.paymentType = "";
	});

	/**
	 * retrieve token from paymnet gateway - from cards ctrl
	 */
	$scope.$on("TOKEN_CREATED", function(e, data){
	 	$scope.newPaymentInfo = data;
	 	$scope.showCCPage = false;
        $scope.swippedCard = false;
	 	setTimeout(function(){
	 		savePayment(data);
	 	}, 200);
	 	runDigestCycle();
	 });

	/*
	 * To save new card
	 */
	 var savePayment = function(data){

		isSixPayment  = angular.copy($scope.newPaymentInfo.tokenDetails.isSixPayment);
		tokenDetails  = angular.copy($scope.newPaymentInfo.tokenDetails);
		cardDetails   = angular.copy($scope.newPaymentInfo.cardDetails);

		var cardToken   = !isSixPayment ? tokenDetails.session:data.tokenDetails.token_no;
		var expiryMonth = isSixPayment ? tokenDetails.expiry.substring(2, 4) :cardDetails.expiryMonth;
		var expiryYear  = isSixPayment ? tokenDetails.expiry.substring(0, 2) :cardDetails.expiryYear;
		var expiryDate  = (expiryMonth && expiryYear )? ("20"+expiryYear+"-"+expiryMonth+"-01"):"";
		var cardCode = 	isSixPayment?
						getSixCreditCardType(tokenDetails.card_type).toLowerCase():
						cardDetails.cardType;


		$scope.callAPI(rvAccountTransactionsSrv.savePaymentDetails, {
			successCallBack: successNewPayment,
			params: {
				"bill_id": bill_id,
				"data_to_pass":{
					"card_expiry": expiryDate,
					"name_on_card": $scope.newPaymentInfo.cardDetails.userName,
					"payment_type": "CC",
					"token": cardToken,
					"card_code": cardCode
				}
			}
		});
	};


	/*
	 * Success call back of save new card
	*/
	 var successNewPayment = function(data){

	 	$scope.$emit("hideLoader");
	 	var cardType = "";
		var cardNumberEndingWith = "";
		var cardExpiry = "";
		var swipedData = angular.copy($scope.swipedCardDataToSave);
		if(!isEmptyObject(swipedData)){
			cardType =  swipedData.cardType.toLowerCase();
			cardNumberEndingWith = swipedData.cardNumber.slice(-4);
			cardExpiry = swipedData.cardExpiryMonth+"/"+swipedData.cardExpiryYear;
			$scope.saveData.paymentType = "CC";
		}
		else{
			cardType = retrieveCardtype(isSixPayment,tokenDetails,cardDetails);
			cardNumberEndingWith = retrieveCardNumber(isSixPayment,tokenDetails,cardDetails);
	 		cardExpiry = retrieveCardExpiryDate(isSixPayment,tokenDetails,cardDetails);

		}

	 	$scope.defaultPaymentTypeCard = cardType;
	 	$scope.defaultPaymentTypeCardNumberEndingWith = cardNumberEndingWith;
	 	$scope.defaultPaymentTypeCardExpiry = cardExpiry;

	 	//check if the selected card has reference
	 	checkReferencetextAvailableForCC();

	 	//check if the selected card has fees
	 	_.each($scope.renderData.paymentTypes, function(paymentType) {
			  if(paymentType.name === "CC" ){
			  	_.each(paymentType.values, function(paymentType) {
			  		if(cardType.toUpperCase() === paymentType.cardcode)
					{
						$scope.feeData.feesInfo = paymentType.charge_code.fees_information;
						$scope.setupFeeData();
					}

				});
			  };
		});


	 	$scope.saveData.payment_type_id = data.id;
	 	$scope.showCCPage = false;
        $scope.swippedCard = false;
	 	$scope.showCreditCardInfo = true;
	 	$scope.newCardAdded = true;
	 	$scope.swipedCardDataToSave = {};

	 };

	/*
	 * Checks whether the selected credit card btn needs to show or not
	*/
	 $scope.showSelectedCreditCardButton = function(){
     	if ($scope.showCreditCardInfo && !$scope.showCCPage && ($scope.paymentGateway !== 'sixpayments' || $scope.isManual) && $scope.saveData.paymentType === 'CC' && !$scope.depositPaidSuccesFully){
           return true;
        } else {
           return false;
        }
    };

    /*
	 * Checks whether reference text is available for CC
	*/
    var checkReferencetextAvailableForCC = function(){
		//call utils fn
		$scope.referenceTextAvailable = checkIfReferencetextAvailableForCC($scope.renderData.paymentTypes,$scope.defaultPaymentTypeCard);
	};

	//Added for CICO-26730
	$scope.changeOnsiteCallIn = function () {
		$scope.showCCPage = ($scope.isManual) ? true :false;
	};

 	//Added for CICO-26730
    $scope.$on('changeOnsiteCallIn', function(event){
        $scope.isManual =  !$scope.isManual;
        $scope.changeOnsiteCallIn();
    });

    /**
	 * to run angular digest loop,
	 * will check if it is not running
	 * return - None
	 */
	var runDigestCycle = function() {
		if (!$scope.$$phase) {
			$scope.$digest();
		}
	};

	/*
	* Success call back of MLI swipe - from cards ctrl
	*/
	$scope.$on("SHOW_SWIPED_DATA_ON_PAY_SCREEN", function(e, swipedCardDataToRender){
		//set variables to display the add mode
		$scope.showCCPage  = true;
        $scope.swippedCard = true;
		$scope.addmode  = true;
		$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
	});


	$scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave){

		$scope.swipedCardDataToSave = swipedCardDataToSave;
		var data 			= swipedCardDataToSave;
		data.payment_credit_type = swipedCardDataToSave.cardType;
		data.credit_card = swipedCardDataToSave.cardType;
		data.card_expiry = "20"+swipedCardDataToSave.cardExpiryYear+"-"+swipedCardDataToSave.cardExpiryMonth+"-01";
	    $scope.callAPI(rvAccountTransactionsSrv.savePaymentDetails, {
			successCallBack: successNewPayment,
			params: {
				"bill_id": bill_id,
				"data_to_pass":data
			}
		});

	});

	/**
	 * MLI error - from cards ctrl
	 */
	$scope.$on("MLI_ERROR", function(e,data){
	 	$scope.errorMessage = data;
	});

	/*
	* Invoke this method to show the refund amount on the button in the payment screen
	*/
	var renderDefaultValues = function(){
		$scope.defaultRefundAmount = (-1)*parseFloat($scope.renderData.defaultPaymentAmount);
		if($scope.renderData.defaultPaymentAmount < 0){
				$scope.defaultRefundAmount = (-1)*parseFloat($scope.renderData.defaultPaymentAmount);
				$scope.shouldShowMakePaymentButton = false;
		} else {
				$scope.shouldShowMakePaymentButton = true;
		};
	};

}]);