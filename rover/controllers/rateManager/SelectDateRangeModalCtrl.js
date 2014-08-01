sntRover.controller('SelectDateRangeModalCtrl',['$scope','ngDialog','$filter','dateFilter','$rootScope', function($scope,  ngDialog, $filter, dateFilter,$rootScope){

	$scope.setUpData = function(){

		if($scope.currentFilterData.begin_date.length > 0){
			$scope.fromDate = $scope.currentFilterData.begin_date;
		}else{
			$scope.fromDate =tzIndependentDate($rootScope.businessDate);
		};
		if($scope.currentFilterData.end_date.length > 0){
			$scope.toDate = $scope.currentFilterData.end_date
		}
		else{
			$scope.toDate = tzIndependentDate($rootScope.businessDate);
		};
		

		$scope.fromDateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate($rootScope.businessDate),
			yearRange: "0:+10",
			onSelect: function() {

				if(tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)){
					$scope.toDate = $scope.fromDate;
				}
			}
		};

		$scope.toDateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate($rootScope.businessDate),
			yearRange: "0:+10",
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