
sntRover.controller('contractEndCalendarCtrl',['$rootScope','$scope','dateFilter','ngDialog',function($rootScope,$scope,dateFilter,ngDialog){
	$scope.setUpData = function(){
	
	    $scope.isDateSelected = false;
	    
		if($scope.contractList.isAddMode){
			
	    	var myDate = new Date($scope.addData.begin_date);
			myDate.setDate(myDate.getDate() + 1);
  			$scope.minDate = dateFilter(myDate, 'yyyy-MM-dd');
  			$scope.date = $scope.addData.end_date;
  			$scope.isDateSelected = true;
	  	}
	  	else{
	  		if($scope.contractData.end_date){
	  			
	  			var myDate = new Date($scope.contractData.begin_date);
				myDate.setDate(myDate.getDate() + 1);
	  			$scope.minDate = dateFilter(myDate, 'yyyy-MM-dd');
	  			
		      	$scope.date = $scope.contractData.end_date;
		      	$scope.isDateSelected = true;
		    }
		    else{
		    	var myDate = new Date($rootScope.businessDate);
				myDate.setDate(myDate.getDate() + 1);
				$scope.minDate = dateFilter(myDate, 'yyyy-MM-dd');
				
	     		$scope.date = dateFilter(myDate, 'yyyy-MM-dd'); 
		    	$scope.contractData.end_date = $scope.date;
		      	$scope.isDateSelected = true;
		    }
	  	
	  	}
	    $scope.closePopupOnSelection = false;
	};
	$scope.setUpData();
	
	$scope.updateDate = function(){

	    if($scope.closePopupOnSelection && $scope.contractList.isAddMode){
	     	$scope.addData.end_date = $scope.date;
	    }
	    else{
	    	$scope.contractData.end_date = $scope.date;
	    } 
	     if($scope.closePopupOnSelection)
	    	ngDialog.close();

  	};

}]);