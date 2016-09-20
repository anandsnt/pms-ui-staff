sntZestStation.controller('zsRoomErrorCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	function($scope, $state, zsEventConstants, $stateParams) {

		BaseCtrl.call(this, $scope);
		/**
		 * when checking-in if room is not assigned or dirty, should show room error page
		 * in future we may want to provide more options for room not available (ie. upgrade,etc.)
		 * 
		 * placeholder {first_name} in stateParams
		 */


		/**
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			console.log('$stateParams for room error: ', $stateParams);
			if (typeof $stateParams.unavailable !== typeof undefined) {
				$scope.unavailable = $stateParams.unavailable;
			};
		}();

	}
]);