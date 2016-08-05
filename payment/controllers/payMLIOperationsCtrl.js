angular.module("sntPay").controller('payMLIOperationsController', ['$scope', 'sntPaymentSrv', function($scope, sntPaymentSrv) {

	var isSwiped;
	var swipedCCData;

	/**
	 * to initialize the carda
	 * @return undefined
	 */
	var initializeCardData = () => {
		isSwiped = false;
		swipedCCData = {};
		$scope.cardData = {
			cardNumber: "",
			CCV: "",
			expiryMonth: "",
			expiryYear: "",
			userName: ""
		}
	};

	$scope.$on('RESET_CARD_DETAILS', function(e, data) {
		initializeCardData();
	});

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
			apiParams: {
				name_on_card: $scope.cardData.userName,
				card_code: retrieveCardtype(),
				payment_type: "CC",
				token: tokenDetails.session,
				card_expiry: cardExpiry
			},
			cardDisplayData: {
				name_on_card: $scope.cardData.userName,
				card_code: retrieveCardtype(),
				ending_with: $scope.cardData.cardNumber.slice(-4),
				expiry_date: expiryMonth + " / " + expiryYear
			}
		};
		$scope.$emit("CC_TOKEN_GENERATED", paymentData);
	};


	var notifyParentError = function(errorMessage) {
		console.error(errorMessage);
		$scope.$emit("ERROR_OCCURED", errorMessage);
	};

	var doSwipedCardActions = function(swipedCardData) {

		var swipeOperationObj = new SwipeOperation();
		var swipedCardDataToSave = swipeOperationObj.createSWipedDataToSave(swipedCardData);

		var apiParams = swipedCardDataToSave;
		apiParams.payment_credit_type = swipedCardDataToSave.cardType;
		apiParams.credit_card = swipedCardDataToSave.cardType;
		apiParams.card_expiry = "20" + swipedCardDataToSave.cardExpiryYear + "-" + swipedCardDataToSave.cardExpiryMonth + "-01";
		apiParams.card_name = swipedCardData.nameOnCard;

		var paymentData = {
			apiParams: apiParams,
			cardDisplayData: {
				name_on_card: swipedCardData.nameOnCard,
				card_code: swipedCardDataToSave.cardType,
				ending_with: $scope.cardData.cardNumber.slice(-4),
				expiry_date: swipedCardDataToSave.cardExpiryMonth + " / " + swipedCardDataToSave.cardExpiryYear
			}
		};
		$scope.$emit("CC_TOKEN_GENERATED", paymentData);
	};

	/*
	 * Function to get MLI token on click 'Add' button in form
	 */
	$scope.getMLIToken = function($event) {
		$event.preventDefault();
		if (isSwiped) {
			doSwipedCardActions(swipedCCData);
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

	var renderDataFromSwipe = function(event, swipedCardData) {
		isSwiped = true;
		swipedCCData = swipedCardData;
		$scope.cardData.cardNumber = swipedCardData.cardNumber;
		$scope.cardData.userName = swipedCardData.nameOnCard;
		$scope.cardData.expiryMonth = swipedCardData.cardExpiryMonth;
		$scope.cardData.expiryYear = swipedCardData.cardExpiryYear;
		$scope.cardData.cardType = swipedCardData.cardType;
		$scope.payment.screenMode = "CARD_ADD_MODE";
		$scope.payment.addCCMode = "ADD_CARD";
	};

	$scope.$on("RENDER_SWIPED_DATA", function(e, data) {
		console.log(data);
		renderDataFromSwipe(e, data);
	});

	/****************** init ***********************************************/

	(function() {
		//to set your merchant ID provided by Payment Gateway
		HostedForm.setMerchant($scope.hotelConfig.mliMerchantId);

		//
		initializeCardData();

	})();

}]);