/**
 * This Controller is to show the  late checkout options
 */
sntGuestWeb.controller('GwCheckoutLaterController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckoutSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckoutSrv) {

		//TODO : remove unwanted injections like $timeout
		$controller('BaseController', {
			$scope: $scope
		});

		var init = function() {
			var screenIdentifier = "CHECKOUT_LATER_OPTIONS";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			var onSuccess = function(response) {
				$scope.lateCheckoutOptions = response;
				$scope.isOperationCompleted = true;
			};
			var options = {
				params: {},
				successCallBack: onSuccess
			};
			$scope.callAPI(GwCheckoutSrv.fetchLateCheckoutOptions, options);
		}();


		$scope.gotToNextStep = function() {
			$state.go('checkOutLaterFinal');
		};
	}
]);