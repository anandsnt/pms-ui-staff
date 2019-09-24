sntRover.controller('rvContractEndCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
		var minDate, maxDate = '';

		if ($scope.contractData.mode === 'ADD') {
			minDate = $rootScope.businessDate;
			$scope.date = $scope.formData.endDate || $rootScope.businessDate;
		}

		// if ($scope.contractList.isAddMode) {
  		// 	$scope.date = $scope.addData.end_date;
  		// 	minDate = $scope.addData.min_date;
  		// 	maxDate = $scope.addData.max_date;
	  	// }
	  	// else {
	  	// 	if ($scope.contractData.end_date) {
	 	//       	$scope.date = $scope.contractData.end_date;
	 	//       	minDate = $scope.contractData.min_date;
	 	//       	maxDate = $scope.contractData.max_date;
		//     }
		//     else {
		//     	// set end date as one day next to bussiness date
		//     	var myDate = tzIndependentDate($rootScope.businessDate);

		// 		myDate.setDate(myDate.getDate() + 1);
	    //  		$scope.date = dateFilter(myDate, 'yyyy-MM-dd');
		//     	$scope.contractData.end_date = $scope.date;
		//     	minDate = $scope.contractData.min_date;
		//     	maxDate = $scope.contractData.max_date;
		//     }
	  	// }

	  	$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate(minDate),
			maxDate: tzIndependentDate(maxDate),
			yearRange: "0:+10",
			onSelect: function() {

				if ($scope.contractData.mode === 'ADD') {
					var myDate = tzIndependentDate($scope.date);

					$scope.formData.endDate = dateFilter(myDate, 'yyyy-MM-dd');
				}
				
				ngDialog.close();
			}
    	};
	};
	
	$scope.setUpData();

}]);