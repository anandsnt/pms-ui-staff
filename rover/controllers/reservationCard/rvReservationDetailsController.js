sntRover.controller('reservationDetailsController', ['$scope', '$rootScope', 'RVReservationCardSrv', '$stateParams', 'reservationListData', 'reservationDetails', 'ngDialog', 'RVSaveWakeupTimeSrv', '$filter', 'RVNewsPaperPreferenceSrv', 'RVLoyaltyProgramSrv', '$state', 'RVSearchSrv', '$vault',
	function($scope, $rootScope, RVReservationCardSrv, $stateParams, reservationListData, reservationDetails, ngDialog, RVSaveWakeupTimeSrv, $filter, RVNewsPaperPreferenceSrv, RVLoyaltyProgramSrv, $state, RVSearchSrv, $vault) {

		// setup a back button
		$rootScope.setPrevState = {
			title: 'Search results'
		};

		BaseCtrl.call(this, $scope);


		$scope.reservationCardSrv = RVReservationCardSrv;
		/*
		 * success call back of fetch reservation details
		 */
		//Data fetched using resolve in router
		reservationMainData = $scope.$parent.reservationData;
		$scope.reservationData = reservationDetails;

		// update the room details to RVSearchSrv via RVSearchSrv.updateRoomDetails - params: confirmation, data
		var updateSearchCache = function() {

			// room related details
			var data = {
				'room': $scope.reservationData.reservation_card.room_number,
				'reservation_status': $scope.reservationData.reservation_card.reservation_status,
				'roomstatus': $scope.reservationData.reservation_card.room_status,
				'fostatus': $scope.reservationData.reservation_card.fo_status,
				'is_reservation_queued': $scope.reservationData.reservation_card.is_reservation_queued,
				'is_queue_rooms_on': $scope.reservationData.reservation_card.is_queue_rooms_on,
				'late_checkout_time': $scope.reservationData.reservation_card.late_checkout_time,
				'is_opted_late_checkout': $scope.reservationData.reservation_card.is_opted_late_checkout,
			};

			RVSearchSrv.updateRoomDetails($scope.reservationData.reservation_card.confirmation_num, data);
		};

		// update any room related data to search service also
		updateSearchCache();

		$scope.$parent.$parent.reservation = reservationDetails;
		$scope.reservationnote = "";
		if ($scope.reservationData.reservation_card.currency_code != null) {
			$scope.currencySymbol = getCurrencySign($scope.reservationData.reservation_card.currency_code);
		}
		$scope.selectedLoyalty = {};
		$scope.$emit('HeaderChanged', $filter('translate')('STAY_CARD_TITLE'));
		$scope.$watch(
			function() {
				return (typeof $scope.reservationData.reservation_card.wake_up_time.wake_up_time != 'undefined') ? $scope.reservationData.reservation_card.wake_up_time.wake_up_time : $filter('translate')('NOT_SET');
			},
			function(wakeuptime) {
				$scope.wake_up_time = wakeuptime;
			}
		);
		$scope.shouldShowGuestDetails = false;
		$scope.toggleGuests = function() {
			$scope.shouldShowGuestDetails = !$scope.shouldShowGuestDetails;
		};
		// $scope.wake_up_time = ;
		angular.forEach($scope.reservationData.reservation_card.loyalty_level.frequentFlyerProgram, function(item, index) {
			if ($scope.reservationData.reservation_card.loyalty_level.selected_loyalty == item.id) {
				$scope.selectedLoyalty = item;
				$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
			}
		});
		angular.forEach($scope.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram, function(item, index) {
			if ($scope.reservationData.reservation_card.loyalty_level.selected_loyalty == item.id) {
				$scope.selectedLoyalty = item;
				$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
			}
		});
		$scope.$on("updateWakeUpTime", function(e, data) {

			$scope.reservationData.reservation_card.wake_up_time = data;
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
			$scope.wake_up_time = (typeof $scope.reservationData.reservation_card.wake_up_time.wake_up_time != 'undefined') ? $scope.reservationData.reservation_card.wake_up_time.wake_up_time : $filter('translate')('NOT_SET');
		});

		$scope.setScroller('resultDetails');

		//CICO-6081 In case of multiple rates selected, show multiple rates selected in the ADR button
		$scope.reservationData.rateDescriptionADR = $scope.reservationData.reservation_card.package_description;
		// var multipleRatesPresent = false;
		// var multipleRates = [];
		// angular.forEach($scope.reservationData.reservation_card.stay_dates, function(item, index) {
		// 	multipleRates.push(item.rate_id);
		// });

		// if (multipleRates.reduce(function(a, b) {
		// 	return (a === b) ? true : false;
		// })) {
		// 	$scope.reservationData.rateDescriptionADR = "Multiple Rates Selected";
		// };

		//CICO-7078 : Initiate company & travelagent card info
		//temporarily store the exiting card ids
		var existingCards = {
			guest: $scope.reservationDetails.guestCard.id,
			company: $scope.reservationDetails.companyCard.id,
			agent: $scope.reservationDetails.travelAgent.id
		};

		$scope.reservationDetails.guestCard.id = reservationListData.guest_details.user_id == null ? "" : reservationListData.guest_details.user_id;
		$scope.reservationDetails.companyCard.id = reservationListData.company_id == null ? "" : reservationListData.company_id;
		$scope.reservationDetails.travelAgent.id = reservationListData.travel_agent_id == null ? "" : reservationListData.travel_agent_id;

		angular.copy(reservationListData, $scope.reservationListData);
		$scope.populateDataModel(reservationDetails);

		// console.log($scope.reservationListData)
		$scope.$emit('cardIdsFetched', {
			guest: $scope.reservationDetails.guestCard.id == existingCards.guest,
			company: $scope.reservationDetails.companyCard.id == existingCards.company,
			agent: $scope.reservationDetails.travelAgent.id == existingCards.agent
		});
		//CICO-7078



		$scope.$on('$viewContentLoaded', function() {
			setTimeout(function() {
					$scope.refreshScroller('resultDetails');
				},
				3000);

		});



		$scope.reservationDetailsFetchSuccessCallback = function(data) {

			$scope.$emit('hideLoader');
			$scope.$parent.$parent.reservation = data;
			$scope.reservationData = data;
			//To move the scroller to top after rendering new data in reservation detals.
			$scope.$parent.myScroll['resultDetails'].scrollTo(0, 0);

			// upate the new room number to RVSearchSrv via RVSearchSrv.updateRoomNo - params: confirmation, room
			updateSearchCache();
		};
		/*
		 * Fetch reservation details on selecting or clicking each reservation from reservations list
		 * @param {int} confirmationNumber => confirmationNumber of reservation
		 */
		$scope.$on("RESERVATIONDETAILS", function(event, confirmationNumber) {
			if (confirmationNumber) {

				var data = {
					"confirmationNumber": confirmationNumber,
					"isRefresh": $stateParams.isrefresh
				};
				$scope.invokeApi(RVReservationCardSrv.fetchReservationDetails, data, $scope.reservationDetailsFetchSuccessCallback);
			} else {
				$scope.reservationData = {};
			}

		});
		//To pass confirmation number and resrvation id to reservation Card controller.
		// var passData = {confirmationNumber: $stateParams.confirmationId, reservationId: $stateParams.id};
		var passData = reservationListData;
		passData.avatar = reservationListData.guest_details.avatar;
		passData.vip = reservationListData.guest_details.vip;
		passData.confirmationNumber = reservationDetails.reservation_card.confirmation_num;

		$scope.$emit('passReservationParams', passData);


		$scope.openAddNewPaymentModel = function(data) {
			if (data === undefined) {
				var passData = {
					"reservationId": $scope.reservationData.reservation_card.reservation_id,
					"fromView": "staycard",
					"is_swiped": false
				};
				var paymentData = $scope.reservationData;
				$scope.showAddNewPaymentModal(passData, paymentData);
			} else {


				var getTokenFrom = {
					'et2': data.RVCardReadTrack2,
					'ksn': data.RVCardReadTrack2KSN,
					'pan': data.RVCardReadMaskedPAN
				};

				var tokenizeSuccessCallback = function(tokenData) {
					data.token = tokenData;
					var passData = {
						"reservationId": $scope.reservationData.reservation_card.reservation_id,
						"fromView": "staycard",
						"credit_card": data.RVCardReadCardType,
						"card_number": "xxxx-xxxx-xxxx-" + tokenData.slice(-4),
						"name_on_card": data.RVCardReadCardName,
						"card_expiry": data.RVCardReadExpDate,
						"et2": data.RVCardReadTrack2,
						'ksn': data.RVCardReadTrack2KSN,
						'pan': data.RVCardReadMaskedPAN,
						'token': tokenData,
						"is_swiped": true // Commenting for now
					};
					var paymentData = $scope.reservationData;
					$scope.showAddNewPaymentModal(passData, paymentData);
				};
				$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
			}

		};

		$rootScope.$on('clearErroMessages', function() {
			$scope.errorMessage = "";
		});

		$scope.openPaymentList = function() {
			$scope.reservationData.currentView = "stayCard";
			$scope.$emit('SHOWPAYMENTLIST', $scope.reservationData);
		};
		/*
		 * Handle swipe action in reservationdetails card
		 */
		$scope.$on('SWIPEHAPPENED', function(event, data) {
			if (!$scope.isGuestCardVisible) {
				$scope.openAddNewPaymentModel(data);
			}

		});

		$scope.failureNewspaperSave = function(errorMessage) {
			$scope.errorMessage = errorMessage;
			$scope.$emit('hideLoader');
		};
		$scope.successCallback = function() {
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);

			// upate the new room number to RVSearchSrv via RVSearchSrv.updateRoomNo - params: confirmation, room
			updateSearchCache();
			$scope.$emit('hideLoader');
		};
		$scope.isNewsPaperPreferenceAndWakeupCallAvailable = function() {
			var status = $scope.reservationData.reservation_card.reservation_status;
			return status == "CHECKEDIN" || status == "CHECKING_OUT" || status == "CHECKING_IN";
		};
		$scope.saveNewsPaperPreference = function() {BALANCECHANGED

			var params = {};
			params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
			params.selected_newspaper = $scope.reservationData.reservation_card.news_paper_pref.selected_newspaper;

			$scope.invokeApi(RVNewsPaperPreferenceSrv.saveNewspaperPreference, params, $scope.successCallback, $scope.failureNewspaperSave);

		};
		$scope.showFeatureNotAvailableMessage = function() {
			var errorMessage = "Feature not available";
			if ($scope.hasOwnProperty("errorMessage")) {
				$scope.errorMessage = [errorMessage];
				$scope.successMessage = '';
			} else {
				$scope.$emit("showErrorMessage", errorMessage);
			}
		};

		$scope.showWakeupCallDialog = function() {
			if (!$scope.isNewsPaperPreferenceAndWakeupCallAvailable()) {
				$scope.showFeatureNotAvailableMessage();
				return;
			}

			$scope.wakeupData = $scope.reservationData.reservation_card.wake_up_time;
			ngDialog.open({
				template: '/assets/partials/reservationCard/rvSetWakeupTimeDialog.html',
				controller: 'rvSetWakeupcallController',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		};

		$scope.extendNights = function() {
			// TODO : This following LOC has to change if the room number changes to an array
			// to handle multiple rooms in future

			if (reservationMainData.rooms[0].roomNumber != "") {
				$state.go('rover.reservation.staycard.changestaydates', {
					reservationId: reservationMainData.reservationId,
					confirmNumber: reservationMainData.confirmNum
				});
			} else {
				$scope.goToRoomAndRates("CALENDAR");
			}
		};

		$scope.goToRoomAndRates = function(state) {
			$state.go('rover.reservation.staycard.mainCard.roomType', {
				from_date: reservationMainData.arrivalDate,
				to_date: reservationMainData.departureDate,
				view: state
			});
		};
		
		
	 
	}
]);