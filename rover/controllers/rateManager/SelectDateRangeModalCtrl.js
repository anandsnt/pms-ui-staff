sntRover.controller('SelectDateRangeModalCtrl',['$scope','ngDialog','$filter','dateFilter','$rootScope', function($scope,  ngDialog, $filter, dateFilter,$rootScope){
	$s = $scope;
	$scope.setUpData = function(){

		if($scope.currentFilterData.begin_date){
			$scope.fromDate = $scope.currentFilterData.begin_date;
		} else {
			//From date is set as the current business date if date is not previousely selected
			$scope.fromDate = $rootScope.businessDate;
		}
		if($scope.currentFilterData.end_date){
			$scope.toDate = $scope.currentFilterData.end_date
		} else {
			//To date will be the 1st of next month if it is not previousely set
			var now = tzIndependentDate($rootScope.businessDate);
			var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
			$scope.toDate = $filter('date')(current, $rootScope.dateFormatForAPI);
		}

		$scope.fromDateOptions = {
			firstDay: 1,
			changeYear: true,
			changeMonth: true,
			yearRange: "-5:+5", //Show 5 years in past & 5 years in future
			defaultDate: "2014-09-03",
			onSelect: function() {
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
			defaultDate: "2014-09-04",
			onSelect: function() {

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