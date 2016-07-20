sntPay.controller('sntPaymentController', function($scope, sntPaymentSrv) {
	// TODO: Fetch All cards for the guest ID

	$scope.payment = {
		referenceText: "",
		amount: 0,
		isRateSuppressed: false,
		isEditable: false,
		addToGuestCard: false
	};

	$scope.showSelectedCard = function() {
		//below condition may be modified wrt payment gateway and all
		var isCCPresent = ($scope.selectedPaymentType === "CC" && $scope.attachedCc.ending_with.length > 0);
		return isCCPresent;
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
			var payment_type_id = null;
			if ($scope.selectedPaymentType === 'CC' && $scope.selectedCard !== -1) {
				payment_type_id = $scope.selectedCardId;
			} else {
				payment_type_id = null;
			};
			var params = {
				"postData": {
					"bill_number": 1,
					"payment_type": $scope.selectedPaymentType,
					"amount": $scope.feeData.totalOfValueAndFee, //amount + fee
					"payment_type_id": payment_type_id
				},
				"reservation_id": $scope.reservationId
			};

			if ($scope.isDisplayRef) {
				params.postData.reference_text = $scope.payment.referenceText;
			}

			//to do
			//handle fees and ref text

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

	$scope.onPaymentInfoChange = function() {
		//NOTE: Fees information is to be calculated only for standalone systems
		//TODO: Handle CC & GC Seperately Here
		var selectedPaymentType = _.find($scope.paymentTypes, {
				name: $scope.selectedPaymentType
			}),
			feeInfo = selectedPaymentType && selectedPaymentType.charge_code && selectedPaymentType.charge_code.fees_information || {},
			currFee = sntPaymentSrv.calculateFee($scope.payment.amount, feeInfo);

		$scope.isDisplayRef = selectedPaymentType && selectedPaymentType.is_display_reference;

		$scope.feeData = {
			calculatedFee: currFee.calculatedFee,
			totalOfValueAndFee: currFee.totalOfValueAndFee,
			showFee: currFee.showFees
		};
	};

	$scope.onFeeOverride = function() {
		var totalAmount = parseFloat($scope.feeData.calculatedFee) + parseFloat($scope.payment.amount);
		$scope.feeData.totalOfValueAndFee = totalAmount.toFixed(2);
	};

	//------------------------------------------------------------------------------------------------------------------
	//
	//------------------------------------------------------------------------------------------------------------------
	var initiate = function() {
		$scope.onPaymentInfoChange();
		$scope.actionType = !!$scope.actionType ? $scope.actionType : 'DEFAULT';

		console.log("initiate");

		$scope.payment.amount = $scope.amount || 0;
		$scope.payment.isRateSuppressed = $scope.isRateSuppressed || false;
		$scope.payment.isEditable = $scope.isEditable || false;

	}();


});