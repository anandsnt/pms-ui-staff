sntPay.controller('sntPaymentController', function($scope, sntPaymentSrv) {
	// TODO: Fetch All cards for the guest ID

	$scope.payment = {
		referenceText: "",
		amount: 0,
		isRateSuppressed: false,
		isEditable: false,
		addToGuestCard: false,
		billNumber: 1,
		linkedCreditCards:[]
	};

	$scope.showSelectedCard = function() {
		//below condition may be modified wrt payment gateway and all
		var isCCPresent = ($scope.selectedPaymentType === "CC" && $scope.attachedCc.ending_with.length > 0);
		return (isCCPresent && $scope.payment.screenMode === "PAYMENT_MODE");
	};

	$scope.shouldHidePaymentButton = function() {
		return !$scope.selectedPaymentType || !$scope.hasPermission;
	};

	//------------------------------------------------------------------------------------------------------------------
	//
	//------------------------------------------------------------------------------------------------------------------

	$scope.payLater = function() {
		$scope.$emit('PAY_LATER');
	};

	$scope.submitPayment = function() {
		if ($scope.payment.amount === '' || $scope.payment.amount === null) {
			$scope.$emit('NO_AMOUNT_NOTIFICATION');
		} else {
			//for CC payments, we need payment type id
			var paymentTypeId = null;
			if ($scope.selectedPaymentType === 'CC' && $scope.selectedCard !== -1) {
				paymentTypeId = $scope.attachedCc.value;
			} else {
				paymentTypeId = null;
			};

			var params = {
				"postData": {
					"bill_number": $scope.payment.billNumber,
					"payment_type": $scope.selectedPaymentType,
					"amount": $scope.payment.amount,
					"payment_type_id": paymentTypeId,
				},
				"reservation_id": $scope.reservationId
			};

			if($scope.feeData.showFee){
				//if fee was calculated wrt to payment type
				params.postData.fees_amount = $scope.feeData.calculatedFee;
				params.postData.fees_charge_code_id = $scope.feeData.feeChargeCode;
			}

			if ($scope.isDisplayRef) {
				//if reference text is presernt for the payment type
				params.postData.reference_text = $scope.payment.referenceText;
			}

			//we need to notify the parent controllers to show loader
			//as this is an external directive
			$scope.$emit('showLoader');

			sntPaymentSrv.submitPayment(params).then(function(response) {
					console.log("payment success" + $scope.payment.amount);
					response.amountPaid = $scope.payment.amount;
					// NOTE: The feePaid key and value would be sent IFF a fee was applied along with the payment
					if ($scope.feeData) {
						response.feePaid = $scope.feeData.calculatedFee;
					}
					$scope.$emit('PAYMENT_SUCCESS', response);
					$scope.$emit('hideLoader');
				},
				function(errorMessage) {
					console.log("payment success" + $scope.payment.amount);
					$scope.$emit('PAYMENT_FAILED', errorMessage);
					$scope.$emit('hideLoader');
				});
		};
	};

	var existingCardsPresent = function(){
		return $scope.payment.linkedCreditCards.length > 0;
	};

	$scope.onPaymentInfoChange = function() {
		//NOTE: Fees information is to be calculated only for standalone systems
		//TODO: Handle CC & GC Seperately Here
		var selectedPaymentType = _.find($scope.paymentTypes, {
				name: $scope.selectedPaymentType
			}),
			feeInfo = selectedPaymentType && selectedPaymentType.charge_code && selectedPaymentType.charge_code.fees_information || {},
			currFee = sntPaymentSrv.calculateFee($scope.payment.amount, feeInfo);

		$scope.isDisplayRef = selectedPaymentType && selectedPaymentType.is_display_reference;

		//If the changed payment type is CC
		//and payment gateway is MLI show CC addition options
		//if there are attached cards, show them first
		if(selectedPaymentType.name === "CC"){
			if($scope.paymentGateway === "MLI"){
				$scope.payment.screenMode = "CARD_ADD_MODE";
				$scope.payment.addCCMode = existingCardsPresent() ? "EXISTING_CARDS" : "ADD_CARD";
			};
		};

		$scope.feeData = {
			calculatedFee: currFee.calculatedFee,
			totalOfValueAndFee: currFee.totalOfValueAndFee,
			showFee: currFee.showFees,
			feeChargeCode: currFee.feeChargeCode
		};
	};

	$scope.onFeeOverride = function() {
		var totalAmount = parseFloat($scope.feeData.calculatedFee) + parseFloat($scope.payment.amount);
		$scope.feeData.totalOfValueAndFee = totalAmount.toFixed(2);
	};

	/**************** CC handling ********************/

	$scope.onCardClick =  function(){
		$scope.payment.screenMode = "CARD_ADD_MODE";
	};
	$scope.cancelCardSelection = function(){
		$scope.payment.screenMode = "PAYMENT_MODE";
	};

	//------------------------------------------------------------------------------------------------------------------
	//
	//------------------------------------------------------------------------------------------------------------------

	(function() {
		$scope.actionType = !!$scope.actionType ? $scope.actionType : 'DEFAULT';

		$scope.payment.amount = $scope.amount || 0;
		$scope.payment.isRateSuppressed = $scope.isRateSuppressed || false;
		$scope.payment.isEditable = $scope.isEditable || false;
		$scope.payment.billNumber = $scope.payment.billNumber || 1;
		$scope.payment.linkedCreditCards = $scope.linkedCreditCards || [];
		$scope.onPaymentInfoChange();
		$scope.payment.screenMode = "PAYMENT_MODE";
		$scope.payment.addCCMode = "ADD_CARD";
		//to change to mapping
		$scope.paymentGatewayUIInterfaceUrl = "/assets/partials/payMLIPartial.html";
	})();

});