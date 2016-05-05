sntZestStation.controller('zsOutOfServiceCtrl', [
	'$scope',
	'zsEventConstants',
	'$timeout',
	function($scope,zsEventConstants,$timeout) {

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			BaseCtrl.call(this, $scope);
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
		}();
	}
]);