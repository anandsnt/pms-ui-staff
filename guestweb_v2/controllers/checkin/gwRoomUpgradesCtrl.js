/**
 * Checkout final Controller
 */
sntGuestWeb.controller('gwRoomUpgradeController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "ROOM_UPGRADES";
			$scope.isUpgradesFetching = true; //to hide contents till api fetches options
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}();
		/**
		 * Room Upgrades fetch actions starts here
		 */
		$scope.returnUpgradeRoomImage = function(room_type_image) {
			console.log((room_type_image.length > 0) ? room_type_image : 'room-image.png');
			return (room_type_image.length > 0) ? room_type_image : 'room-image.png';
		};

		var onUpgradeFetchSuccess = function(response) {
			$scope.upgradeOptions = response;
			$scope.isUpgradesFetching = false;
		};
		var onUpgradeFetchFailure = function(response) {
			//to do - continue process - no fatal error
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
				//to do - continue process 
			};
			var onUpgradeFailure = function() {
				//to do - continue process - no fatal error
			};
			var options = {
				params: params,
				successCallBack: onUpgradeSuccess,
				failureCallBack: onUpgradeFailure
			};
			$scope.callAPI(GwCheckinSrv.upgradeRoom, options);
		};

		$scope.noThanksClicked = function() {
			$state.go('termsAndConditions');
		};
	}
]);