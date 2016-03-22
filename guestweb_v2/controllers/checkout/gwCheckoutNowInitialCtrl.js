/**
 *	This Controller is to view bill
 */
sntGuestWeb.controller('GwCheckoutNowInitialController', ['$scope', '$state', '$controller', 'GwWebSrv',
	function($scope, $state, $controller, GwWebSrv) {

		$scope.checkout_time = GwWebSrv.zestwebData.checkoutTime;

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "CHECKOUT_NOW_LANDING";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@checkout-time", $scope.checkout_time);
		}();

	}
]);