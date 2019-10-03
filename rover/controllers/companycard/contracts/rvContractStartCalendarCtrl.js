
sntRover.controller('rvContractStartCalendarCtrl', ['$rootScope', '$scope', 'ngDialog', function($rootScope, $scope, ngDialog) {
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
					beginDate = moment($scope.date);
				// Above, set the selected date as the beginDate for the form

				/**
				 * EndDate can not be same as the start date
				 * So pick the end date in either cases, if any, else stick with the selected date
				 * 
				 * Applying tzIndependentDate on $scope.date again is to
				 * avoid making the beginDate and endDate "Objects" same - two variables for same memory
				 */
				if ($scope.contractData.mode === 'ADD') {
					endDate = $scope.addData.endDate ? moment($scope.addData.endDate) : moment($scope.date);
				}
				else if ($scope.contractData.mode === 'EDIT') {
					endDate = $scope.contractData.editData.end_date ? moment($scope.contractData.editData.end_date) : moment($scope.date);
				}

				/**
				 * endDate should always be minimum 1 day greater that beginDate
				 * If it's not, make it.
				 */
				if (beginDate >= endDate) {
					endDate = moment($scope.date).add(1, 'days');
				}

				if ($scope.contractData.mode === 'ADD') {
					$scope.addData.startDate = beginDate.format('YYYY-MM-DD');
					$scope.addData.endDate = endDate.format('YYYY-MM-DD');
				}
				else if ($scope.contractData.mode === 'EDIT') {
					$scope.contractData.editData.begin_date = beginDate.format('YYYY-MM-DD');
					$scope.contractData.editData.end_date = endDate.format('YYYY-MM-DD');
				}

				ngDialog.close();
			}
    	};
	};
	
	$scope.setUpData();

}]);