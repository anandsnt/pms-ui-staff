sntZestStation.controller('zsCheckinGuestAddressCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'countryList',
	'zsCheckinSrv',
	'guestAddress',
	function($scope, $state, zsEventConstants, countryList, zsCheckinSrv, guestAddress) {

		var selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
		var resetValues = function() {
			$scope.guestDetails = {
				'postal_code': '',
				'state': '',
				'city': '',
				'street': '',
				'street2': '',
				'country_id': ''
			};
		};

		$scope.usePresentAddress = function() {
			$state.go('zest_station.checkInReservationDetails', {
				previousState: 'COLLECT_ADRESS'
			});
		};

		$scope.useNewAddress = function() {
			resetValues();
			$scope.mode = "NEW_ADDRESS";
			$scope.focusInputField('address-1');
		};

		var saveAddress = function () {
			var params = angular.copy($scope.guestDetails);
			
			params.country = params.country_id;
			delete params.country_id;

			params.reservation_id = selectedReservation.id;

			var options = {
				params: params,
				successCallBack: function() {
					$state.go('zest_station.checkInReservationDetails', {
						previousState: 'COLLECT_ADRESS'
					});
				}
			};

			$scope.callAPI(zsCheckinSrv.saveGuestAddress, options);
		};

		var isValidAddress = function(addrees) {
			return !!addrees.country_id && (!!addrees.street || !!addrees.street1) && (!!addrees.state || !!addrees.city);
		};

		$scope.nextButtonClicked = function() {
			if (isValidAddress($scope.guestDetails)) {
				saveAddress();
			} else {
				$scope.showErrorMessage = true;
			}
		};

		$scope.dismissPopup = function() {
			$scope.showErrorMessage = false;
		};

		(function() {
			BaseCtrl.call(this, $scope);
			$scope.$emit('hideLoader');
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			// back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function() {
				var reservations = zsCheckinSrv.getCheckInReservations();
				
				if (isValidAddress(guestAddress) && $scope.mode === "NEW_ADDRESS") {
					$scope.mode = "SELECT_ADDRESS";
				} else if (reservations.length > 1) {
					$state.go('zest_station.selectReservationForCheckIn');
				} else {
					$state.go('zest_station.checkInReservationSearch');
				}
			});
			$scope.countryList = countryList;
			resetValues();
			$scope.showErrorMessage = false;

			if (isValidAddress(guestAddress)) {
				$scope.mode = "SELECT_ADDRESS";
				$scope.presentAddress = guestAddress;
				var guestCountry = _.find(countryList, function(country) {
					return parseInt(country.id) === parseInt($scope.presentAddress.country_id);
				});

				$scope.presentAddress.country = !!guestCountry ? guestCountry.value : '';
			} else {
				$scope.mode = "NEW_ADDRESS";
				$scope.focusInputField('address-1');
			}
		}());
	}
]);