
sntRover.controller('rvContractStartCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
	    $scope.isDateSelected = false;
		var minDate = '';

		/**
		 * We need the businessDate as the min date,
		 * irrespective of whether a startDate exists or not
		 */
		minDate = $rootScope.businessDate;
		/**
		 * Select the date to be displayed as the start date in the form, if any
		 * else stick with the minDate
		 */
		if ($scope.contractData.mode === 'ADD') {
			$scope.date = $scope.addData.startDate || minDate;
		}
		else if ($scope.contractData.mode === 'EDIT') {
			if (!_.isEmpty($scope.contractData.editData)) {
				$scope.date = $scope.contractData.editData.begin_date || minDate;
			}
			else {
				$scope.date = minDate;
			}
		}

	    $scope.dateOptions = {
		     changeYear: true,
		     changeMonth: true,
		     minDate: tzIndependentDate(minDate),
		     yearRange: "0:+10",
		     onSelect: function() {
				var endDate,
					beginDate = tzIndependentDate($scope.date);
				// Above, set the selected date as the beginDate for the form

				/**
				 * EndDate can not be same as the start date
				 * So pick the end date in either cases, if any, else stick with the selected date
				 * 
				 * Applying tzIndependentDate on $scope.date again is to
				 * avoid making the beginDate and endDate "Objects" same - two variables for same memory
				 */
				if ($scope.contractData.mode === 'ADD') {
					endDate = $scope.addData.endDate ? tzIndependentDate($scope.addData.endDate) : tzIndependentDate($scope.date);
				}
				else if ($scope.contractData.mode === 'EDIT') {
					endDate = $scope.contractData.editData.end_date ? tzIndependentDate($scope.contractData.editData.end_date) : tzIndependentDate($scope.date);
				}

				/**
				 * endDate should always be minimum 1 day greater that beginDate
				 * If it's not, make it.
				 */
				if (beginDate >= endDate) {
					endDate.setDate(beginDate.getDate() + 1);
				}

				if ($scope.contractData.mode === 'ADD') {
					$scope.addData.startDate = dateFilter(beginDate, 'yyyy-MM-dd');
					$scope.addData.endDate = dateFilter(endDate, 'yyyy-MM-dd');
				}
				else if ($scope.contractData.mode === 'EDIT') {
					$scope.contractData.editData.begin_date = dateFilter(beginDate, 'yyyy-MM-dd');
					$scope.contractData.editData.end_date = dateFilter(endDate, 'yyyy-MM-dd');
				}

				ngDialog.close();
	    	}
    	};
	};
	
	$scope.setUpData();

}]);