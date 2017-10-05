sntRover.controller('reservationDetailsController',
	['$scope',
	'$rootScope',
	'rvPermissionSrv',
	'RVReservationCardSrv',
	'RVCCAuthorizationSrv',
	'$stateParams',
	'reservationListData',
	'reservationDetails',
	'ngDialog',
	'RVSaveWakeupTimeSrv',
	'$filter',
	'RVNewsPaperPreferenceSrv',
	'RVLoyaltyProgramSrv',
	'$state', 'RVSearchSrv',
	'$vault',
	'RVReservationSummarySrv',
	'baseData',
	'$timeout',
	'paymentTypes',
	'reseravationDepositData',
	'dateFilter',
	'RVReservationStateService',
	'RVReservationBaseSearchSrv',
	'RVReservationPackageSrv',
	function($scope, $rootScope, rvPermissionSrv, RVReservationCardSrv, RVCCAuthorizationSrv, $stateParams, reservationListData, reservationDetails, ngDialog, RVSaveWakeupTimeSrv, $filter, RVNewsPaperPreferenceSrv, RVLoyaltyProgramSrv, $state, RVSearchSrv, $vault, RVReservationSummarySrv, baseData, $timeout, paymentTypes, reseravationDepositData, dateFilter, RVReservationStateService, RVReservationBaseSearchSrv, RVReservationPackageSrv) {
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

		var roomAndRatesState = 'rover.reservation.staycard.mainCard.room-rates';

		// Putting this hash in parent as we have to maintain the back button in stay card even after navigating to states from stay card and coming back to the stay card.
		var setNavigationBookMark = function() {
			$rootScope.stayCardStateBookMark = {
				previousState: $scope.previousState.name,
				previousStateParams: $scope.previousStateParams
			};
		};

		// CICO-29343 - Set the flag to false initially and checking the View SR permission
		$scope.hasSRViewPermission = rvPermissionSrv.getPermissionValue('VIEW_SUPPRESSED_RATE');
		RVReservationStateService.setReservationFlag("isSRViewRateBtnClicked", false);

		// CICO-38714 / CICO-41313 - Set the Guest ID Permission flag and check if each guest has an id scanned or not
		// set to false if the hotel admin switch is turned off

		$scope.guestIdAdminEnabled = $rootScope.hotelDetails.guest_id_scan.scan_guest_id_active;
   		$scope.hasGuestIDPermission = rvPermissionSrv.getPermissionValue('ACCESS_GUEST_ID_DETAILS');
   		$scope.guestIDsAvailable = [];

		if (!$rootScope.stayCardStateBookMark) {
			setNavigationBookMark();
		}

        if($scope.previousState.name === "rover.actionsManager") {
            setNavigationBookMark();
            $rootScope.setPrevState = {
                title: 'ACTIONS MANAGER',
                name: 'rover.actionsManager',
                param: {
                    restore: true
                }
            };
        }
		else if ($scope.previousState.name === "rover.groups.config" || $rootScope.stayCardStateBookMark.previousState === 'rover.groups.config') {
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
		} else if ($scope.previousState.name === "rover.allotments.config" || $rootScope.stayCardStateBookMark.previousState === 'rover.allotments.config') {
			if ($scope.previousState.name === "rover.allotments.config") {
				setNavigationBookMark();
			}
			$rootScope.setPrevState = {
				title: 'ALLOTMENT DETAILS',
				name: 'rover.allotments.config',
				param: {
					id: $rootScope.stayCardStateBookMark.previousStateParams.id,
					activeTab: "RESERVATIONS"
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

		} else if ($scope.previousState.name === "rover.nightlyDiary" || $rootScope.stayCardStateBookMark.previousState === 'rover.nightlyDiary') {
			if ($scope.previousState.name === "rover.nightlyDiary") {
				setNavigationBookMark();
			}
			$rootScope.setPrevState = {
				title: 'DIARY',
				name: 'rover.nightlyDiary',
				param: {
					id: $rootScope.stayCardStateBookMark.previousStateParams.id,
					activeTab: "DIARY",
					isFromStayCard: true
				}
			};
		} else if ($stateParams.isFromDiary && !$rootScope.isReturning()) {
			setNavigationBookMark();
			$rootScope.setPrevState = {
				title: 'Room Diary'

			};
		} else if ($scope.previousState.name === "rover.reports" || $rootScope.stayCardStateBookMark.previousState === 'rover.reports') {
			if ($scope.previousState.name === "rover.reports") {
				setNavigationBookMark();
			}
			$rootScope.setPrevState = {
				title: 'REPORTS',
				name: 'rover.reports',
				param: {
					id: $rootScope.stayCardStateBookMark.previousStateParams.id,
					activeTab: "REPORTS"
				}
			};
		} else if ($scope.previousState.name === "rover.companycarddetails") {

            setNavigationBookMark();
            $rootScope.setPrevState = {
                title: 'TRAVEL Agent',
                name: 'rover.companycarddetails',
                param: {
					id: $vault.get('travelAgentId'),
					type: $vault.get('travelAgentType'),
					query: $vault.get('travelAgentQuery'),
					isBackToTACommission: $stateParams.isFromTACommission
				}
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
				// Special case - In case of search by CC, the title has to display the card number as well.
				// The title is already stored in $vault
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
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
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

		$scope.fetchedGuestIDs = false;
		var fetchGuestIDs = function() {
			var successCallBack = function(response) {
				$scope.guestIdReponseData = response;
     			$scope.$emit('hideLoader');

				$scope.fetchedGuestIDs = true;
				var guestOnReservation,
					reservation_card = $scope.reservationData.reservation_card;

				for (var i in response) {
					guestOnReservation = response[i];
					if (guestOnReservation.guest_id !== null && !$scope.guestIDsAvailable[guestOnReservation.guest_id]) {
						$scope.guestIDsAvailable.push(guestOnReservation.guest_id);
					}
				}
			};

			var failureCallBack = function() {
     			$scope.$emit('hideLoader');
				console.warn('unable to fetch guest ids: ', arguments);
			};

			var data = {
				"reservation_id": $scope.reservationData.reservation_card.reservation_id
			};

			if (!$scope.fetchedGuestIDs) {
				// do not make more than 1 request per 'fresh' staycard, to keep UI performance quick
				$scope.invokeApi(RVReservationCardSrv.fetchGuestIdentity, data, successCallBack, failureCallBack);
			}
		}

		// CICO-16013, moved from rvReservationGuestCtrl.js to de-duplicate api calls

		$scope.activeWakeUp = false;

		// CICO-10568
		$scope.reservationData.isSameCard = false;

		// CICO-10006 assign the avatar image
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
		// Data fetched using resolve in router
		var reservationMainData = $scope.$parent.reservationData;

		$scope.reservationParentData = $scope.$parent.reservationData;

		$scope.reservationData = reservationDetails;

		// CICO-13564
		$scope.editStore = {
			arrival: $scope.reservationData.reservation_card.arrival_date,
			departure: $scope.reservationData.reservation_card.departure_date
		};

		// for groups this date picker must not allow user to pick
		// a date that is after the group end date.
		// and before the group start date
		if ( !! $scope.reservationData.reservation_card.group_id ) {
			datePickerCommon = angular.extend(datePickerCommon, {
				minDate: $filter('date')($scope.reservationData.reservation_card.group_block_from, $rootScope.dateFormat),
				maxDate: $filter('date')($scope.reservationData.reservation_card.group_block_to, $rootScope.dateFormat)
			});

		}

		$scope.arrivalDateOptions = angular.copy(datePickerCommon);
		$scope.departureDateOptions = angular.copy(datePickerCommon);

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
				'is_opted_late_checkout': $scope.reservationData.reservation_card.is_opted_late_checkout,
				'departure_date': $scope.reservationData.reservation_card.departure_date
				// Fix for CICO-33114 where the departure_date value in cache wasn't getting updated.
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

	//  showing Guest button arrow as part of CICO-25774

		// $scope.shouldShowGuestDetails = false;
		$scope.toggleGuests = function() {

			$scope.shouldShowGuestDetails = !$scope.shouldShowGuestDetails;
			if ($scope.shouldShowGuestDetails) {
				$scope.shouldShowTimeDetails = false;
				fetchGuestIDs();
			}
            $scope.$broadcast("UPDATE_ACCOMPANY_SCROLL");
			// CICO-12454: Upon close the guest tab - save api call for guest details for standalone
			if (!$scope.shouldShowGuestDetails && $scope.isStandAlone) {
				$scope.$broadcast("UPDATEGUESTDEATAILS", {"isBackToStayCard": true});
			}

		};

		$scope.saveAccGuestDetails = function() {
			setTimeout(function() {

				if(document.activeElement.getAttribute("type") != "text") {
					$scope.$broadcast("UPDATEGUESTDEATAILS", {"isBackToStayCard": false});
				}


			}, 800)
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
				if(_.isString($scope.selectedLoyalty.membership_card_number)) {
					$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
				}
			}
		});
		angular.forEach($scope.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram, function(item, index) {
			if ($scope.reservationData.reservation_card.loyalty_level.selected_loyalty === item.id) {
				$scope.selectedLoyalty = item;
				if(_.isString($scope.selectedLoyalty.membership_card_number)) {
					$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
				}
			}
		});

		// Update the balance amount in staycard
		$scope.$on('UPDATE_DEPOSIT_BALANCE', function(e, data) {
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


		// CICO-7078 : Initiate company & travelagent card info
		// temporarily store the exiting card ids
		var existingCards = {
			guest: $scope.reservationDetails.guestCard.id,
			company: $scope.reservationDetails.companyCard.id,
			agent: $scope.reservationDetails.travelAgent.id,
			group: $scope.reservationDetails.group.id,
			allotment: $scope.reservationDetails.allotment.id
		};
		// also reload the loyalty card / frequent flyer section

		$rootScope.$broadcast('reload-loyalty-section-data', {});

		$scope.reservationDetails.guestCard.id = reservationListData.guest_details.user_id === null ? "" : reservationListData.guest_details.user_id;
		$scope.reservationDetails.companyCard.id = reservationListData.company_id === null ? "" : reservationListData.company_id;
		$scope.reservationDetails.travelAgent.id = reservationListData.travel_agent_id === null ? "" : reservationListData.travel_agent_id;
		$scope.reservationDetails.group.id = reservationDetails.reservation_card.group_id || '';
		$scope.reservationDetails.allotment.id = reservationDetails.reservation_card.allotment_id || '';

		angular.copy(reservationListData, $scope.reservationListData);
		// CICO-32546, flag to check if atleast one external reference number exists.
		$scope.externalReferencesExist = ($scope.reservationListData.external_references.length > 0)? true : false;
		 // Reset to firstTab in case in case of coming into staycard from the create reservation screens
         // after creating multiple reservations
        $scope.viewState.currentTab = 0;

		$scope.populateDataModel(reservationDetails);

		$scope.$emit('cardIdsFetched', {
			guest: $scope.reservationDetails.guestCard.id === existingCards.guest,
			company: $scope.reservationDetails.companyCard.id === existingCards.company,
			agent: $scope.reservationDetails.travelAgent.id === existingCards.agent,
			group: $scope.reservationDetails.group.id === existingCards.group,
			allotment: $scope.reservationDetails.allotment.id === existingCards.allotment
		});
		// CICO-7078

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
		$scope.$on('refreshScrollerReservationDetails', function() {
			$scope.refreshReservationDetailsScroller(500);
		});

		$scope.reservationDetailsFetchSuccessCallback = function(data) {

			$scope.$emit('hideLoader');
			$scope.$parent.$parent.reservation = data;
			$scope.reservationData = data;
			// To move the scroller to top after rendering new data in reservation detals.
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
		// To pass confirmation number and resrvation id to reservation Card controller.

		var passData = reservationListData;

		passData.avatar = reservationListData.guest_details.avatar;
		passData.vip = reservationListData.guest_details.vip;
		passData.confirmationNumber = reservationDetails.reservation_card.confirmation_num;

		$scope.$emit('passReservationParams', passData);


		$rootScope.$on('clearErroMessages', function() {
			$scope.errorMessage = "";
		});

		$scope.openPaymentList = function() {
			// Disable the feature when the reservation is checked out
			if (!$scope.isNewsPaperPreferenceAvailable()) {
				return;
			}
			$scope.reservationData.currentView = "stayCard";
			$scope.$emit('SHOWPAYMENTLIST', $scope.reservationData);
		};
		/*
		 * Handle swipe action in reservationdetails card
		 */

                 $scope.$on('UPDATE_DEPOSIT_BALANCE_FLAG', function(evt, val) {
                     $scope.isDepositBalanceScreenOpened = val;
                 });

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
                        if (swipedCardData.swipeFrom !== 'guestCard') {
                            $scope.$emit('isFromGuestCardFalse');
                        }


			var swipeOperationObj = new SwipeOperation();
			var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);

			var tokenizeSuccessCallback = function(tokenValue) {
				$scope.$emit('hideLoader');
				swipedCardData.token = tokenValue;

				$scope.showAddNewPaymentModel(swipedCardData);
                                $scope.swippedCard = true;
                                if (swipedCardData.swipeFrom !== 'guestCard') {
                                    $scope.$emit('isFromGuestCardFalse');
                                }
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
		 * CICO-29324: disable duests button for cancel and no show
		 * @return {Boolean} disable or not.
		 */
		$scope.shouldDisableGuestsButton = function() {
			var reservationStatus = $scope.reservation.reservation_card.reservation_status;

			return (reservationStatus === 'CANCELED' || reservationStatus === 'NOSHOW');
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

		$scope.isStayDatesChangeAllowed = function() {
			var is_hourly_reservation = $scope.reservationData.reservation_card.is_hourly_reservation,
				reservation_status    = $scope.reservationData.reservation_card.reservation_status,
				group_id              = $scope.reservationData.reservation_card.group_id;

			var not_hourly_reservation = ! is_hourly_reservation,
				checking_in_reserved   = {'CHECKING_IN': true, 'RESERVED': true}[reservation_status],
				group_checked_in       = {'CHECKEDIN': true, 'CHECKING_OUT': true}[reservation_status] && !! group_id;

			isStayDatesChangeAllowed = false;

			if (
				$rootScope.isStandAlone &&
				not_hourly_reservation &&
				hasPermissionToChangeStayDates() &&
				(checking_in_reserved || group_checked_in)
			) {
				isStayDatesChangeAllowed = true;
			}

			return isStayDatesChangeAllowed;
		};

		/**
		 * CICO-17693: should be disabled on the Stay Card for Group reservations, until we have the complete functionality working:
		 * CICO-25179: should be disabled for allotment as well
		 * @return {Boolean} flag to disable button
		 */
		$scope.shouldDisableExtendNightsButton = function() {
			var isAllotmentPresent	= $scope.reservationData.allotment_id || $scope.reservationData.reservation_card.allotment_id;

			return (isAllotmentPresent);
		};

		$scope.extendNights = function() {
			// CICO-17693: should be disabled on the Stay Card for Group reservations, until we have the complete functionality working:
			if ($scope.shouldDisableExtendNightsButton()) {
				return false;
			};

			$state.go("rover.reservation.staycard.changestaydates", {
				reservationId: reservationMainData.reservationId,
				confirmNumber: reservationMainData.confirmNum
			});
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

		var navigateToRoomAndRates = function(arrival, departure) {
			$state.go(roomAndRatesState, {
				from_date: arrival || reservationMainData.arrivalDate,
				to_date: departure || reservationMainData.departureDate,
				view: 'DEFAULT',
				fromState: $state.current.name,
				company_id: $scope.$parent.reservationData.company.id,
				travel_agent_id: $scope.$parent.reservationData.travelAgent.id,
				group_id: $scope.borrowForGroups ? '' : $scope.$parent.reservationData.group.id,
				borrow_for_groups: $scope.borrowForGroups,
				room_type_id: $scope.$parent.reservationData.tabs[$scope.viewState.currentTab].roomTypeId,
                adults: $scope.$parent.reservationData.tabs[$scope.viewState.currentTab].numAdults,
                children: $scope.$parent.reservationData.tabs[$scope.viewState.currentTab].numChildren
			});
		}

		$scope.alertOverbooking = function(close) {
			var timer = 0;

			if (close) {
				$scope.closeDialog();
				timer = 1000
			}
			$timeout(navigateToRoomAndRates, timer);
		};

		$scope.updateRoomRate = function() {
			$scope.invokeApi(RVReservationPackageSrv.getReservationPackages, $scope.reservationData.reservation_card.reservation_id, function(response) {

				$scope.$emit('hideLoader');

				var roomData = $scope.$parent.reservationData.rooms[0]; // Accessing from staycard -> ONLY one room/reservation!

				// Reset addons package
				roomData.addons = [];

				angular.forEach(response.existing_packages, function(addon) {
					roomData.addons.push({
						quantity: addon.addon_count,
						id: addon.id,
						price: parseFloat(addon.amount),
						amountType: addon.amount_type,
						postType: addon.post_type,
						title: addon.name,
						totalAmount: addon.addon_count * parseFloat(addon.amount),
						is_inclusive: addon.is_inclusive,
						taxes: addon.taxes,
						is_rate_addon: addon.is_rate_addon,
						allow_rate_exclusion: addon.allow_rate_exclusion,
						excluded_rate_ids: addon.excluded_rate_ids
					});
				});

				$scope.goToRoomAndRates('ROOM_RATE');
			});
		};

		$scope.goToRoomAndRates = function(state) {
			// CICO-17693: should be disabled on the Stay Card for Group reservations, until we have the complete functionality working:
			if ($scope.reservationData.group_id || $scope.reservationData.reservation_card.group_id) {
				return false;
			};

			$scope.closeDialog(editPromptDialogId);
			if ($scope.reservationData.reservation_card.is_hourly_reservation) {
				return false;
			} else if ($rootScope.isStandAlone) {
				navigateToRoomAndRates();
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
				// CICO-11705

				postData.reservationId = $scope.reservationParentData.reservationId;
				$scope.invokeApi(RVReservationSummarySrv.updateReservation, postData, updateSuccess, updateFailure);
			}
		};
		/**
		 * we are capturing model opened to add some class mainly for animation
		 */
		$rootScope.$on('ngDialog.opened', function(e, $dialog) {
			// to add stjepan's popup showing animation
			$rootScope.modalOpened = false;
			$timeout(function() {
				$rootScope.modalOpened = true;
			}, 300);
		});
		$rootScope.$on('ngDialog.closing', function(e, $dialog) {
			// to add stjepan's popup showing animation
			$rootScope.modalOpened = false;
		});

		$scope.closeAddOnPopup = function() {
			// to add stjepan's popup showing animation
			$rootScope.modalOpened = false;
			$timeout(function() {
				ngDialog.close();
			}, 300);
		};

		$scope.showAddNewPaymentModel = function(swipedCardData) {

			var passData = {
				"reservationId": $scope.reservationData.reservation_card.reservation_id,
				"guest_id": $scope.data.guest_details.user_id,
				"details": {
					"firstName": $scope.data.guest_details.first_name,
					"lastName": $scope.data.guest_details.last_name,
					"hideDirectBill": true
				}
			};
			var paymentData = $scope.reservationData;

			if (swipedCardData !== undefined) {
				var swipeOperationObj = new SwipeOperation();
				var swipedCardDataToRender = swipeOperationObj.createSWipedDataToRender(swipedCardData);

				passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
				if (swipedCardDataToRender.swipeFrom !== "depositBalance" &&
                                        swipedCardDataToRender.swipeFrom !== "cancelReservationPenalty" &&
                                        swipedCardDataToRender.swipeFrom !== "stayCardDeposit") {
                                        console.info('doing open pmt window with pass data')
					if (swipedCardDataToRender.swipeFrom === 'guestCard') {
                       passData.isFromGuestCard = true;
					}
					// close any ngDialogs if opened (work around fix)
					ngDialog.close($rootScope.LastngDialogId, "");

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
		// CICO-13907
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

					$scope.responseValidation = {};
					if (response.errors.length === 0) {
						$scope.responseValidation = response.data;
                        // CICO-39997 - Check the group reservation date is outside the group date only for standalone
						$scope.stayDatesExtendedForOutsideGroup = (response.data.is_group_reservation && response.data.outside_group_stay_dates && $rootScope.isStandAlone) ? true : false;
						$scope.borrowForGroups = (response.data.is_group_reservation && ! response.data.is_room_type_available) ? true : false;
                        // if user has over book permission, allow to extend even when room type not available CICO-35615
                        $scope.shouldAllowDateExtend = (response.data.is_room_type_available || rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE')) ? true : false;
                        $scope.showNotAvailableMessage = (!response.data.is_room_type_available && !rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE')) ? true : false;

                        // CICO-36733
                        $scope.showOverBookingAlert = !response.data.is_room_type_available && response.data.is_house_available && rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE');
                        $scope.showChangeDatesPopup = !rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE') || response.data.is_room_type_available || !response.data.is_house_available;


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
						$scope.responseValidation = {};
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
			navigateToRoomAndRates(
				$filter('date')(tzIndependentDate($scope.editStore.arrival), 'yyyy-MM-dd'),
				$filter('date')(tzIndependentDate($scope.editStore.departure), 'yyyy-MM-dd')
			);
			$scope.closeDialog();
		};

		var alertAddonOverbooking = function(close) {
			var addonIndex = 0,
				timer = 0;

			if (close) {
				$scope.closeDialog();
				timer = 1500
			}
			$timeout(function() {
				for (; addonIndex < $scope.responseValidation.addons_to_overbook.length; addonIndex++) {
					var addon = $scope.responseValidation.addons_to_overbook[addonIndex];

					if (!addon.isAlerted) {
						addon.isAlerted = true;
						ngDialog.open({
							template: '/assets/partials/reservationCard/rvInsufficientInventory.html',
							className: 'ngdialog-theme-default',
							closeByDocument: true,
							scope: $scope,
							data: JSON.stringify({
								name: addon.name,
								count: addon.inventory,
								canOverbookInventory: rvPermissionSrv.getPermissionValue('OVERRIDE_ITEM_INVENTORY')
							})
						});
						break;
					}
				}
				if (addonIndex === $scope.responseValidation.addons_to_overbook.length) {
					$scope.changeStayDates({
						skipAddonCheck: true
					});
				}
			}, timer);
		};


		$scope.selectAddon = function() {
			alertAddonOverbooking(true);
		};

		$scope.changeStayDates = function(flags) {

			if (!flags || !flags.skipAddonCheck) {
				if (!!$scope.responseValidation.new_stay_dates && $scope.responseValidation.new_stay_dates.length > 0 &&
					$scope.responseValidation.addons_to_overbook && $scope.responseValidation.addons_to_overbook.length > 0) {
					alertAddonOverbooking(true);
					return false;
				}
			}

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
					// go to take information from the new_stay_dates coming from the API response

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

			// change the reservationData model to have the newer values
			$scope.reservationParentData.arrivalDate = newArrivalDate;
			$scope.reservationParentData.departureDate = newDepartureDate;
			$scope.reservationParentData.rooms[0].stayDates = newStayDates;

			// If it is a group reservation, which has extended the stay beyond the group staydates, then we will be taking the user to the room and rates screen after confirming the staydates
			if ($scope.stayDatesExtendedForOutsideGroup) {
				var stateParams = {
					from_date: $scope.reservationParentData.arrivalDate,
					to_date: $scope.reservationParentData.departureDate,
					fromState: $state.current.name,
					company_id: $scope.$parent.reservationData.company.id,
					travel_agent_id: $scope.$parent.reservationData.travelAgent.id
				};

				RVReservationStateService.setReservationFlag('outsideStaydatesForGroup', true);
				$scope.saveReservation(roomAndRatesState, stateParams);
			} else {
				$scope.saveReservation('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $stateParams.id,
					"confirmationId": $stateParams.confirmationId,
					"isrefresh": false
				});
			}

			$scope.closeDialog();
		};

		// reverse checkout process-
		// show room already occupied popup
		var openRoomOccupiedPopup = function() {
			ngDialog.open({
				template: '/assets/partials/reservation/alerts/rvReverseNotPossible.html',
				className: '',
				scope: $scope,
				data: JSON.stringify($scope.reverseCheckoutDetails.data)
			});
		};

		if ($scope.reverseCheckoutDetails.data.is_reverse_checkout_failed) {
			openRoomOccupiedPopup();
			$scope.initreverseCheckoutDetails();
		};

		$rootScope.$on('SETPREV_RESERVATION', function(evt, fullname) {
			setNavigationBookMark();
			$rootScope.setPrevState = {
				title: fullname
			};
		});

		// CICO-17067 PMS: Rover - Stay Card: Add manual authorization
		// CICO-24426 - multiple authorizations
		$scope.authData = {

			'authAmount': '0.00',
			'manualCCAuthPermission': true,
			'billData': [],
			'selectedCardDetails': {	// To keep the selected/active card details
					'name': '',	// card - name
					'number': '',	// card - number
					'payment_id': '',	// card - payment method id
					'last_auth_date': '',	// card - last autheticated date
					'bill_no': '',	// bill - number
					'bill_balance': ''	// bill - balance amount
				}
		};

		// Flag for CC auth permission
		var hasManualCCAuthPermission = function() {
			return rvPermissionSrv.getPermissionValue('MANUAL_CC_AUTH');
		};

		/**
		* Method to show Authentication popup.
		* Fetching cards data before showing the popup.
		*/
		$scope.showAuthAmountPopUp = function() {

			var fetchCreditCardAuthInfoSuccess = function( data ) {
				$scope.$emit('hideLoader');
				$scope.authData.manualCCAuthPermission = hasManualCCAuthPermission();
				$scope.authData.billData = data.bill_data;

				if( $scope.authData.billData.length > 0 ) {
					// Show Multiple Credit card auth popup
					ngDialog.open({
						template: '/assets/partials/authorization/rvManualAuthorizationPopup.html',
						className: '',
						closeByEscape: false,
						closeByDocument: false,
						scope: $scope
					});
					// Default to select the first CC as active one.
					$scope.selectCCforAuth(0);
					// Handle scroller
					var scrollerOptions = { preventDefault: false };

   				    $scope.setScroller('cardsList', scrollerOptions);
   				    $scope.refreshScroller('cardsList');
				}
				else{
					console.warn("There should be atleast one credit card needed");
				}
			};

			var fetchCreditCardAuthInfoFaliure = function( errorMessage ) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
			};

			// CICO-28042 - Flag added to show/hide between credit card and
			// auth release for credit card sections
			$scope.hasShownReleaseConfirm = false;

			var data = {
				"reservation_id": $scope.reservationData.reservation_card.reservation_id
			};

			$scope.invokeApi(RVCCAuthorizationSrv.fetchCreditCardAuthInfo, data, fetchCreditCardAuthInfoSuccess, fetchCreditCardAuthInfoFaliure);
		};

		/**
		* Method to hanlde each credit card click.
		* @param {int} index of the selected card
		*/
		$scope.selectCCforAuth = function( index ) {
			var selectedCardData = $scope.authData.billData[index];
			var selectedCardDetails = {
				'name': selectedCardData.card_name,
				'number': selectedCardData.card_number,
				'payment_id': selectedCardData.payment_method_id,
				'last_auth_date': selectedCardData.last_authorization.date ? selectedCardData.last_authorization.date : '',
				'bill_no': selectedCardData.number,
				'bill_balance': selectedCardData.balance ? parseFloat(selectedCardData.balance).toFixed(2) : 0.00
			};

			$scope.authData.selectedCardDetails = selectedCardDetails;

			_.each($scope.authData.billData, function( card ) {
				card.active = false;
			});
			$scope.authData.billData[index].active = true;
		};

		var authInProgress = function() {
			// Manual auth in progress status
			$scope.isInProgressScreen = true;
			$scope.isSuccessScreen = false;
			$scope.isFailureScreen = false;
			$scope.isCCAuthPermission = true;
		};

		var authSuccess = function(data) {
			// With Authorization flow .: Auth success
			$scope.isInProgressScreen = false;
			$scope.isSuccessScreen = true;
			$scope.isFailureScreen = false;
			$scope.cc_auth_amount = $scope.authData.authAmount;
			$scope.cc_auth_code = data.auth_code;
			$scope.reservationData.reservation_card.payment_details.auth_color_code = 'green';
		};

		var authFailure = function() {
			// With Authorization flow .: Auth declined
			$scope.isInProgressScreen = false;
			$scope.isSuccessScreen = false;
			$scope.isFailureScreen = true;
			$scope.cc_auth_amount = $scope.authData.authAmount;
			$scope.reservationData.reservation_card.payment_details.auth_color_code = 'red';
		};

		// Manual Auth API call ..
		var manualAuthAPICall = function() {

			var onAuthorizationSuccess = function(response) {
				$scope.$emit('hideLoader');
				authSuccess(response);
			};

			var onAuthorizationFaliure = function(errorMessage) {
				$scope.$emit('hideLoader');
				authFailure();
			};

			var postData = {
				"payment_method_id": $scope.authData.selectedCardDetails.payment_id,
				"amount": $scope.authData.authAmount
			};

			$scope.invokeApi(RVCCAuthorizationSrv.manualAuthorization, postData, onAuthorizationSuccess, onAuthorizationFaliure);
		};

		// To handle close/cancel button click after success/declined of auth process.
		$scope.cancelButtonClick = function() {
			$scope.showAuthAmountPopUp();
		};

		// To handle authorize button click on 'auth amount popup' ..
		$scope.authorize = function() {
			ngDialog.close(); // Closing the 'auth amount popup' ..

			authInProgress();

			setTimeout(function() {

				ngDialog.open({
					template: '/assets/partials/authorization/rvManualAuthorizationProcess.html',
					className: '',
					closeByDocument: false,
					scope: $scope
				});

				manualAuthAPICall();

			}, 100);
		};

    // Handle TRY AGAIN on auth failure popup.
    $scope.tryAgain = function() {
		authInProgress();
		manualAuthAPICall();
	};
    // CICO-17067 PMS: Rover - Stay Card: Add manual authorization ends here...

    // >>wakeup call check after guest prefs are fetched
        $scope.$on('wakeup_call_ON', function(evt, data) {
            if (data) {
                $scope.activeWakeUp = data.active;
            }
        });

            $scope.updateGiftCardNumber = function(n) {
                $rootScope.$broadcast('GIFTCARD_DETAILS', n);
            };

            $scope.giftCardAmountAvailable = false;
            $scope.giftCardAvailableBalance = 0;
            $scope.$on('giftCardAvailableBalance', function(e, giftCardData) {
               $scope.giftCardAvailableBalance = giftCardData.amount;
            });
            $scope.timer = null;
            $scope.cardNumberInput = function(n, e) {
                    var len = n.length;

                    $scope.num = n;
                    if (len >= 8 && len <= 22) {
                        // then go check the balance of the card
                        $('[name=card-number]').keydown(function() {
                            clearTimeout($scope.timer);
                            $scope.updateGiftCardNumber(n);
                            $scope.timer = setTimeout($scope.fetchGiftCardBalance, 1500);
                        });
                    } else {
                        // hide the field and reset the amount stored
                        $scope.giftCardAmountAvailable = false;
                    }
            };
            $scope.num;
            $scope.fetchGiftCardBalance = function() {
               // if ($scope.depositData.paymentType === 'GIFT_CARD'){
                       // switch this back for the UI if the payment was a gift card
                   $scope.giftCardAmountAvailable = false;
                   var fetchGiftCardBalanceSuccess = function(giftCardData) {
                       $scope.giftCardAvailableBalance = giftCardData.amount;
                       $scope.giftCardAmountAvailable = true;
                       $scope.$emit('giftCardAvailableBalance', giftCardData);
                       // data.expiry_date //unused at this time
                       $scope.$emit('hideLoader');
                   };

                   $scope.invokeApi(RVReservationCardSrv.checkGiftCardBalance, {'card_number': $scope.num}, fetchGiftCardBalanceSuccess);
              // } else {
              //     $scope.giftCardAmountAvailable = false;
              // }
            };

     var unbindChildContentModListener = $scope.$on('CHILD_CONTENT_MOD', function(event, timer) {
     	event.stopPropagation();
     	$scope.refreshReservationDetailsScroller(timer || 0);
     });

     $scope.$on( '$destroy', unbindChildContentModListener );

    /**
	* Method to invoke when release btn on each authorized cards are clicked
	* @param {object} selected card with auth details
	*/
     $scope.onReleaseBtnClick = function(cardData) {
     	$scope.selectedCardData = cardData;
     	$scope.hasShownReleaseConfirm = true;
     };

    /**
	* Method to invoke while clicking on cancel btn in release confirm section
	*/
     $scope.onCancelClick = function() {
     	$scope.hasShownReleaseConfirm = false;
     };

    /**
	* Method to release the authorization of a credit card
	* @param {int} payment method id
	*/
     $scope.releaseAuthorization = function(paymentMethodId) {
     	var onReleaseAuthorizationSuccess = function(response) {
				$scope.$emit('hideLoader');
				$scope.hasShownReleaseConfirm = false;
				$scope.showAuthAmountPopUp();
			};

			var onReleaseAuthorizationFaliure = function(errorMessage) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				$scope.hasShownReleaseConfirm = false;
			};

			$scope.errorMessage = "";
			var postData = {
				"payment_method_id": paymentMethodId
			};

			$scope.invokeApi(RVCCAuthorizationSrv.releaseAuthorization, postData, onReleaseAuthorizationSuccess, onReleaseAuthorizationFaliure);
     };

     /*
     * Function which get invoked while clicking the SR  View Rate btn
     */
     $scope.onSRViewRateBtnClick = function() {
     	RVReservationStateService.setReservationFlag("isSRViewRateBtnClicked", true);
     };

     /*
     * Checks whether the balance amount section needs to show or not
     */
     $scope.isBalanceAmountShown = function() {
     	return (!$scope.reservationData.reservation_card.is_rate_suppressed_present_in_stay_dates || RVReservationStateService.getReservationFlag("isSRViewRateBtnClicked"));
     };

     /*
     * Checks whether the SR View Rate btn needs to show or not
     */
     $scope.isSRViewRateBtnShown = function() {
     	return $scope.isStandAlone && $scope.hasSRViewPermission && $scope.reservationData.reservation_card.is_rate_suppressed_present_in_stay_dates && !RVReservationStateService.getReservationFlag("isSRViewRateBtnClicked");
     };

      /*
     * Checks whether the rate amount needs to show or not
     */
     $scope.isRateAmountShown = function() {
     	return ($scope.reservationData.reservation_card.is_rates_suppressed == 'false' || RVReservationStateService.getReservationFlag("isSRViewRateBtnClicked"));
     };

     /**
     * Toggle the overbooking alert section visibility
     */
     $scope.toggleOverBookingAlert = function() {
       $scope.showOverBookingAlert = !$scope.showOverBookingAlert;
     }

     $scope.hideGuestId = function(guest, isPrimary) {
     	if (isPrimary) {
     		guest = {
     			'id': $scope.reservationParentData.guest.id
     		}
     	}
     	var has_guest_id_scanned = false;

 		if ($scope.guestIDsAvailable.indexOf(guest.id) !== -1) {
 			has_guest_id_scanned = true;
 		}
     	return (!has_guest_id_scanned || !$scope.guestIdAdminEnabled);
     }
     /*
      * show the guest id / passport when clicked "guest id" button from manage additional guests view
      */


      var getUserPassportInfo = function(guestResponseData, guest_id) {

     		for (var i in guestResponseData) {
     			if (guestResponseData[i].guest_id === guest_id) {
     				return guestResponseData[i];
     			}
     		}
     		return null;
      }


     $scope.showScannedGuestID = function(isPrimaryGuest, guestData) {
     	// $scope.guestIdData.showScannedGuestID, must be present for the guestID button to be enabled
     	// CICO-38714
     	// TODO: link with proper HTML once complete from design team
     	//       fetch guest id data with front+back images from API using (guest id / reservation id for primary guest?)

        $scope.$emit('hideLoader');
 		var responseData = $scope.guestIdReponseData,
 		 	guest_id;

 		if (isPrimaryGuest) {
 			guest_id = $scope.reservationParentData.guest.id;
 		} else {
 			guest_id = guestData.id;
 		}

 		var guest = getUserPassportInfo(responseData, guest_id);
 		if (guest !== null) {
	     	$scope.guestIdData = guestData;
	     	$scope.guestIdData.isPrimaryGuest = isPrimaryGuest;

	     	// Set data FROM GuestID (ie. passport)
	     	$scope.guestIdData.first_name = guest.first_name;
	     	$scope.guestIdData.last_name = guest.last_name;

	     	$scope.guestIdData.idType = guest.identityType;
	     	$scope.guestIdData.dob = guest.date_of_birth;

	     	$scope.guestIdData.twoSidedDoc = guest.front_image_data && guest.back_image_data;
	     	$scope.guestIdData.nationality = guest.nationality;

	     	$scope.guestIdData.docID = guest.document_number;
	     	$scope.guestIdData.docExpiry = guest.expiration_date;
	     	$scope.guestIdData.displayMode = 'FRONT_SIDE';
	 		$scope.guestIdData.imgFrontSrc = guest.front_image_data;
	 		$scope.guestIdData.imgBackSrc = guest.back_image_data;
	 		// END SETTING DATA FROM GUEST ID
	 		
	 		
	 		$scope.guestIdData.signature = 'data:image/jpeg;base64,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h4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKaFUSMwADEAE+uKBO46iiigYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVT1DUdP0jQrzVNVvrPTNMtIWnu7y7mWKGCNQSzu7EBVABJJOABXyJ+0v+3V+z5+y7Y3Wn+NPFA8QeP1jzB4L8PFbrUySImXzxuCWilJkkBnZC6bjGshXbX5+D4Yftj/8ABTDQ9D1H44LpH7OP7MMetrqmm+GbTTXOt6rGhlEMoM43lvJlaPz5PKhYlJktZBjG9Oi3rLZf1+P/AA1zCpVtpHf+v6/No+s/jf8A8FRv2UPgr4p03RrXxHqPxh1K8tXnkf4dPZ6naWYGBGs9y1xHFuclsLG0jKEJdU3Jv9K/ZF/bd+Gv7Yll4zTwP4b8Z+F9U8LRWT6tba9FbBH+1GcJ5DxTOZAv2dtxZUxuTAOTj+dv/gol+yj8Jf2Sf2hvAXgz4Y+NvGXiO51jw6+p6tpfiSOKWexX7Q8UMy3MMUUbpMY5l8rZvjNuWZmEqBf2R/4JIfs4638G/wBhbWPib4pDWviD4ptZanZ2InDpDpMMchsZGAHyyy/aZ5SAzDy3hB2sHUJRTi9P6/Lz+RTdmrP+v60P1gooorE1CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoorlvG3jjwf8N/hfq/jXx74k0fwj4T0uISX+q6pcrDBCCwVQWbqzMyoqjLMzKqgkgFpNuyE2lqzqa/FD9pX/gpbrvj74sQ/s3fsLaNqHj74n6zqkukP4uit0e1I8r5n0s+YA+1jKz3k4SCJLd5F8yNxPH4348/aA+P/wDwU7/arf4Jfsy3Hif4U/s9abbf8Vj4iuWe1lubW4TypTqHkykPG486KCwR/wB/+8eU7Qxtv13/AGWP2T/hf+yX8CJPCPw+trm/1jUWSbxL4l1DBvdZnTfsL4+WOKMSOscSjaikklneSR9bKFmnr/X9X/4cyUufS2n9f1b7+x8z/sxf8E2PAPwp8eaN8Y/jbr+q/HP9ogXEWqXOuazfy3Fjp+oAMTLAsnz3MiMwxcXO5t0UcqJA4wPuX40fFnwt8DP2XPG3xX8YziPQvDmmSXbwiRUku5fuw20ZbjzZZCkSZ43OM4HNen981/MX+3n+0d4x/be/b98N/su/AX7F4u+H2neIYrfRJdKBnTXtUETpNqDS7PktbdJLhA65j8pJZy7Iy+WRfNK8v6/ruDXKrLc8t/Y0+DHir9vz/grP4i+JHxfN34i8IWOo/wDCQ+P7j7SypO0hf7Fpse/eywu0QiEQI22sEiI6FUNf1jV8/wD7MX7PfhT9mH9jrwx8KPCzRXr2aG51vWPsqwy6xqEgHn3TqMkZIVEVmYpFHGm5tgJ+gKmpK+hVONlcKKKK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ooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKQgMuD0oBi0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUdqKACiomdhOqKu7+9z09P61IzBVLMQoHUmnYlTTv5C0UgIKBgQQRkGgEnORj8c0h3QtNdisTMqlyBkKO9Oo7etANNoZGzPCrOhjYjlSc4p9FFDCKaVm7hRRRQMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAzziiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBGAZCp6EYqKN4txhQjcijI9P84qY/nVBbaGPX5LoO/myRYKdsZ61cbNO5y15TjKLilvZ+nl8y2oBmLceZgBsenOP5miWGOeBopUWSM9VI608AZJ7mo5ozLAyB2jz3Wknqnc0lBezate99O4NDGzxsVH7v7nt/nFS1HFH5Vuse9n2jGW61JSbKpxSV7Wb3CiiikaBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAB3z3ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooo6jI5oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKskcv2pJBcOIgfmiKKQ2ffGa4/VfB+qal8aNA8Vw+PPF2k6dpttNDL4bs2txp9+0m3EkwaIyFk2nbtcAZPFFFdFHE1KTvHs1stnvuvx3OOrgqVW6nd6p7vf79vLbyOvtbg3AkLIFKNt4PWrdFFZ1opTaQsuqyqYeMpO7f+YUUUVmdoUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB/9k=';

	     	ngDialog.open({
				template: '/assets/partials/guestId/guestId.html',
				className: 'guest-id-dialog',
				scope: $scope
			});
 		}

     };

}]);
