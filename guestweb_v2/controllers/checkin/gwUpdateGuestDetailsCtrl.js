/**
 * Checkin - Reservation details Controller
 */
sntGuestWeb.controller('gwUpdateGuestDetailsController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $controller, GwWebSrv,GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "GUEST_DETAILS_UPDATE";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}();
		// 
		
	
	}
]);