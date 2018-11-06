/*
	guest details Ctrl 
	If the admin settings for this is turned on , this screen will be shown and user can
	update the guest details here.
*/
(function() {
	var guestDetailsController = function($scope, $rootScope, $state, guestDetailsService, $modal) {

		$scope.pageValid = false;

		if ($rootScope.isCheckedin) {
			$state.go('checkinSuccess');
		} else if ($rootScope.isCheckedout) {
			$state.go('checkOutStatus');
		} else {
			$scope.pageValid = true;
		}
		if ($scope.pageValid) {
			$scope.countries = [];
			$scope.sortedCountries = [];
			$scope.unSortedCountries = [];
			$scope.years = [];
			$scope.months = [];
			$scope.days = [];
			$scope.guestDetails = {
				'day': '',
				'month': '',
				'year': '',
				'postal_code': '',
				'state': '',
				'city': '',
				'street': '',
				'street2': '',
				'birthday': '',
				'country': ''
			};

			for (var year = new Date().getFullYear(); year >= 1900; year--) {
				$scope.years.push(year);
			}
			for (var month = 1; month <= 12; month++) {
				$scope.months.push(month);
			}
			for (var day = 1; day <= 31; day++) {
				$scope.days.push(day);
			}
			var alreadyPresentGuestDetails = {};
			//fetch details
			var fetchGuestDetails = function() {
				$scope.isLoading = true;
				guestDetailsService.getGuestDetails().then(function(response) {
					$scope.isLoading = false;
					$scope.guestDetails = response;
					$scope.guestDetails.street = response.street1;
					$scope.guestDetails.country = !!response.country_id ? response.country_id : '';
					$scope.guestDetails.day = ($scope.guestDetails.birthday !== null) ? parseInt($scope.guestDetails.birthday.substring(8, 10)) : "";
					$scope.guestDetails.month = ($scope.guestDetails.birthday !== null) ? parseInt($scope.guestDetails.birthday.substring(5, 7)) : "";
					$scope.guestDetails.year = ($scope.guestDetails.birthday !== null) ? parseInt($scope.guestDetails.birthday.substring(0, 4)) : "";
					alreadyPresentGuestDetails = angular.copy($scope.guestDetails);
				}, function() {
					$rootScope.netWorkError = true;
					$scope.isLoading = false;
				});
			};
			//fetch country list
			$scope.isLoading = true;
			if ($rootScope.enforceCountrySort) {
				var data = {
					'reservation_id': $rootScope.reservationID
				}
				guestDetailsService.fetchSortedCountryList(data).then(function(response) {
					$scope.sortedCountries = response.sorted;
					$scope.unSortedCountries = response.unsorted;
					$scope.isLoading = false;
					fetchGuestDetails();
				}, function() {
					$rootScope.netWorkError = true;
					$scope.isLoading = false;
				});
			} else {
				guestDetailsService.fetchCountryList().then(function(response) {
					$scope.countries = response;
					$scope.isLoading = false;
					fetchGuestDetails();
				}, function() {
					$rootScope.netWorkError = true;
					$scope.isLoading = false;
				});
			}
			$scope.yearOrMonthChanged = function() {
				$scope.guestDetails.day = "";
			};
			var getDataToSave = function() {
				var data = {};
				var unwanted_keys = ["month", "year", "day"];
				var newObject = JSON.parse(JSON.stringify($scope.guestDetails));
				for (var i = 0; i < unwanted_keys.length; i++) {
					delete newObject[unwanted_keys[i]];
				};
				data = newObject;
				if ($scope.guestDetails.month && $scope.guestDetails.day && $scope.guestDetails.year) {
					data.birthday = $scope.guestDetails.month + "-" + $scope.guestDetails.day + "-" + $scope.guestDetails.year;
				} else {
					delete data["birthday"];
				}
				return data;
			};
			$scope.errorOpts = {
				backdrop: true,
				backdropClick: true,
				templateUrl: '/assets/preCheckin/partials/preCheckinErrorModal.html',
				controller: ccVerificationModalCtrl,
				resolve: {
					errorMessage: function() {
						return "Please provide all the required information";
					}
				}
			};

			var nextPageActions = function() {
				$rootScope.isGuestAddressVerified = true;
				// (for checkin now room has to be available)
				if ($rootScope.upgradesAvailable && ($rootScope.isAutoCheckinOn || $rootScope.isUpgradeAvailableNow)) {
					$state.go('checkinUpgrade');
				} else {
					if ($rootScope.isAutoCheckinOn) {
						$state.go('checkinArrival');
					} else {
						$state.go('checkinKeys');
					}
				}
			};

			//post guest details
			$scope.postGuestDetails = function() {
				if ($scope.guestDetails.country && $scope.guestDetails.street && $scope.guestDetails.city && $scope.guestDetails.state && $scope.guestDetails.postal_code) {
					if (_.isMatch(alreadyPresentGuestDetails, angular.copy($scope.guestDetails))) {
						// No change in guest details
						nextPageActions();
					} else {
						$scope.isLoading = true;
						var dataToSave = getDataToSave();
						guestDetailsService.postGuestDetails(dataToSave).then(function() {
							$scope.isLoading = false;
							nextPageActions();
						}, function() {
							$rootScope.netWorkError = true;
							$scope.isLoading = false;
						});
					}
				} else {
					$modal.open($scope.errorOpts);
				}
			};
		}
	};

	var dependencies = [
		'$scope', '$rootScope', '$state', 'guestDetailsService', '$modal',
		guestDetailsController
	];
	sntGuestWeb.controller('guestDetailsController', dependencies);
})();