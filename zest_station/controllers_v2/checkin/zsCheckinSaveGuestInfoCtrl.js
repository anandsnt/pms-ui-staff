sntZestStation.controller('zsCheckinSaveGuestInfoCtrl', [
	'$scope',
	'zsCheckinSrv',
	'zsGeneralSrv',
	'$timeout',
	'$stateParams',
	'$controller',
	function($scope, zsCheckinSrv, zsGeneralSrv, $timeout, $stateParams, $controller) {


		BaseCtrl.call(this, $scope);

		$controller('zsCheckinCommonBaseCtrl', {
			$scope: $scope
		});

		console.log($stateParams);

		$scope.showErrorMessage = false;

		$scope.infoNeeded = angular.fromJson($stateParams.guestInfo);
		var checkinParams = angular.fromJson($stateParams.checkinParams);

		$scope.infoNeeded = _.sortBy($scope.infoNeeded, function(field) {
			return -field.mandatory;
		});

		$scope.saveGuestDetails = function() {
			var allRequireFieldsFilled = true;

			_.each($scope.infoNeeded, function(field) {
				if (field.mandatory && !$scope.guestDetails[field.key]) {
					allRequireFieldsFilled = false;
				}
			});

			if (!allRequireFieldsFilled) {
				$scope.showErrorMessage = true;
			} else {
				var apiParams = angular.copy($scope.guestDetails);
				var options = {
					params: apiParams,
					successCallBack: function() {
						$scope.$emit('CHECKIN_GUEST', {
							checkinParams: checkinParams
						});
					}
				};

				$scope.callAPI(zsCheckinSrv.checkInGuest, options);
			}
		};

		$scope.dismissPopup = function() {
			$scope.showErrorMessage = false;
		};

		$scope.guestDetails = {};
		_.each($scope.infoNeeded, function(field) {
			$scope.guestDetails[field.key] = "";
			if (field.type === "date") {
				var displayKey = field.key + "forDisplay";
				$scope.guestDetails[displayKey] = ""
			}
		});

		var selectedCalendar = "";
		var selectedCalendarDisplay = "";

		$scope.showDatePicker = function(calendarModel, calendarDisplayModel) {
			selectedCalendar = calendarModel;
			selectedCalendarDisplay = calendarDisplayModel;
			$scope.showDatePick = !$scope.showDatePick;
		};

		(function() {
			$scope.dateOptions = {
				dateFormat: 'yy-mm-dd',
				// changeYear: true,
				// changeMonth: true,
				onSelect: function(value) {
					$scope.showDatePick = false;
					var selectedDate = angular.copy($scope.selectedDate);
					$scope.guestDetails[selectedCalendarDisplay] = moment(selectedDate, 'MM-DD-YYYY')
						.format($scope.zestStationData.hotelDateFormat);
					$scope.guestDetails[selectedCalendar] = selectedDate;
					$scope.selectedDate = moment().format('mm-dd-yy');
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
			}, 100)
		})();
	}
]);