sntZestStation.controller('zsKeyDispenseCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	function($scope, $stateParams, $state, zsEventConstants) {
		
		//pickup key and checkin share this . But HTML will be differnt.
		//and use two states and two controllers inheriting this controller.
		//zest_station.checkInKeyDispense and zest_station.pickUpKeyDispense
		//include all common functions that will be shared in both screens
		//use the inherited controller for the customized actions like
		//navigation to next page or nav back

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {

			BaseCtrl.call(this, $scope);
			//hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
		}();


	}
]);