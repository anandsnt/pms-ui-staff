sntZestStation.controller('zsCheckinSaveGuestInfoCtrl', [
	'$scope',
	'zsCheckinSrv',
	'zsGeneralSrv',
	'$timeout',
	'$stateParams',
	'$controller',
	'zsEventConstants',
	function($scope, zsCheckinSrv, zsGeneralSrv, $timeout, $stateParams, $controller, zsEventConstants) {


		BaseCtrl.call(this, $scope);

		$controller('zsCheckinCommonBaseCtrl', {
			$scope: $scope
		});

		var guestInfo =  angular.fromJson($stateParams.guestInfo);
		var checkinParams = angular.fromJson($stateParams.checkinParams);
		var selectedCalendarModel = "";
		var selectedCalendarModelDisplay = "";

		var onGuestInfoSave = function() {
			$scope.selectedGuest.is_missing_any_required_field = false;
			if ($scope.selectedReservation.guest_details.length == 1) {
				$scope.$emit('CHECKIN_GUEST', {
					checkinParams: checkinParams
				});
			} else {
				var guestsWithMissingInfo = _.filter($scope.selectedReservation.guest_details, function(guest) {
					return guest.is_missing_any_required_field;
				});

				if (guestsWithMissingInfo.length == 0) {
					$scope.showAllInfoSaved = true;
					$scope.showContinueButton = true;
				}
			}
		};

		$scope.revisitGuestList = function (){
			$scope.showAllInfoSaved = false;
			$scope.screenMode = 'GUEST_LIST';
		};

		$scope.checkinReservation = function() {
			$scope.showAllInfoSaved = false;
			$scope.$emit('CHECKIN_GUEST', {
				checkinParams: checkinParams
			});
		};

		$scope.saveGuestDetails = function() { 
			var allRequireFieldsFilled = true;

			$scope.errorMessage = false;

			_.each($scope.selectedGuest.guest_details, function(info) {
				if (info.mandatory && !$scope.guestDetails[info.field]) {
					allRequireFieldsFilled = false;
				}
			});

			if (!allRequireFieldsFilled) {
				$scope.showWarningPopup = true;
				$scope.triedToSave = true;
			} else {
				var apiParams = angular.copy($scope.guestDetails);

				// Delete the keys used for displaying date in hotel's date format before saving
				for (var key in apiParams) {
					if (key.includes("forDisplay")) {
						delete apiParams[key];
					}
				}
				apiParams.guest_detail_id = $scope.selectedGuest.id;
				apiParams.reservation_id = checkinParams.reservation_id;

				if (apiParams["additional_contacts.email"]) {
					checkinParams.guest_email = apiParams["additional_contacts.email"];
				}

				var options = {
					params: apiParams,
					successCallBack: onGuestInfoSave,
					failureCallBack: function() {
						$scope.showWarningPopup = true;
						$scope.errorMessage = true;
					}
				};

				$scope.callAPI(zsCheckinSrv.savePendingGuestFields, options);
			}
		};

		$scope.dismissPopup = function() {
			$scope.showWarningPopup = false;
		};
		var formatDateBasedOnHotelFormat = function(date) {
			return moment(date, 'YYYY-MM-DD')
				.format($scope.zestStationData.hotelDateFormat);
		};

		var retrieveGuestInfoForDisplay = function(guestInfo) {
			_.each(guestInfo, function(info) {
				$scope.guestDetails[info.field] = info.current_value;
				if (info.type === "date") {
					// Create extra variable for date and use to display the date in hotel's format
					var displayKey = info.field + "forDisplay";

					$scope.guestDetails[displayKey] = $scope.guestDetails[info.field] ?
													  formatDateBasedOnHotelFormat($scope.guestDetails[info.field]) : "";
				}
			});
		};

		$scope.showDatePicker = function(calendarModel, calendarDisplayModel) {
			selectedCalendarModel = calendarModel;
			selectedCalendarModelDisplay = calendarDisplayModel;
			$scope.showDatePick = !$scope.showDatePick;
			$scope.selectedDate = $scope.guestDetails[selectedCalendarModel];
		};
		$scope.clickOnGuest = function(guest) {
			$scope.selectedGuest = guest;
			retrieveGuestInfoForDisplay(guest.guest_details);

			if (guestInfo.metadata.enable_bypass) {
				showQuestionForGuest();
			} else {
				$scope.screenMode = 'GUEST_DETAILS';
				$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
				refreshScroller();
			}
			console.log(guest);
		};

		var onBackButtonClicked = function () {
			if ($scope.screenMode === 'GUEST_DETAILS') {
				$scope.screenMode = 'GUEST_LIST';
				$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			}
		};

		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);

		var refreshScroller = function() {
			$timeout(function() {
				$scope.refreshScroller('guests-info');
			}, 100);
		};

		// QUESTION POPUP CODE STARTS HERE

		var showQuestionForGuest = function () {
			$scope.bypassChoosed = false;
			$scope.showQuestionPopup = true;
		};

		var resetMissingInfoFlagIfNeeded = function() {
			var mandatoryFields = _.filter($scope.selectedGuest.guest_details, function(field) {
				return field.mandatory;
			});

			var missingInfoForGuest = _.filter(mandatoryFields, function(field) {
				return !field.current_value;
			});
			$scope.selectedGuest.is_missing_any_required_field = missingInfoForGuest.length > 0;
		};

		$scope.noByPassChoosed = function () {
			resetMissingInfoFlagIfNeeded();
			$scope.screenMode = 'GUEST_DETAILS';
			refreshScroller();
			$scope.showQuestionPopup = false;
			if ($scope.selectedReservation.guest_details.length > 1) {
				$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			};
		};

		$scope.byPassQuest = function() {
			// record in activity log. Mark as not required
			$scope.bypassChoosed = true;
			$scope.selectedGuest.is_missing_any_required_field = false;
		};

		$scope.closeQuestionPopup = function(){
			$scope.bypassChoosed = false;
			$scope.showQuestionPopup = false;
			if ($scope.selectedReservation.guest_details.length == 1) {
				$scope.$emit('CHECKIN_GUEST', {
					checkinParams: checkinParams
				});
			} else {
				onGuestInfoSave();
			}	
		};

		// QUESTION POPUP CODE ENDS HERE

		(function() {
			// Date picker options
			$scope.dateOptions = {
				dateFormat: 'yy-mm-dd',
				changeYear: true,
				changeMonth: true,
				yearRange: "-100:+10",
				onSelect: function() {
					$scope.showDatePick = false;
					var selectedDate = angular.copy($scope.selectedDate);

					$scope.guestDetails[selectedCalendarModelDisplay] = formatDateBasedOnHotelFormat(selectedDate);
					$scope.guestDetails[selectedCalendarModel] = selectedDate;
					$scope.selectedDate = moment().format('YYYY-MM-DD');
				}
			};

			// Scroller
			$scope.setScroller('guests-info', {
				disablePointer: true, // important to disable the pointer events that causes the issues
				disableTouch: false, // false if you want the slider to be usable with touch devices
				disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
				preventDefaultException: {
					tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|DIV)$/
				}
			});

			$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
			$scope.guestDetails = {};

			if (!guestInfo.metadata.required_for_all_adults) {
				$scope.selectedReservation.guest_details = _.filter($scope.selectedReservation.guest_details, function(guest) {
					return guest.is_primary;
				});
			}

			_.each($scope.selectedReservation.guest_details, function(selectedGuest) {
				_.each(guestInfo.guests, function(guest) {
					if (selectedGuest.id === guest.id) {
						selectedGuest.guest_details = guest.guest_details;
						selectedGuest.is_missing_any_required_field = guest.is_missing_any_required_field;
					}
				});
			});

			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

			$scope.showWarningPopup = false;
			$scope.showQuestionPopup = false;
			$scope.triedToSave = false;
			$scope.errorMessage = true;
			$scope.showAllInfoSaved = false;
			$scope.showContinueButton = false;

			if ($scope.selectedReservation.guest_details.length > 1) {
				$scope.screenMode = 'GUEST_LIST';
			} else {
				retrieveGuestInfoForDisplay(guestInfo.guests[0].guest_details);
				$scope.selectedGuest = guestInfo.guests[0];
				if (guestInfo.metadata.enable_bypass) {
					showQuestionForGuest();
				} else {
					$scope.screenMode = 'GUEST_DETAILS';
					refreshScroller();
				}
			}
			if (guestInfo.metadata.enable_bypass) {
				$scope.bypassQuest = guestInfo.metadata.bypass_schema_json.question_label;
				$scope.bypassAnswer = guestInfo.metadata.bypass_schema_json.yes_label;
				$scope.bypassAnswerNo = guestInfo.metadata.bypass_schema_json.no_label;
			}
		})();
	}
]);