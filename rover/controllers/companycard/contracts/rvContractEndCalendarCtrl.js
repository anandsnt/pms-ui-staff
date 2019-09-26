sntRover.controller('rvContractEndCalendarCtrl', ['$rootScope', '$scope', 'dateFilter', 'ngDialog', function($rootScope, $scope, dateFilter, ngDialog) {
	$scope.setUpData = function() {
		/**
		 * Set the min date to business date initially
		 * For add mode check if there is a start date else stick to the business date
		 */
		var minDate = tzIndependentDate($rootScope.businessDate);

		if ($scope.contractData.mode === 'ADD') {
			minDate = $scope.addData.startDate ? tzIndependentDate($scope.addData.startDate) :
					minDate;
		}
		else if ($scope.contractData.mode === 'EDIT') {
			minDate = $scope.contractData.editData && $scope.contractData.editData.begin_date ?
					tzIndependentDate($scope.contractData.editData.begin_date) :
					minDate
		}
		// Increment the minDate by 1 day as startDate can not be equal to endDate
		minDate.setDate(minDate.getDate() + 1);
		
		/**
		 * If there is a selected endDate in either cases pick that
		 * or the minDate as the active date to be displayed
		 */
		if ($scope.contractData.mode === 'ADD') {
			var date = $scope.addData.endDate ? tzIndependentDate($scope.addData.endDate) : minDate;
			$scope.date = date;
		}
		else if ($scope.contractData.mode === 'EDIT') {
			if (!_.isEmpty($scope.contractData.editData)) {
				var date = $scope.contractData.editData.end_date ? tzIndependentDate($scope.contractData.editData.end_date) : minDate;
				$scope.date = date;
			}
			else {
				$scope.date = minDate;
			}
		}

	  	$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: minDate,
			yearRange: "0:+10",
			onSelect: function() {
				/**
				 * Set the selected date as the endDate for the forms
				 */
				var endDate = tzIndependentDate($scope.date);

				if ($scope.contractData.mode === 'ADD') {
					$scope.addData.endDate = dateFilter(endDate, 'yyyy-MM-dd');
				}
				else if ($scope.contractData.mode === 'EDIT') {
					$scope.contractData.editData.end_date = dateFilter(endDate, 'yyyy-MM-dd');
				}
				
				ngDialog.close();
			}
    	};
	};
	
	$scope.setUpData();

}]);