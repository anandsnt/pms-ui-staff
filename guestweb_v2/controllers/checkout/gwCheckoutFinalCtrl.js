/**
 * Checkout final Controller
 */
sntGuestWeb.controller('GwCheckoutFinalController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckoutSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckoutSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "CHECKOUT_FINAL";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}();

		var onSuccess = function(response) {
			$scope.isOperationCompleted = true;
		};
		var options = {
			params: {
				'reservation_id': GwWebSrv.zestwebData.reservationID
			},
			successCallBack: onSuccess
		};
		$scope.callAPI(GwCheckoutSrv.completeCheckout, options);
	}
]);