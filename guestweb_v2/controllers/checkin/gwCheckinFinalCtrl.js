/**
 * Checkin - final
 */
sntGuestWeb.controller('gwCheckinFinalController', ['$scope', '$state', '$stateParams', '$controller', 'GwWebSrv','GwCheckinSrv',
	function($scope, $state, $stateParams, $controller, GwWebSrv, GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "CHECKIN_FINAL";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.confirmationNumber = GwWebSrv.zestwebData.confirmationNo;
			$scope.isPosting = true;
		}();

		var onSuccess = function(response){
			$scope.isPosting = false;
			$scope.responseData =response;
		};
		var options = {
				params: {
					'reservation_id': GwWebSrv.zestwebData.reservationID
				},
				successCallBack: onSuccess
		};
		$scope.callAPI(GwCheckinSrv.checkinGuest, options);
	}
]);