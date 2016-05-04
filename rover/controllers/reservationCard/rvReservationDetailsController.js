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

		if (!$rootScope.stayCardStateBookMark) {
			setNavigationBookMark();
		}

        if($scope.previousState.name === "rover.actionsManager"){
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
		$scope.activeWakeUp = false;

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

		// for groups this date picker must not allow user to pick
		// a date that is after the group end date.
		if ( !! $scope.reservationData.reservation_card.group_id ) {
			$scope.departureDateOptions.maxDate = $filter('date')($scope.reservationData.reservation_card.group_block_to, $rootScope.dateFormat);
		}

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

	//  showing Guest button arrow as part of CICO-25774

		//$scope.shouldShowGuestDetails = false;
		$scope.toggleGuests = function() {


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
				if(_.isString($scope.selectedLoyalty.membership_card_number)){
					$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
				}
			}
		});
		angular.forEach($scope.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram, function(item, index) {
			if ($scope.reservationData.reservation_card.loyalty_level.selected_loyalty === item.id) {
				$scope.selectedLoyalty = item;
				if(_.isString($scope.selectedLoyalty.membership_card_number)){
					$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
				}
			}
		});

		//Update the balance amount in staycard
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


		//CICO-7078 : Initiate company & travelagent card info
		//temporarily store the exiting card ids
		var existingCards = {
			guest: $scope.reservationDetails.guestCard.id,
			company: $scope.reservationDetails.companyCard.id,
			agent: $scope.reservationDetails.travelAgent.id,
			group: $scope.reservationDetails.group.id,
			allotment: $scope.reservationDetails.allotment.id
		};
		//also reload the loyalty card / frequent flyer section
		$rootScope.$broadcast('reload-loyalty-section-data', {});

		$scope.reservationDetails.guestCard.id = reservationListData.guest_details.user_id === null ? "" : reservationListData.guest_details.user_id;
		$scope.reservationDetails.companyCard.id = reservationListData.company_id === null ? "" : reservationListData.company_id;
		$scope.reservationDetails.travelAgent.id = reservationListData.travel_agent_id === null ? "" : reservationListData.travel_agent_id;
		$scope.reservationDetails.group.id = reservationDetails.reservation_card.group_id || '';
		$scope.reservationDetails.allotment.id = reservationDetails.reservation_card.allotment_id || '';

		angular.copy(reservationListData, $scope.reservationListData);
		 //Reset to firstTab in case in case of coming into staycard from the create reservation screens
         //after creating multiple reservations
        $scope.viewState.currentTab = 0;

		$scope.populateDataModel(reservationDetails);

		$scope.$emit('cardIdsFetched', {
			guest: $scope.reservationDetails.guestCard.id === existingCards.guest,
			company: $scope.reservationDetails.companyCard.id === existingCards.company,
			agent: $scope.reservationDetails.travelAgent.id === existingCards.agent,
			group: $scope.reservationDetails.group.id === existingCards.group,
			allotment: $scope.reservationDetails.allotment.id === existingCards.allotment
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
		$scope.$on('refreshScrollerReservationDetails', function() {
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

                 $scope.$on('UPDATE_DEPOSIT_BALANCE_FLAG',function(evt, val){
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
                        if (swipedCardData.swipeFrom !== 'guestCard'){
                            $scope.$emit('isFromGuestCardFalse');
                        }




			var swipeOperationObj = new SwipeOperation();
			var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);

			var tokenizeSuccessCallback = function(tokenValue) {
				$scope.$emit('hideLoader');
				swipedCardData.token = tokenValue;

				$scope.showAddNewPaymentModel(swipedCardData);
                                $scope.swippedCard = true;
                                if (swipedCardData.swipeFrom !== 'guestCard'){
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
			isStayDatesChangeAllowed = false;

			if ($rootScope.isStandAlone &&
				!$scope.reservationData.reservation_card.is_hourly_reservation &&
				($scope.reservationData.reservation_card.reservation_status === 'CHECKING_IN' ||
					$scope.reservationData.reservation_card.reservation_status === 'RESERVED')) {

				isStayDatesChangeAllowed = true;

				if (!hasPermissionToChangeStayDates()) {
					isStayDatesChangeAllowed = false;
				}
			}
			return isStayDatesChangeAllowed;

		};

		/**
		 * CICO-17693: should be disabled on the Stay Card for Group reservations, until we have the complete functionality working:
		 * CICO-25179: should be disabled for allotment as well
		 * @return {Boolean} flag to disable button
		 */
		$scope.shouldDisableExtendNightsButton = function() {
			var isAllotmentPresent	= $scope.reservationData.allotment_id || $scope.reservationData.reservation_card.allotment_id,
				isGroupPresent 		= $scope.reservationData.group_id || $scope.reservationData.reservation_card.group_id;

			return (isAllotmentPresent || isGroupPresent);
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

					$scope.responseValidation = {};
					if (response.errors.length === 0) {
						$scope.responseValidation = response.data;
						$scope.stayDatesExtendedForOutsideGroup = (response.data.is_group_reservation && response.data.outside_group_stay_dates) ? true : false;
						$scope.borrowForGroups = (response.data.is_group_reservation && ! response.data.is_room_type_available) ? true : false;

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

		//reverse checkout process-
		//show room already occupied popup
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

			'authAmount'			: '0.00',
			'manualCCAuthPermission': true,
			'billData' 				: [],
			'selectedCardDetails' 	: 		// To keep the selected/active card details.
				{
					'name' 			: '',	// card - name
					'number'		: '',	// card - number
					'payment_id'	: '',	// card - payment method id
					'last_auth_date': '',	// card - last autheticated date
					'bill_no' 		: '',	// bill - number
					'bill_balance'	: ''	// bill - balance amount
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

			var fetchCreditCardAuthInfoSuccess = function( data ){
				$scope.$emit('hideLoader');
				$scope.authData.manualCCAuthPermission = hasManualCCAuthPermission();
				$scope.authData.billData = data.bill_data;

				if( $scope.authData.billData.length > 0 ){
					// Show Multiple Credit card auth popup
					ngDialog.open({
						template		: '/assets/partials/authorization/rvManualAuthorizationPopup.html',
						className		: '',
						closeByEscape 	: false,
						closeByDocument : false,
						scope 			: $scope
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

			var fetchCreditCardAuthInfoFaliure = function( errorMessage ){
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
			};

			var data = {
				"reservation_id":$scope.reservationData.reservation_card.reservation_id
			};

			$scope.invokeApi(RVCCAuthorizationSrv.fetchCreditCardAuthInfo, data, fetchCreditCardAuthInfoSuccess, fetchCreditCardAuthInfoFaliure);
		};

		/**
		* Method to hanlde each credit card click.
		* @param {int} index of the selected card
		*/
		$scope.selectCCforAuth = function( index ){
			var selectedCardData = $scope.authData.billData[index];
			var selectedCardDetails = {
				'name' 			: selectedCardData.card_name,
				'number' 		: selectedCardData.card_number,
				'payment_id' 	: selectedCardData.payment_method_id,
				'last_auth_date': selectedCardData.last_authorization.date ? selectedCardData.last_authorization.date : '',
				'bill_no' 		: selectedCardData.number,
				'bill_balance'	: selectedCardData.balance ? parseFloat(selectedCardData.balance).toFixed(2) : 0.00
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
				"payment_method_id"	: $scope.authData.selectedCardDetails.payment_id,
				"amount"			: $scope.authData.authAmount
			};
			$scope.invokeApi(RVCCAuthorizationSrv.manualAuthorization, postData, onAuthorizationSuccess, onAuthorizationFaliure);
		};

		// To handle close/cancel button click after success/declined of auth process.
		$scope.cancelButtonClick = function(){
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

            $scope.updateGiftCardNumber = function(n){
                $rootScope.$broadcast('GIFTCARD_DETAILS',n);
            };

            $scope.giftCardAmountAvailable = false;
            $scope.giftCardAvailableBalance = 0;
            $scope.$on('giftCardAvailableBalance',function(e, giftCardData){
               $scope.giftCardAvailableBalance = giftCardData.amount;
            });
            $scope.timer = null;
            $scope.cardNumberInput = function(n, e){
                    var len = n.length;
                    $scope.num = n;
                    if (len >= 8 && len <= 22){
                        //then go check the balance of the card
                        $('[name=card-number]').keydown(function(){
                            clearTimeout($scope.timer);
                            $scope.updateGiftCardNumber(n);
                            $scope.timer = setTimeout($scope.fetchGiftCardBalance, 1500);
                        });
                    } else {
                        //hide the field and reset the amount stored
                        $scope.giftCardAmountAvailable = false;
                    }
            };
            $scope.num;
            $scope.fetchGiftCardBalance = function() {
               // if ($scope.depositData.paymentType === 'GIFT_CARD'){
                       //switch this back for the UI if the payment was a gift card
                   $scope.giftCardAmountAvailable = false;
                   var fetchGiftCardBalanceSuccess = function(giftCardData){
                       $scope.giftCardAvailableBalance = giftCardData.amount;
                       $scope.giftCardAmountAvailable = true;
                       $scope.$emit('giftCardAvailableBalance',giftCardData);
                       //data.expiry_date //unused at this time
                       $scope.$emit('hideLoader');
                   };
                   $scope.invokeApi(RVReservationCardSrv.checkGiftCardBalance, {'card_number':$scope.num}, fetchGiftCardBalanceSuccess);
              // } else {
              //     $scope.giftCardAmountAvailable = false;
              // }
            };

     var unbindChildContentModListener = $scope.$on('CHILD_CONTENT_MOD',function(event, timer){
     	event.stopPropagation();
     	$scope.refreshReservationDetailsScroller(timer || 0);
     });

     $scope.$on( '$destroy', unbindChildContentModListener );

}]);
