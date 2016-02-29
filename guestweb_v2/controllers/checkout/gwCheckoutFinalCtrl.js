/**
 * Checkout final Controller
 */
sntGuestWeb.controller('GwCheckoutFinalController', ['$scope', '$state', '$controller', 'GwWebSrv', '$timeout', 'GwCheckoutSrv',
	function($scope, $state, $controller, GwWebSrv, $timeout, GwCheckoutSrv) {
		//TODO : remove unwanted injections like $timeout
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