/**
 * Checkin -terms & conditions ctrl
 */
sntGuestWeb.controller('gwExternalCheckInTurnedOffController', ['$scope','GwWebSrv',
	function($scope, GwWebSrv) {

		var init = function() {
			var screenIdentifier = "EXTERNAL_CHECKIN_OFF";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.zestCheckinNoServiceMsg = GwWebSrv.zestwebData.zestCheckinNoServiceMsg;
		}();

	}
]);