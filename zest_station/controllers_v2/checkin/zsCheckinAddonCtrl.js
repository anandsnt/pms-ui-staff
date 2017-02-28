sntZestStation.controller('zsCheckinAddonCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsCheckinSrv',
	'zsEventConstants',
	'$timeout',
	function($scope, $stateParams, $state, zsCheckinSrv, zsEventConstants, $timeout) {

		var navigateToTermsPage = function() {

			var stateParams = {
				'guest_id': $scope.selectedReservation.guest_details[0].id,
				'reservation_id': $scope.selectedReservation.reservation_details.reservation_id,
				'deposit_amount': $scope.selectedReservation.reservation_details.deposit_amount,
				'room_no': $scope.selectedReservation.reservation_details.room_number, // this changed from room_no, to room_number
				'room_status': $scope.selectedReservation.reservation_details.room_status,
				'payment_type_id': $scope.selectedReservation.reservation_details.payment_type,
				'guest_email': $scope.selectedReservation.guest_details[0].email,
				'guest_email_blacklisted': $scope.selectedReservation.guest_details[0].is_email_blacklisted,
				'first_name': $scope.selectedReservation.guest_details[0].first_name,
				'balance_amount': $scope.selectedReservation.reservation_details.balance_amount,
				'confirmation_number': $scope.selectedReservation.confirmation_number,
				'pre_auth_amount_for_zest_station': $scope.selectedReservation.reservation_details.pre_auth_amount_for_zest_station,
				'authorize_cc_at_checkin': $scope.selectedReservation.reservation_details.authorize_cc_at_checkin,
				'is_from_room_upsell': $stateParams.is_from_room_upsell,
				'is_from_addons': 'true'
			};

			$state.go('zest_station.checkInTerms', stateParams);
		};

		var generalError = function() {
			$scope.mode = 'ERROR_MODE';
		};

		var setPageNumberDetails = function() {
			$scope.$emit('hideLoader');
			if ($scope.addonsList.length <= 6) {
				// if 6 or less upgrades are available
				$scope.pageStartingIndex = 1;
				$scope.pageEndingIndex = $scope.addonsList.length;
				$scope.viewableAddons = angular.copy($scope.addonsList);
			} else {
				// if multiple pages (each containing 6 items) are present and user navigates
				// using next and previous buttons
				$scope.pageStartingIndex = 1 + 6 * ($scope.pageNumber - 1);
				// ending index can depend upon the no of items
				if ($scope.pageNumber * 6 < $scope.addonsList.length) {
					$scope.pageEndingIndex = $scope.pageNumber * 6;
				} else {
					$scope.pageEndingIndex = $scope.addonsList.length;
				}

				// set viewable room list - 6 items at a time
				$scope.viewableAddons = [];

				for (var index = -1; index < 5; index++) {
					if (!_.isUndefined($scope.addonsList[$scope.pageStartingIndex + index])) {
						$scope.viewableAddons.push($scope.addonsList[$scope.pageStartingIndex + index]);
					}
				}
				// enable/disable next previous
				$scope.disableNextButton = ($scope.pageEndingIndex === $scope.addonsList.length);
				$scope.disablePreviousButton = $scope.pageStartingIndex === 1;
			}
			// set the height for container
			$('#upgrades').css({
				"height": "calc(100% - 230px)"
			});

			console.log($scope.viewableAddons);
		};

		$scope.viewNextPage = function() {
			// $scope.$emit('showLoader');
			$scope.disableNextButton = true;
			$timeout(function() {
				$scope.pageNumber++;
				setPageNumberDetails();
			}, 200);
		};

		$scope.viewPreviousPage = function() {
			// $scope.$emit('showLoader');
			$scope.disablePreviousButton = true;
			$timeout(function() {
				$scope.pageNumber--;
				setPageNumberDetails();
			}, 200);
		};


		$scope.addonSelected = function(addon) {
			$scope.selectedAddon = addon;
			$scope.showPopup = true;
		};

		$scope.closePopup = function() {
			$scope.showPopup = false;
		};

		var fetchAddons = function() {

			var fetchAddonsSuccess = function(response) {
				$scope.addonsList = response.addons;

				_.each($scope.addonsList, function(addon) {
					addon.is_selected = false;
					addon.quantity = 0;
				});

				// set page number details
				$scope.pageNumber = 1;
				if ($scope.addonsList.length > 0) {
					setPageNumberDetails();
				} else {
					generalError();
				}
				$scope.showPageNumberDetails = true;

				if ($scope.addonsList.length === 1) {
					$scope.selectedRoom = $scope.addonsList[0];
					$scope.mode = 'ROOM_DETAILS';
				} else {
					$scope.mode = 'ROOM_UPSELL_LIST';
				}
			};

			$scope.callAPI(zsCheckinSrv.fetchAddons, {
				params: {
					//reservation_id: $scope.selectedReservation.reservation_details.reservation_id
				},
				'successCallBack': fetchAddonsSuccess,
				'failureCallBack': generalError
			});
		};

		$scope.addonsList = [];
		$scope.getAmountTotal = function() {
			var totalAmount = 0;
			_.each($scope.addonsList, function(addon) {
				if (addon.is_selected) {
					totalAmount = totalAmount + addon.price;
				} else if (addon.quantity > 0) {
					totalAmount = totalAmount + addon.price * addon.quantity;
				}
			});
			return totalAmount;
		};

		$scope.addonPurchaseCompleted = function(argument) {

			if ($scope.getAmountTotal() > 0) {
				$scope.selectedReservation.skipAddon = true;
				zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
				$state.go('zest_station.checkInReservationDetails');
			} else {
				navigateToTermsPage();
			}
		};

		var onBackButtonClicked = function() {
			if ($stateParams.is_from_room_upsell === 'true') {
				$state.go('zest_station.roomUpsell');
			} else {
				$state.go('zest_station.checkInReservationDetails');
			}
		};
		/**
		 * [initializeMe description]
		 */
		var initializeMe = (function() {
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			// hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			// back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);
			$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
			fetchAddons();

		}());
	}
]);