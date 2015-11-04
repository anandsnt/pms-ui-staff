sntZestStation.controller('zsAdminCtrl', [
	'$scope',
	'$state','zsEventConstants',
	function($scope, $state,zsEventConstants) {

	BaseCtrl.call(this, $scope);

	var hideNavButtons = function(){
		//hide back button
		$scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);

		//hide close button
		$scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
	}
	var showNavButtons = function(){
		//show back button
		$scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
	}

	// initialize

	var initialize = function(){	
		$scope.input = {"inputTextValue" : ""};
		$scope.userName = "";
		$scope.passWord = "";
		hideNavButtons();
        //mode
        $scope.mode        = 'options-mode';
	};
	initialize();

	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
		initialize();
	});

	/**
	 * when we clicked on exit button
	 */
	$scope.navToPrev = function(){
		$state.go ('zest_station.home');
	};


	$scope.loginAdmin = function(){
		$scope.mode   = "admin-name-mode";
		$scope.headingText = 'Admin Username';
		showNavButtons();
	};

	$scope.goToNext  = function(){
		if($scope.mode   === "admin-name-mode"){
			$scope.userName = angular.copy($scope.input.inputTextValue);
			$scope.input.inputTextValue = "";
			$scope.mode   = "admin-password-mode";
			$scope.headingText = 'Admin Password';
		}
		else{
			$scope.passWord = angular.copy($scope.input.inputTextValue);
			console.log($scope.userName + $scope.passWord)
			$state.go('zest_station.home-admin',{'isadmin':true});
		}
	};
	
	
}]);