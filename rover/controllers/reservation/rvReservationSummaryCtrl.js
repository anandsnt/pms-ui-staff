
sntRover.controller('RVReservationSummaryCtrl', ['$rootScope', '$scope', '$state', 'RVReservationSummarySrv', 'RVContactInfoSrv', '$filter', '$location', '$stateParams', 'dateFilter', '$vault', '$timeout', 'ngDialog', 'RVPaymentSrv',
	function($rootScope, $scope, $state, RVReservationSummarySrv, RVContactInfoSrv, $filter, $location, $stateParams, dateFilter, $vault, $timeout, ngDialog, RVPaymentSrv) {

		BaseCtrl.call(this, $scope);
		$scope.isSubmitButtonEnabled = false;

		if ($scope.reservationData.reservationId != '') {
			$scope.isSubmitButtonEnabled = true;
		}

		$scope.isSixPaymentGatewayVisible = false;
		$scope.isIframeVisible = false;
		$scope.isCallInOnsiteButtonVisible = false;
		$scope.isMLICreditCardVisible = false;
		if ($scope.reservationData.paymentType.type.value === 'CC') {
			$scope.isMLICreditCardVisible = true;
		}
		$scope.isOnsiteActive = false;

		if ($rootScope.paymentGateway === "sixpayments") {
			$scope.isCallInOnsiteButtonVisible = true;
			$scope.isOnsiteActive = true;
			$scope.isIframeVisible = false;
		}

		// var absoluteUrl = $location.$$absUrl;
		// domainUrl = absoluteUrl.split("/staff#/")[0];
		// $scope.iFrameUrl = domainUrl + "/api/ipage/index.html?amount=" + $filter('number')($scope.reservationData.totalStayCost, 2) + '&card_holder_first_name=' + $scope.guestCardData.contactInfo.first_name + '&card_holder_last_name=' + $scope.guestCardData.contactInfo.last_name + '&service_action=createtoken';
		
		$scope.passData = { "details":{}};

		$scope.passData.details.firstName = $scope.guestCardData.contactInfo.first_name;
		$scope.passData.details.lastName = $scope.guestCardData.contactInfo.last_name;
		$scope.addmode = true;
		$scope.showCC = false;
		$scope.showAddtoGuestCard = true;
		$scope.shouldShowAddNewCard = true;
		$scope.renderData = {};

		var retrieveCardtype = function(){
			var cardType = $scope.newPaymentInfo.tokenDetails.isSixPayment?
				getSixCreditCardType($scope.newPaymentInfo.tokenDetails.card_type).toLowerCase():
				getCreditCardType($scope.newPaymentInfo.tokenDetails.cardBrand).toLowerCase();
			return cardType;
		};

		var retrieveCardNumber = function(){
			var cardNumber = $scope.newPaymentInfo.tokenDetails.isSixPayment?
				$scope.newPaymentInfo.tokenDetails.token_no.substr($scope.newPaymentInfo.tokenDetails.token_no.length - 4):
				$scope.newPaymentInfo.cardDetails.cardNumber.slice(-4);
			return cardNumber;
		};

		var retrieveExpiryDate = function(){
			var expiryMonth =  $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(2, 4) :$scope.newPaymentInfo.cardDetails.expiryMonth;
				var expiryYear  =  $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(0, 2) :$scope.newPaymentInfo.cardDetails.expiryYear;
				var expiryDate = expiryMonth+" / "+expiryYear;
			return expiryDate;
		};

		var retrieveExpiryDateForSave = function(){
			var expiryMonth =  $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(2, 4) :$scope.newPaymentInfo.cardDetails.expiryMonth;
				var expiryYear  =  $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(0, 2) :$scope.newPaymentInfo.cardDetails.expiryYear;
				var expiryDate = "20"+expiryYear+"-"+expiryMonth+"-"+"01";
			return expiryDate;
		};

		$scope.$on('cancelCardSelection',function(){
			$scope.showCC = false;
			$scope.reservationData.paymentType.type.value = ""; 
		}); 

		var savenewCc = function(){
			var ccSaveSuccess = function(data){
				$scope.$emit('hideLoader');
				$scope.showCC = false;
				$scope.showSelectedCreditCard = true;
				$scope.reservationData.selectedPaymentId = data.id;				
				$scope.renderData.creditCardType = retrieveCardtype();
				$scope.renderData.endingWith  =retrieveCardNumber();
				$scope.renderData.cardExpiry =retrieveExpiryDate();
			};

			var data = {};
			data.reservation_id= $scope.reservationData.reservationId;	
			data.token = (!$scope.newPaymentInfo.tokenDetails.isSixPayment)?
								$scope.newPaymentInfo.tokenDetails.session :
								$scope.newPaymentInfo.tokenDetails.token_no;
			data.add_to_guest_card = $scope.newPaymentInfo.cardDetails.addToGuestCard;
			data.card_code =  retrieveCardtype();
			data.card_expiry = retrieveExpiryDateForSave();
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, ccSaveSuccess);
		};

		$scope.$on("TOKEN_CREATED", function(e,data){
			$scope.newPaymentInfo = data;
			savenewCc();
		});

		var setCreditCardFromList = function(index){	
			$scope.reservationData.selectedPaymentId = $scope.cardsList[index].value;
			$scope.renderData.creditCardType = $scope.cardsList[index].card_code.toLowerCase();
			$scope.renderData.endingWith  =$scope.cardsList[index].mli_token;
			$scope.renderData.cardExpiry = $scope.cardsList[index].card_expiry;
			$scope.showCC = false;
			$scope.showSelectedCreditCard = true;
		};

		$scope.$on('cardSelected',function(e,data){
			setCreditCardFromList(data.index);
		});

		$scope.payDeposit = function() {
			var onPaymentSuccess = function(data) {
					console.log(data);
					$scope.depositData.attempted = true;
					$scope.depositData.depositSuccess = true;
					$scope.depositData.authorizationCode = data.authorization_code;
					$scope.$emit('hideLoader');
				},
				onPaymentFailure = function(errorMessage) {
					$scope.depositData.attempted = true;
					$scope.depositData.depositAttemptFailure = true;
					$scope.errorMessage = errorMessage;
					$scope.$emit('hideLoader');
				}

			var dataToMakePaymentApi = {
				"postData": {
					"bill_number": 1,
					"payment_type": $scope.reservationData.paymentType.type.value,
					"amount": $scope.depositData.depositValue,
					"payment_type_id": $scope.reservationData.selectedPaymentId
				},
				"reservation_id": $scope.reservationData.reservationId
			};

			$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToMakePaymentApi, onPaymentSuccess, onPaymentFailure);

		}

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
			if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id) {
				$scope.$emit('PROMPTCARD');
				$scope.$watch("reservationData.guest.id", function() {
					if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id) {
						$scope.errorMessage = ['Need to attach a card to proceed'];
					} else {
						$scope.errorMessage = [];
						$scope.saveReservation();
					}
				});
				$scope.$watch("reservationData.company.id", function() {
					if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id) {
						$scope.errorMessage = ['Need to attach a card to proceed'];
					} else {
						$scope.errorMessage = [];
						$scope.saveReservation();
					}
				});
				$scope.$watch("reservationData.travelAgent.id", function() {
					if (!$scope.reservationData.guest.id && !$scope.reservationData.company.id && !$scope.reservationData.travelAgent.id) {
						$scope.errorMessage = ['Need to attach a card to proceed'];
					} else {
						$scope.errorMessage = [];
						$scope.saveReservation();
					}
				});
			} else {
				$scope.saveReservation();
			}
			$scope.data = {};

			$scope.cards = {
				available: false,
				activeView: "NEW"
			}

			if ($stateParams.reservation == "HOURLY") {
				$scope.$emit('showLoader');
				$scope.reservationData.isHourly = true;
				var temporaryReservationDataFromDiaryScreen = $vault.get('temporaryReservationDataFromDiaryScreen');
				temporaryReservationDataFromDiaryScreen = JSON.parse(temporaryReservationDataFromDiaryScreen);

				if (temporaryReservationDataFromDiaryScreen) {
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
				$scope.depositData = {};
				$scope.depositData.isDepositRequired = false;
				$scope.depositData.description = "";
				$scope.depositData.depositValue = 0.00;
				$scope.depositData.depositSuccess = !$scope.depositData.isDepositRequired;
				$scope.depositData.attempted = false;
				$scope.depositData.depositAttemptFailure = false;
			} else {
				$scope.depositData = {};
				$scope.depositData.isDepositRequired = !!$scope.reservationData.ratesMeta[$scope.reservationData.rooms[0].rateId].deposit_policy.id;
				$scope.depositData.description = $scope.reservationData.ratesMeta[$scope.reservationData.rooms[0].rateId].deposit_policy.description;
				$scope.depositData.depositValue = $scope.reservationData.depositAmount;
				$scope.depositData.depositSuccess = !$scope.depositData.isDepositRequired;
				$scope.depositData.attempted = false;
				$scope.depositData.depositAttemptFailure = false;
			}

			$scope.otherData.isGuestPrimaryEmailChecked = ($scope.reservationData.guest.email != null && $scope.reservationData.guest.email != "") ? true : false;
			$scope.otherData.isGuestAdditionalEmailChecked = false;
			$scope.reservationData.paymentMethods = [];
			$scope.data.MLIData = {};
			$scope.isGuestEmailAlreadyExists = ($scope.reservationData.guest.email != null && $scope.reservationData.guest.email != "") ? true : false;
			$scope.heading = "Guest Details & Payment";
			$scope.setHeadingTitle($scope.heading);

			$scope.setScroller('reservationSummary', {
				'click': true
			});
			$scope.setScroller('paymentInfo');
			fetchPaymentMethods();
			refreshScrolls();
		};

		var refreshScrolls = function() {
			$timeout(function() {
				$scope.refreshScroller('reservationSummary');
				$scope.refreshScroller('paymentInfo');
			}, 1500);
		};

		var ratesFetched = function(data) {
			$scope.otherData.taxesMeta = data.tax_codes;
			$scope.reservationData.totalTax = 0;
			_.each($scope.reservationData.rooms, function(room, roomNumber) {
				var taxes = _.where(data.tax_information, {
					rate_id: parseInt(room.rateId)
				});

				/**
				 * Need to calculate taxes IIF the taxes are configured for the rate selected for the room (as there could be more than one room for multiple reservations)
				 */

				if (taxes.length > 0) {
					/**
					 * Calculating taxApplied just for the arrival date, as this being the case for hourly reservations.
					 */
					var taxApplied = $scope.calculateTax($scope.reservationData.arrivalDate, room.amount, taxes[0].tax, roomNumber);
					_.each(taxApplied.taxDescription, function(description, index) {
						if (typeof $scope.reservationData.taxDetails[description.id] == "undefined") {
							$scope.reservationData.taxDetails[description.id] = description;
						} else {
							$scope.reservationData.taxDetails[description.id].amount = parseFloat($scope.reservationData.taxDetails[description.id].amount) + (parseFloat(description.amount));
						}
					});
					$scope.reservationData.totalTax = parseFloat($scope.reservationData.totalTax) + parseFloat(taxApplied.inclusive) + parseFloat(taxApplied.exclusive);
					$scope.reservationData.totalStayCost = parseFloat($scope.reservationData.totalStayCost) + parseFloat(taxApplied.exclusive);
				}
			});

			$scope.saveReservation();

			$timeout(function() {
				$scope.$emit('hideLoader');
			}, 500);
		};

		$scope.createReservationDataFromDiary = function(roomsArray, temporaryReservationDataFromDiaryScreen) {

			angular.forEach(temporaryReservationDataFromDiaryScreen.rooms, function(value, key) {
				value['roomTypeId'] = roomsArray[value.room_id].room_type_id;
				value['roomTypeName'] = roomsArray[value.room_id].room_type_name;
				value['roomNumber'] = roomsArray[value.room_id].room_no;
			});
			$scope.reservationData.rooms = [];
			$scope.reservationData.rooms = temporaryReservationDataFromDiaryScreen.rooms;
			$scope.reservationData.arrivalDate = temporaryReservationDataFromDiaryScreen.arrival_date;
			$scope.reservationData.departureDate = temporaryReservationDataFromDiaryScreen.departure_date;
			var arrivalTimeSplit = temporaryReservationDataFromDiaryScreen.arrival_time.split(":");
			$scope.reservationData.checkinTime.hh = arrivalTimeSplit[0];
			$scope.reservationData.checkinTime.mm = arrivalTimeSplit[1].split(" ")[0];
			$scope.reservationData.checkinTime.ampm = arrivalTimeSplit[1].split(" ")[1];
			var departureTimeSplit = temporaryReservationDataFromDiaryScreen.departure_time.split(":");
			$scope.reservationData.checkoutTime.hh = departureTimeSplit[0];
			$scope.reservationData.checkoutTime.mm = departureTimeSplit[1].split(" ")[0];
			$scope.reservationData.checkoutTime.ampm = departureTimeSplit[1].split(" ")[1];

			$scope.reservationData.totalStayCost = 0;
			var rateIdSet = [];
			_.each($scope.reservationData.rooms, function(room) {
				room.stayDates = {};
				rateIdSet.push(room.rateId);
				room.rateTotal = room.amount;
				$scope.reservationData.totalStayCost = parseFloat($scope.reservationData.totalStayCost) + parseFloat(room.amount);
				var success = function(data) {
					room.rateName = data;
					refreshScrolls();
				};
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

			$scope.invokeApi(RVReservationSummarySrv.getTaxDetails, {
				rate_ids: rateIdSet
			}, ratesFetched);
		};

		/**
		 * Fetches all the payment methods
		 */
		var fetchPaymentMethods = function() {
			var paymentFetchSuccess = function(data) {
				$scope.reservationData.paymentMethods = data;
				$scope.$emit('hideLoader');

				var reservationDataPaymentTypeValue = JSON.stringify($scope.reservationData.paymentType.type.value);
				var payments = _.where(data, {
					value: reservationDataPaymentTypeValue
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

		$scope.confirmReservation = function() {
			$state.go('rover.reservation.staycard.mainCard.reservationConfirm', {
				"id": $scope.reservationData.reservationId,
				"confirmationId": $scope.reservationData.confirmNum
			});
		}

		$scope.proceedCreatingReservation = function() {
			var postData = $scope.computeReservationDataforUpdate(false, true);
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
					$scope.reservationData.rooms[0].confirm_no = data.confirm_no;
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
				var showRoomNotAvailableDialog = false;
				var error = '';
				angular.forEach(data, function(value, key) {
					if (value == "Room not available for the selected number of hours. Please choose another room") {
						showRoomNotAvailableDialog = true;
						error = value;
					}

				});
				if (showRoomNotAvailableDialog) {
					$scope.showRoomNotAvailableDialog(error);
				} else {
					$scope.errorMessage = data;
				}



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
		$scope.showRoomNotAvailableDialog = function(errorMessage) {

			$scope.status = "error";
			$scope.popupMessage = errorMessage;
			ngDialog.open({
				template: '/assets/partials/reservation/rvShowRoomNotAvailableMessage.html',
				controller: 'RVShowRoomNotAvailableCtrl',
				className: '',
				scope: $scope
			});

		};


	
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
				$scope.showCC = true;
				$scope.addmode = $scope.cardsList.length > 0 ? false:true;
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
			$scope.shouldShowWaiting = true;
			ngDialog.open({
				template: '/assets/partials/reservation/rvWaitingDialog.html',
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
				$scope.shouldShowWaiting = false;
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isPosting = false;
			});

		};

		/*
		 * Get the title for the billing info button,
		 * on the basis of routes available or not
		 */
		$scope.getBillingInfoTitle = function() {
			if ($scope.reservationData.is_routing_available)
				return $filter('translate')('BILLING_INFO_TITLE');
			else
				return $filter('translate')('ADD_BILLING_INFO_TITLE');
		}


		/**
		 * trigger the billing information popup. $scope.reservationData is the same variable used in billing info popups also. 
		 So we are adding the required params to the existing $scope.reservationData, so that no other functionalities in reservation confirmation breaks.
		 */

		$scope.openBillingInformation = function(confirm_no) {
			//incase of multiple reservations we need to check the confirm_no to access billing 
			//information
			if (confirm_no) {
				angular.forEach($scope.reservationData.reservations, function(reservation, key) {
					if (reservation.confirm_no === confirm_no) {
						$scope.reservationData.confirm_no = reservation.confirm_no;
						$scope.reservationData.reservation_id = reservation.id;
						$scope.reservationData.reservation_status = reservation.status;
					}
				});
			} else {
				$scope.reservationData.confirm_no = $scope.reservationData.confirmNum;
				$scope.reservationData.reservation_id = $scope.reservationData.reservationId;
				$scope.reservationData.reservation_status = $scope.reservationData.status;
			}

			if ($scope.reservationData.guest.id != null) {
				$scope.reservationData.user_id = $scope.reservationData.guest.id;
			} else {
				$scope.reservationData.user_id = $scope.reservationData.company.id;
			}

			ngDialog.open({
				template: '/assets/partials/bill/rvBillingInformationPopup.html',
				controller: 'rvBillingInformationPopupCtrl',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		}

		$scope.updateAdditionalDetails = function() {
			var updateSuccess = function(data) {
				$scope.$emit('hideLoader');
			};

			var updateFailure = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
			};

			$scope.errorMessage = [];

			var postData = $scope.computeReservationDataforUpdate(true);
			postData.reservationId = $scope.reservationData.reservationId;
			$scope.invokeApi(RVReservationSummarySrv.updateReservation, postData, updateSuccess, updateFailure);
		}

		$scope.setDemographics = function() {
			ngDialog.open({
				template: '/assets/partials/reservation/rvReservationDemographicsPopup.html',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		}

		$scope.init();
	}
]);