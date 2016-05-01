sntZestStation.controller('zsKeyDispenseCtrl', [
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
			//pickup key and checkin share this . But HTML will be differnt.
			//and use two states.
			//zest_station.checkInKeyDispense and zest_station.pickUpKeyDispense
			//Pass the resevation id and mode to stateparams
			//these condtions are only to be used to navigate back and to navigate to next screen
			$scope.pickupKeyDispenseMode = $stateParams.mode === 'PICKUP_KEY_DISPENSE' ? true : false;
			$scope.resevationId = $stateParams.resevation_id;
		}();

		/**
		 * [Screen navigations]
		 */
		
		var navigateToNextScreen = function(){
		    if($scope.pickupKeyDispenseMode){
				//go to next screen for pickup key
			}
			else{
				//go to next screen for checkin 
			}
		};

		/**
		 * when the back button clicked
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			if($scope.pickupKeyDispenseMode){
				//go to previous screen for pickup key
			}
			else{
				//go to previous screen for checkin 
			}
		});

	}
]);