sntRover.controller('reservationActionsController', [
	'$rootScope',
	'$scope',
	'ngDialog',
	'RVChargeItems',
	'$state',
	'ngDialog',
	function($rootScope, $scope, ngDialog, RVChargeItems, $state, ngDialog) {
		BaseCtrl.call(this, $scope);

		$scope.displayTime = function(status) {
			var display = false;
			if (status == 'CHECKEDIN' || status == 'CHECKING_OUT') {
				display = true;
			}
			return display;
		};
		$scope.displayBalance = function(status) {
			var display = false;
			if (status == 'CHECKING_IN' || status == 'CHECKEDIN' || status == 'CHECKING_OUT') {
				display = true;
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

		$scope.getArrivalTimeColor = function(time) {
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

			$scope.reservationData.reservation_card.balance_amount = balance;
		});

		// the listner must be destroyed when no needed anymore
		$scope.$on('$destroy', postchargeAdded);

		$scope.closeDialog = function() {
			ngDialog.close();
		};



		$scope.goToCheckin = function() {
			if (typeof $scope.guestCardData.userId != "undefined" && $scope.guestCardData.userId != "" && $scope.guestCardData.userId != null) {
				if ($scope.guestCardData.contactInfo.email == '' || $scope.guestCardData.contactInfo.phone == '' || $scope.guestCardData.contactInfo.email == null || $scope.guestCardData.contactInfo.phone == null) {
					$scope.$emit('showLoader');
					ngDialog.open({
						template: '/assets/partials/validateCheckin/rvValidateEmailPhone.html',
						controller: 'RVValidateEmailPhoneCtrl',
						scope: $scope
					});
				} else {
					if ($scope.reservationData.reservation_card.room_number == '' || $scope.reservationData.reservation_card.room_status != 'READY' || $scope.reservationData.reservation_card.fo_status != 'VACANT') {
						//TO DO:Go to room assignemt view
						$state.go("rover.staycard.roomassignment", {
							"reservation_id": $scope.reservationData.reservation_card.reservation_id,
							"room_type": $scope.reservationData.reservation_card.room_type_code,
							"clickedButton": "checkinButton"
						});
					} else if ($scope.reservationData.reservation_card.is_force_upsell == "true" && $scope.reservationData.reservation_card.is_upsell_available == "true") {
						//TO DO : gO TO ROOM UPGRAFED VIEW
						$state.go('rover.staycard.upgrades', {
							"reservation_id": $scope.reservationData.reservation_card.reservation_id,
							"clickedButton": "checkinButton"
						});
					} else {
						$state.go('rover.staycard.billcard', {
							"reservationId": $scope.reservationData.reservation_card.reservation_id,
							"clickedButton": "checkinButton"
						});
					}
				}
			} else {
				//Prompt user to add a Guest Card
				// console.log('Prompt to select a guest card here');
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

	}
]);