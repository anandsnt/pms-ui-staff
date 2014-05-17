
sntRover.controller('contractStartCalendarCtrl',['$scope','dateFilter','ngDialog',function($scope,dateFilter,ngDialog){

	$scope.setUpData = function(){
	
	    $scope.isDateSelected = false;
	
	    if($scope.contractData.begin_date!= null){
	      $scope.date = $scope.contractData.begin_date;
	      $scope.isDateSelected = true;
	    }
	    else{
	      $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
	    }
	  
	    $scope.maxDate =dateFilter(new Date(), 'yyyy-MM-dd');
		//data for the year dropdown
	    var presentDate = new Date();
	    $scope.endYear = presentDate.getFullYear();
	    $scope.startYear = $scope.endYear-100;
	    $scope.closePopupOnSelection = false;
	};
	$scope.setUpData();
	
	$scope.$watch('date',function(){
	  if($scope.closePopupOnSelection){
	    $scope.contractData.begin_date = $scope.date;
	    ngDialog.close();
	  }
	});

}]);