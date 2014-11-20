sntRover.controller('reservationDetailsController', ['$scope', '$rootScope', 'RVReservationCardSrv', '$stateParams', 'reservationListData', 'reservationDetails', 'ngDialog', 'RVSaveWakeupTimeSrv', '$filter', 'RVNewsPaperPreferenceSrv', 'RVLoyaltyProgramSrv', '$state', 'RVSearchSrv', '$vault', 'RVReservationSummarySrv',
	function($scope, $rootScope, RVReservationCardSrv, $stateParams, reservationListData, reservationDetails, ngDialog, RVSaveWakeupTimeSrv, $filter, RVNewsPaperPreferenceSrv, RVLoyaltyProgramSrv, $state, RVSearchSrv, $vault, RVReservationSummarySrv) {

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
		
		//CICO-10006 assign the avatar image
		$scope.guestCardData.cardHeaderImage = reservationListData.guest_details.avatar;

		// if we just created a reservation and came straight to staycard
		// we should show the back button with the default text "Find Reservations"	
		if ( $stateParams.justCreatedRes || $scope.otherData.reservationCreated) {
			backTitle = titleDict['NORMAL_SEARCH'];
			backParam = { type: 'RESET'}; // CICO-9726 --- If a newly created reservation / go back to plain search page
		} else {
			backTitle = !!titleDict[$vault.get('searchType')] ? titleDict[$vault.get('searchType')] : titleDict['NORMAL_SEARCH'];
			backParam = { type: $vault.get('searchType') };
			//Special case - In case of search by CC, the title has to display the card number as well.
			//The title is already stored in $vault
			if($vault.get('searchType') == "BY_SWIPE"){
				backParam = { type: "BY_SWIPE"};
			}

		}

		// setup a back button
		$rootScope.setPrevState = {
			title: $filter('translate')(backTitle),
			scope: $scope,
			callback: 'goBackSearch'
		};

		// we need to update any changes to the room
		// before going back to search results
		$scope.goBackSearch = function() {
			$scope.updateSearchCache();
			console.log(backParam);
			$state.go('rover.search', backParam);
		};

		//CICO-10568
		$scope.reservationData.isSameCard = false;

		BaseCtrl.call(this, $scope);

		$scope.reservationCardSrv = RVReservationCardSrv;
		/*
		 * success call back of fetch reservation details
		 */
		//Data fetched using resolve in router
		var reservationMainData = $scope.$parent.reservationData;
		$scope.reservationParentData = $scope.$parent.reservationData;
		$scope.reservationData = reservationDetails;
		


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
				return (typeof $scope.reservationData.reservation_card.wake_up_time.wake_up_time != 'undefined') ? $scope.reservationData.reservation_card.wake_up_time.wake_up_time : $filter('translate')('NOT_SET');
			},
			function(wakeuptime) {
				$scope.wake_up_time = wakeuptime;
			}
		);
		$scope.shouldShowGuestDetails = false;
		$scope.toggleGuests = function() {
			$scope.shouldShowGuestDetails = !$scope.shouldShowGuestDetails;
			if ($scope.shouldShowGuestDetails) {
				$scope.shouldShowTimeDetails = false;
			}
		};

		$scope.shouldShowTimeDetails = false;
		$scope.toggleTime = function() {
			$scope.shouldShowTimeDetails = !$scope.shouldShowTimeDetails;
			if ($scope.shouldShowTimeDetails) {
				$scope.shouldShowGuestDetails = false;
			}
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
		$scope.setScroller('resultDetails', {'click': true});


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

		$scope.$emit('cardIdsFetched', {
			guest: $scope.reservationDetails.guestCard.id == existingCards.guest,
			company: $scope.reservationDetails.companyCard.id == existingCards.company,
			agent: $scope.reservationDetails.travelAgent.id == existingCards.agent
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
			}

		});
		//To pass confirmation number and resrvation id to reservation Card controller.
		// var passData = {confirmationNumber: $stateParams.confirmationId, reservationId: $stateParams.id};
		var passData = reservationListData;
		passData.avatar = reservationListData.guest_details.avatar;
		passData.vip = reservationListData.guest_details.vip;
		passData.confirmationNumber = reservationDetails.reservation_card.confirmation_num;

		$scope.$emit('passReservationParams', passData);


		/*$scope.openAddNewPaymentModel = function(data) {
			if (data === undefined) {
				var passData = {
					"reservationId": $scope.reservationData.reservation_card.reservation_id,
					"fromView": "staycard",
					"is_swiped": false
				};
				var paymentData = $scope.reservationData;
				$scope.showAddNewPaymentModal(passData, paymentData);
			} else {
				var ksn = data.RVCardReadTrack2KSN;
          		if(data.RVCardReadETBKSN != "" && typeof data.RVCardReadETBKSN != "undefined"){
					ksn = data.RVCardReadETBKSN;
				}

				var getTokenFrom = {
					'ksn': ksn,
					'pan': data.RVCardReadMaskedPAN
				};
				
				if(data.RVCardReadTrack2!=''){
					getTokenFrom.et2 = data.RVCardReadTrack2;
				} else if(data.RVCardReadETB !=""){
					getTokenFrom.etb = data.RVCardReadETB;
				}
				
				
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
						'etb': data.RVCardReadETB,
						'token': tokenData,
						"is_swiped": true // Commenting for now
					};
					var paymentData = $scope.reservationData;
					
					if($scope.isDepositBalanceScreenOpened){
						
						$scope.$broadcast("SHOW_SWIPED_DATA_ON_DEPOSIT_BALANCE_SCREEN", passData);
					} else{
						$scope.showAddNewPaymentModal(passData, paymentData);
					}
					
				};
				$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
			}

		};*/

		$rootScope.$on('clearErroMessages', function() {
			$scope.errorMessage = "";
		});

		$scope.openPaymentList = function() {
			//Disable the feature when the reservation is checked out
			if (!$scope.isNewsPaperPreferenceAvailable())
				return;
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
			$scope.updateSearchCache();
			$scope.$emit('hideLoader');
		};
		$scope.isWakeupCallAvailable = function() {
			var status = $scope.reservationData.reservation_card.reservation_status;
			return status == "CHECKEDIN" || status == "CHECKING_OUT" || status == "CHECKING_IN";
		};
		$scope.isNewsPaperPreferenceAvailable = function() {
			var status = $scope.reservationData.reservation_card.reservation_status;
			return status == "CHECKEDIN" || status == "CHECKING_OUT" || status == "CHECKING_IN" || status == "RESERVED";
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

		$scope.isNightsEnabled = function() {
			var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
			if (reservationStatus == 'RESERVED' || reservationStatus == 'CHECKING_IN') {
				return true;
			}
			if ($rootScope.isStandAlone &&
				(reservationStatus == 'CHECKEDIN' || reservationStatus == 'CHECKING_OUT')) {
				return true;
			}
			return false;
		};

		$scope.extendNights = function() {
			// TODO : This following LOC has to change if the room number changes to an array
			// to handle multiple rooms in future
			if($rootScope.isStandAlone){
				//If standalone, go to change staydates calendar if rooms is assigned.
				//If no room is assigned, go to stay dates calendar.
				if (reservationMainData.rooms[0].roomNumber != "") {
					$state.go('rover.reservation.staycard.changestaydates', {
						reservationId: reservationMainData.reservationId,
						confirmNumber: reservationMainData.confirmNum
					});
				} else {
					$scope.goToRoomAndRates("CALENDAR");
				}
			} else {
				//If ext PMS connected, go to change staydates screen
				$state.go('rover.reservation.staycard.changestaydates', {
					reservationId: reservationMainData.reservationId,
					confirmNumber: reservationMainData.confirmNum
				});
			}
		};

		$scope.goToRoomAndRates = function(state) {
			if($scope.reservationData.reservation_card.is_hourly_reservation){
				return false;
			} else if($rootScope.isStandAlone){
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
					reservationId:$scope.reservationData.reservation_card.reservation_id,
					clickedButton: "viewBillButton",
					userId:$scope.guestCardData.userId
				});
			}
			
			
			//rover.reservation.staycard.billcard({reservationId:$scope.reservationData.reservation_card.reservation_id, clickedButton: viewBillButton, userId:$scope.guestCardData.userId})
		};

		$scope.modifyCheckinCheckoutTime = function() {
			var updateSuccess = function(data) {
				$scope.$emit('hideLoader');
				if ($scope.reservationParentData.checkinTime.hh != '' && $scope.reservationParentData.checkinTime.mm != '') {
					$scope.reservationData.reservation_card.arrival_time = $scope.reservationParentData.checkinTime.hh + ":" + ($scope.reservationParentData.checkinTime.mm != '' ? $scope.reservationParentData.checkinTime.mm : '00') + " " + $scope.reservationParentData.checkinTime.ampm;
				} else {
					$scope.reservationData.reservation_card.arrival_time = null;
				}
				if ($scope.reservationParentData.checkoutTime.hh != '' && $scope.reservationParentData.checkoutTime.mm != '') {
					$scope.reservationData.reservation_card.departure_time = $scope.reservationParentData.checkoutTime.hh + ":" + ($scope.reservationParentData.checkoutTime.mm != '' ? $scope.reservationParentData.checkoutTime.mm : '00') + " " + $scope.reservationParentData.checkoutTime.ampm;
				} else {
					$scope.reservationData.reservation_card.departure_time = null;
				}
			};
			var updateFailure = function(data) {
				$scope.$emit('hideLoader');
			};

			if (($scope.reservationParentData.checkinTime.hh != '' && $scope.reservationParentData.checkinTime.mm != '') || ($scope.reservationParentData.checkoutTime.hh != '' && $scope.reservationParentData.checkoutTime.mm != '') || ($scope.reservationParentData.checkinTime.hh == '' && $scope.reservationParentData.checkinTime.mm == '') || ($scope.reservationParentData.checkoutTime.hh == '' && $scope.reservationParentData.checkoutTime.mm == '')) {
				var postData = $scope.computeReservationDataforUpdate();
				$scope.invokeApi(RVReservationSummarySrv.updateReservation, postData, updateSuccess, updateFailure);
			}
		};
		
		

		
		
		$scope.showAddNewPaymentModel = function(){
			var passData = {
				"reservationId": $scope.reservationData.reservation_card.reservation_id,
				"fromView": "staycard",
				"is_swiped": false
			};
			var paymentData = $scope.reservationData;
			
			$scope.openPaymentDialogModal(passData, paymentData);
		};

		$scope.showDiaryScreen = function(){
			$state.go('rover.diary.reservations');
		};

	}

]);
