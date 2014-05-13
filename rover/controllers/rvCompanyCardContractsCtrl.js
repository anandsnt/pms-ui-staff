sntRover.controller('companyCardContractsCtrl',['$scope', 'companyCardContractsSrv', '$stateParams', function($scope, companyCardContractsSrv, $stateParams){
	
	
	$scope.fetchData = function(){   
  	    var fetchSuccessCallback = function(data){
  	    	console.log("sucss");
  	    	console.log(data);
  	    	
  	    };
  	    var fetchFailureCallback = function(data){
  	        $scope.$emit('hideLoader');
  	    };
  	    $scope.invokeApi(companyCardContractsSrv.fetch,{},fetchSuccessCallback,fetchFailureCallback);  

    };
	$scope.fetchData();
}]);