sntPay.controller('payMLIOperationsController', function($scope, sntPaymentSrv) {


	var emptyCardDetails = function() {
		$scope.cardData.cardNumber = "";
		$scope.cardData.CCV = "";
		$scope.cardData.expiryMonth = "";
		$scope.cardData.expiryYear = "";
	};

	var setUpSessionDetails = function() {
		//for fetching MLI token, we need to pass these params
		var sessionDetails = {};
		sessionDetails.cardNumber = $scope.cardData.cardNumber;
		sessionDetails.cardSecurityCode = $scope.cardData.CCV;
		sessionDetails.cardExpiryMonth = $scope.cardData.expiryMonth;
		sessionDetails.cardExpiryYear = $scope.cardData.expiryYear;
		return sessionDetails;
	};

	var retrieveCardtype = function() {
		var cardType = sntPaymentSrv.getCreditCardTypeForMLI($scope.cardData.cardType);
		return cardType;
	};

	var notifyParent = function(tokenDetails) {
		var expiryMonth = angular.copy($scope.cardData.expiryMonth);
		var expiryYear = angular.copy($scope.cardData.expiryYear);
		var cardExpiry = (expiryMonth && expiryYear) ? ("20" + expiryYear + "-" + expiryMonth + "-01") : "";
		var paymentData = {
			apiParams : {
				name_on_card: $scope.cardData.userName,
				payment_type: "CC",
				token: tokenDetails.session,
				card_expiry: cardExpiry
			},
			cardDisplayData : {
				card_code: retrieveCardtype(),
				ending_with : $scope.cardData.cardNumber.slice(-4),
				expiry_date : expiryMonth+" / "+expiryYear
			}
		};
		$scope.$emit("CC_TOKEN_GENERATED", paymentData);
	};


	var notifyParentError = function(errorMessage) {
		console.error(errorMessage);
		$scope.$emit("MLI_ERROR", errorMessage);
	};


	//to set your merchant ID provided by Payment Gateway
	HostedForm.setMerchant($scope.payment.MLImerchantId);

	/*
	 * Function to get MLI token on click 'Add' button in form
	 */
	$scope.getMLIToken = function($event) {
		$event.preventDefault();
		if (false) {
			//TODO:handle wipe
		} else {
			var sessionDetails = setUpSessionDetails();
			var successCallBack = function(response) {
				notifyParent(response);
			};
			var failureCallback = function(errorMessage) {
				notifyParentError(errorMessage);
			};
			sntPaymentSrv.fetchMLIToken(sessionDetails, successCallBack, failureCallback);
		};
	};

	/****************** init ***********************************************/

	(function() {

		$scope.cardData = {
			cardNumber: "",
			CCV: "",
			expiryMonth: "",
			expiryYear: "",
			userName: ""
		}

	})();

});