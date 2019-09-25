sntRover.controller('rvContractEndCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
		var maxDate = '',
			minDate = tzIndependentDate($rootScope.businessDate);

		minDate.setDate(minDate.getDate() + 1)
			

		if ($scope.contractData.mode === 'ADD') {
			minDate = $scope.formData.startDate ? tzIndependentDate($scope.formData.startDate) : minDate;
			$scope.date = $scope.formData.endDate || minDate;
		} else if ($scope.contractData.mode === 'EDIT') {
			if (!_.isEmpty($scope.contractData.editData)) {
				minDate = $scope.contractData.editData.endDate ? tzIndependentDate($scope.contractData.editData.endDate) : minDate;
				$scope.date = $scope.contractData.editData.end_date || minDate;
			} else {
				$scope.date = minDate;
			}
		}

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
					beginDate = $scope.formData.startDate ? tzIndependentDate($scope.formData.startDate) : tzIndependentDate($scope.date)
				} else if ($scope.contractData.mode === 'EDIT') {
					beginDate = $scope.contractData.editData.begin_date ? tzIndependentDate($scope.contractData.editData.begin_date) : tzIndependentDate($scope.date);
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