/**
	External verification Controller 
	The landing page when the guestweb is accessed without the link from the email.
	This is accessed using URL set in admin settings admin -> zest -> email/SMS/ direct URLs
*/
sntGuestWeb.controller('GwExternalCheckInVerificationController', ['$scope', '$state', '$controller', 'GwCheckinSrv', 'GwWebSrv', '$filter', '$rootScope',
	function($scope, $state, $controller, GwCheckinSrv, GwWebSrv, $filter, $rootScope) {

		$controller('BaseController', {
			$scope: $scope
		});

		var init = function() {
			var screenIdentifier = "EXTERNAL_CHECKIN";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.lastname = "";
			$scope.confirmationNumber = "";
			$scope.departureDate = "";
			$scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
			$scope.noMatchesFound = false;
			$scope.multipleMatchesFound = false;
		}();

		var dateToSend = "";
		var zestwebData = GwWebSrv.zestwebData; //for easy short usage


		// Calendar toggle actions and date select action
		$scope.showCalender = function() {
			loseFocus(); // focusout the input fields , so as to fix cursor being shown above the calendar
			$scope.calendarView = true;
		};
		$scope.closeCalender = function() {
			$scope.calendarView = false;
		};
		$scope.dateChoosen = function() {
			$scope.departureDate = ($filter('date')($scope.date, zestwebData.dateFormat));
			dateToSend = dclone($scope.date, []);
			dateToSend = $filter('date')(dateToSend, 'yyyy-MM-dd');
			$scope.closeCalender();
		};

		var noMatchAction = function() {
			$scope.noMatchesFound = true;
			$scope.multipleMatchesFound = false;
		};

		//we need a guest token for authentication
		//so fetch it with reservation id
		var generateAuthToken = function(reservation_data) {
			var params = {
				"reservation_id": zestwebData.reservationID
			};
			var onSuccess = function(token_response) {
				//set guestweb token
				$rootScope.accessToken = zestwebData.accessToken = token_response.guest_web_token;
				// display options for room upgrade screen
				zestwebData.ShowupgradedLabel = false;
				zestwebData.roomUpgradeheading = "Your trip details";
				reservation_data.terms_and_conditions = (typeof zestwebData.termsAndConditions !== "undefined") ? zestwebData.termsAndConditions : "";
				//set in service for future usage
				GwCheckinSrv.setcheckinData(reservation_data);
				zestwebData.upgradesAvailable = (reservation_data.is_upgrades_available === "true") ? true : false;
				zestwebData.isCCOnFile = (reservation_data.is_cc_attached === "true") ? true : false;
				zestwebData.userEmail = reservation_data.guest_email;
				zestwebData.userMobile = reservation_data.guest_mobile;

				//navigate to next page
				//to be done
				$state.go('checkinReservationDetails');
			};
			var options = {
				params: params,
				successCallBack: onSuccess,
			};
			$scope.callAPI(GwCheckinSrv.generateAuthToken, options);
		};


		// On submitting we will be checking if the details eneterd matches any reservations
		// If matches will return the reservation details and we save it for future usage
		$scope.submit = function() {

			var onSuccess = function(response) {

				var reservations = [];
				//filter out reservations with 'RESERVED' status
				angular.forEach(response.results, function(value, key) {
					if (value.reservation_status === 'RESERVED') {
						reservations.push(value);
					};
				});
				if (reservations.length === 0) { // No match
					noMatchAction();
				} else if (reservations.length >= 2) //Multiple matches
				{
					$scope.multipleMatchesFound = true;
				} else {
					var reservation_data = reservations[0];
					//if reservation status is CANCELED -> No matches
					if (reservation_data.reservation_status === 'CANCELED') {
						noMatchAction();
					}
					//if reservation status is NOSHOW or to too late -> No matches
					else if (reservation_data.reservation_status === 'NOSHOW' || reservation_data.is_too_late) {
						$state.go('guestCheckinLate'); //to be done
					}
					//if reservation is aleady checkin
					else if (reservation_data.is_checked_in === "true") {
						$state.go('checkinSuccess'); // to be done
					}
					//if reservation is early checkin
					else if (reservation_data.is_too_early) {
						//to be done
						$state.go('guestCheckinEarly', {
							"date": reservation_data.available_date_after
						});
					} else {
						//retrieve token for guest
						zestwebData.primaryGuestId = reservation_data.primary_guest_id;
						zestwebData.reservationID = reservation_data.reservation_id;
						zestwebData.isPrecheckinOnly = (reservation_data.is_precheckin_only === "true" && reservation_data.reservation_status === 'RESERVED') ? true : false;
						zestwebData.isAutoCheckinOn = (reservation_data.is_auto_checkin === "true") && zestwebData.isPrecheckinOnly;
						generateAuthToken(reservation_data);
					};
				};

			};
			var onFailure = function(data) {
				noMatchAction();
			};
			var params = {
				"hotel_identifier": zestwebData.hotelIdentifier
			};
			//check if all fields are filled
			$scope.lastname.length > 0 ? (params.last_name = $scope.lastname) : '';
			$scope.confirmationNumber.length > 0 ? (params.alt_confirmation_number = $scope.confirmationNumber) : '';
			(typeof $scope.departureDate !== "undefined" && $scope.departureDate.length > 0) ? (params.departure_date = dateToSend) : '';

			var options = {
				params: params,
				successCallBack: onSuccess,
				failureCallBack: onFailure
			};
			$scope.callAPI(GwCheckinSrv.findUser, options);
		};

		$scope.tryAgain = function() {
			$scope.noMatchesFound = false;
		};

	}
]);