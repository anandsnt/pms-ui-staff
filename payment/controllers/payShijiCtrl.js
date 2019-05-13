angular.module('sntPay').controller('payShijiCtrl', ['$scope', 'sntShijiGatewaySrv', 'ngDialog', '$timeout', 'sntActivity', '$window',
	function($scope, sntShijiGatewaySrv, ngDialog, $timeout, sntActivity, $window) {

		// ----------- init -------------
		(() => {
			var isCCPresent = angular.copy($scope.showSelectedCard());

			$scope.payment.isManualEntryInsideIFrame = isCCPresent && $scope.hotelConfig.paymentGateway === 'SHIJI';

			// handle six payment iFrame communication
			var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			var eventer = window[eventMethod];
			var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

			angular.element($window).on(messageEvent, function(e) {
				var responseData = e.data || e.originalEvent.data;

				if (responseData.response_message === "token_created") {
					notifyParent(responseData);
				}
			});

			$scope.$on("$destroy", () => {
				angular.element($window).off(messageEvent);
			});

		})();

	}
]);