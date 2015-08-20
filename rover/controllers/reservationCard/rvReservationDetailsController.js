
sntRover.controller('reservationDetailsController', ['$scope', '$rootScope', 'rvPermissionSrv' ,'RVReservationCardSrv', '$stateParams', 'reservationListData', 'reservationDetails', 'ngDialog', 'RVSaveWakeupTimeSrv', '$filter', 'RVNewsPaperPreferenceSrv', 'RVLoyaltyProgramSrv', '$state', 'RVSearchSrv', '$vault', 'RVReservationSummarySrv', 'baseData', '$timeout', 'paymentTypes', 'reseravationDepositData', 'dateFilter', 'RVReservationStateService',
	function($scope, $rootScope, rvPermissionSrv ,RVReservationCardSrv, $stateParams, reservationListData, reservationDetails, ngDialog, RVSaveWakeupTimeSrv, $filter, RVNewsPaperPreferenceSrv, RVLoyaltyProgramSrv, $state, RVSearchSrv, $vault, RVReservationSummarySrv, baseData, $timeout, paymentTypes, reseravationDepositData, dateFilter, RVReservationStateService) {
		// pre setups for back button
		var backTitle,
			backParam,
			titleDict = {
				'DUEIN': 'DASHBOARD_SEARCH_CHECKINGIN',
				'DUEOUT': 'DASHBOARD_SEARCH_CHECKINGOUT',
				'INHOUSE': 'DASHBOARD_SEARCH_INHOUSE',
				'LATE_CHECKOUT': 'DASHBOARD_SEARCH_LATECHECKOUT',
				'VIP': 'DASHBOARD_SEARCH_VIP',
				'NORMAL_SEARCH': 'SEARCH_NORMAL'
			};

		// Putting this hash in parent as we have to maintain the back button in stay card even after navigating to states from stay card and coming back to the stay card.
		var setNavigationBookMark = function() {
			$rootScope.stayCardStateBookMark = {
				previousState: $scope.previousState.name,
				previousStateParams: $scope.previousStateParams
			};
		};

		if (!$rootScope.stayCardStateBookMark) {
			setNavigationBookMark();
		}

		if ($scope.previousState.name === "rover.groups.config" || $rootScope.stayCardStateBookMark.previousState === 'rover.groups.config') {
			if ($scope.previousState.name === "rover.groups.config") {
				setNavigationBookMark();
			}
			$rootScope.setPrevState = {
				title: 'GROUP DETAILS',
				name: 'rover.groups.config',
				param: {
					id: $rootScope.stayCardStateBookMark.previousStateParams.id,
					activeTab: "ROOMING"
				}
			};
		} else if ($stateParams.isFromCards) {
			setNavigationBookMark();
			$rootScope.setPrevState = {
				title: 'AR Transactions',
				name: 'rover.companycarddetails',
				param: {
					id: $vault.get('cardId'),
					type: $vault.get('type'),
					query: $vault.get('query'),
					isBackFromStaycard: true
				}
			};

		} else if ($stateParams.isFromDiary && !$rootScope.isReturning()) {
			setNavigationBookMark();
			$rootScope.setPrevState = {
				title: 'Room Diary'
			};
		} else {
			setNavigationBookMark();
			// if we just created a reservation and came straight to staycard
			// we should show the back button with the default text "Find Reservations"
			if ($stateParams.justCreatedRes || $scope.otherData.reservationCreated) {
				backTitle = titleDict['NORMAL_SEARCH'];
				backParam = {
					type: 'RESET'
				}; // CICO-9726 --- If a newly created reservation / go back to plain search page
			} else {
				backTitle = !!titleDict[$vault.get('searchType')] ? titleDict[$vault.get('searchType')] : titleDict['NORMAL_SEARCH'];
				backParam = {
					type: $vault.get('searchType')
				};
				//Special case - In case of search by CC, the title has to display the card number as well.
				//The title is already stored in $vault
				if ($vault.get('searchType') === "BY_SWIPE") {
					backParam = {
						type: "BY_SWIPE"
					};
				}
			};

			// setup a back button
			$rootScope.setPrevState = {
				title: $filter('translate')(backTitle),
				scope: $scope,
				callback: 'goBackSearch'
			};

			// we need to update any changes to the room
			// before going back to search results
			$scope.goBackSearch = function() {
				$scope.$emit('showLoader');
				$scope.updateSearchCache();
				$state.go('rover.search', backParam);
			};
		}

		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation hide-arrow');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

				setTimeout(function() {
					$('body').find('#ui-datepicker-overlay')
						.on('click', function() {
							$('#room-out-from').blur();
							$('#room-out-to').blur();
						});
				}, 100);
			},
			onClose: function(value) {
				$('#ui-datepicker-div').removeClass('reservation hide-arrow');
				$('#ui-datepicker-overlay').off('click').remove();
			}
		};
                //CICO-16013, moved from rvReservationGuestCtrl.js to de-duplicate api calls
                $scope.activeWakeUp     = false;

		//CICO-10568
		$scope.reservationData.isSameCard = false;

		//CICO-10006 assign the avatar image
		$scope.guestCardData.cardHeaderImage = reservationListData.guest_details.avatar;

		/**
		 *	We have moved the fetching of 'baseData' form 'rover.reservation' state
		 *	to the state where this controller is set as the state controller
		 *
		 *	Now we do want the original parent controller 'RVReservationMainCtrl' to bind that data
		 *	so we have created a 'callFromChildCtrl' method on the 'RVReservationMainCtrl' $scope.
		 *
		 *	Once we fetch the baseData here we are going call 'callFromChildCtrl' method
		 *	while passing the data, this way all the things 'RVReservationMainCtrl' was doing with
		 *	'baseData' will be processed again
		 *
		 *	The number of '$parent' used is based on how deep this state is wrt 'rover.reservation' state
		 */
		var rvReservationMainCtrl = $scope.$parent.$parent.$parent.$parent;
		rvReservationMainCtrl.callFromChildCtrl(baseData);


		BaseCtrl.call(this, $scope);

		$scope.reservationCardSrv = RVReservationCardSrv;
		$scope.$emit('showLoader');
		/*
		 * success call back of fetch reservation details
		 */
		//Data fetched using resolve in router
		var reservationMainData = $scope.$parent.reservationData;

		$scope.reservationParentData = $scope.$parent.reservationData;

		$scope.reservationData = reservationDetails;
		// CICO-13564
		$scope.editStore = {
			arrival: $scope.reservationData.reservation_card.arrival_date,
			departure: $scope.reservationData.reservation_card.departure_date
		};

		$scope.arrivalDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(dateText, inst) {
				// Handle onSelect
			}
		}, datePickerCommon);

		$scope.departureDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(dateText, inst) {
				//
			}
		}, datePickerCommon);

		$scope.reservationData.paymentTypes = paymentTypes;
		$scope.reservationData.reseravationDepositData = reseravationDepositData;

		$scope.reservationData.justCreatedRes = (typeof $stateParams.justCreatedRes !== "undefined" && $stateParams.justCreatedRes !== "" && $stateParams.justCreatedRes !== null && $stateParams.justCreatedRes === "true") ? true : false;
		// update the room details to RVSearchSrv via RVSearchSrv.updateRoomDetails - params: confirmation, data
		$scope.updateSearchCache = function() {
			// room related details
			var data = {
				'room': $scope.reservationData.reservation_card.room_number,
				'reservation_status': $scope.reservationData.reservation_card.reservation_status,
				'roomstatus': $scope.reservationData.reservation_card.room_status,
				'fostatus': $scope.reservationData.reservation_card.fo_status,
				'room_ready_status': $scope.reservationData.reservation_card.room_ready_status,
				'is_reservation_queued': $scope.reservationData.reservation_card.is_reservation_queued,
				'is_queue_rooms_on': $scope.reservationData.reservation_card.is_queue_rooms_on,
				'late_checkout_time': $scope.reservationData.reservation_card.late_checkout_time,
				'is_opted_late_checkout': $scope.reservationData.reservation_card.is_opted_late_checkout
			};

			RVSearchSrv.updateRoomDetails($scope.reservationData.reservation_card.confirmation_num, data);
		};

		// update any room related data to search service also
		$scope.updateSearchCache();

		$scope.$parent.$parent.reservation = reservationDetails;
		$scope.reservationnote = "";
		$scope.selectedLoyalty = {};
		$scope.$emit('HeaderChanged', $filter('translate')('STAY_CARD_TITLE'));
		$scope.$watch(
			function() {
				return (typeof $scope.reservationData.reservation_card.wake_up_time.wake_up_time !== 'undefined') ? $scope.reservationData.reservation_card.wake_up_time.wake_up_time : $filter('translate')('NOT_SET');
			},
			function(wakeuptime) {
				$scope.wake_up_time = wakeuptime;
			}
		);

		$scope.shouldShowGuestDetails = false;
		$scope.toggleGuests = function() {
			// CICO-17693: should be disabled on the Stay Card for Group reservations, until we have the complete functionality working:
			if( $scope.reservationData.group_id || $scope.reservationData.reservation_card.group_id ){
				return false;
			};

			$scope.shouldShowGuestDetails = !$scope.shouldShowGuestDetails;
			if ($scope.shouldShowGuestDetails) {
				$scope.shouldShowTimeDetails = false;
			}

			// CICO-12454: Upon close the guest tab - save api call for guest details for standalone
			if (!$scope.shouldShowGuestDetails && $scope.isStandAlone) {
				$scope.$broadcast("UPDATEGUESTDEATAILS");
			}
		};

		$scope.$on("OPENGUESTTAB", function(e) {
			$scope.toggleGuests();
		});

		$scope.shouldShowTimeDetails = false;
		$scope.toggleTime = function() {
			$scope.shouldShowTimeDetails = !$scope.shouldShowTimeDetails;
			if ($scope.shouldShowTimeDetails) {
				$scope.shouldShowGuestDetails = false;
			}
		};



		angular.forEach($scope.reservationData.reservation_card.loyalty_level.frequentFlyerProgram, function(item, index) {
			if ($scope.reservationData.reservation_card.loyalty_level.selected_loyalty === item.id) {
				$scope.selectedLoyalty = item;
				$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
			}
		});
		angular.forEach($scope.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram, function(item, index) {
			if ($scope.reservationData.reservation_card.loyalty_level.selected_loyalty === item.id) {
				$scope.selectedLoyalty = item;
				$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
			}
		});

		//Update the balance amount in staycard
		$scope.$on('UPDATE_DEPOSIT_BALANCE', function(e, data){
			$scope.reservationData.reservation_card.balance_amount = data.reservation_balance;
		});


		$scope.$on("updateWakeUpTime", function(e, data) {

			$scope.reservationData.reservation_card.wake_up_time = data;
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
			$scope.wake_up_time = (typeof $scope.reservationData.reservation_card.wake_up_time.wake_up_time !== 'undefined') ? $scope.reservationData.reservation_card.wake_up_time.wake_up_time : $filter('translate')('NOT_SET');
		});
		$scope.setScroller('resultDetails', {
			'click': true
		});


		//CICO-7078 : Initiate company & travelagent card info
		//temporarily store the exiting card ids
		var existingCards = {
			guest: $scope.reservationDetails.guestCard.id,
			company: $scope.reservationDetails.companyCard.id,
			agent: $scope.reservationDetails.travelAgent.id
		};
                //also reload the loyalty card / frequent flyer section
                $rootScope.$broadcast('reload-loyalty-section-data',{});

		$scope.reservationDetails.guestCard.id = reservationListData.guest_details.user_id === null ? "" : reservationListData.guest_details.user_id;
		$scope.reservationDetails.companyCard.id = reservationListData.company_id === null ? "" : reservationListData.company_id;
		$scope.reservationDetails.travelAgent.id = reservationListData.travel_agent_id === null ? "" : reservationListData.travel_agent_id;

		angular.copy(reservationListData, $scope.reservationListData);
		$scope.populateDataModel(reservationDetails);

		$scope.$emit('cardIdsFetched', {
			guest: $scope.reservationDetails.guestCard.id === existingCards.guest,
			company: $scope.reservationDetails.companyCard.id === existingCards.company,
			agent: $scope.reservationDetails.travelAgent.id === existingCards.agent
		});
		//CICO-7078

		$scope.refreshReservationDetailsScroller = function(timeoutSpan) {
			setTimeout(function() {
					$scope.refreshScroller('resultDetails');
					$scope.$emit("REFRESH_LIST_SCROLL");
				},
				timeoutSpan);
		};


		$scope.$on('$viewContentLoaded', function() {
			$scope.refreshReservationDetailsScroller(3000);
		});

		/**
		 * (CICO-16893)
		 * Whene there is any click happened reservation area, we have to refresh scroller
		 * we will use this event to refresh scroller
		 */
		$scope.$on('refreshScrollerReservationDetails', function(){
			$scope.refreshReservationDetailsScroller(500);
		});

		$scope.reservationDetailsFetchSuccessCallback = function(data) {

			$scope.$emit('hideLoader');
			$scope.$parent.$parent.reservation = data;
			$scope.reservationData = data;
			//To move the scroller to top after rendering new data in reservation detals.
			$scope.$parent.myScroll['resultDetails'].scrollTo(0, 0);
			// upate the new room number to RVSearchSrv via RVSearchSrv.updateRoomNo - params: confirmation, room
			$scope.updateSearchCache();
		};
		/*
		 * Fetch reservation details on selecting or clicking each reservation from reservations list
		 * @param {int} confirmationNumber => confirmationNumber of reservation
		 */
		$scope.$on("RESERVATIONDETAILS", function(event, confirmationNumber) {
			if (confirmationNumber) {

				var data = {
					"confirmationNumber": confirmationNumber,
					"isRefresh": false
				};
				$scope.invokeApi(RVReservationCardSrv.fetchReservationDetails, data, $scope.reservationDetailsFetchSuccessCallback);
			} else {
				$scope.reservationData = {};
				$scope.reservationData.reservation_card = {};
			}

		});
		//To pass confirmation number and resrvation id to reservation Card controller.

		var passData = reservationListData;
		passData.avatar = reservationListData.guest_details.avatar;
		passData.vip = reservationListData.guest_details.vip;
		passData.confirmationNumber = reservationDetails.reservation_card.confirmation_num;

		$scope.$emit('passReservationParams', passData);



		$rootScope.$on('clearErroMessages', function() {
			$scope.errorMessage = "";
		});

		$scope.openPaymentList = function() {
			//Disable the feature when the reservation is checked out
			if (!$scope.isNewsPaperPreferenceAvailable()) {
				return;
			}
			$scope.reservationData.currentView = "stayCard";
			$scope.$emit('SHOWPAYMENTLIST', $scope.reservationData);
		};
		/*
		 * Handle swipe action in reservationdetails card
		 */

		$scope.$on('SWIPE_ACTION', function(event, swipedCardData) {
			if ($scope.isDepositBalanceScreenOpened) {
				swipedCardData.swipeFrom = "depositBalance";
			} else if ($scope.isCancelReservationPenaltyOpened) {
				swipedCardData.swipeFrom = "cancelReservationPenalty";
			} else if ($scope.isStayCardDepositScreenOpened) {
				swipedCardData.swipeFrom = "stayCardDeposit";
			} else if ($scope.isGuestCardVisible) {
				swipedCardData.swipeFrom = "guestCard";
			} else {
				swipedCardData.swipeFrom = "stayCard";
			}
			var swipeOperationObj = new SwipeOperation();
			var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
			var tokenizeSuccessCallback = function(tokenValue) {
				$scope.$emit('hideLoader');
				swipedCardData.token = tokenValue;
				$scope.showAddNewPaymentModel(swipedCardData);
			};
			$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
		});

		$scope.failureNewspaperSave = function(errorMessage) {
			$scope.errorMessage = errorMessage;
			$scope.$emit('hideLoader');
		};
		$scope.successCallback = function() {
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);

			// upate the new room number to RVSearchSrv via RVSearchSrv.updateRoomNo - params: confirmation, room
			$scope.updateSearchCache();
			$scope.$emit('hideLoader');
		};
		$scope.isWakeupCallAvailable = function() {
			var status = $scope.reservationData.reservation_card.reservation_status;
			return status === "CHECKEDIN" || status === "CHECKING_OUT" || status === "CHECKING_IN";
		};
		$scope.isNewsPaperPreferenceAvailable = function() {
			var status = $scope.reservationData.reservation_card.reservation_status;
			return status === "CHECKEDIN" || status === "CHECKING_OUT" || status === "CHECKING_IN" || status === "RESERVED";
		};

		$scope.saveNewsPaperPreference = function() {
			var params = {};
			params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
			params.selected_newspaper = $scope.reservationData.reservation_card.news_paper_pref.selected_newspaper;

			$scope.invokeApi(RVNewsPaperPreferenceSrv.saveNewspaperPreference, params, $scope.successCallback, $scope.failureNewspaperSave);

		};
		$scope.showFeatureNotAvailableMessage = function() {
			ngDialog.open({
				template: '/assets/partials/reservationCard/rvFeatureNotAvailableDialog.html',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		};
		$scope.deleteModal = function() {
			ngDialog.close();
		};

		$scope.showWakeupCallDialog = function() {
			if (!$scope.isWakeupCallAvailable()) {
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

		/**
		* we will not show "Nights" button in case of hourly, isNightsEnabled()
		* as part of CICO-17712, we are hiding it for now (group rservation)
		* @return {Boolean}
		*/
		$scope.shouldShowChangeStayDatesButton = function() {
			return ($scope.isNightsEnabled() &&
					!$scope.reservationData.reservation_card.is_hourly_reservation);
		};

		$scope.isNightsEnabled = function() {
			var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
			if (reservationStatus === 'RESERVED' || reservationStatus === 'CHECKING_IN') {
				return true;
			}
			if ($rootScope.isStandAlone &&
				(reservationStatus === 'CHECKEDIN' || reservationStatus === 'CHECKING_OUT')) {
				return true;
			}
			return false;
		};

		var hasPermissionToChangeStayDates = function() {
			return rvPermissionSrv.getPermissionValue('EDIT_RESERVATION');
		};

		$scope.isStayDatesChangeAllowed = function(){
			isStayDatesChangeAllowed = false;

			if($rootScope.isStandAlone &&
				!$scope.reservationData.reservation_card.is_hourly_reservation &&
				($scope.reservationData.reservation_card.reservation_status === 'CHECKING_IN' ||
				 $scope.reservationData.reservation_card.reservation_status === 'RESERVED')){

				isStayDatesChangeAllowed = true;

				if(!hasPermissionToChangeStayDates()){
					isStayDatesChangeAllowed = false;
				}
			}
			return isStayDatesChangeAllowed;

		};

		$scope.extendNights = function() {
			// CICO-17693: should be disabled on the Stay Card for Group reservations, until we have the complete functionality working:
			if( $scope.reservationData.group_id || $scope.reservationData.reservation_card.group_id ){
				return false;
			};

			// TODO : This following LOC has to change if the room number changes to an array
			// to handle multiple rooms in future
			if ($rootScope.isStandAlone) {
				//If standalone, go to change staydates calendar if rooms is assigned.
				//If no room is assigned, go to stay dates calendar. (REQUIREMENT HAS CHANGED - CICO-13566)
				if (true) { // -- CICO-13566  (reservationMainData.rooms[0].roomNumber !== "") - <<<< ALWAYS ROUTE TO THE STAYDATES SCREEN >>>>
					$state.go('rover.reservation.staycard.changestaydates', {
						reservationId: reservationMainData.reservationId,
						confirmNumber: reservationMainData.confirmNum
					});
				}

			} else {
				//If ext PMS connected, go to change staydates screen
				$state.go('rover.reservation.staycard.changestaydates', {
					reservationId: reservationMainData.reservationId,
					confirmNumber: reservationMainData.confirmNum
				});
			}
		};

		var editPromptDialogId;

		$scope.showEditReservationPrompt = function() {
			if ($rootScope.isStandAlone) {
				if ($scope.reservationData.reservation_card.is_hourly_reservation) {
					$scope.applyCustomRate();
				} else {
					editPromptDialogId = ngDialog.open({
						template: '/assets/partials/reservation/rvStayCardEditRate.html',
						className: 'ngdialog-theme-default',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false
					});
				}
			} else {
				$state.go('rover.reservation.staycard.billcard', {
					reservationId: $scope.reservationData.reservation_card.reservation_id,
					clickedButton: "viewBillButton",
					userId: $scope.guestCardData.userId
				});
			}
		};

		$scope.applyCustomRate = function() {
			$scope.closeDialog(editPromptDialogId);
			$timeout(function() {
				$scope.editReservationRates($scope.reservationParentData.rooms[0], 0);
			}, 1000);
		};


		$scope.goToRoomAndRates = function(state) {
			// CICO-17693: should be disabled on the Stay Card for Group reservations, until we have the complete functionality working:
			if( $scope.reservationData.group_id || $scope.reservationData.reservation_card.group_id ){
				return false;
			};

			$scope.closeDialog(editPromptDialogId);
			if ($scope.reservationData.reservation_card.is_hourly_reservation) {
				return false;
			} else if ($rootScope.isStandAlone) {
				$state.go('rover.reservation.staycard.mainCard.roomType', {
					from_date: reservationMainData.arrivalDate,
					to_date: reservationMainData.departureDate,
					view: state,
					fromState: $state.current.name,
					company_id: $scope.$parent.reservationData.company.id,
					travel_agent_id: $scope.$parent.reservationData.travelAgent.id
				});
			} else {
				$state.go('rover.reservation.staycard.billcard', {
					reservationId: $scope.reservationData.reservation_card.reservation_id,
					clickedButton: "viewBillButton",
					userId: $scope.guestCardData.userId
				});
			}



		};

		$scope.modifyCheckinCheckoutTime = function() {
			var updateSuccess = function(data) {
				$scope.$emit('hideLoader');
				if ($scope.reservationParentData.checkinTime.hh !== '' && $scope.reservationParentData.checkinTime.mm !== '') {
					$scope.reservationData.reservation_card.arrival_time = $scope.reservationParentData.checkinTime.hh + ":" + ($scope.reservationParentData.checkinTime.mm !== '' ? $scope.reservationParentData.checkinTime.mm : '00') + " " + $scope.reservationParentData.checkinTime.ampm;
				} else {
					$scope.reservationData.reservation_card.arrival_time = null;
				}
				if ($scope.reservationParentData.checkoutTime.hh !== '' && $scope.reservationParentData.checkoutTime.mm !== '') {
					$scope.reservationData.reservation_card.departure_time = $scope.reservationParentData.checkoutTime.hh + ":" + ($scope.reservationParentData.checkoutTime.mm !== '' ? $scope.reservationParentData.checkoutTime.mm : '00') + " " + $scope.reservationParentData.checkoutTime.ampm;
				} else {
					$scope.reservationData.reservation_card.departure_time = null;
				}
			};
			var updateFailure = function(data) {
				$scope.$emit('hideLoader');
			};

			if (($scope.reservationParentData.checkinTime.hh !== '' && $scope.reservationParentData.checkinTime.mm !== '') || ($scope.reservationParentData.checkoutTime.hh !== '' && $scope.reservationParentData.checkoutTime.mm !== '') || ($scope.reservationParentData.checkinTime.hh === '' && $scope.reservationParentData.checkinTime.mm === '') || ($scope.reservationParentData.checkoutTime.hh === '' && $scope.reservationParentData.checkoutTime.mm === '')) {
				var postData = $scope.computeReservationDataforUpdate();
				//CICO-11705
				postData.reservationId = $scope.reservationParentData.reservationId;
				$scope.invokeApi(RVReservationSummarySrv.updateReservation, postData, updateSuccess, updateFailure);
			}
		};
		/**
		 * we are capturing model opened to add some class mainly for animation
		 */
		$rootScope.$on('ngDialog.opened', function(e, $dialog) {
			//to add stjepan's popup showing animation
			$rootScope.modalOpened = false;
			$timeout(function() {
				$rootScope.modalOpened = true;
			}, 300);
		});
		$rootScope.$on('ngDialog.closing', function(e, $dialog) {
			//to add stjepan's popup showing animation
			$rootScope.modalOpened = false;
		});

		$scope.closeAddOnPopup = function() {
			//to add stjepan's popup showing animation
			$rootScope.modalOpened = false;
			$timeout(function() {
				ngDialog.close();
			}, 300);
		};

		$scope.showAddNewPaymentModel = function(swipedCardData) {

			var passData = {
				"reservationId": $scope.reservationData.reservation_card.reservation_id,
				"userId": $scope.data.guest_details.user_id,
				"details": {
					"firstName": $scope.data.guest_details.first_name,
					"lastName": $scope.data.guest_details.last_name,
					"hideDirectBill":true
				}
			};
			var paymentData = $scope.reservationData;
			if (swipedCardData !== undefined) {
				var swipeOperationObj = new SwipeOperation();
				var swipedCardDataToRender = swipeOperationObj.createSWipedDataToRender(swipedCardData);

				passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
				if (swipedCardDataToRender.swipeFrom !== "depositBalance" && swipedCardDataToRender.swipeFrom !== "cancelReservationPenalty" && swipedCardDataToRender.swipeFrom !== "stayCardDeposit") {
					$scope.openPaymentDialogModal(passData, paymentData);
				} else if (swipedCardDataToRender.swipeFrom === "stayCardDeposit") {
					$scope.$broadcast('SHOW_SWIPED_DATA_ON_STAY_CARD_DEPOSIT_SCREEN', swipedCardDataToRender);
				} else if (swipedCardDataToRender.swipeFrom === "depositBalance") {
					$scope.$broadcast('SHOW_SWIPED_DATA_ON_DEPOSIT_BALANCE_SCREEN', swipedCardDataToRender);
				} else {
					$scope.$broadcast('SHOW_SWIPED_DATA_ON_CANCEL_RESERVATION_PENALTY_SCREEN', swipedCardDataToRender);
				}
			} else {
				passData.details.swipedDataToRenderInScreen = {};
				$scope.openPaymentDialogModal(passData, paymentData);
			}


		};

		$scope.showDiaryScreen = function() {
			RVReservationCardSrv.checkinDateForDiary = $scope.reservationData.reservation_card.arrival_date.replace(/-/g, '/');
			$state.go('rover.diary', {
				reservation_id: $scope.reservationData.reservation_card.reservation_id,
				checkin_date: $scope.reservationData.reservation_card.arrival_date
			});
		};

		$scope.handleAddonsOnReservation = function(isPackageExist) {
			if (isPackageExist) {
				ngDialog.open({
					template: '/assets/partials/packages/showPackages.html',
					controller: 'RVReservationPackageController',
					scope: $scope
				});
			} else {
				$state.go('rover.reservation.staycard.mainCard.addons', {
					'from_date': $scope.reservation.reservation_card.arrival_date,
					'to_date': $scope.reservation.reservation_card.departure_date,
					'is_active': true,
					'is_not_rate_only': true,
					'from_screen': 'staycard'

				});
			}
		};
		//CICO-13907
		$scope.hasAnySharerCheckedin = function() {
			var isSharerCheckedin = false;
			angular.forEach($scope.reservationData.reservation_card.sharer_information, function(sharer, key) {
				if (sharer.reservation_status === 'CHECKEDIN' || sharer.reservation_status === 'CHECKING_OUT') {
					isSharerCheckedin = true;
					return false;
				}

			});
			return isSharerCheckedin;
		};

		$scope.responseValidation = {};

		$scope.editStayDates = function() {
			// reservation_id, arrival_date, departure_date
			$scope.errorMessage = "";
			var onValidationSuccess = function(response) {


					if (response.errors.length === 0) {
						$scope.responseValidation = response.data;
						$scope.stayDatesExtendedForOutsideGroup = (response.data.is_group_reservation &&response.data.outside_group_stay_dates) ? true: false;

						ngDialog.open({
							template: '/assets/partials/reservation/alerts/editDatesInStayCard.html',
							className: '',
							scope: $scope,
							data: JSON.stringify({
								is_stay_cost_changed: response.data.is_stay_cost_changed,
								is_assigned_room_available: response.data.is_room_available,
								is_rate_available: response.data.is_room_type_available,
								is_group_reservation: response.data.is_group_reservation,
								is_outside_group_stay_dates: response.data.outside_group_stay_dates,
								group_name: response.data.group_name,
								is_invalid_move: response.data.is_invalid_move,
								is_house_available: !!response.data.is_house_available
							})
						});
					} else {
						$scope.errorMessage = response.errors;
					}

					$scope.$emit('hideLoader');
				},
				onValidationFaliure = function(error) {

					$scope.$emit('hideLoader');
				};
			$scope.invokeApi(RVReservationCardSrv.validateStayDateChange, {
				arrival_date: $filter('date')(tzIndependentDate($scope.editStore.arrival), 'yyyy-MM-dd'),
				dep_date: $filter('date')(tzIndependentDate($scope.editStore.departure), 'yyyy-MM-dd'),
				reservation_id: $scope.reservationData.reservation_card.reservation_id
			}, onValidationSuccess, onValidationFaliure);
		};

		$scope.moveToRoomRates = function() {

			var initStayDates = function(roomNumber) {
				if (roomNumber === 0) {
					$scope.reservationParentData.stayDays = [];
				}
				for (var d = [], ms = new tzIndependentDate($scope.reservationParentData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationParentData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
					if (roomNumber === 0) {
						$scope.reservationParentData.stayDays.push({
							date: dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd'),
							dayOfWeek: dateFilter(new tzIndependentDate(ms), 'EEE'),
							day: dateFilter(new tzIndependentDate(ms), 'dd')
						});
					}
					$scope.reservationParentData.rooms[roomNumber].stayDates[dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd')] = {
						guests: {
							adults: parseInt($scope.reservationParentData.rooms[roomNumber].numAdults),
							children: parseInt($scope.reservationParentData.rooms[roomNumber].numChildren),
							infants: parseInt($scope.reservationParentData.rooms[roomNumber].numInfants)
						},
						rate: {
							id: "",
							name: ""
						}
					};
				};
			};

			var arrivalDate = tzIndependentDate($scope.editStore.arrival),
				departureDate = tzIndependentDate($scope.editStore.departure);
			$scope.reservationParentData.arrivalDate = $filter('date')(arrivalDate, 'yyyy-MM-dd');
			$scope.reservationParentData.departureDate = $filter('date')(departureDate, 'yyyy-MM-dd');
			$scope.reservationParentData.numNights = Math.floor((Date.parse(departureDate) - Date.parse(arrivalDate)) / 86400000);
			initStayDates(0);

			$state.go('rover.reservation.staycard.mainCard.roomType', {
				from_date: $filter('date')(tzIndependentDate($scope.editStore.arrival), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($scope.editStore.departure), 'yyyy-MM-dd'),
				fromState: $state.current.name,
				company_id: $scope.$parent.reservationData.company.id,
				travel_agent_id: $scope.$parent.reservationData.travelAgent.id
			});

			$scope.closeDialog();
		};

		$scope.changeStayDates = function() {
			var newArrivalDate = $filter('date')(tzIndependentDate($scope.editStore.arrival), 'yyyy-MM-dd');
			var newDepartureDate = $filter('date')(tzIndependentDate($scope.editStore.departure), 'yyyy-MM-dd');
			var existingStayDays = $scope.reservationParentData.rooms[0].stayDates;
			var modifiedStayDays = $scope.responseValidation.new_stay_dates;
			var newStayDates = {};

			for (var d = [], ms = new tzIndependentDate(newArrivalDate) * 1, last = new tzIndependentDate(newDepartureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
				var currentDate = $filter('date')(tzIndependentDate(ms), 'yyyy-MM-dd');
				if (!!existingStayDays[currentDate]) {
					newStayDates[currentDate] = existingStayDays[currentDate];
				} else {
					//go to take information from the new_stay_dates coming from the API response

					var newDateDetails = _.where(modifiedStayDays, {
						reservation_date: currentDate
					})[0];

					newStayDates[currentDate] = {
						guests: {
							adults: newDateDetails.adults,
							children: newDateDetails.children,
							infants: newDateDetails.infants || 0
						},
						rate: {
							id: newDateDetails.rate_id
						},
						rateDetails: {
							actual_amount: newDateDetails.rate_amount,
							modified_amount: newDateDetails.rate_amount
						}
					};

				}
			}

			//change the reservationData model to have the newer values
			$scope.reservationParentData.arrivalDate = newArrivalDate;
			$scope.reservationParentData.departureDate = newDepartureDate;
			$scope.reservationParentData.rooms[0].stayDates = newStayDates;

			//If it is a group reservation, which has extended the stay beyond the group staydates, then we will be taking the user to the room and rates screen after confirming the staydates
			if($scope.stayDatesExtendedForOutsideGroup){
				var stateParams = {
						from_date: $scope.reservationParentData.arrivalDate,
						to_date: $scope.reservationParentData.departureDate,
						fromState: $state.current.name,
						company_id: $scope.$parent.reservationData.company.id,
						travel_agent_id: $scope.$parent.reservationData.travelAgent.id
				};
				RVReservationStateService.setReservationFlag('outsideStaydatesForGroup', true);
				$scope.saveReservation('rover.reservation.staycard.mainCard.roomType', stateParams);
			}else{
				$scope.saveReservation('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $stateParams.id,
					"confirmationId": $stateParams.confirmationId,
					"isrefresh": false
				});
			}

			$scope.closeDialog();
		};

		//reverse checkout process-
		//show room already occupied popup
		var openRoomOccupiedPopup = function(){
			ngDialog.open({
							template: '/assets/partials/reservation/alerts/rvReverseNotPossible.html',
							className: '',
							scope: $scope,
							data: JSON.stringify($scope.reverseCheckoutDetails.data)
						});
		};
		if($scope.reverseCheckoutDetails.data.is_reverse_checkout_failed){
			openRoomOccupiedPopup();
			$scope.initreverseCheckoutDetails();
		};

    $rootScope.$on('SETPREV_RESERVATION',function(evt, fullname){
        setNavigationBookMark();
        $rootScope.setPrevState = {
                title: fullname
        };
    });

    // CICO-17067 PMS: Rover - Stay Card: Add manual authorization
    $scope.authData = {
		'authAmount' : '',
		'manualCCAuthPermission': true
	};

	// Flag for CC auth permission
    var hasManualCCAuthPermission = function() {
        return rvPermissionSrv.getPermissionValue('MANUAL_CC_AUTH');
    };

    $scope.showAuthAmountPopUp = function(){
    	$scope.authData.manualCCAuthPermission = hasManualCCAuthPermission();
    	$scope.authData.authAmount = "";
    	ngDialog.open({
			template: '/assets/partials/reservation/rvManualAuthorizationAddAmount.html',
			className: '',
			scope: $scope
		});
    };

    var authInProgress = function(){
    	// Manual auth in progress status
		$scope.isInProgressScreen = true;
    	$scope.isSuccessScreen = false;
    	$scope.isFailureScreen = false;
    	$scope.isCCAuthPermission = true;
	};

    var authSuccess = function(data){
		// With Authorization flow .: Auth success
		$scope.isInProgressScreen = false;
    	$scope.isSuccessScreen = true;
    	$scope.isFailureScreen = false;
    	$scope.cc_auth_amount = $scope.authData.authAmount;
    	$scope.cc_auth_code = data.auth_code;
    	$scope.reservationData.reservation_card.payment_details.auth_color_code = 'green';
	};

	var authFailure = function(){
		// With Authorization flow .: Auth declined
    	$scope.isInProgressScreen = false;
    	$scope.isSuccessScreen = false;
    	$scope.isFailureScreen = true;
    	$scope.cc_auth_amount = $scope.authData.authAmount;
    	$scope.reservationData.reservation_card.payment_details.auth_color_code = 'red';
	};

	// Manual Auth API call ..
    var manualAuthAPICall = function(){

    	var onAuthorizationSuccess = function(response){
    		$scope.$emit('hideLoader');
    		authSuccess(response);
    	};

    	var onAuthorizationFaliure = function(errorMessage){
    		$scope.$emit('hideLoader');
    		authFailure();
    	};

    	var data = {
			"payment_method_id": $scope.reservationData.reservation_card.payment_details.id,
			"amount": $scope.authData.authAmount
		};
    	$scope.invokeApi(RVReservationCardSrv.manualAuthorization, data , onAuthorizationSuccess, onAuthorizationFaliure);
    };

    // To handle authorize button click on 'auth amount popup' ..
    $scope.authorize = function(){
    	ngDialog.close(); // Closing the 'auth amount popup' ..

    	authInProgress();

    	setTimeout(function(){

	    	ngDialog.open({
				template: '/assets/partials/reservation/rvManualAuthorizationProcess.html',
				className: '',
				closeByDocument: false,
				scope: $scope
			});

			manualAuthAPICall();

    	}, 100);
    };

    // Handle TRY AGAIN on auth failure popup.
    $scope.tryAgain = function(){
		authInProgress();
		manualAuthAPICall();
	};
    // CICO-17067 PMS: Rover - Stay Card: Add manual authorization ends here...

    //>>wakeup call check after guest prefs are fetched
        $scope.$on('wakeup_call_ON',function(evt, data){
            if (data){
                $scope.activeWakeUp = data.active;
            }
        });
}]);
