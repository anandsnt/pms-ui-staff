sntRover.controller('contractEndCalendarCtrl',['$rootScope','$scope','dateFilter','ngDialog',function($rootScope,$scope,dateFilter,ngDialog){
	$scope.setUpData = function(){
		    
		if($scope.contractList.isAddMode){
  			$scope.date = $scope.addData.end_date;
	  	}
	  	else{
	  		if($scope.contractData.end_date){
	 	      	$scope.date = $scope.contractData.end_date;
		    }
		    else{
		    	var myDate = tzIndependentDate($rootScope.businessDate);
				myDate.setDate(myDate.getDate() + 1);
	     		$scope.date = dateFilter(myDate, 'yyyy-MM-dd'); 
		    	$scope.contractData.end_date = $scope.date;

		    }
	  	
	  	}
	  	$scope.dateOptions = {
		     changeYear: true,
		     changeMonth: true,
		    // minDate:  dateFilter(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
		     yearRange: "0:+10",
		     onSelect: function() {
		     	
			    if($scope.contractList.isAddMode){
			     	$scope.addData.end_date = $scope.date;
			    }
			    else{
			    	$scope.contractData.end_date = $scope.date;
			    } 
			        ngDialog.close();
			    }

    	}

	};
	$scope.setUpData();
	
}]);