
sntRover.controller('contractedNightsCtrl',['$scope','dateFilter','ngDialog','RVCompanyCardSrv','$stateParams',function($scope,dateFilter,ngDialog,RVCompanyCardSrv,$stateParams){

	$scope.saveContractedNights = function(){
		console.log($scope.contractData);
		var saveContractSuccessCallback = function(data){
	    	$scope.$emit('hideLoader');
	    };
	  	var saveContractFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	    }; 
		$scope.invokeApi(RVCompanyCardSrv.updateNight,{ "account_id": $stateParams.id, "contract_id": $scope.contractSelected, "postData": $scope.contractData.occupancy}, saveContractSuccessCallback, saveContractFailureCallback);  
		ngDialog.close();
	};
	
	$scope.clickedCancel = function(){
		ngDialog.close();
	};
	
	$scope.updateAllNights = function(){
		angular.forEach($scope.contractData.occupancy,function(item, index) {
			item.contracted_occupancy = $scope.contractData.allNights;
       	});
	};
	
}]);