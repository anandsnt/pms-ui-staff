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

		$controller('BaseController', {
			$scope: $scope
		});

		var init = function() {
			var screenIdentifier = "LATE_CHECKOUT_FINAL";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			// replace the string @<what-ever> with corresponding scope variable
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@checkout-time", $scope.lateCheckOut.time + $scope.lateCheckOut.ap);
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@amount", $rootScope.currencySymbol + $scope.lateCheckOut.amount.toString());
			
			$scope.oldCheckoutTime = angular.copy(GwWebSrv.zestwebData.checkoutTime);
			GwWebSrv.zestwebData.checkoutTime = $scope.lateCheckOut.time +':00 '+$scope.lateCheckOut.ap;
			$scope.keyExpiry = "Your room keys are set to expire for the checkout time of "+$scope.oldCheckoutTime+". Please see a guest service agent at the front desk to re-activate your keys for the late checkout time selected.";
		}();

		$scope.$emit('showLoader');
		// for a better transition from previous screen add small timeout
		$timeout(function() {
			$scope.$emit('hideLoader');
			$scope.isOperationCompleted = true;
		}, 500);

	}
]);