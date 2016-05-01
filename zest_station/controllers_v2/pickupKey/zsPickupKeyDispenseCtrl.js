sntZestStation.controller('zsPickupKeyDispenseCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$controller',
	function($scope, $stateParams, $state, zsEventConstants,$controller) {

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			$controller('zsKeyDispenseCtrl', {$scope: $scope});
		}();

		/**
		 * [Screen navigations]
		 */
		
		var navigateToNextScreen = function(){
		   
		};

		/**
		 * when the back button clicked
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			
		});

	}
]);