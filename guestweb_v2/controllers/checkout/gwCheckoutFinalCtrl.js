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

		$scope.$emit('showLoader');
		$timeout(function() {
			$scope.$emit('hideLoader');
			$scope.isOperationCompleted = true;
		}, 500);


	}
]);