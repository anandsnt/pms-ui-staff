sntPay.controller('sntPaymentController', function($scope, sntPaymentSrv) {

	$scope.payment = {
		reference_text: "",
		amount: 0
	};

	$scope.addToGuestCard = false;
	$scope.depositData = {};
	$scope.depositData.amount = angular.copy($scope.amount);
	$scope.showSelectedCard = function() {
		//below condition may be modified wrt payment gateway and all
		var isCCPresent = ($scope.selectedPaymentType === "CC" && $scope.attachedCc.ending_with.length > 0);
		return isCCPresent;
	};

	$scope.shouldHidePayMentButton = function() {
		var paymentType = $scope.selectedPaymentType;
		return (paymentType === '' || paymentType === null || !$scope.hasPermissionToMakePayment);
	};


	$scope.payLater = function() {
		$scope.$emit('PAY_LATER');
	};

	$scope.submitPaymentForReservation = function() {

		if ($scope.depositData.amount === '' || $scope.depositData.amount === null) {
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
				params.postData.reference_text = $scope.payment.reference_text;
			}

			//to do
			//handle fees and ref text

			$scope.$emit('showLoader');
			sntPaymentSrv.submitPayment(params).then(function(response) {
					response.depositAmount = $scope.depositData.amount;
					response.feesAmount = 0;
					$scope.$emit('PAYMENT_SUCCESS', response);
					$scope.$emit('hideLoader');
				},
				function(errorMessage) {
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
			currFee = sntPaymentSrv.calculateFee($scope.depositData.amount, feeInfo);

		$scope.isDisplayRef = selectedPaymentType && selectedPaymentType.is_display_reference;

		$scope.feeData = {
			calculatedFee: currFee.calculatedFee,
			totalOfValueAndFee: currFee.totalOfValueAndFee,
			showFee: currFee.showFees
		};
	};

	$scope.onFeeOverride = function() {
		var totalAmount = parseFloat($scope.feeData.calculatedFee) + parseFloat($scope.depositData.amount);
		$scope.feeData.totalOfValueAndFee = totalAmount.toFixed(2);
	};

	var initiate = function() {
		$scope.onPaymentInfoChange();
		$scope.actionType = !!$scope.actionType ? $scope.actionType : 'DEFAULT';
	}();


});