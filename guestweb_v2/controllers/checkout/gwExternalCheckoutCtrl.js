/**
	External verification Controller 
	The landing page when the guestweb is accessed without the link from the email.
	This is accessed using URL set in admin settings WEB CHECK OUT URL in admin -> zest -> Checkout
*/
sntGuestWeb.controller('GwExternalCheckoutVerificationController', ['$scope', '$state', '$controller', 'GwCheckoutSrv', 'GwWebSrv', '$filter','$modal',
	function($scope, $state, $controller, GwCheckoutSrv, GwWebSrv, $filter,$modal) {

		$controller('BaseController', {
			$scope: $scope
		});

		var init = function() {
			var screenIdentifier = "EXTERNAL_CHECKOUT";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.stayDetails = {
				"room_number": "",
				"last_name": "",
				"arrival_date": "",
				"email": ""
			};
			$scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
		}();

		var dateToSend = "";


		// Calendar toggle actions and date select action
		$scope.showCalender = function() {
			loseFocus(); // focusout the input fields , so as to fix cursor being shown above the calendar
			$scope.calendarView = true;
		};
		$scope.closeCalender = function() {
			$scope.calendarView = false;
		};
		$scope.dateChoosen = function() {
			$scope.stayDetails.arrival_date = ($filter('date')($scope.date, GwWebSrv.zestwebData.dateFormat));
			dateToSend = dclone($scope.date, []);
			dateToSend = $filter('date')(dateToSend, 'yyyy-MM-dd');
			$scope.closeCalender();
		};

		var verifyUserSuccess = function(response) {
			$scope.$emit('hideLoader');
			$state.go('checkOutOptions');
		};

		// On submitting we will be checking if the details eneterd matches any reservations
		// If matches will return the reservation details and we save it for future usage
		$scope.submit = function() {
			$scope.stayDetails.hotel_identifier = GwWebSrv.zestwebData.hotelIdentifier;
			$scope.stayDetails.arrival_date = dateToSend;
			var onSuccess = function(data) {
				GwWebSrv.setReservationDataForExternalCheckout(data);
				// check and navigate base upon checkout later option is available
				GwWebSrv.zestwebData.isLateCheckoutAvailable ? $state.go('checkOutOptions') : $state.go('checkOutConfirmation');
			};
			var onFailure = function(data) {
				var popupOptions = angular.copy($scope.errorOpts);
				popupOptions.resolve = {
					message: function() {
						return "<b>We could not find your reservation</b>. Please check for typos, or call <hotelPhone>."
					}
				};
				$modal.open(popupOptions);
			};
			var options = {
				params: $scope.stayDetails,
				successCallBack: onSuccess,
				failureCallBack: onFailure
			};
			$scope.callAPI(GwCheckoutSrv.verifyCheckoutUser, options);
		};

	}
]);