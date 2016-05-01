sntZestStation.controller('zsHomeCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	function($scope, $rootScope, $state, zsEventConstants) {

		/**
		 * when we clicked on pickup key from home screen
		 */
		$scope.clickedOnPickUpKey = function() {
			$state.go('zest_station.checkOutReservationSearch',{'mode':'PICKUP_KEY'});
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
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

			//hide close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
		}();


	}
]);