/**
 * Checkin - already checked in
 */
sntGuestWeb.controller('gwAlreadyCheckedOutController', ['$scope', '$state', '$stateParams', '$controller', 'GwWebSrv',
	function($scope, $state, $stateParams, $controller, GwWebSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "ALREADY_CHECKED_OUT";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}();


	}
]);