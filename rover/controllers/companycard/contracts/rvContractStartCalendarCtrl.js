
sntRover.controller('rvContractStartCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
	    $scope.isDateSelected = false;
		var minDate = '';

		minDate = $rootScope.businessDate;
		
		if ($scope.contractData.mode === 'ADD') {
			$scope.date = $scope.formData.startDate || minDate;
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
				
				if ($scope.contractData.mode === 'ADD') {
					endDate = $scope.formData.endDate ? tzIndependentDate($scope.formData.endDate) : tzIndependentDate($scope.date);
				}
				else if ($scope.contractData.mode === 'EDIT') {
					endDate = $scope.contractData.editData.end_date ? tzIndependentDate($scope.contractData.editData.end_date) : tzIndependentDate($scope.date);
				}

				if (beginDate >= endDate) {
					endDate.setDate(beginDate.getDate() + 1);
				}

				if ($scope.contractData.mode === 'ADD') {
					$scope.formData.startDate = dateFilter(beginDate, 'yyyy-MM-dd');
					$scope.formData.endDate = dateFilter(endDate, 'yyyy-MM-dd');
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