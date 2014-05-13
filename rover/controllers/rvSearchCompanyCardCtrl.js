sntRover.controller('searchCompanyCardController',['$scope', 'RVCompanyCardSearchSrv', '$stateParams', function($scope, RVCompanyCardSearchSrv, $stateParams){

	BaseCtrl.call(this, $scope);

	var successCallBackofInitialFetch = function(data){
		$scope.$emit("hideLoader");
		$scope.results = data;
	}

  	/**
  	* function to perform initial actions like setting heading, call webservice..
  	*/
  	var performInitialActions = function(){
		//setting the page's heading
		$scope.heading = "Find Card";
		//calling the webservice
		$scope.invokeApi(RVCompanyCardSearchSrv.fetch, {}, successCallBackofInitialFetch); 
  	}

  	performInitialActions();

}]);