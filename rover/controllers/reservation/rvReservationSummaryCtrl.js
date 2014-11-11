sntRover.controller('RVReservationSummaryCtrl', ['$rootScope', '$scope', '$state', 'RVReservationSummarySrv', 'RVContactInfoSrv', '$filter', '$location', '$stateParams', 'dateFilter', '$vault', '$timeout',
	function($rootScope, $scope, $state, RVReservationSummarySrv, RVContactInfoSrv, $filter, $location, $stateParams, dateFilter, $vault, $timeout) {


		BaseCtrl.call(this, $scope);

		///

		///
		$scope.isSubmitButtonEnabled = false;

		if ($scope.reservationData.reservationId != '') {
			$scope.isSubmitButtonEnabled = true;
		}
		$scope.isSixPaymentGatewayVisible = false;
		$scope.isIframeVisible = false;
		$scope.isCallInOnsiteButtonVisible = false;
		$scope.isMLICreditCardVisible = false;
		$scope.isOnsiteActive = false;
		if ($rootScope.paymentGateway === "sixpayments") {
			$scope.isCallInOnsiteButtonVisible = true;
			$scope.isOnsiteActive = true;
			$scope.isIframeVisible = false;
		}

		var absoluteUrl = $location.$$absUrl;
		domainUrl = absoluteUrl.split("/staff#/")[0];
		$scope.iFrameUrl = domainUrl + "/api/ipage/index.html?amount=" + $filter('number')($scope.reservationData.totalStayCost, 2) + '&card_holder_first_name=' + $scope.guestCardData.contactInfo.first_name + '&card_holder_last_name=' + $scope.guestCardData.contactInfo.last_name + '&service_action=createtoken';
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		// Now...
		// if 
		//    "attachEvent", then we need to select "onmessage" as the event. 
		// if 
		//    "addEventListener", then we need to select "message" as the event

		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

		// Listen to message from child IFrame window
		eventer(messageEvent, function(e) {
			var responseData = e.data;
			if (responseData.response_message == "token_created") {
				console.log("event listener==============");
				$scope.isSubmitButtonEnabled = true;
				var unwantedKeys = ["response_message"]; // remove unwanted keys for API
				//responseData = dclone(responseData, unwantedKeys);
				//console.log(JSON.stringify(responseData));
				$scope.six_token = responseData.token;
				//$scope.invokeApi(RVReservationSummarySrv.paymentAction, responseData, $scope.successPayment);
			}
		}, false);

		$scope.submitReservationButtonClass = function(isSubmitButtonEnabled) {

			var buttonClass = "grey";
			if (isSubmitButtonEnabled) {
				buttonClass = "green";
			}
			return buttonClass;
		};
		// $scope.successPayment = function(data){
		// console.log(data);
		// $scope.$emit('hideLoader');
		// $scope.isSubmitButtonEnabled = true;
		// $scope.creditCardTransactionId = data.credit_card_transaction_id;
		// };



		setTimeout(function() {
			// var MyIFrame = document.getElementById("sixpaymentform");
			// var MyIFrameDoc = (MyIFrame.contentWindow || MyIFrame.contentDocument);
			// if (MyIFrameDoc.document) MyIFrameDoc = MyIFrameDoc.document;
			// MyIFrameDoc.getElementById("six_form").submit();

		}, 1000);

		// set the previous state -- 

		if ($stateParams.reservation != "HOURLY") {
			$rootScope.setPrevState = {
				title: $filter('translate')('ENHANCE_STAY'),
				name: 'rover.reservation.staycard.mainCard.addons',
				param: {
					from_date: $scope.reservationData.arrivalDate,
					to_date: $scope.reservationData.departureDate
				}
			};
		}

		$scope.init = function() {
			$scope.data = {};
			if ($stateParams.reservation == "HOURLY") {

				$scope.reservationData.isHourly = true;
				var temporaryReservationDataFromDiaryScreen = $vault.get('temporaryReservationDataFromDiaryScreen');
				temporaryReservationDataFromDiaryScreen = JSON.parse(temporaryReservationDataFromDiaryScreen);

				if (temporaryReservationDataFromDiaryScreen && temporaryReservationDataFromDiaryScreen.is_from_diary_screen) {
					var getRoomsSuccess = function(data) {
						var roomsArray = {};
						angular.forEach(data.rooms, function(value, key) {
							var roomKey = value.id;
							roomsArray[roomKey] = value;
						});
						$scope.createReservationDataFromDiary(roomsArray, temporaryReservationDataFromDiaryScreen);
					};
					$scope.invokeApi(RVReservationSummarySrv.fetchRooms, {}, getRoomsSuccess);
				}
			}

			$scope.otherData.isGuestPrimaryEmailChecked = ($scope.reservationData.guest.email != null && $scope.reservationData.guest.email != "") ? true : false;
			$scope.otherData.isGuestAdditionalEmailChecked = false;
			$scope.data.paymentMethods = [];
			$scope.data.MLIData = {};
			$scope.isGuestEmailAlreadyExists = ($scope.reservationData.guest.email != null && $scope.reservationData.guest.email != "") ? true : false;
			$scope.heading = "Guest Details & Payment";
			$scope.setHeadingTitle($scope.heading);

			$scope.setScroller('reservationSummary', {
				'click': true
			});
			$scope.setScroller('paymentInfo', {
				'click': true
			});
			fetchPaymentMethods();
			refreshScrolls();
		};

		var refreshScrolls = function() {
			$timeout(function() {
				$scope.refreshScroller('reservationSummary');
				$scope.refreshScroller('paymentInfo');
			}, 1500)
		}

		$scope.createReservationDataFromDiary = function(roomsArray, temporaryReservationDataFromDiaryScreen) {
			angular.forEach(temporaryReservationDataFromDiaryScreen.rooms, function(value, key) {
				value['roomTypeId'] = roomsArray[value.room_id].room_type_id;
				value['roomTypeName'] = roomsArray[value.room_id].room_type_name;
			});
			$scope.reservationData.rooms = [];
			$scope.reservationData.rooms = temporaryReservationDataFromDiaryScreen.rooms;
			$scope.reservationData.arrivalDate = temporaryReservationDataFromDiaryScreen.arrival_date;
			$scope.reservationData.departureDate = temporaryReservationDataFromDiaryScreen.departure_date;			
			$scope.reservationData.totalStayCost = 0;

			_.each($scope.reservationData.rooms, function(room) {
				room.stayDates = {};
				room.rateTotal = room.amount;
				$scope.reservationData.totalStayCost = parseFloat($scope.reservationData.totalStayCost) + parseFloat(room.amount);
				var success = function(data) {
					room.rateName = data;
					refreshScrolls();
				}
				$scope.invokeApi(RVReservationSummarySrv.getRateName, {
					id: room.rateId
				}, success);
				for (var ms = new tzIndependentDate($scope.reservationData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
					room.stayDates[dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd')] = {
						guests: {
							adults: room.numAdults,
							children: room.numChildren,
							infants: room.numInfants
						},
						rate: {
							id: room.rateId
						}
					};
				}
			});
		};

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
			data.is_hourly = $scope.reservationData.isHourly;
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
			data.payment_type = {};

			if ($scope.reservationData.paymentType.type.value !== null) {
				//console.log("===================="+$scope.reservationData.paymentType.type.value);
				angular.forEach($scope.data.paymentMethods, function(item, index) {
					if ($scope.reservationData.paymentType.type.value == item.value) {
						data.payment_type.type_id = item.id;
					}
				});
				//console.log("=========++++++==========="+data.payment_type.type_id);
				//TODO: verify
				//data.payment_type.card_number = $scope.reservationData.paymentType.ccDetails.number;
				data.payment_type.expiry_date = ($scope.reservationData.paymentType.ccDetails.expYear == "" || $scope.reservationData.paymentType.ccDetails.expYear == "") ? "" : "20" + $scope.reservationData.paymentType.ccDetails.expYear + "-" +
					$scope.reservationData.paymentType.ccDetails.expMonth + "-01";
				data.payment_type.card_name = $scope.reservationData.paymentType.ccDetails.nameOnCard;
			}

			/**			
			 * CICO-7077 Confirmation Mail to have tax details
			 */

			data.tax_details = [];
			_.each($scope.reservationData.taxDetails, function(taxDetail) {
				data.tax_details.push(taxDetail);
			});

			data.tax_total = $scope.reservationData.totalTaxAmount;

			// guest emails to which confirmation emails should send
			data.confirmation_emails = [];
			if ($scope.otherData.isGuestPrimaryEmailChecked && $scope.reservationData.guest.email != "") {
				data.confirmation_emails.push($scope.reservationData.guest.email);
			}
			if ($scope.otherData.isGuestAdditionalEmailChecked && $scope.otherData.additionalEmail != "") {
				data.confirmation_emails.push($scope.otherData.additionalEmail);
			}

			// MLI Integration.
			if ($rootScope.paymentGateway === "sixpayments") {
				data.payment_type.token = $scope.six_token;
				data.payment_type.isSixPayment = true;
			} else {
				data.payment_type.isSixPayment = false;
				if ($scope.reservationData.paymentType.type !== null) {
					if ($scope.reservationData.paymentType.type.value === "CC") {
						data.payment_type.session_id = $scope.data.MLIData.session;
					}
				}
			}

			//	CICO-8320
			// 	The API request payload changes
			var stay = [];
			data.room_id = [];
			_.each($scope.reservationData.rooms, function(room) {
				var reservationStayDetails = [];
				_.each(room.stayDates, function(staydata, date) {
					reservationStayDetails.push({
						date: date,
						rate_id: (date == $scope.reservationData.departureDate) ? room.stayDates[$scope.reservationData.arrivalDate].rate.id : staydata.rate.id, // In case of the last day, send the first day's occupancy
						room_type_id: room.roomTypeId,
						room_id: room.room_id,
						adults_count: (date == $scope.reservationData.departureDate) ? room.stayDates[$scope.reservationData.arrivalDate].guests.adults : parseInt(staydata.guests.adults),
						children_count: (date == $scope.reservationData.departureDate) ? room.stayDates[$scope.reservationData.arrivalDate].guests.children : parseInt(staydata.guests.children),
						infants_count: (date == $scope.reservationData.departureDate) ? room.stayDates[$scope.reservationData.arrivalDate].guests.infants : parseInt(staydata.guests.infants)
					});
				});
				stay.push(reservationStayDetails);
			});

			//	end of payload changes
			data.stay_dates = stay;

			//addons
			data.addons = [];
			_.each($scope.reservationData.rooms[0].addons, function(addon) {
				data.addons.push({
					id: addon.id,
					quantity: addon.quantity
				});
			});

			data.company_id = $scope.reservationData.company.id;
			data.travel_agent_id = $scope.reservationData.travelAgent.id;
			data.reservation_type_id = parseInt($scope.reservationData.demographics.reservationType);
			data.source_id = parseInt($scope.reservationData.demographics.source);
			data.market_segment_id = parseInt($scope.reservationData.demographics.market);
			data.booking_origin_id = parseInt($scope.reservationData.demographics.origin);
			data.confirmation_email = $scope.reservationData.guest.sendConfirmMailTo;

			//to delete starts here
			// var room = {
			//                  numAdults: 1,
			//                  numChildren: 0,
			//                  numInfants: 0,
			//                  roomTypeId: '',
			//                  roomTypeName: 'Deluxe',
			//                  rateId: '',
			//                  rateName: 'Special',
			//                  rateAvg: 0,
			//                  rateTotal: 0,
			//                  addons: [],
			//                  varyingOccupancy: false,
			//                  stayDates: {},
			//                  room_id:320,
			//                  isOccupancyCheckAlerted: false
			//              }
			//          $scope.reservationData.rooms[0].room_id = 324;
			// $scope.reservationData.rooms.push(room);
			// data.room_id = [];
			// angular.forEach($scope.reservationData.rooms, function(room, key) {
			//   data.room_id.push(room.room_id);
			// });
			//to delete ends here
			return data;

		};

		$scope.proceedCreatingReservation = function() {
			var postData = computeReservationDataToSave();
			console.log("----------------POST DATA-----------------------");
			console.log(postData);
			// return false;
			var saveSuccess = function(data) {
				$scope.$emit('hideLoader');
				/*
				 * TO DO: to handle in future when more than one confirmations are returned.
				 * For now we will be using first item for navigating to staycard
				 * Response will have an array 'reservations' in that case.
				 * Normally the data will be a plain dictionary as before.
				 */
				if (typeof data.reservations !== 'undefined' && data.reservations instanceof Array) {

					angular.forEach(data.reservations, function(reservation, key) {
						angular.forEach($scope.reservationData.rooms, function(room, key) {
							if (parseInt(reservation.room_id) === parseInt(room.room_id)) {
								room.confirm_no = reservation.confirm_no;
							}
						});
					});
					$scope.reservationData.reservations = data.reservations;
					$scope.reservationData.reservationId = $scope.reservationData.reservations[0].id;
					$scope.reservationData.confirmNum = $scope.reservationData.reservations[0].confirm_no;
					$scope.reservationData.status = $scope.reservationData.reservations[0].status;
					$scope.viewState.reservationStatus.number = $scope.reservationData.reservations[0].id;
				} else {
					$scope.reservationData.reservationId = data.id;
					$scope.reservationData.confirmNum = data.confirm_no;
					$scope.reservationData.status = data.status;
					$scope.viewState.reservationStatus.number = data.id;
				}
				/*
				 * TO DO:ends here
				 */

				$scope.viewState.reservationStatus.confirm = true;
				$scope.reservationData.is_routing_available = false;
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
			};

			var updateSuccess = function(data) {
				$scope.viewState.identifier = "UPDATED";
				$scope.reservationData.is_routing_available = data.is_routing_available;
				$state.go('rover.reservation.staycard.mainCard.reservationConfirm', {
					"id": $scope.reservationData.reservationId,
					"confirmationId": $scope.reservationData.confirmNum
				});
			};

			if ($scope.reservationData.reservationId != "" && $scope.reservationData.reservationId != null && typeof $scope.reservationData.reservationId != "undefined") {
				//creating reservation
				postData.reservationId = $scope.reservationData.reservationId;
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
			};

			try {
				HostedForm.updateSession(sessionDetails, callback);
				$scope.$emit("showLoader");
			} catch (err) {
				$scope.errorMessage = ["There was a problem connecting to the payment gateway."];
			};
		};

		$scope.initFetchMLI = function() {
			if ($scope.reservationData.paymentType.ccDetails.number == "" ||
				$scope.reservationData.paymentType.ccDetails.cvv == "" ||
				$scope.reservationData.paymentType.ccDetails.expMonth == "" ||
				$scope.reservationData.paymentType.ccDetails.expYear == "") {
				return false;
			}
			fetchMLISession();
		};

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
			$scope.errorMessage = [];
			// CICO-9794
			if (($scope.otherData.isGuestPrimaryEmailChecked && $scope.reservationData.guest.email == "") || ($scope.otherData.isGuestAdditionalEmailChecked && $scope.otherData.additionalEmail == "")) {
				$scope.errorMessage = [$filter('translate')('INVALID_EMAIL_MESSAGE')];
			}
			if ($rootScope.paymentGateway !== "sixpayments") {
				if ($scope.reservationData.paymentType.type != null) {
					if ($scope.reservationData.paymentType.type.value === "CC" && ($scope.data.MLIData.session == "" || $scope.data.MLIData.session == undefined)) {
						$scope.errorMessage = [$filter('translate')('INVALID_CREDIT_CARD')];
					}
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
					id: $scope.reservationData.reservationId,
					confirmationId: $scope.reservationData.confirmNum,
					isrefresh: false
				};
				$state.go('rover.reservation.staycard.reservationcard.reservationdetails', stateParams);
			} else {
				$scope.initReservationData();
				$state.go('rover.reservation.search');
			}
		};

		$scope.changePaymentType = function() {
			if ($scope.reservationData.paymentType.type.value === 'CC') {
				if ($rootScope.paymentGateway === "sixpayments") {
					$scope.isSixPaymentGatewayVisible = true;
					if ($scope.isOnsiteActive) {
						$scope.isMLICreditCardVisible = false;
					} else {
						$scope.isMLICreditCardVisible = false;
					}

				} else {
					$scope.isSixPaymentGatewayVisible = false;
					$scope.isMLICreditCardVisible = true;
				}
			} else {
				$scope.isSixPaymentGatewayVisible = false;
				$scope.isMLICreditCardVisible = false;
				$scope.isSubmitButtonEnabled = true;
			}

			$scope.refreshPaymentScroller();
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
				"email": $scope.reservationData.guest.email
			};

			var data = {
				'data': dataToUpdate,
				'userId': $scope.reservationData.guest.id
			};

			var updateGuestEmailSuccessCallback = function(data) {
				$scope.$emit('guestEmailChanged');
				$scope.$emit("hideLoader");
			};

			var updateGuestEmailFailureCallback = function(data) {
				$scope.$emit("hideLoader");
			};

			$scope.invokeApi(RVContactInfoSrv.updateGuest, data, updateGuestEmailSuccessCallback, updateGuestEmailFailureCallback);
		};

		$scope.clickedOnsite = function() {

			$scope.isOnsiteActive = true;
			// $scope.isSixPaymentGatewayVisible = true;

			$scope.isIframeVisible = false;
			if ($scope.reservationData.paymentType.type.value == 'CC') {
				$scope.isSixPaymentGatewayVisible = true;
			} else {
				$scope.isSixPaymentGatewayVisible = false;
			}

			//Hiding in develop brach
			//ONCE 9424 done value Remove below line
			$scope.isSixPaymentGatewayVisible = false;
			$scope.refreshPaymentScroller();
		};

		$scope.clickedCallIn = function() {
			var typeIndex = '';
			$scope.isOnsiteActive = false;
			$scope.isIframeVisible = true;
			$scope.isSixPaymentGatewayVisible = true;
			$scope.reservationData.paymentType.type.value = 'CC';
			$scope.refreshPaymentScroller();
		};

		/*
		 *
		 */
		$scope.startPaymentProcess = function() {
			ngDialog.open({
				template: '/assets/partials/reservationCard/rvWaitingDialog.html',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
			var data = {
				"work_station_id": 1,
				"amount": "10.00",
				"currency_code": ""
			};
			RVReservationSummarySrv.startPayment(data).then(function(response) {
				console.log(response);
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isPosting = false;
			});

		};
		$scope.init();
	}
]);