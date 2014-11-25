sntRover.controller('RVReservationSummaryCtrl', ['$rootScope', '$scope', '$state', 'RVReservationSummarySrv', 'RVContactInfoSrv', '$filter', '$location', '$stateParams', 'dateFilter', '$vault', '$timeout', 'ngDialog',
	function($rootScope, $scope, $state, RVReservationSummarySrv, RVContactInfoSrv, $filter, $location, $stateParams, dateFilter, $vault, $timeout, ngDialog) {

		BaseCtrl.call(this, $scope);
		$scope.isSubmitButtonEnabled = false;

		if ($scope.reservationData.reservationId != '') {
			$scope.isSubmitButtonEnabled = true;
		}

		$scope.isSixPaymentGatewayVisible = false;
		$scope.isIframeVisible = false;
		$scope.isCallInOnsiteButtonVisible = false;
		$scope.isMLICreditCardVisible = false;
		if($scope.reservationData.paymentType.type.value === 'CC'){
			$scope.isMLICreditCardVisible = true;
		}
		$scope.isOnsiteActive = false;

		if ($rootScope.paymentGateway === "sixpayments") {
			$scope.isCallInOnsiteButtonVisible = true;
			$scope.isOnsiteActive = true;
			$scope.isIframeVisible = false;
		}

		var absoluteUrl = $location.$$absUrl;
		domainUrl = absoluteUrl.split("/staff#/")[0];
		$scope.iFrameUrl = domainUrl + "/api/ipage/index.html?amount=" + $filter('number')($scope.reservationData.totalStayCost, 2) + '&card_holder_first_name=' + $scope.guestCardData.contactInfo.first_name + '&card_holder_last_name=' + $scope.guestCardData.contactInfo.last_name + '&service_action=createtoken';
		// var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		// var eventer = window[eventMethod];
		// // Now...
		// // if 
		// //    "attachEvent", then we need to select "onmessage" as the event. 
		// // if 
		// //    "addEventListener", then we need to select "message" as the event

		// var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

		// // Listen to message from child IFrame window

		// eventer(messageEvent, function (e) {
			
		// 	   var responseData = e.data;
		//        if(responseData.response_message == "token_created"){
		//        		$scope.isSubmitButtonEnabled = true;
		//        		var unwantedKeys = ["response_message"]; // remove unwanted keys for API
  //      				//responseData = dclone(responseData, unwantedKeys);
		//        		//console.log(JSON.stringify(responseData));
		//        		$scope.six_token = responseData.token_no;
		       		
		//        		//$scope.invokeApi(RVReservationSummarySrv.paymentAction, responseData, $scope.successPayment);
		//        }
		    
		// }, false);   

		$rootScope.$on('six_token_recived',function(e,data){
			console.log(data);
			$scope.isSubmitButtonEnabled = true;
			// var unwantedKeys = ["response_message"]; // remove unwanted keys for API
			// responseData = dclone(responseData, unwantedKeys);
			// console.log(JSON.stringify(responseData));
			$scope.six_token = data.six_token;
			console.log($scope.six_token)
			//$scope.invokeApi(RVReservationSummarySrv.paymentAction, responseData, $scope.successPayment);
		});
		
		$scope.submitReservationButtonClass = function(isSubmitButtonEnabled){
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
				console.log("hhhhhhhhhhhhhhhhhh")
;;				$scope.$emit('showLoader');
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

		$scope.proceedCreatingReservation = function() {
			var postData = $scope.computeReservationDataforUpdate();
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
				angular.forEach(data, function(value, key){
					if(value == "Room not available for the selected number of hours. Please choose another room"){
						showRoomNotAvailableDialog = true;
						error = value;
					}
					
				});
				if(showRoomNotAvailableDialog){
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
		$scope.showRoomNotAvailableDialog = function(errorMessage){
			
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
					$scope.isSubmitButtonEnabled = true;
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

		$scope.changePaymentType = function(){
			if($scope.reservationData.paymentType.type.value === 'CC'){
				if($rootScope.paymentGateway === "sixpayments"){
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
		$scope.startPaymentProcess = function(){
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
			},function(){
				$rootScope.netWorkError = true;
				$scope.isPosting = false;
			});

		};
		$scope.init();
	}
]);