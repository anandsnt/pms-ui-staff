sntZestStation.controller('zsOutOfServiceCtrl', [
	'$scope',
	'zsEventConstants',
	function($scope,zsEventConstants) {

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