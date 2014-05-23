
sntRover.controller('contractedNightsCtrl',['$scope','dateFilter','ngDialog','RVCompanyCardSrv','$stateParams',function($scope,dateFilter,ngDialog,RVCompanyCardSrv,$stateParams){
	BaseCtrl.call(this, $scope);
	
		
	var first_date = new Date($scope.contractData.begin_date);
	var last_date = new Date($scope.contractData.end_date);
	var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	
	var new_occupancy =[];
	for(var j=first_date.getFullYear(); j<= last_date.getFullYear(); j++){
		for(var i=first_date.getMonth() ; i<=last_date.getMonth(); i++){
			var obj = {
				"contracted_occupancy": 0,
				"year" : j,
				"actual_occupancy": 0,
				"month" : month[i]
			};
			new_occupancy.push(obj);
		}
	}

	if(!$scope.isAddMode){
		angular.forEach($scope.contractData.occupancy,function(item, index) {
				angular.forEach(new_occupancy,function(item2, index2) {
					if((item2.year == item.year) && (item2.month == item.month)){
						item2.contracted_occupancy = item.contracted_occupancy;
						item2.actual_occupancy = item.actual_occupancy;
					}
	    		});
	    });
	    $scope.contractData.occupancy = new_occupancy;
   	}
   	else{
   		$scope.addData.occupancy = [];
   		$scope.addData.occupancy = new_occupancy;
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