sntZestStation.controller('zsReservationSearchCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	function($scope, $state, zsModeConstants, zsEventConstants) {

	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
		$state.go ('zest_station.home');
	});

	/**
	 * [initializeMe description]
	 * @return {[type]} [description]
	 */
	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
	}();

}]);