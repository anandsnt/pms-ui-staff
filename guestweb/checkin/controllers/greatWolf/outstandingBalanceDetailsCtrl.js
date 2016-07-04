(function() {
	var outstandingBalanceDetailsController = function($scope, $state, $rootScope, guestDetailsService,$modal,ccVerificationService) {



		$scope.goToNextPage = function() {
			$rootScope.KeyCountAttemptedToSave = true;
			$state.go('preCheckinStatus');
		};

		$scope.changeCard = function() {
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


		//setup options for error popup

		$scope.cardErrorOpts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkin/partials/ccErrorModal.html',
			controller: ccVerificationModalCtrl,
			resolve: {
				errorMessage: function() {
					return "There is a problem with your credit card.";
				}
			}
		};

		$scope.errorOpts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkin/partials/ccErrorModal.html',
			controller: ccVerificationModalCtrl,
			resolve: {
				errorMessage: function() {
					return "You must provide all the required information. Please update and try again.";
				}
			}
		};


		var saveCardToReservation = function() {
			//save cc success
			var ccSaveSuccesActions = function(response){
				$rootScope.isCCOnFile = true;
					$rootScope.isCcAttachedFromGuestWeb = true;
					var cardNumberLength = $scope.cardNumber.length;
					$scope.paymentMethodDetails.payment_details = {
						"card_type_image": "images/"+response.data.credit_card_type+".png",
						"card_number": $scope.cardNumber.toString().substring(cardNumberLength-4, cardNumberLength),
						"card_expiry": $scope.monthSelected + "/"+ $scope.yearSelected.toString().substring(2, 4),
						"card_name": $scope.cardName,
						"id": response.data.id
					}
					$scope.mode = "PAYMENT_MODE";
			}
			//setup params
			var cardExpiryDate = $scope.yearSelected + "-" + $scope.monthSelected + "-" + "01";
			var data = {
				'reservation_id': $rootScope.reservationID,
				'token': MLISessionId,
				'card_expiry': cardExpiryDate,
				'payment_type': "CC",
				'card_name' : $scope.cardName
			};
			//call API
			$scope.isLoading = true;
			ccVerificationService.verifyCC(data).then(function(response) {
				$scope.isLoading = false;
				if (response.status === "success") {
					ccSaveSuccesActions(response);
				} else {
					$scope.netWorkError = true;
				};
			}, function() {
				$scope.netWorkError = true;
				$scope.isLoading = false;
			});

		};

		$scope.saveCard = function() {

			var fetchMLISessionId = function() {

				var sessionDetails = {};

				var mliCallback = function(response) {
					$scope.$apply();
					if (response.status === "ok") {
						MLISessionId = response.session;
						saveCardToReservation();
					} else {
						$modal.open($scope.cardErrorOpts);
						$scope.isLoading = false;
					}
				};

				if (($scope.cardNumber.length === 0) ||
					($scope.ccv.length === 0) ||
					(!$scope.monthSelected) ||
					(!$scope.yearSelected)) {
					$modal.open($scope.errorOpts); // details modal popup
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
			$rootScope.outStandingBalance = 100;
			$scope.paymentMethodDetails = {
					"payment_method_used": "CC",
					"payment_details": {
						"card_type_image": "images/mc.png",
						"card_number": "5454",
						"card_expiry": "12/17",
						"card_name": "Resheil",
						"id": 30970
					}
				}
				/*******************************************/
			if ($scope.paymentMethodDetails.payment_method_used === "CC" && $scope.paymentMethodDetails.payment_details.id !== null) {
				$scope.cardPresent = true;
			} else {
				$scope.cardPresent = false;
			};
			$scope.mode = "PAYMENT_MODE";
		}();

	};

	var dependencies = [
		'$scope', '$state', '$rootScope', 'guestDetailsService','$modal','ccVerificationService',
		outstandingBalanceDetailsController
	];

	sntGuestWeb.controller('outstandingBalanceDetailsController', dependencies);
})();