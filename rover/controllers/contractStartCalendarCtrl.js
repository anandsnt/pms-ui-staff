
sntRover.controller('contractStartCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
	    $scope.isDateSelected = false;
	    var minDate, maxDate = '';

	    if ($scope.contractList.isAddMode) {
		    if ($scope.addData.begin_date) {
		      $scope.date = $scope.addData.begin_date;
		      minDate = $scope.addData.begin_date;
	 	      maxDate = $scope.addData.end_date;
		    }
	    }
	    else {
	    	if ($scope.contractData.begin_date) {
		      $scope.date = $scope.contractData.begin_date;
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
			     	// set end date as one day next to begin date
			     	$scope.addData.begin_date = $scope.date;
		     		var myDate = tzIndependentDate($scope.date);

					myDate.setDate(myDate.getDate() + 1);
		     		$scope.addData.end_date = dateFilter(myDate, 'yyyy-MM-dd');

			     }
			     else {

			    	$scope.contractData.begin_date = $scope.date;
			    	if (!($scope.contractData.begin_date < $scope.contractData.end_date)) {
			     		// set end date as one day next to begin date
			     		var myDate = tzIndependentDate($scope.date);

						myDate.setDate(myDate.getDate() + 1);
			     		$scope.contractData.end_date = dateFilter(myDate, 'yyyy-MM-dd');
			     	}
			     }

			     ngDialog.close();
	     }

    	};
	};
	$scope.setUpData();


}]);