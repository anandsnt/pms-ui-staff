/**
 * Checkin -Auto checkin Controller
 */
sntGuestWeb.controller('gwAutoCheckinController', ['$scope', '$controller', 'GwWebSrv', 'GwCheckinSrv', '$rootScope', '$state',
	function($scope, $controller, GwWebSrv, GwCheckinSrv, $rootScope, $state) {

		$controller('BaseController', {
			$scope: $scope
		});
		
		var init = (function() {
			var screenIdentifier = "AUTO_CHECKIN_FINAL";
			
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.isLoading = true;
		}());

		var completeAutoCheckinSuccess = function(response) {
			console.log(response);
			$scope.displayText = response.confirmation_message;
			$scope.confirmationNumber = GwWebSrv.zestwebData.confirmationNo;
			$scope.isLoading = false;
		};
		var options = {
			params: {
				'reservation_id': GwWebSrv.zestwebData.reservationID
			},
			successCallBack: completeAutoCheckinSuccess
		};
		
		if (!GwWebSrv.zestwebData.isInZestwebDemoMode) {
			$scope.callAPI(GwCheckinSrv.completeAutoCheckin, options);
		} else {
			completeAutoCheckinSuccess({
				'confirmation_message': 'Please wait till you receive a mail from us. Thank You'
			});
		}
	}
]);