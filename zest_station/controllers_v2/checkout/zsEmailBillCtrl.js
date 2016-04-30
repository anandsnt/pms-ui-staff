sntZestStation.controller('zsEmailBillCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	function($scope, $stateParams, $state, zsEventConstants) {

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

			//hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
		}();

		$scope.navToHome = function(){
			$state.go('zest_station.home');
		};

	}
]);