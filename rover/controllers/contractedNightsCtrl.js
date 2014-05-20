
sntRover.controller('contractedNightsCtrl',['$scope','dateFilter','ngDialog','RVCompanyCardSrv','$stateParams',function($scope,dateFilter,ngDialog,RVCompanyCardSrv,$stateParams){
	BaseCtrl.call(this, $scope);
	var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	if($scope.contractData.occupancy.length == 0){
		for(var i=0;i<12;i++){
			var obj = {
				"contracted_occupancy" : 0,
				"year" : new Date().getFullYear().toString(),
				"actual_occupancy" : 0,
				"month" : month[i]
			};
			$scope.contractData.occupancy.push(obj);
		}
	}
		
	$scope.saveContractedNights = function(){
		
		var saveContractSuccessCallback = function(data){
			console.log("success");
	    	$scope.$emit('hideLoader');
	    };
	  	var saveContractFailureCallback = function(data){
	  		console.log("failure");
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
	    };
	    var data = {"occupancy": $scope.contractData.occupancy};
		$scope.invokeApi(RVCompanyCardSrv.updateNight,{ "account_id": $stateParams.id, "contract_id": $scope.contractSelected, "postData": data }, saveContractSuccessCallback, saveContractFailureCallback);  
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