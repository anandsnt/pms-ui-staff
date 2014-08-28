sntRover.controller('SelectDateRangeModalCtrl',['$scope','ngDialog','$filter','dateFilter','$rootScope', function($scope,  ngDialog, $filter, dateFilter,$rootScope){
	$scope.setUpData = function(){
		
		var now = tzIndependentDate($rootScope.businessDate);
		if($scope.currentFilterData.begin_date){
			$scope.fromDate = $scope.currentFilterData.begin_date;
		} else {
			//We need to default from calendar to the month of current business date
			//Do not default the date
			var fromDateOffset = (new Date().getMonth()) - now.getMonth();
		}
		if($scope.currentFilterData.end_date){
			$scope.toDate = $scope.currentFilterData.end_date;
		} else {
			//we need to default the to calendar to the next month of current businsess date
			var toDateOffset = (new Date().getMonth()) - now.getMonth() - 1;
		}

		$scope.fromDateOptions = {
			firstDay: 1,
			changeYear: true,
			changeMonth: true,
			yearRange: "-5:+5", //Show 5 years in past & 5 years in future
			showCurrentAtPos: fromDateOffset,
			onSelect: function(dateText, datePicker) {
				datePicker.drawMonth += fromDateOffset;
				if(tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)){
					$scope.toDate = $scope.fromDate;
				}
			}
		};

		$scope.toDateOptions = {
			firstDay: 1,
			changeYear: true,
			changeMonth: true,
			yearRange: "-5:+5",
			showCurrentAtPos: toDateOffset,
			onSelect: function(dateText, datePicker) {
				datePicker.drawMonth += toDateOffset;
				if(tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)){
					$scope.fromDate = $scope.toDate;
				}
			}
		};

		$scope.errorMessage='';
	};

	$scope.setUpData();
	$scope.updateClicked = function(){
		$scope.currentFilterData.begin_date = $scope.fromDate;
		$scope.currentFilterData.end_date = $scope.toDate;
		$scope.currentFilterData.selected_date_range = dateFilter($scope.currentFilterData.begin_date, 'MM-dd-yyyy') + " to " + dateFilter($scope.currentFilterData.end_date, 'MM-dd-yyyy');
		ngDialog.close();
	};
	$scope.cancelClicked = function(){
		ngDialog.close();
	};

}]);