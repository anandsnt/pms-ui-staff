
sntRover.controller('contractEndCalendarCtrl',['$scope','dateFilter','ngDialog',function($scope,dateFilter,ngDialog){
	
	$scope.setUpData = function(){
	
	    $scope.isDateSelected = false;
		if($scope.isAddMode){
		    if($scope.addData.end_date){
		      $scope.date = $scope.addData.end_date;
		      $scope.isDateSelected = true;
		    }
		    else{
		      $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
		    }
	  	}
	  	else{
	  		if($scope.contractData.end_date){
		      $scope.date = $scope.contractData.end_date;
		      $scope.isDateSelected = true;
		    }
		    else{
		      $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
		    }
	  	
	  	}
	    $scope.closePopupOnSelection = false;
	};
	$scope.setUpData();
	
	$scope.updateDate = function(){

	    if($scope.closePopupOnSelection && $scope.isAddMode){
	     	$scope.addData.end_date = $scope.date;
	    }
	    else{
	    	$scope.contractData.end_date = $scope.date;
	    } 
	     if($scope.closePopupOnSelection)
	    	ngDialog.close();


  	};

}]);