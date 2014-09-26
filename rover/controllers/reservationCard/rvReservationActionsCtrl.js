sntRover.controller('reservationActionsController', [
	'$rootScope',
	'$scope',
	'ngDialog',
	'RVChargeItems',
	'$state',
	'RVReservationCardSrv',
	'RVReservationSummarySrv',
	'RVHkRoomDetailsSrv',
	'RVDepositBalanceSrv',
	'$filter',
	function($rootScope, $scope, ngDialog, RVChargeItems, $state, RVReservationCardSrv, RVReservationSummarySrv, RVHkRoomDetailsSrv, RVDepositBalanceSrv, $filter) {

		BaseCtrl.call(this, $scope);

		$scope.actionsCheck = {
			firstDate: $scope.reservationParentData.arrivalDate == $rootScope.businessDate
		};

		$scope.displayTime = function(status) {
			var display = false;
			if (status == 'CHECKEDIN' || status == 'CHECKING_OUT') {
				display = true;
			}
			return display;
		};

		$scope.displayBalance = function(status, balance) {
			var display = false;
			if (status == 'CHECKING_IN' || status == 'RESERVED' || status == 'CHECKEDIN' || status == 'CHECKING_OUT') {
				if(status == 'CHECKING_IN' || status == 'RESERVED'){
					if (balance == 0 || balance == 0.00 || balance == 0.0) {
						display = false;
					} else {
						display = true;
					}
				} else {
					display = true;
				}
				
			}
			return display;
		};

		$scope.getBalanceAmountColor = function(balance) {
			var balanceClass = "";
			if (balance == 0 || balance == 0.00 || balance == 0.0) {
				balanceClass = "green";
			} else {
				balanceClass = "red";
			}
			return balanceClass;
		};

		$scope.displayAddon = function(status) {
			var display = false;
			if (status == 'RESERVED' || status == 'CHECKING_IN' || status == 'CHECKEDIN' || status == 'CHECKING_OUT') {
				display = true;
			}
			return display;
		};

		$scope.displayAddCharge = function(status) {
			var display = false;

			if (status == 'RESERVED' || status == 'CHECKING_IN' || status == 'CHECKEDIN' || status == 'CHECKING_OUT' || status == 'NOSHOW_CURRENT') {
				display = true;
			}
			return display;
		};

		$scope.displayArrivalTime = function(status) {
			var display = false;
			if (status == 'CHECKING_IN' || status == 'NOSHOW_CURRENT') {
				display = true;
			}
			return display;
		};

		$scope.getTimeColor = function(time) {
			var timeColor = "";
			if (time != null) {
				timeColor = "time";
			}
			return timeColor;
		};

		$scope.openPostCharge = function() {
			// pass on the reservation id
			$scope.reservation_id = $scope.reservationData.reservation_card.reservation_id;

			// translating this logic as such from old Rover
			// api post param 'fetch_total_balance' must be 'true' when posted from 'staycard'
			$scope.fetchTotalBal = true;

			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.fetchedData = data;

				ngDialog.open({
					template: '/assets/partials/postCharge/postCharge.html',
					controller: 'RVPostChargeController',
					scope: $scope
				});
			};
			$scope.invokeApi(RVChargeItems.fetch, $scope.reservation_id, callback);
		};

		// update the price on staycard.
		var postchargeAdded = $scope.$on('postcharge.added', function(event, netPrice) {
			var balance = parseFloat($scope.reservationData.reservation_card.balance_amount);
			balance += netPrice;
			$scope.reservationData.reservation_card.balance_amount = parseFloat(netPrice);
		});

		// the listner must be destroyed when no needed anymore
		$scope.$on('$destroy', postchargeAdded);


		$scope.goToCheckin = function() {
			var afterRoomUpdate = function() {
				if (typeof $scope.guestCardData.userId != "undefined" && $scope.guestCardData.userId != "" && $scope.guestCardData.userId != null) {
					if ($scope.guestCardData.contactInfo.email == '' || $scope.guestCardData.contactInfo.phone == '' || $scope.guestCardData.contactInfo.email == null || $scope.guestCardData.contactInfo.phone == null) {
						$scope.$emit('showLoader');
						ngDialog.open({
							template: '/assets/partials/validateCheckin/rvValidateEmailPhone.html',
							controller: 'RVValidateEmailPhoneCtrl',
							scope: $scope
						});
					} else {
						if ($scope.reservationData.reservation_card.room_number == '' || $scope.reservationData.reservation_card.room_status === 'NOTREADY' || $scope.reservationData.reservation_card.fo_status === 'OCCUPIED') {
							//TO DO:Go to room assignemt view
							$state.go("rover.reservation.staycard.roomassignment", {
								"reservation_id": $scope.reservationData.reservation_card.reservation_id,
								"room_type": $scope.reservationData.reservation_card.room_type_code,
								"clickedButton": "checkinButton"
							});
						} else if ($scope.reservationData.reservation_card.is_force_upsell == "true" && $scope.reservationData.reservation_card.is_upsell_available == "true") {
							//TO DO : gO TO ROOM UPGRAFED VIEW
							$state.go('rover.reservation.staycard.upgrades', {
								"reservation_id": $scope.reservationData.reservation_card.reservation_id,
								"clickedButton": "checkinButton"
							});
						} else {
							$state.go('rover.reservation.staycard.billcard', {
								"reservationId": $scope.reservationData.reservation_card.reservation_id,
								"clickedButton": "checkinButton",
								"userId": $scope.guestCardData.userId
							});
						}
					}
				} else {
					//Prompt user to add a Guest Card
					$scope.errorMessage = ['Please select a Guest Card to check in'];
					var templateUrl = '/assets/partials/cards/alerts/cardAdditionPrompt.html';
					ngDialog.open({
						template: templateUrl,
						className: 'ngdialog-theme-default stay-card-alerts',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false
					});
				}
			};

			// NOTE: room_id is provided as string and number >.<, that why checking length/existance
			var hasRoom = typeof $scope.reservationData.reservation_card.room_id === 'string' ? $scope.reservationData.reservation_card.room_id.length : $scope.reservationData.reservation_card.room_id
			if (!!hasRoom) {
				// Go fetch the room status again
				// After fetch do the entire rest of it
				$scope.$emit('showLoader');
				RVHkRoomDetailsSrv.fetch($scope.reservationData.reservation_card.room_id)
					.then(function(data) {
						// Rest of the things
						$scope.$emit('hideLoader');

						// update the room status to reservation card
						$scope.reservationData.reservation_card.room_ready_status = data.room_details.current_hk_status;
						$scope.reservationData.reservation_card.room_status = data.room_details.is_ready === "true" ? 'READY' : 'NOTREADY';
						$scope.reservationData.reservation_card.fo_status = data.room_details.is_occupied === "true" ? 'OCCUPIED' : 'VACANT';

						afterRoomUpdate();
					}, function() {
						$scope.$emit('hideLoader');
					});
			} else {
				// just cont.
				afterRoomUpdate();
			}
		};

		$scope.showPutInQueue = function(isQueueRoomsOn, isReservationQueued, reservationStatus) {
			var displayPutInQueue = false;
			if (reservationStatus == 'CHECKING_IN' || reservationStatus == 'NOSHOW_CURRENT') {
				if (isQueueRoomsOn == "true" && isReservationQueued == "false") {
					displayPutInQueue = true;
				}
			}
			return displayPutInQueue;
		};

		$scope.showRemoveFromQueue = function(isQueueRoomsOn, isReservationQueued, reservationStatus) {
			var displayPutInQueue = false;
			if (reservationStatus == 'CHECKING_IN' || reservationStatus == 'NOSHOW_CURRENT') {
				if (isQueueRoomsOn == "true" && isReservationQueued == "true") {
					displayPutInQueue = true;
				}
			}
			return displayPutInQueue;
		};

		$scope.successPutInQueueCallBack = function() {
			$scope.$emit('hideLoader');
			$scope.reservationData.reservation_card.is_reservation_queued = "true";
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.reservation_id, $scope.reservationData);
		};

		$scope.successRemoveFromQueueCallBack = function() {
			$scope.$emit('hideLoader');
			$scope.reservationData.reservation_card.is_reservation_queued = "false";
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.reservation_id, $scope.reservationData);
		};

		$scope.putInQueue = function(reservationId) {
			var data = {
				"reservationId": reservationId,
				"status": "true"
			};
			$scope.invokeApi(RVReservationCardSrv.modifyRoomQueueStatus, data, $scope.successPutInQueueCallBack);
		};

		$scope.removeFromQueue = function(reservationId) {
			var data = {
				"reservationId": reservationId,
				"status": false
			};
			$scope.invokeApi(RVReservationCardSrv.modifyRoomQueueStatus, data, $scope.successRemoveFromQueueCallBack);
		};

		var promptCancel = function(penalty, nights) {
			ngDialog.open({
				template: '/assets/partials/reservationCard/rvCancelReservation.html',
				controller: 'RVCancelReservation',
				scope: $scope,
				data: JSON.stringify({
					state: 'CONFIRM',
					cards: false,
					penalty: penalty,
					penaltyText: (function() {
						if (nights) {
							return penalty + (penalty > 1 ? " nights" : " night");
						} else {
							return $rootScope.currencySymbol + $filter('number')(penalty, 2);
						}
					})()
				})
			});
		};

		/**
		 * This method handles cancelling an exisiting reservation or
		 * reinstating a cancelled reservation CICO-1403 and CICO-6056(Sprint20 >>> to be implemented in the next sprint)
		 */
		$scope.toggleCancellation = function() {

			var checkCancellationPolicy = function() {
				var onCancellationDetailsFetchSuccess = function(data) {
					$scope.$emit('hideLoader');
					var nights = false;
					var cancellationCharge = 0;

					// Sample Response from api/reservations/:id/policies inside the results hash
					// calculated_penalty_amount: 40
					// cancellation_policy_id: 36
					// penalty_type: "percent"
					// penalty_value: 20

					if (typeof data.results != 'undefined') {
						if (data.results.penalty_type == 'day') {
							// To get the duration of stay
							var stayDuration = $scope.reservationParentData.numNights > 0 ? $scope.reservationParentData.numNights : 1;
							// Make sure that the cancellation value is -lte thatn the total duration
							cancellationCharge = stayDuration > data.results.penalty_value ? data.results.penalty_value : stayDuration;
							nights = true;
						} else {
							cancellationCharge = parseFloat(data.results.calculated_penalty_amount);
						}
					}
					promptCancel(cancellationCharge, nights);

				};
				var onCancellationDetailsFetchFailure = function(error) {
					$scope.$emit('hideLoader');
					$scope.errorMessage = error;
				};

				var params = {
					id: $scope.reservationData.reservation_card.reservation_id
				};

				$scope.invokeApi(RVReservationCardSrv.fetchCancellationPolicies, params, onCancellationDetailsFetchSuccess, onCancellationDetailsFetchFailure);
			};

			/**
			 * If the reservation is within cancellation period, no action will take place.
			 * If the reservation is outside of the cancellation period, a screen will display to show the cancellation rule.
			 * [Cancellation period is the date and time set up in the cancellation rule]
			 */

			checkCancellationPolicy();
		};

		$scope.openSmartBands = function() {
			ngDialog.open({
				template: '/assets/partials/smartbands/rvSmartBandDialog.html',
				controller: 'RVSmartBandsController',
				className: 'ngdialog-theme-default1',
				closeByDocument: false,
				closeByEscape: false,
				scope: $scope
			});
		};

		$scope.showSmartBandsButton = function(reservationStatus, icareEnabled) {
			var showSmartBand = false;
			if (icareEnabled) {
				if (reservationStatus == 'RESERVED' || reservationStatus == 'CHECKING_IN' || reservationStatus == 'CHECKEDIN' || reservationStatus == 'CHECKING_OUT' || reservationStatus == 'NOSHOW_CURRENT' || reservationStatus == 'CHECKEDOUT') {
					showSmartBand = true;
				}
			}
			return showSmartBand;
		};

		//({reservationId:, clickedButton: 'checkoutButton'})
		//	goToCheckoutButton(reservationData.reservation_card.reservation_id, 'checkoutButton');
		$scope.goToCheckoutButton = function(reservationId, clickedButton, smartbandHasBalance) {
			if (smartbandHasBalance == "true") {
				$scope.clickedButton = clickedButton;
				ngDialog.open({
					template: '/assets/partials/smartbands/rvSmartbandListCheckoutscreen.html',
					controller: 'RVSmartBandsCheckoutController',
					className: 'ngdialog-theme-default1',
					scope: $scope
				});
			} else {
				$state.go("rover.reservation.staycard.billcard", {
					"reservationId": reservationId,
					"clickedButton": clickedButton,
					"userId": $scope.guestCardData.userId
				});
			}
		};
		/*
		 * Show Deposit/Balance Modal
		 */
		$scope.showDepositBalanceModal = function(){
			var reservationId = $scope.reservationData.reservation_card.reservation_id;
			var dataToSrv = {
				"reservationId": reservationId
			};
			$scope.invokeApi(RVDepositBalanceSrv.getDepositBalanceData, dataToSrv, $scope.successCallBackFetchDepositBalance);
			
			
		};
		$scope.successCallBackFetchDepositBalance = function(data){

			$scope.$emit('hideLoader');
			// $scope.depositBalanceData = data;
			$scope.depositBalanceData = data;
			
			ngDialog.open({
					template: '/assets/partials/depositBalance/rvDepositBalanceModal.html',
					controller: 'RVDepositBalanceCtrl',
					className: 'ngdialog-theme-default1',
					closeByDocument: false,
					scope: $scope
				});
			
		};
		$scope.showDepositBalance = function(reservationStatus, isRatesSuppressed){
			var showDepositBalanceButtonWithoutSR = false;
			if (reservationStatus == 'RESERVED' || reservationStatus == 'CHECKING_IN'){
				if(!isRatesSuppressed){
					showDepositBalanceButtonWithoutSR = true;
				}
				
			}
			return true;
		};
		$scope.showDepositBalanceWithSr = function(reservationStatus, isRatesSuppressed){
			var showDepositBalanceButtonWithSR = false;
			if (reservationStatus == 'RESERVED' || reservationStatus == 'CHECKING_IN'){
				if(isRatesSuppressed){
					showDepositBalanceButtonWithSR = true;
				}
				
			}
			return true;
		};
	}
]);