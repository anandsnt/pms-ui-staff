sntRover.controller('companyCardDetailsController',['$scope', 'RVCompanyCardSrv', '$stateParams', function($scope, RVCompanyCardSrv, $stateParams){
	//setting the heading of the screen
	$scope.heading = "Company Card";	

	//inheriting some useful things
	BaseCtrl.call(this, $scope);

	//scope variable for tab navigation, based on which the tab will appear
	$scope.currentSelectedTab = 'cc-contact-info'; //initially contact information is active

	/**
	* function to switch to new tab, will set $scope.currentSelectedTab to param variable
	* @param{string} is the value of that tab
	*/
	$scope.switchTabTo = function(tabToSwitch){
		$scope.currentSelectedTab = tabToSwitch;		
	}

	/**
	* success callback of initial fetch data
	*/
	var successCallbackOfInitialFetch = function(data){
		$scope.$emit("hideLoader");
		$scope.contactInformation = data.account_info;
	}

	//getting the contact information
	var id = $stateParams.id;
	var data = {'id': id};
	$scope.invokeApi(RVCompanyCardSrv.fetchContactInformation, data, successCallbackOfInitialFetch);
		



}]);