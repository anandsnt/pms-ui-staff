/**
 * Checkout final Controller
 */
sntGuestWeb.controller('gwRoomUpgradeController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = (function() {
			var screenIdentifier = "ROOM_UPGRADES";

			$scope.isUpgradesFetching = true; // to hide contents till api fetches options
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}());
		/**
		 * Room Upgrades fetch actions starts here
		 */

		var onUpgradeFetchSuccess = function(response) {
			$scope.upgradeOptions = response;
			$scope.isUpgradesFetching = false;
			// if no upgrades are available
			if (!response.upsell_room_types.length) {
				$scope.noThanksClicked();
			}
		};
		var onUpgradeFetchFailure = function(response) {
			// to do - continue process - no fatal error
		};

		var options = {
			params: {
				'reservation_id': GwWebSrv.zestwebData.reservationID
			},
			successCallBack: onUpgradeFetchSuccess,
			failureCallBack: onUpgradeFetchFailure
		};

		$scope.callAPI(GwCheckinSrv.fetchRoomUpgradesDetails, options);

		/**
		 * Upgrade selected actions starts here
		 */

		$scope.upgradeClicked = function(upsellOption) {
			var params = {
				'reservation_id': GwWebSrv.zestwebData.reservationID,
				'upsell_amount_id': upsellOption.upsell_amount_id,
				'upgrade_room_type_id': upsellOption.upgrade_room_type_id
			};
			var onUpgradeSuccess = function() {
				GwWebSrv.zestwebData.roomUpgraded = true;
				var reservationDetails = GwCheckinSrv.getcheckinData();
				
				reservationDetails.room_type = upsellOption.upgrade_room_type_name;
				GwCheckinSrv.setcheckinData(reservationDetails);
				$state.go('checkinReservationDetails');
			};
			var onUpgradeFailure = function() {
				// to do - continue process - no fatal error
			};
			var options = {
				params: params,
				successCallBack: onUpgradeSuccess,
				failureCallBack: onUpgradeFailure
			};

			if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
				GwWebSrv.zestwebData.roomUpgraded = true;
				$state.go('checkinReservationDetails');
			} else {
				$scope.callAPI(GwCheckinSrv.upgradeRoom, options);
			}
		};

		$scope.noThanksClicked = function() {
			if (GwWebSrv.zestwebData.isAddonUpsellActive) {
				$state.go('offerAddons');
			} else if (GwWebSrv.zestwebData.guestAddressOn) {
				$state.go('updateGuestDetails');
			} else if (GwWebSrv.zestwebData.isAutoCheckinOn) {
				$state.go('etaUpdation');
			} else {
				$state.go('checkinFinal');
			}
		};
	}
]);