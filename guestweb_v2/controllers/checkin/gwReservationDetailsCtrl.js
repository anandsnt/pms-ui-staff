/**
 * Checkin - Reservation details Controller
 */
sntGuestWeb.controller('gwReservationDetailsController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $controller, GwWebSrv,GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "RESERVATION_DETAILS";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}();

		$scope.reservationData = GwCheckinSrv.getcheckinData();
		GwWebSrv.zestwebData.confirmationNo = $scope.reservationData.confirm_no;
		/*
		 *	if room upgrade is present, go there else go to terms and conditions
		 */
		$scope.checkInButtonClicked = function() {
			//to do : show terms and conditions
			if ( GwWebSrv.zestwebData.upgradesAvailable) {
				$state.go('roomUpgrade');
			} else {
				$state.go('termsAndConditions');
			};
		};
	}
]);