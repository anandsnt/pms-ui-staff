
sntRover.controller('contractStartCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
	    $scope.isDateSelected = false;
		var minDate, maxDate = '';
		
		if ($scope.contractData.mode === 'ADD') {
			minDate = $rootScope.businessDate;
			$scope.date = $scope.formData.startDate || $rootScope.businessDate;
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

				if ($scope.contractData.mode === 'ADD') {
					var myDate = tzIndependentDate($scope.date);

					$scope.formData.startDate = dateFilter(myDate, 'yyyy-MM-dd');
				};
				// if ($scope.contractList.isAddMode) {
				// // set end date as one day next to begin date
				// $scope.addData.begin_date = $scope.date;
				// var myDate = tzIndependentDate($scope.date);

				// myDate.setDate(myDate.getDate() + 1);
				// $scope.addData.end_date = dateFilter(myDate, 'yyyy-MM-dd');

				// }
				// else {

				// $scope.contractData.begin_date = $scope.date;
				// if (!($scope.contractData.begin_date < $scope.contractData.end_date)) {
				// 	// set end date as one day next to begin date
				// 	var myDate = tzIndependentDate($scope.date);

				// 	myDate.setDate(myDate.getDate() + 1);
				// 	$scope.contractData.end_date = dateFilter(myDate, 'yyyy-MM-dd');
				// }
				// }

				ngDialog.close();
	    	}

    	};
	};
	
	$scope.setUpData();

}]);