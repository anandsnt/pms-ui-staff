/**
 * Checkin - Update Guest details Controller
 */
sntGuestWeb.controller('gwUpdateGuestDetailsController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv) {


		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "GUEST_DETAILS_UPDATE";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.years = returnYearsInReverseOrder();
			$scope.months = returnMonthsArray();
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
		}();

		// fetch the guest details
		var fetchGuestDetails = function() {
			var guestDetailsFetchSuccess = function(response) {
				$scope.guestDetails = response;
				$scope.guestDetails.street = response.street1;
				$scope.guestDetails.country = response.country_id;
				//split the birthday string to be used in popup
				$scope.guestDetails.day = (response.birthday !== null) ? parseInt(response.birthday.substring(8, 10)) : "";
				$scope.guestDetails.month = (response.birthday !== null) ? returnSelectedMonth(response.birthday.substring(5, 7)).value : "";
				$scope.guestDetails.year = (response.birthday !== null) ? parseInt(response.birthday.substring(0, 4)) : "";
			};
			var options = {
				params: {
					'reservation_id': GwWebSrv.zestwebData.reservationID
				},
				successCallBack: guestDetailsFetchSuccess
			};
			$scope.callAPI(GwCheckinSrv.getGuestDetails, options);
		};

		// fetch countrylist
		var fetchCountryListSuccess = function(response) {
			fetchGuestDetails();
			$scope.countries = response;
		};
		var options = {
			successCallBack: fetchCountryListSuccess
		};
		$scope.callAPI(GwCheckinSrv.fetchCountryList, options);

		// watch if the day selected is valid, eg:- Feb 30 is invalid
		// else unset the day selected
		$scope.yearOrMonthChanged = function() {
			if (!checkIfDateIsValid($scope.guestDetails.month, $scope.guestDetails.day, $scope.guestDetails.year)) {
				$scope.guestDetails.day = "";
			} else {
				return;
			};
		};
		// the PUT API expects some parameters, so need to convert in to that
		var getDataToSave = function() {
			var data = {};
			var unwanted_keys = ["month", "year", "day", "country_id", "street1"];
			var newObject = JSON.parse(JSON.stringify($scope.guestDetails));
			for (var i = 0; i < unwanted_keys.length; i++) {
				delete newObject[unwanted_keys[i]];
			};
			data = newObject;
			if ($scope.guestDetails.month && $scope.guestDetails.day && $scope.guestDetails.year) {
				data.birthday = $scope.guestDetails.month + "-" + $scope.guestDetails.day + "-" + $scope.guestDetails.year;
			} else {
				delete data["birthday"];
			};
			return data;
		};

		//save changes
		$scope.postGuestDetails = function() {
			var postGuestDetailsSuccess = function() {
				if (GwWebSrv.zestwebData.isAutoCheckinOn) {
					$state.go('etaUpdation');
				} else {
					$state.go('checkinFinal');
				};
			}
			var options = {
				params: {
					'data': getDataToSave(),
					'reservation_id': GwWebSrv.zestwebData.reservationID
				},
				successCallBack: postGuestDetailsSuccess
			};
			$scope.callAPI(GwCheckinSrv.postGuestDetails, options);
		};


	}
]);