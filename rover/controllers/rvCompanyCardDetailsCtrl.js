sntRover.controller('companyCardDetailsController',['$scope', 'RVSearchSrv', '$stateParams', function($scope, RVSearchSrv, $stateParams){
	//setting the heading of the screen
	$scope.heading = "Company Card";	

	//scope variable for tab navigation, based on which the tab will appear
	$scope.currentSelectedTab = 'cc-contact-info'; //initially contact information is active

	/**
	* function to switch to new tab, will set $scope.currentSelectedTab to param variable
	* @param{string} is the value of that tab
	*/
	$scope.switchTabTo = function(tabToSwitch){
		$scope.currentSelectedTab = tabToSwitch;		
	}

	

}]);