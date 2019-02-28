/*
	Checkin confimation Ctrl 
	The user enetered card number and departure number are verified.
	However if the operation is autocheckin and the reservation has non CC payment type, then the card entry is not required.
	The reservation details will be the  in the API response of the verification API.
*/

(function() {
	var checkInConfirmationViewController = function($scope, $modal, $rootScope, $state, dateFilter, $filter, checkinConfirmationService, checkinDetailsService) {


		$scope.pageValid = false;
		var dateToSend = '';

		if ($rootScope.isCheckedin) {
			$state.go('checkinSuccess');
		} else {
			$scope.pageValid = true;
		}
		// uncheck checkbox in reservation details page

		$rootScope.checkedApplyCharges = false;
		$scope.minDate = $rootScope.businessDate;
		$scope.cardDigits = '';

		// setup options for modal
		$scope.opts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkin/partials/errorModal.html',
			controller: ModalInstanceCtrl
		};

		var setupPageActions = function() {
			// next page actions
			var verificationSuccessActions = function(response) {
				// display options for room upgrade screen
				$rootScope.ShowupgradedLabel = false;
				$rootScope.roomUpgradeheading = "Your trip details";
				$scope.isResponseSuccess = true;
				checkinDetailsService.setResponseData(response);
				$rootScope.upgradesAvailable = (response.is_upgrades_available === "true") ? true : false;
				$rootScope.isUpgradeAvailableNow = response.is_upsell_available_now;
				$rootScope.outStandingBalance = response.outstanding_balance;
				$rootScope.payment_method_used = response.payment_method_used;
				$rootScope.paymentDetails = response.payment_details;
				// navigate to next page
				$state.go('checkinReservationDetails');
				$scope.isPosting = false;

			};

			// if we don't need extra verification using
			// departure date and CC
			if ($rootScope.bypassCheckinVerification) {
				// set up flags related to webservice
				$scope.isPosting = true;
				var data = {
					'reservation_id': $rootScope.reservationID,
					'bypass_verification': true
				};

				checkinConfirmationService.verifyCheckinReservation(data).then(function(response) {
					if (response.status === 'failure') {
						$rootScope.netWorkError = true;
					} else {
						verificationSuccessActions(response.data);
					}
				}, function() {
					$rootScope.netWorkError = true;
					$scope.isPosting = false;
				});
			} else {
				// set up flags related to webservice
				$scope.isPosting = false;
				$rootScope.netWorkError = false;
			}

			// next button clicked actions
			$scope.nextButtonClicked = function() {
				var data = {
					'departure_date': dateToSend,
					'credit_card': $scope.cardDigits,
					'reservation_id': $rootScope.reservationID
				};

				$scope.isPosting = true;

				// call service
				checkinConfirmationService.verifyCheckinReservation(data).then(function(response) {

					if (response.status === 'failure') {
						$modal.open($scope.opts); // error modal popup
						$scope.isPosting = false;
					} else {
						verificationSuccessActions(response.data);
					}
				}, function() {
					$rootScope.netWorkError = true;
					$scope.isPosting = false;
				});
			};

			// moved date picker controller logic
			$scope.isCalender = false;
			$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
			$scope.selectedDate = ($filter('date')($scope.date, $rootScope.dateFormat));

			function loseFocus() {
				var inputs = document.getElementsByTagName('input');

				for (var i = 0; i < inputs.length; ++i) {
					inputs[i].blur();
				}
			}
			$scope.showCalender = function() {
				loseFocus(); // focusout the input fields , so as to fix cursor being shown above the calendar
				$scope.isCalender = true;
			};
			$scope.closeCalender = function() {
				$scope.isCalender = false;
			};
			$scope.dateChoosen = function() {
				$scope.selectedDate = ($filter('date')($scope.date, $rootScope.dateFormat));
				$rootScope.departureDate = $scope.selectedDate;

				dateToSend = dclone($scope.date, []);
				dateToSend = ($filter('date')(dateToSend, 'MM-dd-yyyy'));
				$scope.closeCalender();
			};
		};

		if ($state.href("unableToCheckn") !== null) {

			$scope.isPosting = true;
			checkinConfirmationService.isReservationEligibleToCheckin({
				'reservation_id': $rootScope.reservationID
			}).then(function(response) {
				$scope.isPosting = false;
				if (!response.eligible_for_checkin) {
					$state.go('unableToCheckn', {
						'reason': response.ineligibility_reason
					});
				} else {
					setupPageActions();
				}
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isPosting = false;
			});
		} else {
			setupPageActions();
		}
	};

	var dependencies = [
		'$scope', '$modal', '$rootScope', '$state', 'dateFilter', '$filter', 'checkinConfirmationService', 'checkinDetailsService',
		checkInConfirmationViewController
	];

	sntGuestWeb.controller('checkInConfirmationViewController', dependencies);
})();