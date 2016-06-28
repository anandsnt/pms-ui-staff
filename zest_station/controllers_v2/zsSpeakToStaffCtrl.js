sntZestStation.controller('zsSpeakToStaffCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	function($scope, $stateParams, $state, zsEventConstants) {

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {

			$scope.customMessagePresent = !!$stateParams.message;
			$scope.customMessage = $scope.customMessagePresent ? $stateParams.message : "";
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

			//hide close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
		}();

		$scope.navToHome = function() {
			$state.go('zest_station.home');
		};

	}
]);