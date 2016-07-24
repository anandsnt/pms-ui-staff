sntPay.controller('paySixPayController', function($scope, sntPaymentSrv) {

	var retrieveCardDetails = function(tokenDetails) {
		var cardDetails = {};
		cardDetails.cardType = tokenDetails.token_no.substr(tokenDetails.token_no.length - 4);
		cardDetails.expiryMonth = tokenDetails.expiry.substring(2, 4);
		cardDetails.expiryYear  = tokenDetails.expiry.substring(0, 2);
		//for displaying
		cardDetails.expiryDate = cardDetails.expiryMonth+" / "+cardDetails.expiryYear;
		//for API params
		cardDetails.cardExpiry = (cardDetails.expiryMonth && cardDetails.expiryYear) ? ("20" + cardDetails.expiryYear + "-" + cardDetails.expiryMonth + "-01") : "";
		cardDetails.cardCode = sntPaymentSrv.getSixPayCreditCardType(tokenDetails.card_type).toLowerCase();
		//last 4 number of card
		cardDetails.endingWith = tokenDetails.token_no.substr(tokenDetails.token_no.length - 4);
		cardDetails.token = tokenDetails.token_no,
		cardDetails.nameOnCard = $scope.payment.guestFirstName+' '+$scope.payment.guestLastName;
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

	$scope.$on('INITIATE_CHIP_AND_PIN_PAYMENT',function(event,data){
		console.log(data);
	});
	/****************** init ***********************************************/

	(function() {
		//Initially set Manaul card Entry if card is attached already
		var isCCPresent = angular.copy($scope.showSelectedCard());
		$scope.payment.manualSixPayCardEntry = isCCPresent && $scope.paymentGateway === 'sixpayments' ?  true : false;

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