sntZestStation.controller('zsOutOfServiceCtrl', [
	'$scope',
	'zsEventConstants',
	'$timeout',
	function($scope,zsEventConstants,$timeout) {
		/**
		 * [CheckForWorkStationStatusContinously description]
		 *  Check if admin has set back the status of the
		 *  selected workstation to in order
		 */
		var  CheckForWorkStationStatusContinously = function(){
			 $scope.$emit('FETCH_LATEST_WORK_STATIONS');
			 $timeout(CheckForWorkStationStatusContinously, 5000); 
		};

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			BaseCtrl.call(this, $scope);
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
			CheckForWorkStationStatusContinously();
		}();
	}
]);