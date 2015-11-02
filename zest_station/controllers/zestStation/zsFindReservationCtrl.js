sntZestStation.controller('zsFindReservationCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	function($scope, $state, zsModeConstants, zsEventConstants) {

	/**
	 * when we clicked on pickup key from home screen
	 */
	$scope.clickedOnPickUpKey = function() {
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.PICKUP_KEY_MODE
            });
	};

	/**
	 * when we clicked on checkin from home screen
	$scope.clickedOnCheckinButton = function() {
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.CHECKIN_MODE
            });
	};

	 * when we clicked on checkout from home screen
	 */
	$scope.clickedOnCheckoutButton = function() {
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.CHECKOUT_MODE
            });
	};

        $scope.findByDate = function(){
          //find-by-date  
        };
        $scope.findByEmail = function(){
          //find-by-email  
        };
        $scope.findByConfirmation = function(){
          //find-by-conf  
        };

        $scope.init = function(){
          $scope.at = 'find-reservation';  
          
          
          
        };

	/**
	 * [initializeMe description]
	 */
	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
                
                $scope.init();
	}();
}]);