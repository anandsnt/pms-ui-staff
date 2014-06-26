
sntRover.controller('contractStartCalendarCtrl',['$rootScope','$scope','dateFilter','ngDialog',function($rootScope,$scope,dateFilter,ngDialog){
	$scope.setUpData = function(){
	    $scope.isDateSelected = false;
	    if($scope.contractList.isAddMode){
		    if($scope.addData.begin_date){
		      $scope.date = $scope.addData.begin_date;
		      $scope.isDateSelected = true;
		    }
		    else{
		      $scope.date = $rootScope.businessDate;
		    }
	    }
	    else{
	    	if($scope.contractData.begin_date){
		      $scope.date = $scope.contractData.begin_date;
		      $scope.isDateSelected = true;
		    }
		    else{
		      $scope.date = $rootScope.businessDate;
		    }
	    }
	    $scope.minDate = $rootScope.businessDate;
	    $scope.closePopupOnSelection = false;
	};
	$scope.setUpData();

	$scope.updateDate = function(){

	    if($scope.closePopupOnSelection && $scope.contractList.isAddMode){
	     	$scope.addData.begin_date = $scope.date;
	     	
     		var myDate = new Date($scope.date);
			myDate.setDate(myDate.getDate() + 1);
     		$scope.addData.end_date = dateFilter(myDate, 'yyyy-MM-dd'); 
	    }
	    else{
	    	$scope.contractData.begin_date = $scope.date;   
	    	if(!($scope.contractData.begin_date < $scope.contractData.end_date)){
	     		var myDate = new Date($scope.date);
				myDate.setDate(myDate.getDate() + 1);
	     		$scope.contractData.end_date = dateFilter(myDate, 'yyyy-MM-dd'); 
	     	}	
	    }

	    if($scope.closePopupOnSelection)
	    	ngDialog.close();

  	};

}]);