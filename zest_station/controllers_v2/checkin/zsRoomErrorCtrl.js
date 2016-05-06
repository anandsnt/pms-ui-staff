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
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			$state.go('zest_station.checkInReservationSearch');
		});

		$scope.navToPrev = function() {
			$scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
		};

		$scope.init = function() {
                    
		};
                

		/**
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

			$scope.init();
		}();

	}
]);