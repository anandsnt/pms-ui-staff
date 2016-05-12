/**
 *	CC addition
 */
sntGuestWeb.controller('GwCCAdditionController', ['$scope', '$rootScope', '$state', '$controller', '$modal', 'GwWebSrv', 'GwCheckoutSrv', '$stateParams',
	function($scope, $rootScope, $state, $controller, $modal, GwWebSrv, GwCheckoutSrv, $stateParams) {
		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "CC_ADDITION";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.checkoutmessage = $stateParams.message;
			$scope.isFromCheckoutNow = ($stateParams.isFromCheckoutNow === "true") ? true : false;
			$scope.fee = $stateParams.fee;
			$scope.months = returnMonthsArray();
			$scope.years = returnYears();
			$scope.cardNumber = "";
			$scope.ccv = "";
			$scope.monthSelected = "";
			$scope.yearSelected = "";
		}();
		var MLISessionId = "";


		HostedForm.setMerchant(GwWebSrv.zestwebData.mliMerchatId);
		//setup options for error popup
		var cardErrorPopupOpts = angular.copy($scope.errorOpts);
		var emptyFeildsErrorPopup = angular.copy($scope.errorOpts);
		cardErrorPopupOpts.resolve = {
			message: function() {
				return "There is a problem with your credit card."
			}
		};
		emptyFeildsErrorPopup.resolve = {
			message: function() {
				return "All fields are required"
			}
		};
		var ccvOpts = angular.copy($scope.errorOpts);
		ccvOpts.templateUrl = '/assets/partials/ccVerificationNumberModal.html',
			ccvOpts.resolve = {
				message: function() {
					return ""
				}
			};

		$scope.showCcvPopup = function() {
			$modal.open(ccvOpts); // error modal popup
		};
		var navigateToNextPage = function() {
			if ($stateParams.isFromCheckoutNow === "true") {
				$state.go('checkOutFinal');
			} else {
				$state.go('checkOutLaterFinal', {
						time: $stateParams.time,
						ap: $stateParams.ap,
						amount: $stateParams.amount
				});
			}
		};

		//save payment method and proceed
		var goToNextStep = function() {
			var cardExpiryDate = $scope.yearSelected + "-" + $scope.monthSelected + "-" + "01";
			var onSuccess = function() {
				navigateToNextPage();
			};
			var onFailure = function() {
				$state.go('seeFrontDesk');
			};
			var options = {
				params: {
					'reservation_id': $rootScope.reservationID,
					'token': MLISessionId,
					'card_expiry': cardExpiryDate,
					'payment_type': "CC"
				},
				successCallBack: onSuccess,
				failureCallBack: onFailure
			};

			$scope.callAPI(GwCheckoutSrv.savePayment, options);
		};

		//MLI token creation
		$scope.savePaymentDetails = function() {
			var fetchMLISessionId = function() {
				var sessionDetails = {};
				var callback = function(response) {
					$scope.$apply();
					if (response.status === "ok") {
						MLISessionId = response.session;
						goToNextStep();
					} else {
						$modal.open(cardErrorPopupOpts);
					};
				};
				if (($scope.cardNumber.length === 0) || ($scope.ccv.length === 0) || (!$scope.monthSelected) || (!$scope.yearSelected)) {
					$modal.open(emptyFeildsErrorPopup); // details modal popup
				} else {
					sessionDetails.cardNumber = $scope.cardNumber;
					sessionDetails.cardSecurityCode = $scope.ccv;
					sessionDetails.cardExpiryMonth = $scope.monthSelected;
					sessionDetails.cardExpiryYear = $scope.yearSelected.toString();
					try {
						HostedForm.updateSession(sessionDetails, callback);
					} catch (err) {
						$state.go('seeFrontDesk');
					};
				}
			};
			if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
				navigateToNextPage();
			} else {
				fetchMLISessionId();
			}

		};
	}
]);