sntRover.controller('rvContractEndCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
		var maxDate = '',
			minDate = tzIndependentDate($rootScope.businessDate);

		minDate.setDate(minDate.getDate() + 1)
			

		if ($scope.contractData.mode === 'ADD') {
			$scope.date = $scope.formData.endDate || minDate;
		} else if ($scope.contractData.mode === 'EDIT') {
			if (!_.isEmpty($scope.contractData.editData)) {
				$scope.date = $scope.contractData.editData.end_date || minDate;
			}
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
				var endDate = tzIndependentDate($scope.date),
					beginDate;

				if ($scope.contractData.mode === 'ADD') {
					beginDate = tzIndependentDate($scope.formData.startDate) || endDate
				} else if ($scope.contractData.mode === 'EDIT') {
					beginDate = tzIndependentDate($scope.contractData.editData.begin_date);
				};

				if (endDate <= beginDate) {
					beginDate.setDate(beginDate.getDate() - 1);
				};

				if ($scope.contractData.mode === 'ADD') {
					$scope.formData.endDate = dateFilter(endDate, 'yyyy-MM-dd');
					$scope.formData.beginDate = dateFilter(beginDate, 'yyyy-MM-dd');
				} else if ($scope.contractData.mode === 'EDIT') {
					$scope.contractData.editData.end_date = dateFilter(endDate, 'yyyy-MM-dd');
					$scope.contractData.editData.begin_date = dateFilter(beginDate, 'yyyy-MM-dd');
				};
				
				ngDialog.close();
			}
    	};
	};
	
	$scope.setUpData();

}]);