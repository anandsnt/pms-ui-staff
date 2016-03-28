/**
 * Checkin - early checkin final
 */
sntGuestWeb.controller('gwEarlyCheckinFinalController', ['$scope', '$state', '$stateParams', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $stateParams, $controller, GwWebSrv, GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "EARLY_CHECKIN_FINAL";
			$scope.earlyCheckinCharge = $stateParams.charge;
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@early-checkin-charge", $scope.earlyCheckinCharge);
		}();

		$scope.nextButtonClicked = function() {
			$state.go('autoCheckinFinal');
		};
	}
]);