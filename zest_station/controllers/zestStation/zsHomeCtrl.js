sntZestStation.controller('zsHomeCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	function($scope, $state, zsModeConstants, zsEventConstants) {

	/**
	 * when we clicked on pickup key from home screen
	 * @return {undefined}
	 */
	$scope.clickedOnPickUpKey = function() {
		$state.go('zest_station.reservation_search', {
          mode: zsModeConstants.PICKUP_KEY_MODE
        });
	};

	/**
	 * when we clicked on checkin from home screen
	 * @return {undefined}
	 */
	$scope.clickedOnCheckinButton = function() {
		$state.go('zest_station.reservation_search', {
          mode: zsModeConstants.CHECKIN_MODE
        });
	};

	/**
	 * when we clicked on checkout from home screen
	 * @return {undefined}
	 */
	$scope.clickedOnCheckoutButton = function() {
		$state.go('zest_station.reservation_search', {
          mode: zsModeConstants.CHECKOUT_MODE
        });
	};

	/**
	 * [initializeMe description]
	 * @return {[type]} [description]
	 */
	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
	}();
}]);