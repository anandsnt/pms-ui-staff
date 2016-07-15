/*
	Checkin reservation details Ctrl 
	Reservation details are shown in this page.
*/
(function() {
	var greatWolfCheckInReservationDetailsCtrl = function($scope, $rootScope, $location, checkinDetailsService, $state, $modal) {

		$scope.pageValid = false;
		if ($rootScope.isCheckedin) {
			$state.go('checkinSuccess');
		} else {
			$scope.pageValid = true;
		};

		if ($scope.pageValid) {
			$scope.reservationData = checkinDetailsService.getResponseData();
			$rootScope.confirmationNumber = $scope.reservationData.confirm_no;

			/*
			 *	if birthday selection is turened on in admin, show birthday page 
			 *   Else if prompt for guest details (the new version of guest details)
			 *   Other scenarios are room upgrades, checkin key -> if precheckin in turned on
			 *   If precheckin is turned on go to ETA page.
			 */

			$scope.checkInButtonClicked = function() {
				if ($rootScope.guestBirthdateOn && !$rootScope.isBirthdayVerified) {
					$state.go('birthDateDetails');
				} else if ($rootScope.guestPromptAddressOn && !$rootScope.isGuestAddressVerified) {
					$state.go('promptGuestDetails');
				} else if (!$rootScope.guestAddressOn || $rootScope.isGuestAddressVerified) {
					// if room upgrades are available
					if ($rootScope.upgradesAvailable) {
						$state.go('checkinUpgrade');
					} else {
						if ($rootScope.isAutoCheckinOn) {
							$state.go('checkinArrival');
						} else {
							$state.go('checkinKeys');
						}
					};
				} else {
					$state.go('guestDetails');
				}
			};
		}
	};

	var dependencies = [
		'$scope', '$rootScope', '$location', 'checkinDetailsService', '$state', '$modal',
		greatWolfCheckInReservationDetailsCtrl
	];

	sntGuestWeb.controller('greatWolfCheckInReservationDetailsCtrl', dependencies);
})();