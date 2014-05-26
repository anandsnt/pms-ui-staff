
sntRover.controller('contractStartCalendarCtrl',['$scope','dateFilter','ngDialog',function($scope,dateFilter,ngDialog){
	
	$scope.setUpData = function(){
	    $scope.isDateSelected = false;
	    if($scope.isAddMode){
		    if($scope.addData.begin_date){
		      $scope.date = $scope.addData.begin_date;
		      $scope.isDateSelected = true;
		    }
		    else{
		      $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
		    }
	    }
	    else{
	    	if($scope.contractData.begin_date){
		      $scope.date = $scope.contractData.begin_date;
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
	     	$scope.addData.begin_date = $scope.date;
	    }
	    else{
	    	$scope.contractData.begin_date = $scope.date;   	
	    }

	    if($scope.closePopupOnSelection)
	    	ngDialog.close();

  	};

}]);