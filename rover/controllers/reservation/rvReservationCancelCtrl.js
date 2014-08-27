sntRover.controller('RVCancelReservation', ['$rootScope', '$scope', '$stateParams', 'RVPaymentSrv', '$timeout', 'RVReservationCardSrv', '$state',
	function($rootScope, $scope, $stateParams, RVPaymentSrv, $timeout, RVReservationCardSrv, $state) {

		BaseCtrl.call(this, $scope);

		//Set merchant ID for MLI integration
		var MLISessionId = "";

		// try {
		HostedForm.setMerchant($rootScope.MLImerchantId);
		// } catch (err) {};

		$scope.cancellationData = {
			selectedCard: -1,
			reason: "",
			viewCardsList: false,
			existingCard: false,
			cardId: "",
			newCard: {
				cardNumber: "",
				addToGuest: false,
				nameOnCard: "",
				expiryDate: {
					mm: "",
					yy: ""
				},
				ccv: ""
			}
		}

		$scope.setScroller('cardsList');

		var refreshCardsList = function() {
			$timeout(function() {
				$scope.refreshScroller('cardsList');
			}, 300)
		}

		var savePayment = function() {
			var onSaveSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.cancellationData.selectedCard = data.id;
				$scope.cancelReservation();
			}
			var onSaveFailure = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
			}
			var paymentData = {
				add_to_guest_card: $scope.cancellationData.newCard.addToGuest,
				card_expiry: $scope.cancellationData.newCard.expiryDate.mm && $scope.cancellationData.newCard.expiryDate.yy ? "20" + $scope.cancellationData.newCard.expiryDate.yy + "-" + $scope.cancellationData.newCard.expiryDate.mm + "-01" : "",
				credit_card: "",
				name_on_card: $scope.cancellationData.newCard.nameOnCard,
				payment_type: "CC",
				reservation_id: $scope.reservationData.reservation_card.reservation_id,
				session_id: MLISessionId
			}
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, paymentData, onSaveSuccess, onSaveFailure);
		}

		var fetchMLISessionId = function() {
			var sessionDetails = {};
			sessionDetails.cardNumber = $scope.cancellationData.newCard.cardNumber;
			sessionDetails.cardSecurityCode = $scope.cancellationData.newCard.ccv;
			sessionDetails.cardExpiryMonth = $scope.cancellationData.newCard.expiryDate.mm;
			sessionDetails.cardExpiryYear = $scope.cancellationData.newCard.expiryDate.yy;

			var callback = function(response) {
				$scope.$emit("hideLoader");
				if (response.status === "ok") {
					MLISessionId = response.session;
					savePayment(); // call save payment details WS		 		
				} else {
					$scope.errorMessage = ["There is a problem with your credit card"];
				}
				$scope.$apply();
			};

			try {
				HostedForm.updateSession(sessionDetails, callback);
				$scope.$emit("showLoader");
			} catch (err) {
				$scope.errorMessage = ["There was a problem connecting to the payment gateway."];
			};

		};

		var onFetchPaymentsSuccess = function(data) {
			$scope.$emit('hideLoader');			
			$scope.cardsInPaymentMethods = _.where(data.existing_payments, {
				is_credit_card: true
			});
			if ($scope.cardsInPaymentMethods.length > 0) {
				$scope.ngDialogData.cards = true;
				$scope.cancellationData.viewCardsList = true;
				refreshCardsList();
			}
			$scope.ngDialogData.state = 'PENALTY';
		}

		$scope.applyPenalty = function() {
			var reservationId = $stateParams.id;
			$scope.invokeApi(RVPaymentSrv.getPaymentList, reservationId, onFetchPaymentsSuccess);
		}

		$scope.cancelReservation = function() {
			var onCancelSuccess = function(data) {
				$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $stateParams.id,
					"confirmationId": $stateParams.confirmationId,
					"isrefresh": false
				});
				$scope.closeDialog();
				$scope.$emit('hideLoader');
			}
			var onCancelFailure = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
			}
			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				penalty: parseFloat($scope.ngDialogData.penalty),
				payment_method_id: parseInt($scope.cancellationData.selectedCard) == -1 ? null : parseInt($scope.cancellationData.selectedCard),
				id: $scope.reservationData.reservation_card.reservation_id
			}
			console.log('cancellationParameters', cancellationParameters);
			$scope.invokeApi(RVReservationCardSrv.cancelReservation, cancellationParameters, onCancelSuccess, onCancelFailure);
		}

		$scope.chargePenalty = function() {
			//Clear the error messages if they exist from the previous attempt to charge penalty with a new card
			$scope.errorMessage = [];
			if ($scope.cancellationData.viewCardsList) {
				$scope.cancelReservation();
			}
			//If the user is on add card screen && if there is a card Number entered then make call to MLI to check validity of the card			 
			else if (!$scope.cancellationData.viewCardsList && $scope.cancellationData.newCard.cardNumber.toString().length > 0) {
				fetchMLISessionId();
			} else {
				// Client side validation added to eliminate a false session being retrieved in case of empty card number
				$scope.errorMessage = ["There is a problem with your credit card"];
			}
		}
	}

]);