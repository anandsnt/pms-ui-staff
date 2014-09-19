sntRover.controller('SelectDateRangeModalCtrl', ['filterDefaults', '$scope','ngDialog','$filter','dateFilter','$rootScope', 
	function(filterDefaults, $scope,  ngDialog, $filter, dateFilter, $rootScope) {
	'use strict';

	var filterData = $scope.currentFilterData,
		businessDate = tzIndependentDate($rootScope.businessDate),
		from_date = tzIndependentDate($rootScope.businessDate), //new Date(),
		to_date = new Date((new Date(from_date)).setMonth(from_date.getMonth() + 1));

	$scope.setUpData = function() {		
		filterData.begin_date = _.isEmpty(filterData.begin_date) ? dateFilter(from_date, filterDefaults.UI_DATE_FORMAT) : tzIndependentDate(filterData.begin_date);
		filterData.end_date = _.isEmpty(filterData.end_date) ? dateFilter(new Date(to_date.setDate(to_date.getDate() + 1)), filterDefaults.UI_DATE_FORMAT) : tzIndependentDate(filterData.end_date);

		$scope.fromDateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: new Date((new Date(from_date)).setYear(from_date.getYear() + 1899)), 
			yearRange: "0:+10",
			onSelect: function() {
				if(tzIndependentDate(filterData.begin_date) > tzIndependentDate(filterData.end_date)) {
					filterData.end_date = filterData.begin_date;
				}
			}
		};

		$scope.toDateOptions = {
			changeYear: true,
			changeMonth: true,
			minDate: new Date((new Date(from_date)).setDate(from_date.getDate() + 1)), 
			yearRange: "0:+10",
			onSelect: function() {
				if(tzIndependentDate(filterData.begin_date) > tzIndependentDate(filterData.end_date)) {
					filterData.begin_date = filterData.end_date;
				}
			}
		};

		$scope.errorMessage = '';
	};

	$scope.setUpData();

	$scope.updateClicked = function() {
		filterData.selected_date_range = dateFilter(filterData.begin_date, $rootScope.dateFormat) +
										 ' to ' + 
										 dateFilter(filterData.end_date, $rootScope.dateFormat);

		ngDialog.close();
	};

	$scope.cancelClicked = function() {
		ngDialog.close();
	};
}]);