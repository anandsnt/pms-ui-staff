
sntRover.controller('contractedNightsCtrl',['$scope','dateFilter','ngDialog','RVCompanyCardSrv','$stateParams',function($scope,dateFilter,ngDialog,RVCompanyCardSrv,$stateParams){
	BaseCtrl.call(this, $scope);
	
	if($scope.isAddMode){
		$scope.addData.occupancy = [];
		var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		for(var i=0;i<12;i++){
			var obj = {
				"contracted_occupancy" : 0,
				"year" : new Date().getFullYear().toString(),
				"actual_occupancy" : 0,
				"month" : month[i]
			};
			$scope.addData.occupancy.push(obj);
		}
	}
		
	$scope.saveContractedNights = function(){
		
		var saveContractSuccessCallback = function(data){
	    	$scope.closeActivityIndication();
	    };
	  	var saveContractFailureCallback = function(data){
	  		$scope.closeActivityIndication();
	        $scope.errorMessage = data;
	    };
	    if($scope.isAddMode){
	    	var data = {"occupancy": $scope.addData.occupancy};
	    }
	    else{
	    	var data = {"occupancy": $scope.contractData.occupancy};
	    }
		$scope.invokeApi(RVCompanyCardSrv.updateNight,{ "account_id": $stateParams.id, "contract_id": $scope.contractSelected, "postData": data }, saveContractSuccessCallback, saveContractFailureCallback);  
		ngDialog.close();
	};
	
	$scope.clickedCancel = function(){
		ngDialog.close();
	};
	
	$scope.updateAllNights = function(){
		if($scope.isAddMode){
			angular.forEach($scope.addData.occupancy,function(item, index) {
				item.contracted_occupancy = $scope.addData.allNights;
	       	});
       	}
       	else{
       		angular.forEach($scope.contractData.occupancy,function(item, index) {
				item.contracted_occupancy = $scope.contractData.allNights;
	       	});
       	}
	};
	
}]);