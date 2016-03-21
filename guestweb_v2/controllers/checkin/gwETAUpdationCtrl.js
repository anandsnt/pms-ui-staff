/**
 * Checkin - ETA updation ctrl
 */
sntGuestWeb.controller('gwETAUpdationController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $controller, GwWebSrv,GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "ETA_UPDATION";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}();

	}
]);