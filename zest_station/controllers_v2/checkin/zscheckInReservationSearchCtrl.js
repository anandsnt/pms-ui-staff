sntZestStation.controller('zscheckInReservationSearchCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'zsEventConstants',
    'zsCheckinSrv',
    'zsGeneralSrv',
    '$timeout',
    function($scope, $rootScope, $state, zsEventConstants, zsCheckinSrv, zsGeneralSrv, $timeout) {

		/** ********************************************************************************************
		 **		Please note that, not all the stateparams passed to this state will not be used in this state, 
		 **      however we will have to pass this so as to pass again to future states which will use these.
		 **
		 **      Expected state params -----> none    
		 **      Exit function -> checkinVerificationSuccess                              
		 **                                                                       
		 ***********************************************************************************************/

		// This controller is used for searching reservation using last name
		// and other optional params

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
		// flush out previous search results
        zsCheckinSrv.setSelectedCheckInReservation([]);
        zsCheckinSrv.setCheckInReservations([]);


        var setupSeperatorBetweenOptions = (function() {
			// show/hide seperator between departure date and no of nights
            $scope.showOrBetweenDateAndNoOfNights = $scope.zestStationData.checkin_screen.authentication_settings.departure_date &&
				($scope.zestStationData.checkin_screen.authentication_settings.number_of_nights ||
					$scope.zestStationData.checkin_screen.authentication_settings.email ||
					$scope.zestStationData.checkin_screen.authentication_settings.confirmation);

			// show/hide seperator between  no of nights and email
            $scope.showOrBetweenNoOfNightsAndEmail = $scope.zestStationData.checkin_screen.authentication_settings.number_of_nights &&
				($scope.zestStationData.checkin_screen.authentication_settings.email ||
					$scope.zestStationData.checkin_screen.authentication_settings.confirmation);

			// show/hide seperator between email and conf no
            $scope.showOrBetweenEmailAndConfirmNo = $scope.zestStationData.checkin_screen.authentication_settings.email &&
				$scope.zestStationData.checkin_screen.authentication_settings.confirmation;
        }());

        var focusDepartureDateField = function() {
            // A small timeout for making sure the mode is changed to departure date
            // and trigger click event to launch calendar
            $timeout(function() {
                $("#departure-date").click();
                 $scope.$emit('hideLoader');
            }, 200);
        };


        $scope.findByDate = function() {
            $scope.trackEvent('FIND_BY_DATE', 'user_selected');
            $scope.mode = 'FIND_BY_DATE';
            // To prevent conflicting calender actions
            // (auto popup and manula trigger)
            $scope.$emit('showLoader');
            focusDepartureDateField();
            $scope.resetTime();
        };

        var changeModeActions = function (eventName, newMode, inputField) {
            $scope.trackEvent(eventName, 'user_selected');
            $scope.mode = newMode;
            $scope.focusInputField(inputField);
            $scope.resetTime();
        };

        $scope.findByNoOfNights = function() {
            changeModeActions('NO_OF_NIGHTS', 'NO_OF_NIGHTS_MODE', 'no-of-nights');
        };
        $scope.findByEmail = function() {
            changeModeActions('EMAIL_ENTRY', 'EMAIL_ENTRY_MODE', 'guest-email');
        };
        $scope.findByConfirmation = function() {
            changeModeActions('CONFIRM_NO', 'CONFIRM_NO_MODE', 'conf-number');
        };

        $scope.showDatePicker = function() {
            $scope.showDatePick = !$scope.showDatePick;
            $scope.resetTime();
        };

        var searchReservation = function(params) {
            var checkinVerificationSuccess = function(data) {
                if (data.results.length === 0) {
                    $scope.mode = 'NO_MATCH';
                    $scope.callBlurEventForIpad();
                }
                else if (data.results.length === 1) {
                    $scope.$emit('showLoader');
                    zsCheckinSrv.setSelectedCheckInReservation(data.results);
                    if ($scope.zestStationData.kiosk_collect_guest_address) {
                        $state.go('zest_station.collectGuestAddress');
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
            params.is_kiosk = true;
            var options = {
                params: params,
                successCallBack: checkinVerificationSuccess,
                failureCallBack: checkinVerificationCallBack
            };

            if ($scope.usingFakeReservation()) {
                checkinVerificationSuccess(zsCheckinSrv.fetchResDemoData);
            } else {
                $scope.callAPI(zsCheckinSrv.fetchReservations, options);
            }
            
        };

        var deleteUnwantedParams = function(params, unwantedKeys) {
            _.each(unwantedKeys, function(unwantedKey) {
                 delete params[unwantedKey];
            });
            return params;
        };

        var SetUpSearchParams = function() {
            var params = angular.copy($scope.reservationParams);

            if ($scope.reservationParams.no_of_nights.length > 0) {
                params = deleteUnwantedParams(params, ['alt_confirmation_number', 'email', 'date']);
            } else if ($scope.reservationParams.alt_confirmation_number.length > 0) {
                params = deleteUnwantedParams(params, ['no_of_nights', 'email', 'date']);
            } else if ($scope.reservationParams.email.length > 0) {
                params = deleteUnwantedParams(params, ['alt_confirmation_number', 'no_of_nights', 'date']);
            } else if ($scope.reservationParams.date.length > 0) {
                params = deleteUnwantedParams(params, ['alt_confirmation_number', 'email', 'no_of_nights']);
                params.dep_date = angular.copy(params.date);
                delete params.date;
            } else {
                params = params;
            }
            return params;
        };

        var anyOftheRequireFieldsAreFilled = function() {
            return ($scope.reservationParams.no_of_nights.length > 0 ||
                $scope.reservationParams.alt_confirmation_number.length > 0 ||
                $scope.reservationParams.email.length > 0 ||
                $scope.reservationParams.date.length > 0);
        };

        $scope.lastNameEntered = function() {
            $scope.hideKeyboardIfUp();
			// if room is already entered, no need to enter again
            if (anyOftheRequireFieldsAreFilled()) {
                if ($scope.zestStationData.kiosk_validate_first_name) {
                    $scope.mode = 'FIRST_NAME_ENTRY_MODE';
                    $scope.focusInputField('first-name');
                } else {

                    searchReservation(SetUpSearchParams());
                }
            } else {
                if ($scope.zestStationData.kiosk_validate_first_name) {
                    $scope.mode = 'FIRST_NAME_ENTRY_MODE';
                    $scope.focusInputField('first-name');
                } else {
                    $scope.mode = $scope.reservationParams.last_name.length > 0 ? 'CHOOSE_OPTIONS' : $scope.mode;
                    $scope.callBlurEventForIpad();
                }
            }
            $scope.resetTime();
        };

        $scope.firstNameEntered = function() {
            $scope.hideKeyboardIfUp();
			// if room is already entered, no need to enter again
            if (anyOftheRequireFieldsAreFilled()) {
                searchReservation(SetUpSearchParams());
            } else {
                $scope.mode = $scope.reservationParams.first_name.length > 0 ? 'CHOOSE_OPTIONS' : $scope.mode;
                $scope.callBlurEventForIpad();
            }
            $scope.resetTime();
        };

        var searchReservationActions = function(requiredParam, unwantedKeys) {
            $scope.hideKeyboardIfUp();
            var params = angular.copy($scope.reservationParams);

            params = deleteUnwantedParams(params, unwantedKeys);
            if (params[requiredParam] === '') {
                return;
            }
            searchReservation(params);
            $scope.resetTime();
        };

        $scope.noOfNightsEntered = function() {
            searchReservationActions('no_of_nights', ['alt_confirmation_number', 'email', 'date']);
        };

        $scope.confNumberEntered = function() {
            searchReservationActions('alt_confirmation_number', ['no_of_nights', 'email', 'date']);
        };
        $scope.emailEntered = function() {
            searchReservationActions('email', ['no_of_nights', 'alt_confirmation_number', 'date']);
        };

        $scope.dateEntered = function() {
            $scope.showDatePick = false;
            var params = angular.copy($scope.reservationParams);

            params = deleteUnwantedParams(params, ['no_of_nights', 'alt_confirmation_number', 'email']);
            params.dep_date = angular.copy(params.date);
            delete params.date;
            if (params.dep_date === '') {
                return;
            }
            searchReservation(params);
            $scope.resetTime();
        };

        $scope.showDatePicker = function() {
            $scope.showDatePick = !$scope.showDatePick;
        };

        $scope.reEnterText = function(type) {
            if (type === 'name') {
                $scope.mode = 'LAST_NAME_ENTRY';
                $scope.focusInputField('last-name');
                
            } else if ($scope.reservationParams.no_of_nights.length > 0) {
                $scope.mode = 'NO_OF_NIGHTS_MODE';
                $scope.focusInputField('no-of-nights');

            } else if ($scope.reservationParams.alt_confirmation_number.length > 0) {
                $scope.mode = 'CONFIRM_NO_MODE';
                $scope.focusInputField('conf-number');

            } else if ($scope.reservationParams.email.length > 0) {
                $scope.mode = 'EMAIL_ENTRY_MODE';
                $scope.focusInputField('guest-email');

            } else if ($scope.reservationParams.date.length > 0) {
                $scope.findByDate();
            } else {
                return;
            }
        };

        var setHotelDateTime = function(response) {
			// fetch the current date and time from the API, 
			// **this should be combined into 1 api call in the future
			// * have noticed multiple API calls that get date/time and there are inconsistencies
            $scope.zestStationData.bussinessDate = $scope.hotel_date.business_date;

			var minDate = new Date($scope.zestStationData.bussinessDate.replace(/-/g, '/'));
            
            $scope.dateOptions = {
                dateFormat: $scope.zestStationData.hotelDateFormat,
                yearRange: '0:+10',
                minDate: minDate,
                onSelect: function(value) {
                    $scope.showDatePick = false;
                    $scope.dateEntered();
                }
            };

            console.info(':: zestStationData > bussinessDate :: ', $scope.zestStationData.bussinessDate);
        };
        var setDateOptions = function() {

            var options = {
                params: {}, // just get the current / active business date to update the calendar
                successCallBack: function(hotel_date) {
                    $scope.hotel_date = hotel_date;

                    var timeOptions = {
                        params: {}, // just get the current / active business date to update the calendar
                        successCallBack: setHotelDateTime,
                        failureCallBack: function(errorMessage) {
                            $scope.$emit('GENERAL_ERROR', errorMessage);
                        }

                    };

                    $scope.callAPI(zsGeneralSrv.fetchHotelTime, timeOptions);
                },
                failureCallBack: function(errorMessage) {
                    $scope.$emit('GENERAL_ERROR', errorMessage);
                }
            };

            $scope.callAPI(zsGeneralSrv.fetchHotelBusinessDate, options);
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
        var onBackClicked = function(event) {
            if ($scope.mode === 'NO_MATCH') {
                $scope.reservationParams.alt_confirmation_number = '';
                $scope.reservationParams.email = '';
                $scope.reservationParams.date = '';
                $scope.reservationParams.no_of_nights = '';
                $scope.mode = 'CHOOSE_OPTIONS';
            } else if ($scope.mode === 'LAST_NAME_ENTRY') {
                $state.go('zest_station.home');
            } else if ($scope.mode === 'FIND_BY_DATE') {
                $scope.showDatePick = false;
                $timeout(function() {
                    $scope.mode = 'LAST_NAME_ENTRY';
                    $scope.focusInputField('last-name');
                }, 100);
            } else {
                $scope.mode = 'LAST_NAME_ENTRY';
                $scope.focusInputField('last-name');
            }
        };

        var init = function() {
            $scope.hideKeyboardIfUp();
			// show back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			// show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			// back button action
            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackClicked);
			// starting mode
            $scope.showDatePick = false;
            setDateOptions();
            setReservationParams();
            $scope.mode = 'LAST_NAME_ENTRY';
            $scope.focusInputField('last-name');
            $scope.setScreenIcon('checkin');
        };

        init();
    }
]);