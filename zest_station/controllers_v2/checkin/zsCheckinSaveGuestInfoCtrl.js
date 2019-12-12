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

		$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
		$scope.showWarningPopup = false;
		$scope.triedToSave = false;
		$scope.errorMessage = true;
		$scope.infoNeeded = angular.fromJson($stateParams.guestInfo);
		var checkinParams = angular.fromJson($stateParams.checkinParams);
		var selectedCalendarModel = "";
		var selectedCalendarModelDisplay = "";

		$scope.saveGuestDetails = function() {
			var allRequireFieldsFilled = true;

			$scope.errorMessage = false;

			_.each($scope.infoNeeded, function(info) {
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
				apiParams.guest_detail_id = checkinParams.guest_id;
				apiParams.reservation_id = checkinParams.reservation_id;

				if (apiParams["additional_contacts.email"]) {
					checkinParams.guest_email = apiParams["additional_contacts.email"];
				}

				var options = {
					params: apiParams,
					successCallBack: function() {
						$scope.$emit('CHECKIN_GUEST', {
							checkinParams: checkinParams
						});
					},
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
		$scope.guestDetails = {};

		_.each($scope.infoNeeded, function(info) {
			$scope.guestDetails[info.field] = info.current_value;
			if (info.type === "date") {
				// Create extra variable for date and use to display the date in hotel's format
				var displayKey = info.field + "forDisplay";

				$scope.guestDetails[displayKey] = $scope.guestDetails[info.field] ? formatDateBasedOnHotelFormat($scope.guestDetails[info.field]) : "";
			}
		});

		$scope.showDatePicker = function(calendarModel, calendarDisplayModel) {
			selectedCalendarModel = calendarModel;
			selectedCalendarModelDisplay = calendarDisplayModel;
			$scope.showDatePick = !$scope.showDatePick;
			$scope.selectedDate = $scope.guestDetails[selectedCalendarModel];
		};

		(function() {
			$scope.dateOptions = {
				dateFormat: 'yy-mm-dd',
				changeYear: true,
				changeMonth: true,
				onSelect: function() {
					$scope.showDatePick = false;
					var selectedDate = angular.copy($scope.selectedDate);

					$scope.guestDetails[selectedCalendarModelDisplay] = formatDateBasedOnHotelFormat(selectedDate);
					$scope.guestDetails[selectedCalendarModel] = selectedDate;
					$scope.selectedDate = moment().format('YYYY-MM-DD');
				}
			};
			$scope.setScroller('guests-info', {
				disablePointer: true, // important to disable the pointer events that causes the issues
				disableTouch: false, // false if you want the slider to be usable with touch devices
				disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
				preventDefaultException: {
					tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|DIV)$/
				}
			});
			$timeout(function() {
				$scope.refreshScroller('guests-info');
			}, 100);
		})();
	}
]);