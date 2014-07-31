sntRover.controller('RVReservationConfirmCtrl', ['$scope', '$state', 'RVReservationSummarySrv', 'ngDialog',
	function($scope, $state, RVReservationSummarySrv, ngDialog) {
		BaseCtrl.call(this, $scope);

		$scope.init = function() {
			$scope.$emit('setHeading', 'Reservations');
			$scope.$parent.hideSidebar = true;
			$scope.isConfirmationEmailSent = ($scope.reservationData.guest.email || $scope.otherData.additionalEmail) ? true : false;
			$scope.$parent.myScrollOptions = {
				'reservationSummary': {
					scrollbars: true,
					snap: false,
					hideScrollbar: false,
					preventDefault: false
				},
				'paymentInfo': {
					scrollbars: true,
					snap: false,
					hideScrollbar: false,
					preventDefault: false
				},
			};

		};

		/**
		 * Function to check if the the check-in time is selected by the user.
		 * @return {Boolean} true if 'hours', 'minutes', 'primetime' - all are selected.
		 */
		$scope.isCheckinTimeSet = function() {
			var ret = false;
			if ($scope.reservationData.checkinTime.hh != '' &&
				$scope.reservationData.checkinTime.mm != '' &&
				$scope.reservationData.checkinTime.ampm != '') {

				ret = true;
			}
			return ret;
		};

		/**
		 * Function to check if the the checkout time is selected by the user.
		 * @return {Boolean} true if 'hours', 'minutes', 'primetime' - all are selected.
		 */
		$scope.isCheckoutTimeSet = function() {
			var ret = false;
			if ($scope.reservationData.checkoutTime.hh != '' &&
				$scope.reservationData.checkoutTime.mm != '' &&
				$scope.reservationData.checkoutTime.ampm != '') {

				ret = true;
			}
			return ret;

		};

		/**
		 * Call API to send the confirmation email
		 */
		$scope.sendConfirmationClicked = function(isEmailValid) {
			if ($scope.reservationData.guest.sendConfirmMailTo == "" || !isEmailValid) {
				ngDialog.open({
					template: '/assets/partials/reservation/alerts/rvEmailWarning.html',
					closeByDocument: true,
					className: 'ngdialog-theme-default1',
					scope: $scope
				});

				return false;

			}
			var postData = {};
			postData.reservationId = $scope.reservationData.reservationId;
			postData.emails = [];
			postData.emails.push($scope.reservationData.guest.sendConfirmMailTo);

			var emailSentSuccess = function(data) {
				$scope.$emit('hideLoader');
			};
			$scope.invokeApi(RVReservationSummarySrv.sendConfirmationEmail, postData, emailSentSuccess);
		};

		/**
		 * Navigate to the staycard for this guest
		 */
		$scope.goToStaycardClicked = function() {
			var stateParams = {
				id: $scope.reservationData.reservationId,
				confirmationId: $scope.reservationData.confirmNum,
				isrefresh: true
			}
			$state.go('rover.reservation.staycard.reservationcard.reservationdetails', stateParams);

		};

		/**
		 * Navigate to the reservation search.
		 * Retain Arrival / Departure Date / Number of nights,
		 * Retain  Guest, Company & TA names
		 * Retain Adults / Children / Infants
		 * Retain  Previously booked room type
		 * initialize all the other data.
		 */
		$scope.clickedNewReservation = function() {
			$scope.reservationData.roomCount = 1;
			$scope.reservationData.rooms[0].rateId = '';
			$scope.reservationData.rooms[0].rateName = '';
			$scope.reservationData.rooms[0].rateAvg = '';
			$scope.reservationData.rooms[0].rateTotal = '';

			$scope.reservationData.totalTaxAmount = '';
			$scope.reservationData.totalStayCost = '';
			$scope.reservationData.guest.sendConfirmMailTo = '';

			var paymentType = {
				type: {},
				ccDetails: { //optional - only if credit card selected
					number: '',
					expMonth: '',
					expYear: '',
					nameOnCard: ''
				}
			};
			$scope.reservationData.paymentType = paymentType;
			var demographics = {
				market: '',
				source: '',
				reservationType: '',
				origin: ''
			};
			$scope.reservationData.demographics = demographics;
			var promotion = {
				promotionCode: '',
				promotionType: ''
			};
			$scope.reservationData.promotion = promotion;
			$scope.reservationData.reservationId = '';
			$scope.reservationData.confirmNum = '';
			// Set flag to retain the card details
			$scope.reservationData.isSameCard = true;

			$state.go('rover.reservation.search');
		};

		/**
		 * Reset all reservation data and go to search
		 */
		$scope.goToSearchClicked = function() {
			$scope.initReservationData();
			$state.go('rover.reservation.search');
		};

		$scope.modifyCheckinCheckoutTime = function(){
			if ($scope.reservationData.checkinTime.hh != '' && $scope.reservationData.checkoutTime.hh != '') {
				$scope.$emit("checkinCheckoutTimeUpdated");
			}
		}

		$scope.init();



	}
]);