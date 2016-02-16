/**
 *	This Controller is for late checkout final page
 */
sntGuestWeb.controller('gwLateCheckoutFinalController', ['$scope', '$rootScope', '$state', '$controller', 'GwWebSrv', '$timeout', 'GwCheckoutSrv',
	function($scope, $rootScope, $state, $controller, GwWebSrv, $timeout, GwCheckoutSrv) {


		$scope.lateCheckOut = {
			"time": 12,
			"ap": "AM",
			"amount": 334
		};
		//TODO : remove unwanted injections like $timeout
		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "LATE_CHECKOUT_FINAL";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.screenCMSDetails.description = $scope.screenCMSDetails.description.replace("@checkout-time", $scope.lateCheckOut.time + $scope.lateCheckOut.ap);
			$scope.screenCMSDetails.description = $scope.screenCMSDetails.description.replace("@amount", $rootScope.currencySymbol + $scope.lateCheckOut.amount.toString());
		}();

		$scope.$emit('showLoader');
		$timeout(function() {
			$scope.$emit('hideLoader');
			$scope.isOperationCompleted = true;
		}, 500);

	}
]);