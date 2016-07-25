sntPay.controller('paySixPayController', function($scope, sntPaymentSrv) {

	var retrieveCardDetails = function(tokenDetails) {
		var cardDetails = {};
		cardDetails.cardType = tokenDetails.token_no.substr(tokenDetails.token_no.length - 4);
		cardDetails.expiryMonth = tokenDetails.expiry.substring(2, 4);
		cardDetails.expiryYear = tokenDetails.expiry.substring(0, 2);
		//for displaying
		cardDetails.expiryDate = cardDetails.expiryMonth + " / " + cardDetails.expiryYear;
		//for API params
		cardDetails.cardExpiry = (cardDetails.expiryMonth && cardDetails.expiryYear) ? ("20" + cardDetails.expiryYear + "-" + cardDetails.expiryMonth + "-01") : "";
		cardDetails.cardCode = sntPaymentSrv.getSixPayCreditCardType(tokenDetails.card_type).toLowerCase();
		//last 4 number of card
		cardDetails.endingWith = tokenDetails.token_no.substr(tokenDetails.token_no.length - 4);
		cardDetails.token = tokenDetails.token_no;
		cardDetails.nameOnCard = $scope.payment.guestFirstName + ' ' + $scope.payment.guestLastName;
		return cardDetails;
	};

	var notifyParent = function(tokenDetails) {
		var cardDetails = retrieveCardDetails(tokenDetails);
		var paymentData = {
			apiParams: {
				name_on_card: cardDetails.nameOnCard,
				payment_type: "CC",
				token: cardDetails.token,
				card_expiry: cardDetails.cardExpiry
			},
			cardDisplayData: {
				card_code: cardDetails.cardCode,
				ending_with: cardDetails.endingWith,
				expiry_date: cardDetails.expiryDate
			}
		};
		$scope.$emit("CC_TOKEN_GENERATED", paymentData);
	};


	var notifyParentError = function(errorMessage) {
		console.error(errorMessage);
	};

	var proceedChipAndPinPayment = function(params) {
		//we need to notify the parent controllers to show loader
		//as this is an external directive
	
		$scope.$emit("SHOW_SIX_PAY_LOADER");
		sntPaymentSrv.submitPaymentForChipAndPin(params).then(function(response) {
				console.log("payment success" + $scope.payment.amount);
				response.amountPaid = $scope.payment.amount;
				response.authorizationCode = response.authorization_code;
				// NOTE: The feePaid key and value would be sent IFF a fee was applied along with the payment
				if ($scope.feeData) {
					response.feePaid = $scope.feeData.calculatedFee;
				};
				$scope.selectedCC.value = response.payment_method.id;
				$scope.selectedCC.card_code = response.payment_method.card_type;
				$scope.selectedCC.ending_with = response.payment_method.ending_with;
				$scope.selectedCC.expiry_date = response.payment_method.expiry_date;
				response.cc_details = angular.copy($scope.selectedCC);
				$scope.$emit('PAYMENT_SUCCESS', response);
				$scope.$emit("HIDE_SIX_PAY_LOADER");
			},
			function(errorMessage) {
				console.log("payment failed" + errorMessage);
				$scope.$emit('PAYMENT_FAILED', errorMessage);
				$scope.$emit("HIDE_SIX_PAY_LOADER");
			});
	};

	$scope.$on('INITIATE_CHIP_AND_PIN_PAYMENT', function(event, data) {
		var paymentParams = data;
		paymentParams.postData.is_emv_request = true;
		paymentParams.postData.workstation_id = $scope.payment.workstationId;
		paymentParams.emvTimeout = $scope.payment.emvTimeout;
		proceedChipAndPinPayment(data);
	});
	/****************** init ***********************************************/

	(function() {
		//Initially set Manaul card Entry if card is attached already
		var isCCPresent = angular.copy($scope.showSelectedCard());
		$scope.payment.isManualEntryInsideIFrame = isCCPresent && $scope.paymentGateway === 'sixpayments' ? true : false;

		//handle six payment iFrame communication
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

		eventer(messageEvent, function(e) {
			var responseData = e.data;
			if (responseData.response_message === "token_created") {
				notifyParent(responseData);
			}
		}, false);
	})();

});