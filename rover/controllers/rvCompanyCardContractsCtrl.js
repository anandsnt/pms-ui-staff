sntRover.controller('companyCardContractsCtrl',['$scope', 'RVCompanyCardSrv', '$stateParams', function($scope, RVCompanyCardSrv, $stateParams){

	$scope.fetchData = function(){   
  	    var fetchSuccessCallback = function(data){
  	    	console.log("sucss");
  	    	console.log(data);
  	    	$scope.contractsData = data;
  	    	
  	    };
  	    var fetchFailureCallback = function(data){
  	        $scope.$emit('hideLoader');
  	    };
  	    $scope.invokeApi(RVCompanyCardSrv.fetchContracts,{},fetchSuccessCallback,fetchFailureCallback);  

    };
	$scope.fetchData();
}]);