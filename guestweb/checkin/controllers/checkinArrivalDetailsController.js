/*
	Checkin arrival details Ctrl 
	The user can change the estimated time of arrival from here and optionally add comments.
*/

(function() {

	var checkinArrivalDetailsController = function($scope, preCheckinSrv, $rootScope, $state, $modal, $stateParams, guestDetailsService) {

		var restrictPrimetime = "";
		var restrictHour = "";
		var restrictMinute = "";
		var restrictMinute = "";
		var restrictHour = "";
		var isDayOfArrival = false;
		var restrictHoursListByHour = function(restrictHour) {
			// restrict hour selection based on a time
			var hoursList = angular.copy($scope.hourCopy);
			if (restrictHour !== "12") {
				angular.forEach(hoursList, function(hour, index) {
					if (hour === restrictHour) {
						hoursList = $scope.hours.slice(index);
						hoursList.splice($scope.hours.length - 1, 1);
					};
				});
			}
			return hoursList;
		};
		var init = function() {

			$scope.hours = $scope.hoursWithRestrictions = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
			$scope.minutes = $scope.minutesWithRestrictions = ["00", "15", "30", "45"];
			$scope.primeTimes = $scope.primeTimesNewWithRestrictions = ["AM", "PM"];
			$scope.hourCopy = angular.copy($scope.hours);
			$scope.minutesCopy = angular.copy($scope.minutes);

			// when eta has to restricted bases on early checkin settings
			if (typeof $rootScope.earlyCheckinRestrictHour !== "undefined") {
				$scope.earlyCheckinRestrictLimit = $rootScope.earlyCheckinRestrictHourForDisplay + ":" + $rootScope.earlyCheckinRestrictMinute + " " + $rootScope.earlyCheckinRestrictPrimetime;
				//restrict time before earlyCheckinRestrictTime
				$scope.primeTimes = ($rootScope.earlyCheckinRestrictPrimetime === "PM") ? $scope.primeTimes.slice(1) : $scope.primeTimes;
				$scope.hours = restrictHoursListByHour($rootScope.earlyCheckinRestrictHour);
				$scope.hoursWithRestrictions = angular.copy($scope.hours);
				$scope.primeTimesNewWithRestrictions = angular.copy($scope.primeTimes);

				$scope.stayDetails = {
					"hour": $rootScope.earlyCheckinRestrictHour,
					"minute": $rootScope.earlyCheckinRestrictMinute,
					"primeTime": $rootScope.earlyCheckinRestrictPrimetime
				};
			} else if ($rootScope.restrictByHotelTimeisOn) {
				// eta restricted based on hotel time
				$scope.isLoading = true;
				guestDetailsService.fetchHotelTime().then(function(response) {
					$scope.showHotelTime = response.guest_arriving_today;

					$scope.hotelTime = response.hotel_time_hour + ":" + response.hotel_time_minute + " " + response.hotel_time_prime_time;
					restrictPrimetime = response.hotel_time_prime_time;
					restrictHour = parseInt(response.hotel_time_hour).toString();
					restrictMinute = parseInt(response.hotel_time_minute).toString();
					restrictMinute = (restrictMinute.length === 1) ? ("0" + restrictMinute) : restrictMinute;
					restrictHour = (restrictHour.length === 1) ? ("0" + restrictHour) : restrictHour;
					isDayOfArrival = response.guest_arriving_today;
					$scope.isLoading = false;
					if (isDayOfArrival) {
						$scope.primeTimesNewWithRestrictions = (restrictPrimetime === "PM") ? $scope.primeTimesNewWithRestrictions.slice(1) : $scope.primeTimesNewWithRestrictions;
						$scope.hoursWithRestrictions = restrictHoursListByHour(restrictHour);
					}

				}, function() {
					$rootScope.netWorkError = true;
					$scope.isLoading = false;
				});
				$scope.stayDetails = {
					"hour": "",
					"minute": "",
					"primeTime": ""
				};
			} else {
				$scope.stayDetails = {
					"hour": "",
					"minute": "",
					"primeTime": ""
				};
			};

			var restrictMinutes = function() {
				if (parseInt(restrictMinute) >= 0 && parseInt(restrictMinute) < 15) {
					$scope.minutesWithRestrictions = ["15", "30", "45"];
				} else if (parseInt(restrictMinute) >= 15 && parseInt(restrictMinute) < 30) {
					$scope.minutesWithRestrictions = ["30", "45"];
				} else if (parseInt(restrictMinute) >= 30 && parseInt(restrictMinute) < 45) {
					$scope.minutesWithRestrictions = ["45"];
				} else if (parseInt(restrictMinute) >= 45) {
					$scope.minutesWithRestrictions = [];
				} else {
					$scope.minutesWithRestrictions = ["00", "15", "30", "45"];
				};
			};

			$scope.primeTimeChanged = function() {

				if (typeof $rootScope.earlyCheckinRestrictHour !== "undefined") {
					if ($rootScope.earlyCheckinRestrictPrimetime === "AM" && $scope.stayDetails.primeTime === "PM") {
						$scope.hours = $scope.hoursWithRestrictions = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
					} else if ($rootScope.earlyCheckinRestrictPrimetime === "AM" && $scope.stayDetails.primeTime === "AM") {
						$scope.hours = $scope.hoursWithRestrictions = restrictHoursListByHour($rootScope.earlyCheckinRestrictHour);
					};
				} else if ($rootScope.restrictByHotelTimeisOn && isDayOfArrival) {
					if (restrictPrimetime === "AM" && $scope.stayDetails.primeTime === "PM") {
						$scope.hoursWithRestrictions = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
					} else if (restrictPrimetime === "AM" && $scope.stayDetails.primeTime === "AM") {
						$scope.hoursWithRestrictions = restrictHoursListByHour(restrictHour);
					};
					if ($rootScope.restrictByHotelTimeisOn && $scope.stayDetails.hour === restrictHour && restrictPrimetime === $scope.stayDetails.primeTime) {
						restrictMinutes()
					} else {
						$scope.minutesWithRestrictions = ["00", "15", "30", "45"];
					}
				} else {
					return;
				}
			};

			$scope.hoursChanged = function() {
				// restrict minute selection based on a time
				if (typeof $rootScope.earlyCheckinRestrictHour !== "undefined") {

				} else if ($rootScope.restrictByHotelTimeisOn && $scope.stayDetails.hour === restrictHour && restrictPrimetime === $scope.stayDetails.primeTime && isDayOfArrival) {
					restrictMinutes();
				} else {
					$scope.minutesWithRestrictions = ["00", "15", "30", "45"];
				};
			};

			$scope.errorOpts = {
				backdrop: true,
				backdropClick: true,
				templateUrl: '/assets/preCheckin/partials/preCheckinErrorModal.html',
				controller: ccVerificationModalCtrl,
				resolve: {
					errorMessage: function() {
						return "Please select a valid estimated arrival time";
					}
				}
			};
			$scope.checkinTime = (typeof $stateParams.time !== "undefined") ? $stateParams.time : "";

		};
		if ($rootScope.is_checkin_now_on && !$rootScope.checkinOptionShown) {
			$state.go('guestCheckinOptions');
		} else {
			init();
		};

		$scope.postStayDetails = function() {
			$scope.isLoading = true;
			if (!$scope.stayDetails.hour || !$scope.stayDetails.minute || !$scope.stayDetails.primeTime) {
				$modal.open($scope.errorOpts); // error modal popup
				$scope.isLoading = false;
			} else {
				//change format to 24 hours
				var hour = parseInt($scope.stayDetails.hour);
				if ($scope.stayDetails.primeTime === 'PM' && hour < 12) {
					hour = hour + 12;
				} else if ($scope.stayDetails.primeTime === 'AM' && hour === 12) {
					hour = hour - 12;
				}
				hour = (hour < 10) ? ("0" + hour) : hour;
				var dataTosend = {
					"arrival_time": hour + ":" + $scope.stayDetails.minute,
					"comments": $scope.stayDetails.comment
				};

				preCheckinSrv.postStayDetails(dataTosend).then(function(response) {
					$rootScope.earlyCheckinHour = response.last_early_checkin_hour;
					$rootScope.earlyCheckinMinute = response.last_early_checkin_minute;
					$rootScope.earlyCheckinPM = response.last_early_checkin_primetime;
					$rootScope.earlyCheckinRestrictHour = response.early_checkin_restrict_hour;
					$rootScope.earlyCheckinRestrictHourForDisplay = response.early_checkin_restrict_hour_for_display;
					$rootScope.earlyCheckinRestrictMinute = response.early_checkin_restrict_minute;
					$rootScope.earlyCheckinRestrictPrimetime = response.early_checkin_restrict_primetime;

					if (response.early_checkin_available && typeof response.early_checkin_offer_id !== "undefined" && !response.bypass_early_checkin) {
						$state.go('earlyCheckinOptions', {
							'time': response.checkin_time,
							'charge': response.early_checkin_charge,
							'id': response.early_checkin_offer_id
						});
					} else if (response.early_checkin_on && !response.early_checkin_available && !response.bypass_early_checkin) {
						$state.go('laterArrival', {
							'time': response.checkin_time,
							'isearlycheckin': true
						});
					} else {
						$state.go('preCheckinStatus');
					}
				}, function() {
					$scope.netWorkError = true;
					$scope.isLoading = false;
				});
			}
		};
	};

	var dependencies = [
		'$scope',
		'preCheckinSrv', '$rootScope', '$state', '$modal', '$stateParams', 'guestDetailsService',
		checkinArrivalDetailsController
	];

	sntGuestWeb.controller('checkinArrivalDetailsController', dependencies);
})();