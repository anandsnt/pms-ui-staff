/**
 * Checkin - Reservation details Controller
 */
sntGuestWeb.controller('gwReservationDetailsController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = (function() {
			var screenIdentifier = "RESERVATION_DETAILS";

			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}());

		$scope.reservationData = GwCheckinSrv.getcheckinData();
		GwWebSrv.zestwebData.confirmationNo = $scope.reservationData.confirm_no;
		$scope.ShowupgradedLabel = GwWebSrv.zestwebData.roomUpgraded;
		$scope.isAddonUpsellActive = GwWebSrv.zestwebData.isAddonUpsellActive;
		/*
		 *	if room upgrade is present, go there else go to terms and conditions
		 */
		$scope.checkInButtonClicked = function() {
			if (!GwWebSrv.zestwebData.showedTermsAndConditions) {
				$state.go('termsAndConditions');
			} else if (GwWebSrv.zestwebData.upgradesAvailable && !GwWebSrv.zestwebData.roomUpgraded) {
				$state.go('roomUpgrade');
			} else if (GwWebSrv.zestwebData.isAddonUpsellActive) {
				$state.go('offerAddons');
			} else if (GwWebSrv.zestwebData.guestAddressOn) {
				$state.go('updateGuestDetails');
			} else {
				$state.go('etaUpdation');
			}
		};
	}
]);