sntRover.controller('rvDiarySummaryCtrl', 
	['$rootScope', 
	 '$scope', 
	 '$state', 
	 '$stateParams', 
	 'rvDiarySummarySrv',
	 'rvDiaryReservationCompatSrv',  
	 'RVContactInfoSrv', 
	 '$filter',
	function($rootScope, 
			 $scope, 
			 $state, 
			 $stateParams,
			 rvDiarySummarySrv, 
			 rvDiaryReservationCompatSrv,
			 RVContactInfoSrv, 
			 $filter) {

		BaseCtrl.call(this, $scope);

		var resv = rvDiaryReservationCompatSrv,
			contactInfo = RVContactInfoSrv,
			reservationData = resv.reservationData,
			otherData = resv.otherData;

		resv.updateReservationDates();

		// set the previous state
		$rootScope.setPrevState = {
			title: $filter('translate')('ENHANCE_STAY'),
			name: 'rover.diary.reservation.guestCard',
			param: {
				from_date: reservationData.arrivalDate,
				to_date: reservationData.departureDate
			}
		};



		$scope.init = function() {
			$scope.data = {};

			otherData.isGuestPrimaryEmailChecked = (reservationData.guest.email !== null && !_.isEmpty(reservationData.guest.email)) ? true : false;
			otherData.isGuestAdditionalEmailChecked = false;

			$scope.data.paymentMethods = [];
			$scope.data.MLIData = {};

			$scope.isGuestEmailAlreadyExists = (reservationData.guest.email !== null && !_.isEmpty(reservationData.guest.email)) ? true : false;
			$scope.heading = "Guest Details & Payment";
			$scope.setHeadingTitle($scope.heading);

			$scope.setScroller('reservationSummary');
			$scope.setScroller('paymentInfo');

			fetchPaymentMethods();

		};

		/**
		 * Fetches all the payment methods
		 */
		var fetchPaymentMethods = function() {
			var paymentFetchSuccess = function(data) {
				$scope.data.paymentMethods = data;
				$scope.$emit('hideLoader');
				var payments = _.where(data, {
					value: reservationData.paymentType.type.value
				});
				if (payments.length > 0) {
					reservationData.paymentType.type = payments[0];
				}
			};
			var paymentFetchError = function(data) {
				$scope.errorMessage = data;
				$scope.$emit('hideLoader');
			};

			$scope.invokeApi(RVDiarySummarySrv.fetchPaymentMethods, {}, paymentFetchSuccess, paymentFetchError);

		};

		/**
		 * Click handler for confirm email Checkbox.
		 * If checked, copies the guest email to the confirm email
		 */
		$scope.confirmEmailCheckboxClicked = function() {

			reservationData.guest.sendConfirmMailTo = '';

			if ($scope.data.isConfirmationEmailSameAsGuestEmail) {
				reservationData.guest.sendConfirmMailTo = reservationData.guest.email;
			}

			$scope.refreshPaymentScroller();
		};

		/**
		 * Build the reservation data from the data modal to be passed to the API
		 */
		var computeReservationDataToSave = function() {
			var data = {},
				room = reservationData.rooms[0],
				guest = reservationData.guest,
				paymentType = reservationData.paymentType,
				taxDetails = reservationData.taxDetails;

			data.arrival_date = reservationData.arrivalDate;
			data.arrival_time = '';
			//Check if the check-in time is set by the user. If yes, format it to the 24hr format and build the API data.
			/*if ($scope.reservationData.checkinTime.hh != '' && $scope.reservationData.checkinTime.mm != '' && $scope.reservationData.checkinTime.ampm != '') {
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
			}*/

			data.adults_count = parseInt(room.numAdults);
			data.children_count = parseInt(room.numChildren);
			data.infants_count = parseInt(room.numInfants);
			// CICO - 8320 Rate to be handled in room level
			// data.rate_id = parseInt($scope.reservationData.rooms[0].rateId);
			data.room_type_id = parseInt(room.roomTypeId);
			//Guest details
			data.guest_detail = {};
			// Send null if no guest card is attached, empty string causes server internal error
			data.guest_detail.id = reservationData.guest.id === "" ? null : reservationData.guest.id;
			// New API changes
			data.guest_detail_id 			= data.guest_detail.id;
			data.guest_detail.first_name 	= guest.firstName;
			data.guest_detail.last_name 	= guest.lastName;
			data.guest_detail.email 		= guest.email;
			data.payment_type = {};

			if (paymentType.type !== null && !isEmpty(paymentType.type)) {
				data.payment_type.type_id = parseInt(paymentType.type.id, 10);
				//TODO: verify
				//data.payment_type.card_number = $scope.reservationData.paymentType.ccDetails.number;
				data.payment_type.expiry_date = (paymentType.ccDetails.expYear === "" || 
					paymentType.ccDetails.expYear === "") ? "" : "20" + paymentType.ccDetails.expYear + "-" +
					paymentType.ccDetails.expMonth + "-01";
				
				data.payment_type.card_name = paymentType.ccDetails.nameOnCard;

			}
			
			/**			
			 * CICO-7077 Confirmation Mail to have tax details
			 */

			data.tax_details = [];

			_.each(taxDetails, function(taxDetail) {
				data.tax_details.push(taxDetail);
			});
			
			data.tax_total = reservationData.totalTaxAmount;


			// guest emails to which confirmation emails should send
			data.confirmation_emails = [];

			if (otherData.isGuestPrimaryEmailChecked && !_.isEmpty(guest.email)) {
				data.confirmation_emails.push(guest.email);
			}
			if (otherData.isGuestAdditionalEmailChecked && !_.isEmpty(otherData.additionalEmail)) {
				data.confirmation_emails.push(otherData.additionalEmail);
			}

			// MLI Integration.
			if (paymentType.type !== null) {
				if (paymentType.type.value === "CC") {
					data.payment_type.session_id = $scope.data.MLIData.session;
				}
			}

			//	CICO-8320
			// 	The API request payload changes

			var stay = [];

			_.each(room.stayDates, function(staydata, date) {
				// if ($scope.reservationData.reservationId == "" || $scope.reservationData.reservationId == null || typeof $scope.reservationData.reservationId == "undefined") {
				var datesEqual = (date === reservationData.departureDate);

				stay.push({
					date: 		date,
					rate_id: 	(date === reservationData.departureDate) ? room.stayDates[$scope.reservationData.arrivalDate].rate.id : staydata.rate.id, // In case of the last day, send the first day's occupancy
					room_type_id: room.roomTypeId,
					adults_count: 	(datesEqual) ? room.stayDates[reservationData.arrivalDate].guests.adults : parseInt(staydata.guests.adults),
					children_count: (datesEqual) ? room.stayDates[reservationData.arrivalDate].guests.children : parseInt(staydata.guests.children),
					infants_count: 	(datesEqual) ? room.stayDates[reservationData.arrivalDate].guests.infants : parseInt(staydata.guests.infants)
				});
				// } else if (date != $scope.reservationData.departureDate) {
				// 	stay.push({
				// 		date: date,
				// 		rate_id: staydata.rate.id,
				// 		room_type_id: $scope.reservationData.rooms[0].roomTypeId,
				// 		adults_count: parseInt(staydata.guests.adults),
				// 		children_count: parseInt(staydata.guests.children),
				// 		infants_count: parseInt(staydata.guests.infants)
				// 	});
				// }
			});

			//	end of payload changes

			data.stay_dates = stay;

			//addons


			data.addons = [];

			_.each(room.addons, function(addon) {
				data.addons.push({
					id: addon.id,
					quantity: addon.quantity
				});
			});


			data.company_id 			= reservationData.company.id;
			data.travel_agent_id 		= reservationData.travelAgent.id;
			data.reservation_type_id 	= parseInt(demographics.reservationType);
			data.source_id 				= parseInt(demographics.source);
			data.market_segment_id 		= parseInt(demographics.market);
			data.booking_origin_id 		= parseInt(demographics.origin);
			data.confirmation_email 	= guest.sendConfirmMailTo;

			return data;

		};

		$scope.proceedCreatingReservation = function() {
			var postData = computeReservationDataToSave();

			var saveSuccess = function(data) {
				$scope.$emit('hideLoader');
				reservationData.reservationId = data.id;
				reservationData.confirmNum = data.confirm_no;
				$scope.viewState.reservationStatus.confirm = true;
				reservationData.is_routing_available = false;
				$scope.viewState.reservationStatus.number = data.id;
				// Change mode to stay card as the reservation has been made!
				$scope.viewState.identifier = "CONFIRM";

				$scope.reservation = {
					reservation_card: {}
				};

				$scope.reservation.reservation_card.arrival_date = reservationData.arrivalDate;
				$scope.reservation.reservation_card.departure_date = reservationData.departure_time;

				$state.go('rover.diary.reservation.reservationConfirm', {
					"id": data.id,
					"confirmationId": data.confirm_no
				});
				// $scope.data.MLIData = {};

			};

			var saveFailure = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
				// $scope.data.MLIData= {};
			};

			var updateSuccess = function(data) {
				$scope.viewState.identifier = "UPDATED";
				$scope.reservationData.is_routing_available = data.is_routing_available;
				$state.go('rover.diary.reservation.reservationConfirm', {
					"id": reservationData.reservationId,
					"confirmationId": reservationData.confirmNum
				});
			};

			if (!_.isEmpty(reservationData.reservationId) && 
				!_.isNull(reservationData.reservationId) && 
				!_.isUndefined(reservationData.reservationId)) {
				//creating reservation
				postData.reservationId = reservationData.reservationId;
				$scope.invokeApi(RVReservationSummarySrv.updateReservation, postData, updateSuccess, saveFailure);
			} else {
				//updating reservation
				$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess, saveFailure);
			}

		};

		/**
		 * MLI integration
		 *
		 */
		var fetchMLISession = function() {

			var sessionDetails = {
				cardNumber 			: reservationData.paymentType.ccDetails.number,
				cardSecurityCode 	: reservationData.paymentType.ccDetails.cvv,
				cardExpiryMonth 	: reservationData.paymentType.ccDetails.expMonth,
				cardExpiryYear 		: reservationData.paymentType.ccDetails.expYear
			};

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
			};

			try {
				HostedForm.updateSession(sessionDetails, callback);

				$scope.$emit("showLoader");
			} catch (err) {
				$scope.errorMessage = ["There was a problem connecting to the payment gateway."];
			};
		}

		$scope.initFetchMLI = function() {
			if (_.isEmpty(reservationData.paymentType.ccDetails.number) ||
				_.isEmpty(reservationData.paymentType.ccDetails.cvv) ||
				_.isEmpty(reservationData.paymentType.ccDetails.expMonth) ||
				_.isEmpty(reservationData.paymentType.ccDetails.expYear)) {
				
				return false;
			}

			fetchMLISession();
		}


		$scope.setUpMLIConnection = function() {
			try {
				HostedForm.setMerchant($rootScope.MLImerchantId);
			} catch (err) {}

		}();



		/**
		 * Click handler for confirm button -
		 * Creates the reservation and on success, goes to the confirmation screen
		 */
		$scope.submitReservation = function() {
			$scope.errorMessage = [];
			// CICO-9794
			if ((otherData.isGuestPrimaryEmailChecked && _.isEmpty(reservationData.guest.email)) || (otherData.isGuestAdditionalEmailChecked && _.isEmpty(otherData.additionalEmail))) {

				$scope.errorMessage = [$filter('translate')('INVALID_EMAIL_MESSAGE')];
			}

			if (reservationData.paymentType.type !== null) {
				if (reservationData.paymentType.type.value === "CC" && _.isEmpty($scope.data.MLIData.session) || _.isUndefined($scope.data.MLIData.session)) {
					$scope.errorMessage = [$filter('translate')('INVALID_CREDIT_CARD')];
				}
			}

			if ($scope.errorMessage.length > 0) {
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
					id: reservationData.reservationId,
					confirmationId: reservationData.confirmNum,
					isrefresh: false
				}
				$state.go('rover.diary.reservation.staycard.reservationcard.reservationdetails', stateParams);
			} else {
				$scope.initReservationData();
				$state.go('rover.reservation.search');
			}
		};

		$scope.refreshPaymentScroller = function() {
			$scope.refreshScroller('paymentInfo');
		};

		/*
			If email address does not exists on Guest Card,
		    and user decides to update via the Email field on the summary screen,
		    this email should be linked to the guest card. 
		 */
		$scope.primaryEmailEntered = function() {
			var dataToUpdate = {
				"email": reservationData.guest.email
			};

			var data = {
				'data': dataToUpdate,
				'userId': reservationData.guest.id
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