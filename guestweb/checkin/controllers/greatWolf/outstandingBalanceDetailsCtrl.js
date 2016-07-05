(function() {
	var outstandingBalanceDetailsController = function($scope, $state, $rootScope, guestDetailsService, ccVerificationService, sntGuestWebSrv) {



		$scope.goToNextPage = function() {
			$rootScope.skipBalanceCollection = true;
			$state.go('preCheckinStatus');
		};

		$scope.changeCard = function() {
			//card details
			$scope.cardNumber = "";
			$scope.ccv = "";
			$scope.monthSelected = "";
			$scope.yearSelected = "";
			$scope.ccSaved = false;
			$scope.cardName = "";
			//error flags
			$scope.cardError = false;
			$scope.paymentError = false;
			$scope.cardNotFilledError = false;
			//mode
			$scope.mode = "CC_ENTRY_MODE";
		};

		$scope.payBalance = function() {
			$scope.isLoading = true;

			var params = {
				"bill_number": 1,
				"payment_type": "CC",
				"amount": $rootScope.outStandingBalance,
				"payment_type_id": $scope.paymentMethodDetails.payment_details.id
			};
			//submit payment
			guestDetailsService.submitPayment(params).then(function(response) {
				$scope.isLoading = false;
				$scope.paymentSuccess = true;
			}, function() {
				$scope.isLoading = false;
				$scope.paymentError = true;
			});
		};


		/********************** card entry ***************************/
		//set merchant id

		HostedForm.setMerchant($rootScope.mliMerchatId);


		var saveCardToReservation = function() {
			//save cc success
			var ccSaveSuccesActions = function(response) {
					$rootScope.isCCOnFile = true;
					$rootScope.isCcAttachedFromGuestWeb = true;
					$scope.cardPresent = true;
					var cardNumberLength = $scope.cardNumber.length;
					$scope.paymentMethodDetails.payment_details = {
						"card_type_image": "images/" + response.data.credit_card_type + ".png",
						"card_number": $scope.cardNumber.toString().substring(cardNumberLength - 4, cardNumberLength),
						"card_expiry": $scope.monthSelected + "/" + $scope.yearSelected.toString().substring(2, 4),
						"card_name": $scope.cardName,
						"id": response.data.id
					}
					$scope.cardError = false;
					$scope.paymentError = false;
					$scope.mode = "PAYMENT_MODE";
				}
				//setup params
			var cardExpiryDate = $scope.yearSelected + "-" + $scope.monthSelected + "-" + "01";
			var data = {
				'reservation_id': $rootScope.reservationID,
				'token': MLISessionId,
				'card_expiry': cardExpiryDate,
				'payment_type': "CC",
				'card_name': $scope.cardName
			};
			//call API
			$scope.isLoading = true;
			ccVerificationService.verifyCC(data).then(function(response) {
				$scope.isLoading = false;
				if (response.status === "success") {
					ccSaveSuccesActions(response);
				} else {
					$scope.cardError = true;
				};
			}, function() {
				$scope.cardError = true;
				$scope.isLoading = false;
			});

		};

		$scope.saveCard = function() {

			$scope.cardNotFilledError = false;
			var fetchMLISessionId = function() {

				var sessionDetails = {};

				var mliCallback = function(response) {
					if (response.status === "ok") {
						MLISessionId = response.session;
						saveCardToReservation();
					} else {
						$scope.cardError = true;
						$scope.isLoading = false;
					}
					$scope.$apply();
				};
				//check if user has entered all data
				if (($scope.cardNumber.length === 0) ||
					($scope.ccv.length === 0) ||
					(!$scope.monthSelected) ||
					(!$scope.yearSelected)) {
					$scope.cardError = false;
					$scope.cardNotFilledError = true;
					if ($scope.ccv.length === 0) {
						$scope.isCVVEmpty = true;
					} else {
						$scope.isCVVEmpty = false;
					}
				} else {

					$scope.isLoading = true;
					$scope.isCVVEmpty = false;
					sessionDetails.cardNumber = $scope.cardNumber;
					sessionDetails.cardSecurityCode = $scope.ccv;
					sessionDetails.cardExpiryMonth = $scope.monthSelected;
					sessionDetails.cardExpiryYear = $scope.yearSelected.toString();
					try {
						HostedForm.updateSession(sessionDetails, mliCallback);
					} catch (err) {
						$scope.netWorkError = true;
					};
				}
			};
			fetchMLISessionId();
		};
		$scope.cancelCardEntry = function() {
			$scope.mode = "PAYMENT_MODE";
			$scope.cardError = false;
			$scope.paymentError = false;
			$scope.cardNotFilledError = false;
		};



		var init = function() {

			$scope.months = returnMonthsArray(); //utils function
			$scope.years = [];
			var startYear = new Date().getFullYear();
			var endYear = parseInt(startYear) + 100;
			for (year = parseInt(startYear); year <= parseInt(endYear); year++) {
				$scope.years.push(year);
			};
			$scope.cardNumber = "";
			$scope.ccv = "";
			$scope.monthSelected = "";
			$scope.yearSelected = "";
			$scope.ccSaved = false;
			$scope.cardName = "";

			//TO DO ----
			/*******************************************/
			$rootScope.reservationID = 1344568;
			$rootScope.accessToken = '3b9b81823405849e79e7a6eab35212b0';
			$scope.paymentMethodDetails = {
					"payment_method_used": $rootScope.payment_method_used,
					"payment_details": $rootScope.paymentDetails
				}
				/*******************************************/
			if ($scope.paymentMethodDetails.payment_method_used === "CC" && typeof $scope.paymentMethodDetails.payment_details !== "undefined" && typeof $scope.paymentMethodDetails.payment_details.id !== null) {
				$scope.cardPresent = true;
			} else {
				$scope.cardPresent = false;
			};
			$scope.mode = "PAYMENT_MODE";
		}();

	};

	var dependencies = [
		'$scope', '$state', '$rootScope', 'guestDetailsService', 'ccVerificationService', 'sntGuestWebSrv',
		outstandingBalanceDetailsController
	];

	sntGuestWeb.controller('outstandingBalanceDetailsController', dependencies);
})();