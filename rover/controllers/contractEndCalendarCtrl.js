
sntRover.controller('contractEndCalendarCtrl',['$scope','dateFilter','ngDialog',function($scope,dateFilter,ngDialog){
	
	$scope.setUpData = function(){
	
	    $scope.isDateSelected = false;
	
	    if($scope.contractData.end_date!= null){
	      $scope.date = $scope.contractData.end_date;
	      $scope.isDateSelected = true;
	    }
	    else{
	      $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
	    }
	  
	    $scope.maxDate =dateFilter(new Date(), 'yyyy-MM-dd');
	    $scope.closePopupOnSelection = false;
	};
	$scope.setUpData();
	
	$scope.updateDate = function(){

	    if($scope.closePopupOnSelection){
	     $scope.contractData.end_date = $scope.date;
		    ngDialog.close();
	    };  

  	};

}]);