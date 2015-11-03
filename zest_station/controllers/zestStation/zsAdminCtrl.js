sntZestStation.controller('zsAdminCtrl', [
	'$scope',
	'$state','zsEventConstants',
	function($scope, $state,zsEventConstants) {

	BaseCtrl.call(this, $scope);

	// initialize

	var initialize = function(){
		//show back button
		$scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);

		$scope.modalBtn1   = 'LOGIN';
        $scope.modalBtn2   = 'Exit';
        $scope.at 		   = 'admin-login-screen';
        $scope.headingText = 'Administrator';
	}();

	/**
	 * when we clicked on exit button
	 */
	$scope.navToPrev = function(){
		$state.go ('zest_station.home');
	};
	
	
}]);