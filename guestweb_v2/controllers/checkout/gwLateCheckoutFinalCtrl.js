/**
 *	This Controller is for late checkout final page
 */
sntGuestWeb.controller('gwLateCheckoutFinalController', ['$scope', '$rootScope', '$state', '$stateParams', '$controller', 'GwWebSrv', '$timeout', 'GwCheckoutSrv',
	function($scope, $rootScope, $state, $stateParams, $controller, GwWebSrv, $timeout, GwCheckoutSrv) {


		$scope.lateCheckOut = {
			time: $stateParams.time,
			amount: $stateParams.amount,
			ap: $stateParams.ap
		};
		//TODO : remove unwanted injections like $timeout
		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "LATE_CHECKOUT_FINAL";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@checkout-time", $scope.lateCheckOut.time + $scope.lateCheckOut.ap);
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@amount", $rootScope.currencySymbol + $scope.lateCheckOut.amount.toString());
		}();

		$scope.$emit('showLoader');
		$timeout(function() {
			$scope.$emit('hideLoader');
			$scope.isOperationCompleted = true;
		}, 500);

	}
]);