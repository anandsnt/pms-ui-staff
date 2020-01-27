sntZestStation.controller('zsCheckinSaveGuestInfoCtrl', [
	'$scope',
	'zsCheckinSrv',
	'zsGeneralSrv',
	'$timeout',
	'$stateParams',
	'$controller',
	'zsEventConstants',
	function($scope, zsCheckinSrv, zsGeneralSrv, $timeout, $stateParams, $controller, zsEventConstants) {

		/* ************************************************

		Two modes GUEST_DETAILS and GUEST_LIST

		Different popups are listed below

		WARNING_POPUP --> While saving if any required data is missing or API failed to save
		SHOW_QUESTION --> Show bypass collect info question
		BYPASS_INFO_CHOOSED --> On choosing to bypass question, show msg to guest that the selected guest info can be skipped
		ALL_REQUIRED_INFO_PRESENT --> If all the required guest info is saved or bypassed, show msg to guest and allow them to proceed.
		
		*********************************************** */

		BaseCtrl.call(this, $scope);

		$controller('zsCheckinCommonBaseCtrl', {
			$scope: $scope
		});

		var guestInfo = angular.fromJson($stateParams.guestInfo);
		var checkinParams = angular.fromJson($stateParams.checkinParams);
		var selectedCalendarModel = "";
		var selectedCalendarModelDisplay = "";

		var onGuestInfoSave = function() {
			$scope.selectedGuest.is_missing_any_required_field = false;
			// If there is only one guest, checkin the reservation and proceed
			if ($scope.selectedReservation.guest_details.length === 1) {
				$scope.$emit('CHECKIN_GUEST', {
					checkinParams: checkinParams
				});
			} else {
				var guestsWithMissingInfo = _.filter($scope.selectedReservation.guest_details, function(guest) {
					return guest.is_missing_any_required_field;
				});

				// If all the info needed are saved or bypassed, show the message to the guest
				if (guestsWithMissingInfo.length === 0) {
					$scope.screenData.openedPopupName = 'ALL_REQUIRED_INFO_PRESENT';
					$scope.screenData.showContinueButton = true;
				}
				$scope.screenData.screenMode = 'GUEST_LIST';
				$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			}
		};

		// ALL_REQUIRED_INFO_PRESENT popup

		$scope.revisitGuestList = function() {
			$scope.screenData.screenMode = 'GUEST_LIST';
			$scope.screenData.openedPopupName = '';
		};

		// Continue button action
		$scope.checkinReservation = function() {
			$scope.$emit('CHECKIN_GUEST', {
				checkinParams: checkinParams
			});
		};

		$scope.saveGuestDetails = function() {
			var allRequireFieldsFilled = true;

			$scope.screenData.showErrorMessage = false;

			// Check if any of the mandatory field is yet to be filled
			_.each($scope.selectedGuest.reservationDetails, function(row) {
				_.each(row, function(field) {
					if (field.mandatory && !field[field.field_key]) {
						allRequireFieldsFilled = false;
					}
				});
			});
			_.each($scope.selectedGuest.contactDetails, function(row) {
				_.each(row, function(field) {
					if (field.mandatory && !field[field.field_key]) {
						allRequireFieldsFilled = false;
					}
				});
			});

			if (!allRequireFieldsFilled) {
				$scope.screenData.openedPopupName = 'WARNING_POPUP';
				$scope.screenData.triedToSave = true;
			} else {
				var apiParams = {};

				_.each($scope.selectedGuest.reservationDetails, function(row) {
					_.each(row, function(field) {
						apiParams[field.field_key] = field[field.field_key]
					});
				});

				_.each($scope.selectedGuest.contactDetails, function(row) {
					_.each(row, function(field) {
						apiParams[field.field_key] = field[field.field_key]
					});
				});

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
						$scope.screenData.openedPopupName = 'WARNING_POPUP';
						$scope.screenData.showErrorMessage = true;
					}
				};

				$scope.callAPI(zsCheckinSrv.savePendingGuestFields, options);
			}
		};

		$scope.dismissPopup = function() {
			$scope.screenData.openedPopupName = '';
		};
		var formatDateBasedOnHotelFormat = function(date) {
			return moment(date, 'YYYY-MM-DD')
				.format($scope.zestStationData.hotelDateFormat);
		};

		var contactDetailsKeys = [
			'additional_contacts.email',
			'additional_contacts.phone',
			'additional_contacts.mobile'
		];

		var retrieveGuestInfoForDisplay = function(guestInfo) {

			$scope.selectedGuest.reservationDetails = [];
			$scope.selectedGuest.contactDetails = [];

			// guestInfo = _.filter(guestInfo, function(info){
			// 	return contactDetailsKeys.indexOf(info.field) !== -1;
			// });

			var guestInfoWithoutContactDetails = _.filter(guestInfo, function(info) {
				return contactDetailsKeys.indexOf(info.field) === -1;
			});

			var guestInfoWithContactDetails = _.filter(guestInfo, function(info) {
				return contactDetailsKeys.indexOf(info.field) !== -1;
			});
			var individualRow = {
				'reservationDetails': [],
				'contactDetails': []
			};
			var groupData = function(info, $index, array, rowKey, fullArray) {
				var infoData = {
					field_label: info.label,
					field_key: info.field,
					mandatory: info.mandatory,
					type: info.type,
					values: info.values
				};

				infoData[info.field] = info.current_value;

				if (infoData.type === "date") {
					var displayKey = infoData.field_key + "forDisplay";

					infoData[displayKey] = info.current_value ? formatDateBasedOnHotelFormat(info.current_value) : "";
				}

				if (guestInfo.length === 1) {
					array.push([infoData]);
				} else {
					individualRow[rowKey].push(infoData);

					if (individualRow[rowKey].length === 2 || $index === fullArray.length - 1) {
						array.push(individualRow[rowKey]);
						individualRow[rowKey] = [];
					}
				}
			};

			_.each(guestInfoWithoutContactDetails, function(info, $index) {
				groupData(info, $index, $scope.selectedGuest.reservationDetails, 'reservationDetails', guestInfoWithoutContactDetails);
			});

			_.each(guestInfoWithContactDetails, function(info, $index) {
				groupData(info, $index, $scope.selectedGuest.contactDetails, 'contactDetails', guestInfoWithContactDetails);
			});

			$scope.contactInfoMissigStyle = guestInfoWithContactDetails.length > 0 ? {} : {
				"width": "100%"
			};
			$scope.reservationInfoMissigStyle = guestInfoWithoutContactDetails.length > 0 ? {} : {
				"width": "100%"
			};

			console.log($scope.selectedGuest.reservationDetails);
		};

		$scope.clickOnGuest = function(guest) {
			$scope.selectedGuest = guest;
			retrieveGuestInfoForDisplay(guest.guest_details);

			if (guestInfo.metadata.enable_bypass) {
				showQuestionForGuest();
			} else {
				$scope.screenData.screenMode = 'GUEST_DETAILS';
				refreshScroller();
				var scroller = $scope.getScroller('guests-info');

				$timeout(function() {
					scroller.scrollTo(0, 0, 300);
				}, 0);
				$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			}
		};

		var refreshScroller = function() {
			$timeout(function() {
				$scope.refreshScroller('guests-info');
			}, 100);
		};

		// QUESTION POPUP CODE STARTS HERE

		var showQuestionForGuest = function() {
			$scope.screenData.openedPopupName = 'SHOW_QUESTION';
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

		$scope.noByPassChoosed = function() {
			resetMissingInfoFlagIfNeeded();
			$scope.screenData.screenMode = 'GUEST_DETAILS';
			refreshScroller();
			$scope.screenData.openedPopupName = '';
			if ($scope.selectedReservation.guest_details.length > 1) {
				$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			}
		};

		$scope.byPassQuest = function() {
			// record in activity log. Mark as not required
			$scope.selectedGuest.is_missing_any_required_field = false;
			$scope.screenData.openedPopupName = 'BYPASS_INFO_CHOOSED';
		};

		$scope.closeQuestionPopup = function() {
			$scope.screenData.openedPopupName = '';
			if ($scope.selectedReservation.guest_details.length === 1) {
				$scope.$emit('CHECKIN_GUEST', {
					checkinParams: checkinParams
				});
			} else {
				onGuestInfoSave();
			}
		};

		var onBackButtonClicked = function() {
			if ($scope.screenData.screenMode === 'GUEST_DETAILS') {
				$scope.screenData.screenMode = 'GUEST_LIST';
				$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			}
		};

		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);

		// QUESTION POPUP CODE ENDS HERE

		var findTheDatePicker = function() {
			var selectedCalendarField;
			_.each($scope.selectedGuest.reservationDetails, function(row) {
				var calendarModel = _.find(row, function(field) {
					return field.field_key === selectedCalendarModel;
				});

				if (calendarModel) {
					selectedCalendarField = calendarModel;
				}
			});

			return selectedCalendarField;
		};

		$scope.showDatePicker = function(calendarModel, calendarDisplayModel) {
			selectedCalendarModel = calendarModel;
			selectedCalendarModelDisplay = calendarDisplayModel;
			$scope.showDatePick = !$scope.showDatePick;
			var selectedCalendarField = findTheDatePicker();

			if (selectedCalendarField) {
				$scope.selectedDate = selectedCalendarField[selectedCalendarModel];
			}
		};

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
					var selectedCalendarField = findTheDatePicker();

					if (selectedCalendarField) {
						selectedCalendarField[selectedCalendarModel] = selectedDate;
						selectedCalendarField[selectedCalendarModelDisplay] = formatDateBasedOnHotelFormat(selectedDate);;
					}
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

			// If only primay guest info is required remove accompanying guests from the list
			if (!guestInfo.metadata.required_for_all_adults) {
				$scope.selectedReservation.guest_details = _.filter($scope.selectedReservation.guest_details, function(guest) {
					return guest.is_primary;
				});
			}
			// Loop through guest list and assign info present
			_.each($scope.selectedReservation.guest_details, function(selectedGuest) {
				_.each(guestInfo.guests, function(guest) {
					if (selectedGuest.id === guest.id) {
						selectedGuest.guest_details = guest.guest_details;
						selectedGuest.is_missing_any_required_field = guest.is_missing_any_required_field;
						selectedGuest.guest_type = guest.guest_type;
					}
				});
			});

			// Show only ADULT guests
			$scope.selectedReservation.guest_details = _.filter($scope.selectedReservation.guest_details, function(guest) {
				return guest.guest_type === 'ADULT';
			});

			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

			$scope.screenData = {
				showContinueButton: false,
				openedPopupName: '',
				triedToSave: false,
				showErrorMessage: false,
				showWarningPopup: false

			};

			if (guestInfo.metadata.enable_bypass) {
				$scope.bypassQuest = guestInfo.metadata.bypass_schema_json.question_label;
				$scope.bypassAnswer = guestInfo.metadata.bypass_schema_json.yes_label;
				$scope.bypassAnswerNo = guestInfo.metadata.bypass_schema_json.no_label;
			}

			// If the guest count greater than one, show the guests in a list
			if ($scope.selectedReservation.guest_details.length > 1) {
				$scope.screenData.screenMode = 'GUEST_LIST';
			} else {
				// If there is only one guest, show the bypass question if set or the guest info details
				$scope.selectedGuest = guestInfo.guests[0];
				retrieveGuestInfoForDisplay(guestInfo.guests[0].guest_details);
				if (guestInfo.metadata.enable_bypass) {
					showQuestionForGuest();
				} else {
					$scope.screenData.screenMode = 'GUEST_DETAILS';
					refreshScroller();
				}
			}
		})();
	}
]);