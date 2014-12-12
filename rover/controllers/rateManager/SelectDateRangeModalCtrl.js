sntRover.controller('SelectDateRangeModalCtrl', ['filterDefaults', '$scope','ngDialog','$filter','dateFilter','$rootScope', 
	function(filterDefaults, $scope,  ngDialog, $filter, dateFilter, $rootScope) {
	'use strict';

	var filterData = $scope.currentFilterData,
		businessDate = tzIndependentDate($rootScope.businessDate),
		defaultDate = tzIndependentDate(Date.now()),
		fromDate = _.isEmpty(filterData.begin_date) ? '' : filterData.begin_date,
		toDate = _.isEmpty(filterData.end_date) ? '' : filterData.end_date;

	$scope.setUpData = function() {		
		$scope.fromDate = fromDate;
		$scope.toDate = toDate;

		$scope.fromDateOptions = {
			firstDay: 1,
			changeYear: true,
			changeMonth: true,
			yearRange: "-5:+5", //Show 5 years in past & 5 years in future			
			onSelect: function(dateText, datePicker) {
				if(tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)) {
					$scope.toDate = $scope.fromDate;
				}
			}
		};

		$scope.toDateOptions = {
			firstDay: 1,
			changeYear: true,
			changeMonth: true,			
			yearRange: "-5:+5",
			onSelect: function(dateText, datePicker) {
				if(tzIndependentDate($scope.fromDate) > tzIndependentDate($scope.toDate)) {
					$scope.fromDate = $scope.toDate;
				}
			}
		};

		$scope.errorMessage = '';
	};

	$scope.setUpData();

	$scope.updateClicked = function() {
		filterData.begin_date = $scope.fromDate;
		filterData.end_date = $scope.toDate;
		filterData.selected_date_range = dateFilter($scope.fromDate, $rootScope.dateFormat) +
										 ' to ' + 
										 dateFilter($scope.toDate, $rootScope.dateFormat);

		ngDialog.close();
	};

	$scope.toggleUpdate = function() {
		return _.isEmpty($scope.fromDate) || _.isEmpty($scope.toDate);
	};

	$scope.cancelClicked = function() {
		ngDialog.close();
	};

}]);