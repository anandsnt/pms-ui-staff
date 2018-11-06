/**
 * Checkin -terms & conditions ctrl
 */
sntGuestWeb.controller('gwTermsAndConditionsController', ['$scope', '$state', '$controller', 'GwWebSrv',
	function($scope, $state, $controller, GwWebSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = (function() {
			var screenIdentifier = "TERMS_AND_CONDITIONS";
			
			GwWebSrv.zestwebData.showedTermsAndConditions = true;
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}());

		$scope.termsAndConditions = GwWebSrv.zestwebData.termsAndConditions;

		$scope.agreeClicked = function() {
			if (GwWebSrv.zestwebData.upgradesAvailable && !GwWebSrv.zestwebData.roomUpgraded) {
				$state.go('roomUpgrade');
			} else if (GwWebSrv.zestwebData.isAddonUpsellActive) {
				$state.go('offerAddons');
			} else if (GwWebSrv.zestwebData.guestAddressOn) {
				$state.go('updateGuestDetails');
			} else if (GwWebSrv.zestwebData.isAutoCheckinOn) {
				$state.go('etaUpdation');
			} else {
				$state.go('checkinFinal');
			}
		};
		$scope.cancelClicked = function() {
			location.href = "about:home";
		};

	}
]);