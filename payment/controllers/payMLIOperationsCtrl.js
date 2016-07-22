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

	var notifyParent = function(tokenDetails){
		console.log(tokenDetails);
	};


	var notifyParentError = function(errorMessage){
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
			addToGuestCard: false,
			cardNumber: "",
			CCV: "",
			expiryMonth: "",
			expiryYear: "",
			userName: ""
		}

	})();

});