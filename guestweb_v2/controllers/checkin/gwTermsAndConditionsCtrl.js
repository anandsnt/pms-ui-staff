/**
 * Checkin -terms & conditions ctrl
 */
sntGuestWeb.controller('gwTermsAndConditionsController', ['$scope', '$state', '$controller', 'GwWebSrv',
	function($scope, $state, $controller, GwWebSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "TERMS_AND_CONDITIONS";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}();

		$scope.termsAndConditions = GwWebSrv.zestwebData.termsAndConditions;

	}
]);