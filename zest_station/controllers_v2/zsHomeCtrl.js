sntZestStation.controller('zsHomeCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsModeConstants',
	'zsEventConstants', '$stateParams', 'ngDialog', 'zsTabletSrv', '$window',
	function($scope, $rootScope, $state, zsModeConstants, zsEventConstants, $stateParams, ngDialog, zsTabletSrv, $window) {

		/**
		 * when we clicked on pickup key from home screen
		 */
		$scope.clickedOnPickUpKey = function() {
			$state.go('zest_station.pickUpKeyReservationSearch');
		};

		/**
		 * when we clicked on checkin from home screen
		 */
		$scope.clickedOnCheckinButton = function() {
			$state.go('zest_station.checkInReservationSearch');
		};


		/**
		 * when we clicked on checkout from home screen
		 */
		$scope.clickedOnCheckoutButton = function() {
			if (!$scope.zestStationData.checkout_keycard_lookup) {
				$state.go('zest_station.checkOutReservationSearch');
			} else {
				$state.go('zest_station.checkoutSearchOptions');
			};
		};

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			//show back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

			//show close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
		}();


	}
]);