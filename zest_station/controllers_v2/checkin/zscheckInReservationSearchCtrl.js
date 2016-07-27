sntZestStation.controller('zscheckInReservationSearchCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	'zsCheckinSrv',
	'$timeout',
	function($scope, $rootScope, $state, zsEventConstants, zsCheckinSrv, $timeout) {

		/**********************************************************************************************
		 **		Please note that, not all the stateparams passed to this state will not be used in this state, 
		 **      however we will have to pass this so as to pass again to future states which will use these.
		 **
		 **      Expected state params -----> none    
		 **      Exit function -> checkinVerificationSuccess                              
		 **                                                                       
		 ***********************************************************************************************/

		//This controller is used for searching reservation using last name
		//and other optional params

		/** MODES in the screen
		 *   1.LAST_NAME_ENTRY_MODE --> enter last name
		 *   2.CHOOSE_OPTIONS --> choose from no of nights, email and confirm no.
		 *   3.NO_OF_NIGHTS_MODE --> enter no of nights
		 *   4.CONFIRM_NO_MODE --> enter confirmation no.
		 *   6.EMAIL_ENTRY_MODE --> email entry mode
		 *   7.FIND_BY_DATE --> find by date 
		 *   5.NO_MATCH --> No match
		 *   6.FIRST_NAME_ENTRY_MODE
		 **/

		BaseCtrl.call(this, $scope);
		//flush out previous search results
		zsCheckinSrv.setSelectedCheckInReservation([]);
		zsCheckinSrv.setCheckInReservations([]);


		var focuInputField = function(elementId) {
			$timeout(function() {
				if (!$scope.isIpad) {
					document.getElementById(elementId).focus();
				} else {
					$scope.callBlurEventForIpad();
				}
			}, 300);

		};

		var setupSeperatorBetweenOptions = function() {
			//show/hide seperator between departure date and no of nights
			$scope.showOrBetweenDateAndNoOfNights = $scope.zestStationData.checkin_screen.authentication_settings.departure_date &&
				($scope.zestStationData.checkin_screen.authentication_settings.number_of_nights ||
					$scope.zestStationData.checkin_screen.authentication_settings.email ||
					$scope.zestStationData.checkin_screen.authentication_settings.confirmation);

			//show/hide seperator between  no of nights and email
			$scope.showOrBetweenNoOfNightsAndEmail = $scope.zestStationData.checkin_screen.authentication_settings.number_of_nights &&
				($scope.zestStationData.checkin_screen.authentication_settings.email ||
					$scope.zestStationData.checkin_screen.authentication_settings.confirmation);

			//show/hide seperator between email and conf no
			$scope.showOrBetweenEmailAndConfirmNo = $scope.zestStationData.checkin_screen.authentication_settings.email &&
				$scope.zestStationData.checkin_screen.authentication_settings.confirmation;
		}();


		$scope.findByDate = function() {
			$scope.mode = 'FIND_BY_DATE';
			focuInputField("departure-date");
			$scope.resetTime();
		};
		$scope.findByNoOfNights = function() {
			$scope.mode = 'NO_OF_NIGHTS_MODE';
			focuInputField("no-of-nights");
			$scope.resetTime();
		};
		$scope.findByEmail = function() {
			$scope.mode = "EMAIL_ENTRY_MODE";
			focuInputField("guest-email");
			$scope.resetTime();
		};
		$scope.findByConfirmation = function() {
			$scope.mode = 'CONFIRM_NO_MODE';
			focuInputField("conf-number");
			$scope.resetTime();
		};

		$scope.showDatePicker = function() {
			$scope.showDatePick = !$scope.showDatePick;
			$scope.resetTime();
		};

		var searchReservation = function(params) {
			var checkinVerificationSuccess = function(data) {
				if (data.results.length == 0) {
					$scope.mode = 'NO_MATCH';
					$scope.callBlurEventForIpad();
				} else if (data.results.length == 1) {
					zsCheckinSrv.setSelectedCheckInReservation(data.results);
					var primaryGuest = _.find(data.results[0].guest_details, function(guest_detail) {
						return guest_detail.is_primary === true;
					});
					if ($scope.zestStationData.check_in_collect_nationality) {
						$state.go('zest_station.collectNationality', {
							'guestId': primaryGuest.id
						});
					} else {
						$state.go('zest_station.checkInReservationDetails');
					}
				} else {
					zsCheckinSrv.setCheckInReservations(data.results);
					$state.go('zest_station.selectReservationForCheckIn');
				}
			};
			var checkinVerificationCallBack = function() {
				$scope.mode = 'NO_MATCH';
				$scope.callBlurEventForIpad();
			};
			if ($scope.zestStationData.kiosk_validate_first_name) {
				params.first_name = $scope.reservationParams.first_name;
				params.validate_first_name_first_letter = true;
			}
			var options = {
				params: params,
				successCallBack: checkinVerificationSuccess,
				failureCallBack: checkinVerificationCallBack
			};
			$scope.callAPI(zsCheckinSrv.fetchReservations, options);
		};


		var SetUpSearchParams = function() {
			var params = angular.copy($scope.reservationParams);

			if ($scope.reservationParams.no_of_nights.length > 0) {
				delete params.alt_confirmation_number;
				delete params.email;
				delete params.date;
			} else if ($scope.reservationParams.alt_confirmation_number.length > 0) {
				delete params.no_of_nights;
				delete params.email;
				delete params.date;
			} else if ($scope.reservationParams.no_of_nights.length > 0) {
				delete params.alt_confirmation_number;
				delete params.email;
				delete params.date;
			} else if ($scope.reservationParams.email.length > 0) {
				delete params.alt_confirmation_number;
				delete params.no_of_nights;
				delete params.date;

			} else if ($scope.reservationParams.date.length > 0) {
				delete params.alt_confirmation_number;
				delete params.email;
				delete params.no_of_nights;
				params.dep_date = angular.copy(params.date);
				delete params.date;
			} else {
				params = params;
			}
			return params;
		}

		$scope.lastNameEntered = function() {
			$scope.hideKeyboardIfUp();
			//if room is already entered, no need to enter again
			if ($scope.reservationParams.no_of_nights.length > 0 ||
				$scope.reservationParams.alt_confirmation_number.length > 0 ||
				$scope.reservationParams.email.length > 0 ||
				$scope.reservationParams.date.length > 0
			) {
				if ($scope.zestStationData.kiosk_validate_first_name) {
					$scope.mode = 'FIRST_NAME_ENTRY_MODE';
					focuInputField("first-name");
				} else {

					searchReservation(SetUpSearchParams());
				}
			} else {
				if ($scope.zestStationData.kiosk_validate_first_name) {
					$scope.mode = 'FIRST_NAME_ENTRY_MODE';
					focuInputField("first-name");
				} else {
					$scope.mode = $scope.reservationParams.last_name.length > 0 ? "CHOOSE_OPTIONS" : $scope.mode;
					$scope.callBlurEventForIpad();
				}
			};
			$scope.resetTime();
		};

		$scope.firstNameEntered = function() {
			$scope.hideKeyboardIfUp();
			//if room is already entered, no need to enter again
			if ($scope.reservationParams.no_of_nights.length > 0 ||
				$scope.reservationParams.alt_confirmation_number.length > 0 ||
				$scope.reservationParams.email.length > 0 ||
				$scope.reservationParams.date.length > 0
			) {
				searchReservation(SetUpSearchParams());
			} else {
				$scope.mode = $scope.reservationParams.first_name.length > 0 ? "CHOOSE_OPTIONS" : $scope.mode;
				$scope.callBlurEventForIpad();
			};
			$scope.resetTime();
		};

		$scope.noOfNightsEntered = function() {

			$scope.hideKeyboardIfUp();
			var params = angular.copy($scope.reservationParams);
			delete params.alt_confirmation_number;
			delete params.email;
			delete params.date;
			searchReservation(params);
			$scope.resetTime();
		};

		$scope.confNumberEntered = function() {

			$scope.hideKeyboardIfUp();
			var params = angular.copy($scope.reservationParams);
			delete params.no_of_nights;
			delete params.email;
			delete params.date;
			searchReservation(params);
			$scope.resetTime();
		};
		$scope.emailEntered = function() {

			$scope.hideKeyboardIfUp();
			var params = angular.copy($scope.reservationParams);
			delete params.no_of_nights;
			delete params.alt_confirmation_number;
			delete params.date;
			searchReservation(params);
			$scope.resetTime();
		};

		$scope.dateEntered = function() {

			var params = angular.copy($scope.reservationParams);
			delete params.no_of_nights;
			delete params.alt_confirmation_number;
			delete params.email;
			params.dep_date = angular.copy(params.date);
			delete params.date;
			searchReservation(params);
			$scope.resetTime();
		};

		$scope.showDatePicker = function() {
			$scope.showDatePick = !$scope.showDatePick;
		};

		$scope.reEnterText = function(type) {
			if (type === 'name') {
				$scope.mode = "LAST_NAME_ENTRY";
				focuInputField("last-name");
			} else if ($scope.reservationParams.no_of_nights.length > 0) {
				$scope.mode = 'NO_OF_NIGHTS_MODE';
				focuInputField("no-of-nights");
			} else if ($scope.reservationParams.alt_confirmation_number.length > 0) {
				$scope.mode = 'CONFIRM_NO_MODE';
				focuInputField("conf-number");
			} else if ($scope.reservationParams.email.length > 0) {
				$scope.mode = "EMAIL_ENTRY_MODE";
				focuInputField("guest-email");
			} else if ($scope.reservationParams.date.length > 0) {
				$scope.mode = "FIND_BY_DATE";
				focuInputField("departure-date");
			} else {
				return;
			};
		};

		$scope.talkToStaff = function() {
			$state.go('zest_station.speakToStaff');
		};



		var setDateOptions = function() {
			$scope.dateOptions = {
				dateFormat: 'MM-dd-yy',
				dateFormat: $scope.zestStationData.hotelDateFormat,
				yearRange: "0:+10",
				minDate: new Date($scope.zestStationData.bussinessDate),
				onSelect: function(value) {
					$scope.showDatePicker();
				}
			};
		};
		var setReservationParams = function() {
			$scope.reservationParams = {
				'due_in': true,
				'last_name': '',
				'no_of_nights': '',
				'alt_confirmation_number': '',
				'email': '',
				'date': ''
			};
		};

		var init = function() {
			$scope.hideKeyboardIfUp();
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				if ($scope.mode === "LAST_NAME_ENTRY") {
					$state.go('zest_station.home');
				} else {
					$scope.mode = "LAST_NAME_ENTRY";
					focuInputField("last-name");
				};

			});
			//starting mode
			$scope.showDatePick = false;
			setDateOptions();
			setReservationParams();
			$scope.mode = "LAST_NAME_ENTRY";
			focuInputField("last-name");
			$scope.setScreenIcon('checkin');
		};
		init();
	}
]);