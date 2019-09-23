
sntRover.controller('rvContractStartCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
	    $scope.isDateSelected = false;
		var minDate, maxDate = '';

		minDate = $rootScope.businessDate;
		
		if ($scope.contractData.mode === 'ADD') {
			$scope.date = $scope.formData.startDate || minDate;
		} else if ($scope.contractData.mode === 'EDIT') {
			if (!_.isEmpty($scope.contractData.editData)) {
				$scope.date = $scope.contractData.editData.begin_date;
			}
		};

	    // if ($scope.contractList.isAddMode) {
	    //   	$scope.date = $scope.addData.begin_date;
	    //   	minDate = $scope.addData.min_date;
 	    //   	maxDate = $scope.addData.max_date;
	    // }
	    // else {
	    // 	if ($scope.contractData.begin_date) {
		//       $scope.date = $scope.contractData.begin_date;
		//       minDate = $scope.contractData.min_date;
	 	//       maxDate = $scope.contractData.max_date;
		//     }
		//     else {
		//     	// set start date as bussiness date
		//     	var myDate = tzIndependentDate($rootScope.businessDate);

	    //  		$scope.date = dateFilter(myDate, 'yyyy-MM-dd');
		//     	$scope.contractData.begin_date = $scope.date;
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
				var endDate;
				var beginDate = tzIndependentDate($scope.date);
				
				if ($scope.contractData.mode === 'ADD') {
					endDate = tzIndependentDate($scope.formData.endDate) || beginDate;
				} else if ($scope.contractData.mode === 'EDIT') {
					endDate = tzIndependentDate($scope.contractData.editData.end_date) || beginDate;
				}
				if (beginDate >= endDate) {
					endDate.setDate(beginDate.getDate() + 1);
				}
				if ($scope.contractData.mode === 'ADD') {
					$scope.formData.startDate = dateFilter(beginDate, 'yyyy-MM-dd');
					$scope.formData.endDate = dateFilter(endDate, 'yyyy-MM-dd');
				} else if ($scope.contractData.mode === 'EDIT') {
					$scope.contractData.editData.begin_date = dateFilter(beginDate, 'yyyy-MM-dd');
					$scope.contractData.editData.end_date = dateFilter(endDate, 'yyyy-MM-dd');
				};

				ngDialog.close();
	    	}
    	};
	};
	
	$scope.setUpData();

}]);