sntPay.controller('sntPaymentController', function($scope, sntPaymentSrv) {

	var zeroAmount = parseFloat("0.00");

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

	var initiate = function() {

		$scope.actionType = !!$scope.actionType ? $scope.actionType : 'DEFAULT';
	}();


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
					"amount": $scope.depositData.amount,
					"payment_type_id": payment_type_id
				},
				"reservation_id": $scope.reservationId
			};
			//to do
			//handle fees and ref text

			$scope.$emit('SHOW_LOADER');
			sntPaymentSrv.submitPayment(params).then(function(response) {
					response.depositAmount = $scope.depositData.amount;
					response.feesAmount    = 0;
					$scope.$emit('PAYMENT_SUCCESS', response);
					$scope.$emit('HIDE_LOADER');
				},
				function(errorMessage) {
					$scope.$emit('PAYMENT_FAILED', errorMessage);
					$scope.$emit('HIDE_LOADER');
				});

		};
	};


});