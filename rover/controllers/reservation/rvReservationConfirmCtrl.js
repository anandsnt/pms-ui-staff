sntRover.controller('RVReservationConfirmCtrl', ['$scope', '$state', 'RVReservationSummarySrv', 'ngDialog', 'RVContactInfoSrv', '$filter',
	function($scope, $state, RVReservationSummarySrv, ngDialog, RVContactInfoSrv, $filter) {
		$scope.errorMessage = '';
		BaseCtrl.call(this, $scope);


		$scope.init = function() {
			$scope.heading = 'Reservations';
			$scope.setHeadingTitle($scope.heading);
			
			$scope.$parent.hideSidebar = true;
			$scope.isConfirmationEmailSent = ($scope.otherData.isGuestPrimaryEmailChecked || $scope.otherData.isGuestAdditionalEmailChecked) ? true : false;
			$scope.setScroller('reservationSummary');
			$scope.setScroller('paymentInfo');

		};

		/*
		 * Get the title for the billing info button,
		 * on the basis of routes available or not
		 */
		$scope.getBillingInfoTitle = function() {
			if ($scope.reservationData.is_routing_available)
				return $filter('translate')('BILLING_INFO_TITLE');
			else
				return $filter('translate')('ADD_BILLING_INFO_TITLE');
		}

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
				$scope.errorMessage = [$filter('translate')('INVALID_EMAIL_MESSAGE')];
				return false;

			}
			var postData = {};			
			postData.reservationId = $scope.reservationData.reservationId;
			/**
			 * CICO-7077 Confirmation Mail to have tax details
			 */
			postData.tax_details = [];
			_.each($scope.reservationData.taxDetails, function(taxDetail) {
				postData.tax_details.push(taxDetail);
			});
			
			postData.tax_total = $scope.reservationData.totalTax;

			postData.emails = [];
			postData.emails.push($scope.reservationData.guest.sendConfirmMailTo);

			var emailSentSuccess = function(data) {
				$scope.$emit('hideLoader');
			};
			$scope.invokeApi(RVReservationSummarySrv.sendConfirmationEmail, postData, emailSentSuccess);
		};

		/*
			If email address does not exists on Guest Card,
		    and user decides to update via the Email field on the summary screen,
		    this email should be linked to the guest card. 
		 */
		$scope.primaryEmailEntered = function() {

			if ($scope.reservationData.guest.email != '' && $scope.reservationData.guest.email != null) {
				return false;
			}

			var dataToUpdate = {
				"email": $scope.reservationData.guest.sendConfirmMailTo
			};

			var data = {
				'data': dataToUpdate,
				'userId': $scope.reservationData.guest.id
			};

			var updateGuestEmailSuccessCallback = function(data) {
				$scope.reservationData.guest.email = $scope.reservationData.guest.sendConfirmMailTo;
				$scope.$emit('guestEmailChanged');
				$scope.$emit("hideLoader");
			}

			var updateGuestEmailFailureCallback = function(data) {
				$scope.$emit("hideLoader");
			}

			$scope.invokeApi(RVContactInfoSrv.updateGuest, data, updateGuestEmailSuccessCallback, updateGuestEmailFailureCallback);
		}

		/**
		 * Navigate to the staycard for this guest
		 */
		$scope.goToStaycardClicked = function() {
			var stateParams = {
				id: $scope.reservationData.reservationId,
				confirmationId: $scope.reservationData.confirmNum,
				isrefresh: true,
				justCreatedRes: true
			}
			$scope.otherData.reservationCreated = true;
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
			$scope.reservationData.totalTax = '';
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
			$scope.otherData.reservationCreated = true;

			$state.go('rover.reservation.search');
		};

		/**
		 * Reset all reservation data and go to search
		 */
		$scope.goToSearchClicked = function() {
			$scope.initReservationData();
			$state.go('rover.reservation.search');
		};

		$scope.modifyCheckinCheckoutTime = function() {

			var updateSuccess = function(data) {
				$scope.$emit('hideLoader');
			}


			var updateFailure = function(data) {
				$scope.$emit('hideLoader');
			}
			if ($scope.reservationData.checkinTime.hh != '' && $scope.reservationData.checkoutTime.hh != '') {
				var postData = $scope.computeReservationDataforUpdate();
				$scope.invokeApi(RVReservationSummarySrv.updateReservation, postData, updateSuccess, updateFailure);
			}
		}

		/**
		 * trigger the billing information popup. $scope.reservationData is the same variable used in billing info popups also. 
		 So we are adding the required params to the existing $scope.reservationData, so that no other functionalities in reservation confirmation breaks.
		 */

		$scope.openBillingInformation = function() {


			$scope.reservationData.confirm_no = $scope.reservationData.confirmNum;
			$scope.reservationData.reservation_id = $scope.reservationData.reservationId;
			$scope.reservationData.reservation_status = $scope.reservationData.status;
			if ($scope.reservationData.guest.id != null) {
				$scope.reservationData.user_id = $scope.reservationData.guest.id;
			} else {
				$scope.reservationData.user_id = $scope.reservationData.company.id;
			}

			ngDialog.open({
				template: '/assets/partials/bill/rvBillingInformationPopup.html',
				controller: 'rvBillingInformationPopupCtrl',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		}

		$scope.init();



	}
]);