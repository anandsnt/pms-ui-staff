sntRover.controller('contractEndCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
		var minDate, maxDate = '';

		if ($scope.contractList.isAddMode) {
  			$scope.date = $scope.addData.end_date;
  			minDate = $scope.addData.begin_date;
  			maxDate = $scope.addData.end_date;
	  	}
	  	else {
	  		if ($scope.contractData.end_date) {
	 	      	$scope.date = $scope.contractData.end_date;
	 	      	minDate = $scope.contractData.begin_date;
	 	      	maxDate = $scope.contractData.end_date;
		    }
		    else {
		    	// set end date as one day next to bussiness date
		    	var myDate = tzIndependentDate($rootScope.businessDate);

				myDate.setDate(myDate.getDate() + 1);
	     		$scope.date = dateFilter(myDate, 'yyyy-MM-dd');
		    	$scope.contractData.end_date = $scope.date;
		    	minDate = $scope.contractData.begin_date;
		    	maxDate = $scope.contractData.end_date;
		    }

	  	}
	  	$scope.dateOptions = {
		     changeYear: true,
		     changeMonth: true,
		     minDate: tzIndependentDate(minDate),
		     maxDate: tzIndependentDate(maxDate),
		     yearRange: "0:+10",
		     onSelect: function() {

			    if ($scope.contractList.isAddMode) {
			     	$scope.addData.end_date = $scope.date;
			    }
			    else {
			    	$scope.contractData.end_date = $scope.date;
			    }
			        ngDialog.close();
			    }

    	};

	};
	$scope.setUpData();

}]);