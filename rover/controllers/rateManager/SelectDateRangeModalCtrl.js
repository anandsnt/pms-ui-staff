sntRover.controller('SelectDateRangeModalCtrl', ['filterDefaults', '$scope','ngDialog','$filter','dateFilter','$rootScope', 
	function(filterDefaults, $scope,  ngDialog, $filter, dateFilter, $rootScope) {
	'use strict';

	var filterData = $scope.currentFilterData,
		businessDate = tzIndependentDate($rootScope.businessDate),
		to_date = new Date(),
		from_date = new Date();

	$scope.setUpData = function() {
		//if($scope.currentFilterData.begin_date.length > 0){
		/*if(filterData.begin_date.length > 0) {}
			$scope.fromDate = filterData.begin_date; //$scope.currentFilterData.begin_date;
		} else {
			$scope.fromDate =tzIndependentDate($rootScope.businessDate);
		};
		if($scope.currentFilterData.end_date.length > 0){
			$scope.toDate = $scope.currentFilterData.end_date
		}
		else{
			$scope.toDate = tzIndependentDate($rootScope.businessDate);
		};*/
		
		filterData.begin_date = _.isEmpty(filterData.begin_date) ? dateFilter(new Date(from_date.setMonth(from_date.getMonth() - 1)), filterDefaults.UI_DATE_FORMAT) : tzIndependentDate(filterData.begin_date);
		filterData.end_date = _.isEmpty(filterData.end_date) ? dateFilter(new Date(to_date.setDate(to_date.getDate() + 1)), filterDefaults.UI_DATE_FORMAT) : tzIndependentDate(filterData.end_date);

		$scope.fromDateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: businessDate, //tzIndependentDate($rootScope.businessDate),
			yearRange: "-1:+10",
			onSelect: function() {
				/*if(tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)){
					$scope.toDate = $scope.fromDate;
				}*/
				if(tzIndependentDate(filterData.begin_date) > tzIndependentDate(filterData.end_date)) {
					filterData.end_date = filterData.begin_date;
				}
			}
		};

		$scope.toDateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: businessDate, //tzIndependentDate($rootScope.businessDate),
			yearRange: "-1:+10",
			onSelect: function() {
				/*if(tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)){
					$scope.fromDate = $scope.toDate;
				}*/
				if(tzIndependentDate(filterData.begin_date) > tzIndependentDate(filterData.end_date)) {
					filterData.begin_date = filterData.end_date;
				}
			}
		};

		$scope.errorMessage = '';
	};

	$scope.setUpData();

	$scope.updateClicked = function() {
		/*$scope.currentFilterData.begin_date = $scope.fromDate;
		$scope.currentFilterData.end_date = $scope.toDate;
		$scope.currentFilterData.selected_date_range = dateFilter($scope.currentFilterData.begin_date, 'MM-dd-yyyy') + " to " + dateFilter($scope.currentFilterData.end_date, 'MM-dd-yyyy');*/
		
		//filterData.begin_date = $scope.fromDate;
		//filterData.end_date = $scope.toDate;
		filterData.selected_date_range = dateFilter(filterData.begin_date, filterDefaults.DATE_FORMAT) + 
										 ' to ' + 
										 dateFilter(filterData.end_date, filterDefaults.DATE_FORMAT);

		ngDialog.close();
	};

	$scope.cancelClicked = function() {
		ngDialog.close();
	};
}]);