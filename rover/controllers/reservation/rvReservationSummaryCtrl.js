sntRover.controller('RVReservationSummaryCtrl', ['$rootScope', '$scope', '$state', 'RVReservationSummarySrv', 'RVContactInfoSrv',
	function($rootScope, $scope, $state, RVReservationSummarySrv, RVContactInfoSrv) {

		BaseCtrl.call(this, $scope);
		
		$scope.init = function() {
			$scope.data = {};
			$scope.otherData.isGuestPrimaryEmailChecked = ($scope.reservationData.guest.email != null && $scope.reservationData.guest.email != "") ? true : false;
			$scope.otherData.isGuestAdditionalEmailChecked = false;
			$scope.data.paymentMethods = [];
			$scope.data.MLIData = {};
			$scope.isGuestEmailAlreadyExists = ($scope.reservationData.guest.email != null && $scope.reservationData.guest.email != "") ? true : false;
			$scope.heading = "Guest Details & Payment";
			$scope.$emit('setHeading', 'Guest Details & Payment');

			$scope.$parent.myScrollOptions = {
				'reservationSummary': {
					scrollbars: true,
					snap: false,
					hideScrollbar: false
				},
				'paymentInfo': {
					scrollbars: true,
					hideScrollbar: false,
				},
			};
			fetchPaymentMethods();

		}

		/**
		 * Fetches all the payment methods
		 */
		var fetchPaymentMethods = function() {
			var paymentFetchSuccess = function(data) {
				$scope.data.paymentMethods = data;
				$scope.$emit('hideLoader');
				var payments = _.where(data, {
					value: $scope.reservationData.paymentType.type.value
				});
				if (payments.length > 0) {
					$scope.reservationData.paymentType.type = payments[0];
				}
			};
			var paymentFetchError = function(data) {
				$scope.errorMessage = data;
				$scope.$emit('hideLoader');
			};

			$scope.invokeApi(RVReservationSummarySrv.fetchPaymentMethods, {}, paymentFetchSuccess, paymentFetchError);

		};

		/**
		 * Click handler for confirm email Checkbox.
		 * If checked, copies the guest email to the confirm email
		 */
		$scope.confirmEmailCheckboxClicked = function() {

			$scope.reservationData.guest.sendConfirmMailTo = '';
			if ($scope.data.isConfirmationEmailSameAsGuestEmail) {
				$scope.reservationData.guest.sendConfirmMailTo = $scope.reservationData.guest.email;
			}
			$scope.refreshPaymentScroller();
		};

		/**
		 * Build the reservation data from the data modal to be passed to the API
		 */
		var computeReservationDataToSave = function() {
			var data = {};
			data.arrival_date = $scope.reservationData.arrivalDate;
			data.arrival_time = '';
			//Check if the check-in time is set by the user. If yes, format it to the 24hr format and build the API data.
			if ($scope.reservationData.checkinTime.hh != '' && $scope.reservationData.checkinTime.mm != '' && $scope.reservationData.checkinTime.ampm != '') {
				data.arrival_time = getTimeFormated($scope.reservationData.checkinTime.hh,
					$scope.reservationData.checkinTime.mm,
					$scope.reservationData.checkinTime.ampm);
			}
			data.departure_date = $scope.reservationData.departureDate;
			data.departure_time = '';
			//Check if the checkout time is set by the user. If yes, format it to the 24hr format and build the API data.
			if ($scope.reservationData.checkoutTime.hh != '' && $scope.reservationData.checkoutTime.mm != '' && $scope.reservationData.checkoutTime.ampm != '') {
				data.departure_time = getTimeFormated($scope.reservationData.checkoutTime.hh,
					$scope.reservationData.checkoutTime.mm,
					$scope.reservationData.checkoutTime.ampm);
			}

			data.adults_count = parseInt($scope.reservationData.rooms[0].numAdults);
			data.children_count = parseInt($scope.reservationData.rooms[0].numChildren);
			data.infants_count = parseInt($scope.reservationData.rooms[0].numInfants);
			// CICO - 8320 Rate to be handled in room level
			// data.rate_id = parseInt($scope.reservationData.rooms[0].rateId);
			data.room_type_id = parseInt($scope.reservationData.rooms[0].roomTypeId);

			//Guest details
			data.guest_detail = {};
			// Send null if no guest card is attached, empty string causes server internal error
			data.guest_detail.id = $scope.reservationData.guest.id == "" ? null : $scope.reservationData.guest.id;
			// New API changes
			data.guest_detail_id = data.guest_detail.id;
			data.guest_detail.first_name = $scope.reservationData.guest.firstName;
			data.guest_detail.last_name = $scope.reservationData.guest.lastName;
			data.guest_detail.email = $scope.reservationData.guest.email;
			if (!isEmpty($scope.reservationData.paymentType.type)) {
				data.payment_type = {};
				data.payment_type.type_id = parseInt($scope.reservationData.paymentType.type.id);
				//TODO: verify
				//data.payment_type.card_number = $scope.reservationData.paymentType.ccDetails.number;
				data.payment_type.expiry_date = ($scope.reservationData.paymentType.ccDetails.expYear == "" || $scope.reservationData.paymentType.ccDetails.expYear == "") ? "" : "20" + $scope.reservationData.paymentType.ccDetails.expYear + "-" +
					$scope.reservationData.paymentType.ccDetails.expMonth + "-01"
				data.payment_type.card_name = $scope.reservationData.paymentType.ccDetails.nameOnCard;

			}

			// guest emails to which confirmation emails should send
			data.confirmation_emails = [];
			if ($scope.otherData.isGuestPrimaryEmailChecked) {
				data.confirmation_emails.push($scope.reservationData.guest.email);
			}
			if ($scope.otherData.isGuestAdditionalEmailChecked) {
				data.confirmation_emails.push($scope.otherData.additionalEmail);
			}

			// MLI Integration.
			if ($scope.reservationData.paymentType.type.value === "CC") {
				data.payment_type.session_id = $scope.data.MLIData.session;
			}

			//	CICO-8320
			// 	The API request payload changes

			var stay = [];
			_.each($scope.reservationData.rooms[0].stayDates, function(staydata, date) {
				if ($scope.reservationData.reservationId == "" || $scope.reservationData.reservationId == null || typeof $scope.reservationData.reservationId == "undefined") {
					stay.push({
						date: date,
						rate_id: (date == $scope.reservationData.departureDate) ? $scope.reservationData.rooms[0].stayDates[$scope.reservationData.arrivalDate].rate.id : staydata.rate.id, // In case of the last day, send the first day's occupancy
						room_type_id: $scope.reservationData.rooms[0].roomTypeId,
						adults_count: parseInt(staydata.guests.adults),
						children_count: parseInt(staydata.guests.children),
						infants_count: parseInt(staydata.guests.infants)
					});
				} else if (date != $scope.reservationData.departureDate) {
					stay.push({
						date: date,
						rate_id: staydata.rate.id,
						room_type_id: $scope.reservationData.rooms[0].roomTypeId,
						adults_count: parseInt(staydata.guests.adults),
						children_count: parseInt(staydata.guests.children),
						infants_count: parseInt(staydata.guests.infants)
					});
				}
			});

			//	end of payload changes

			data.stay_dates = stay;

			data.company_id = $scope.reservationData.company.id;
			data.travel_agent_id = $scope.reservationData.travelAgent.id;
			data.reservation_type_id = parseInt($scope.reservationData.demographics.reservationType);
			data.source_id = parseInt($scope.reservationData.demographics.source);
			data.market_segment_id = parseInt($scope.reservationData.demographics.market);
			data.booking_origin_id = parseInt($scope.reservationData.demographics.origin);
			data.confirmation_email = $scope.reservationData.guest.sendConfirmMailTo;

			return data;

		};

		$scope.proceedCreatingReservation = function() {
			var postData = computeReservationDataToSave();

			var saveSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.reservationData.reservationId = data.id;
				$scope.reservationData.confirmNum = data.confirm_no;
				$scope.viewState.reservationStatus.confirm = true;
				$scope.viewState.reservationStatus.number = data.id;
				// Change mode to stay card as the reservation has been made!
				$scope.viewState.identifier = "CONFIRM";

				$scope.reservation = {
					reservation_card: {}
				};

				$scope.reservation.reservation_card.arrival_date = $scope.reservationData.arrivalDate;
				$scope.reservation.reservation_card.departure_date = $scope.reservationData.departure_time;

				$state.go('rover.reservation.staycard.mainCard.reservationConfirm', {
					"id": data.id,
					"confirmationId": data.confirm_no
				});
				// $scope.data.MLIData = {};

			};
			var saveFailure = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
				// $scope.data.MLIData= {};

			}

			var updateSuccess = function(data) {
				$scope.viewState.identifier = "UPDATED";
				$state.go('rover.reservation.staycard.mainCard.reservationConfirm', {
					"id": $scope.reservationData.reservationId,
					"confirmationId": $scope.reservationData.confirmNum
				});
			}

			if ($scope.reservationData.reservationId != "" && $scope.reservationData.reservationId != null && typeof $scope.reservationData.reservationId != "undefined") {
				//creating reservation
				postData.reservationId = $scope.reservationData.reservationId;
				$scope.invokeApi(RVReservationSummarySrv.updateReservation, postData, updateSuccess, saveFailure);
			} else {
				//updating reservation
				$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess, saveFailure);
			}

		}

		/**
		 * MLI integration
		 *
		 */
		var fetchMLISession = function() {

			var sessionDetails = {};
			sessionDetails.cardNumber = $scope.reservationData.paymentType.ccDetails.number;
			sessionDetails.cardSecurityCode = $scope.reservationData.paymentType.ccDetails.cvv;
			sessionDetails.cardExpiryMonth = $scope.reservationData.paymentType.ccDetails.expMonth;
			sessionDetails.cardExpiryYear = $scope.reservationData.paymentType.ccDetails.expYear;

			var callback = function(response) {

				$scope.$emit("hideLoader");
				$scope.$apply();
				if (response.status === "ok") {
					$scope.data.MLIData = response;
				} else {
					$scope.errorMessage = ["There is a problem with your credit card"];
					$scope.data.MLIData = {};
				}
				$scope.$apply();
			}

			try {
				HostedForm.updateSession(sessionDetails, callback);
				$scope.$emit("showLoader");
			} catch (err) {
				$scope.errorMessage = ["There was a problem connecting to the payment gateway."];
			};
		}

		$scope.initFetchMLI = function() {
			if ($scope.reservationData.paymentType.ccDetails.number == "" ||
				$scope.reservationData.paymentType.ccDetails.cvv == "" ||
				$scope.reservationData.paymentType.ccDetails.expMonth == "" ||
				$scope.reservationData.paymentType.ccDetails.expYear == "") {
				return false;
			}
			fetchMLISession();
		}


		$scope.setUpMLIConnection = function() {
			try {
				HostedForm.setMerchant($rootScope.MLImerchantId);
			} catch (err) {};

		}();



		/**
		 * Click handler for confirm button -
		 * Creates the reservation and on success, goes to the confirmation screen
		 */
		$scope.submitReservation = function() {

			if ($scope.reservationData.paymentType.type.value === "CC" && ($scope.data.MLIData.session == "" || $scope.data.MLIData.session == undefined)) {
				$scope.errorMessage = ["There is a problem with your credit card"];
				return false;
			}
			$scope.proceedCreatingReservation();

		};

		/**
		 * Click handler for cancel button - Go back to the reservation search screen
		 * Does not save the reservation
		 */
		$scope.cancelButtonClicked = function() {
			if ($scope.viewState.identifier == "STAY_CARD") {
				var stateParams = {
					id: $scope.reservationData.reservationId,
					confirmationId: $scope.reservationData.confirmNum,
					isrefresh: false
				}
				$state.go('rover.reservation.staycard.reservationcard.reservationdetails', stateParams);
			} else {
				$scope.initReservationData();
				$state.go('rover.staycard.reservation.search');
			}
		};

		$scope.refreshPaymentScroller = function() {
			setTimeout(function() {
				$scope.$parent.myScroll['paymentInfo'].refresh();
			}, 0);
		};

		/*
			If email address does not exists on Guest Card,
		    and user decides to update via the Email field on the summary screen,
		    this email should be linked to the guest card. 
		 */
		$scope.primaryEmailEntered = function() {
			var dataToUpdate = {
				"email": $scope.reservationData.guest.email
			};

			var data = {
				'data': dataToUpdate,
				'userId': $scope.reservationData.guest.id
			};

			var updateGuestEmailSuccessCallback = function(data) {
				$scope.$emit('guestEmailChanged');
				$scope.$emit("hideLoader");
			}

			var updateGuestEmailFailureCallback = function(data) {
				$scope.$emit("hideLoader");
			}

			$scope.invokeApi(RVContactInfoSrv.updateGuest, data, updateGuestEmailSuccessCallback, updateGuestEmailFailureCallback);
		}

		$scope.init();

	}
]);