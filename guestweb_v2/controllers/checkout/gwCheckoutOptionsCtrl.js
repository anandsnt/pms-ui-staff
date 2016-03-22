/**
 *	This Controller is to list checkout options
 */
sntGuestWeb.controller('GwCheckOutOptionsController', ['$scope', '$state', '$controller', 'GwWebSrv',
	function($scope, $state, $controller, GwWebSrv) {

		$scope.checkout_time = GwWebSrv.zestwebData.checkoutTime;

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "CHECKOUT_LANDING";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			// replace the string @<what-ever> with corresponding scope variable
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@checkout-time", $scope.checkout_time);
		}();

	}
]);