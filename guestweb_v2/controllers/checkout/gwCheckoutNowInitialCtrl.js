/**
 *	This Controller is to view bill
 */
sntGuestWeb.controller('GwCheckoutNowInitialController', ['$scope', '$state', '$controller', 'GwWebSrv', '$timeout',
	function($scope, $state, $controller, GwWebSrv, $timeout) {

		$scope.checkout_time = GwWebSrv.zestwebData.checkoutTime;

		//TODO : remove unwanted injections like $timeout
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