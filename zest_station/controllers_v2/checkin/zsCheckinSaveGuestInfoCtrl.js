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
		
		*********************************************** */

		BaseCtrl.call(this, $scope);

		$controller('zsCheckinCommonBaseCtrl', {
			$scope: $scope
		});

		var guestInfo = angular.fromJson($stateParams.guestInfo);
		var checkinParams = angular.fromJson($stateParams.checkinParams);
		var selectedCalendarModel = "";
		var selectedCalendarModelDisplay = "";

		var calculateScrollableViewHeight = function(h1Id, h2Id, h3Id) {
			var contentHeight = $('#content').outerHeight();
			var h1Height = $('#' + h1Id).outerHeight(true),
				h2Height = $('#' + h2Id).outerHeight(true),
				h3Height = $scope.bypassQuest ? $('#' + h3Id).outerHeight(true) : 0,
				scrollableViewHeight = parseFloat(contentHeight - (h1Height + h2Height + h3Height + 120) + 8);

			return scrollableViewHeight;
		};

		var calculateHeightOfListAndRefreshScroller = function() {
			$scope.listDivHeight = '0px';
			$timeout(function() {
				var scrollableViewHeight = calculateScrollableViewHeight('list-main-heading',
																		'list-sub-heading',
																		'list-sub-text');
				
				$scope.listDivHeight = scrollableViewHeight + 'px';
				$scope.refreshScroller('guests-list');
			}, 100);
		};

		var updateGuestInfo = function() {
			// TODO: clean the below code later
			_.each(guestInfo.guests, function(guest) {
				if (guest.id === $scope.selectedGuest.id) {
					_.each(guest.guest_details, function(guest_detail) {
						_.each($scope.selectedGuest.reservationDetails, function(fieldRow) {
							_.each(fieldRow, function(resDetails) {
								if (guest_detail.field === resDetails.field_key) {
									guest_detail.current_value = resDetails[resDetails.field_key];
								}
							});
						});
					});
				}
			});
		};

		var onGuestInfoSave = function() {
			updateGuestInfo();
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
					// $scope.screenData.openedPopupName = 'ALL_REQUIRED_INFO_PRESENT';
					$scope.screenData.showContinueButton = true;
				}
				$scope.screenData.screenMode = 'GUEST_LIST';
				calculateHeightOfListAndRefreshScroller();
				$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			}
		};

		// ALL_REQUIRED_INFO_PRESENT popup

		$scope.revisitGuestList = function() {
			$scope.screenData.screenMode = 'GUEST_LIST';
			calculateHeightOfListAndRefreshScroller();
			$scope.screenData.openedPopupName = '';
		};

		// Continue button action
		$scope.checkinReservation = function() {
			$scope.$emit('CHECKIN_GUEST', {
				checkinParams: checkinParams
			});
		};

		var recordSkipingOffVehicleRegNumber = function(actionDetails) {

			var params = {
				"id": checkinParams.reservation_id,
				"application": 'KIOSK',
				"action_type": 'GUEST_SCHEMA',
				"details": actionDetails
			};

			var options = {
				params: params,
				loader: 'none',
				failureCallBack: function() {
					// do nothing
				}
			};

			$scope.callAPI(zsGeneralSrv.recordReservationActions, options);
		};

		$scope.saveGuestDetails = function(skipVehicleRegNumber) {

			$scope.screenData.openedPopupName = '';
			var allRequireFieldsFilled = true;
			var vehicleRegNumberNeedtoBeEntered = false;

			$scope.screenData.showErrorMessage = false;

			// Check if any of the mandatory field is yet to be filled
			_.each($scope.selectedGuest.reservationDetails, function(row) {
				_.each(row, function(field) {
					if (field.mandatory && !field[field.field_key]) {
						allRequireFieldsFilled = false;
					}
				});
			});

			_.each($scope.selectedGuest.reservationDetails, function(row) {
				_.each(row, function(field) {
					if (field.field_category === 'parking') {
						vehicleRegNumberNeedtoBeEntered = (skipVehicleRegNumber || field[field.field_key]) ? false : true;
						if (!skipVehicleRegNumber && allRequireFieldsFilled && field.old_value !== field[field.field_key]) {
							var actionDetails;

							if (!field.old_value) {
								actionDetails = [{
									"key": 'Vehicle registraion number added for the guest',
									"new_value": $scope.selectedGuest.first_name + ' ' + $scope.selectedGuest.last_name
								}];
							} else {
								actionDetails = [{
									"key": 'Vehicle registraion number updated for the guest',
									"new_value": $scope.selectedGuest.first_name + ' ' + $scope.selectedGuest.last_name
								}, {
									"key": "from",
									"new_value": field.old_value
								}, {
									"key": "to",
									"new_value": field[field.field_key]
								}];
							}
							recordSkipingOffVehicleRegNumber(actionDetails);
						}
					}
				});
			});

			if (skipVehicleRegNumber) {
				var actionDetails = [{
					"key": 'Vehicle registraion number skipped for the guest',
					"new_value": $scope.selectedGuest.first_name + ' ' + $scope.selectedGuest.last_name
				}];

				recordSkipingOffVehicleRegNumber(actionDetails);
			}
			
			if (!allRequireFieldsFilled) {
				$scope.screenData.openedPopupName = 'WARNING_POPUP';
				$scope.screenData.triedToSave = true;
			} 
			else if (vehicleRegNumberNeedtoBeEntered) {
				$scope.screenData.openedPopupName = 'PARKING_ADDON_WARNING_POPUP';
				$scope.screenData.triedToSave = true;
			}
			else {
				var apiParams = {};

				_.each($scope.selectedGuest.reservationDetails, function(row) {
					_.each(row, function(field) {
						apiParams[field.field_key] = field[field.field_key];
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
					successCallBack: function () {
						$scope.selectedGuest.is_missing_any_required_field = false;
						onGuestInfoSave();
					},
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

		var retrieveGuestInfoForDisplay = function(guestInfo) {

			$scope.selectedGuest.reservationDetails = [];

			var individualRow = {
				'reservationDetails': []
			};

			// Since the design is with two fields in a row, we need to group them before repeating
			var groupData = function(info, $index, array, rowKey, fullArray) {
				var infoData = {
					field_label: info.label,
					field_key: info.field,
					mandatory: info.mandatory,
					type: info.type,
					values: info.values,
					field_category: info.field_category
				};

				infoData[info.field] = info.current_value;

				if (infoData.field_category === 'parking') {
					infoData.old_value = angular.copy(info.current_value);
				}

				if (infoData.type === "date") {
					var displayKey = infoData.field_key + "forDisplay";

					infoData[displayKey] = info.current_value ? formatDateBasedOnHotelFormat(info.current_value) : "";
				}
				// If only one field is present, just show as one
				if (fullArray.length === 1) {
					array.push([infoData]);
				} else {
					individualRow[rowKey].push(infoData);
					// group two fields as one till the last item in the array
					if (individualRow[rowKey].length === 2 || $index === fullArray.length - 1) {
						array.push(individualRow[rowKey]);
						individualRow[rowKey] = [];
					}
				}
			};

			_.each(guestInfo, function(info, $index) {
				groupData(info, $index, $scope.selectedGuest.reservationDetails, 'reservationDetails', guestInfo);
			});

		};

		$scope.clickOnGuest = function(guest) {
			$scope.selectedGuest = guest;
			retrieveGuestInfoForDisplay(guest.guest_details);
			$scope.screenData.triedToSave = false;


				$scope.screenData.screenMode = 'GUEST_DETAILS';
				// refresh scroller and scroll to top
				refreshScroller();
				var scroller = $scope.getScroller('guests-info');

				$timeout(function() {
					scroller.scrollTo(0, 0, 300);
				}, 0);
				$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			
		};

		var refreshScroller = function() {
			$scope.textualHeight = '0px';
			$timeout(function() {
				var scrollableViewHeight = calculateScrollableViewHeight('main-heading',
																		'sub-heading',
																		'sub-text');

				$scope.textualHeight = scrollableViewHeight + 'px';
				$scope.refreshScroller('guests-info');
			}, 100);
		};

		$scope.byPassGuestInfo = function(guest) {
			// record in activity log. Mark as not required
			guest.is_missing_any_required_field = false;
			onGuestInfoSave();
		};

		var onBackButtonClicked = function() {
			if ($scope.screenData.screenMode === 'GUEST_DETAILS') {
				calculateHeightOfListAndRefreshScroller();
				$scope.screenData.screenMode = 'GUEST_LIST';
				$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			}
		};

		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);

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

			$timeout(function() {
				// Add a wrapper class to the select box for style adjustments
				$('.ui-datepicker-month').wrapAll("<div class='select'></div>");
				$('.ui-datepicker-year').wrapAll("<div class='select'></div>");
			}, 100);
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
						selectedCalendarField[selectedCalendarModelDisplay] = formatDateBasedOnHotelFormat(selectedDate);
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
			$scope.setScroller('guests-list');

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
						selectedGuest.is_all_info_present = !selectedGuest.is_missing_any_required_field;
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
				calculateHeightOfListAndRefreshScroller();
			} else {
				// If there is only one guest, show the bypass question if set or the guest info details
				$scope.selectedGuest = $scope.selectedReservation.guest_details[0];
				retrieveGuestInfoForDisplay(guestInfo.guests[0].guest_details);
				$scope.screenData.screenMode = 'GUEST_DETAILS';
				refreshScroller();
			}
		})();
	}
]);
