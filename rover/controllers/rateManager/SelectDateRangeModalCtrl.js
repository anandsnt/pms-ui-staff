sntRover.controller('SelectDateRangeModalCtrl', ['filterDefaults', '$scope','ngDialog','$filter','dateFilter','$rootScope', 
	function(filterDefaults, $scope,  ngDialog, $filter, dateFilter, $rootScope) {
	'use strict';

	var filterData = $scope.currentFilterData,
		businessDate = tzIndependentDate($rootScope.businessDate),
		from_date = tzIndependentDate($rootScope.businessDate), //new Date(),
		to_date = new Date((new Date(from_date)).setMonth(from_date.getMonth() + 1)),
		orig = _.extend({}, _.pick(filterData, 'begin_date', 'end_date'));

	$scope.setUpData = function() {		
		filterData.begin_date = _.isEmpty(filterData.begin_date) ? dateFilter(from_date, filterDefaults.UI_DATE_FORMAT) : tzIndependentDate(filterData.begin_date);
		//filterData.end_date = _.isEmpty(filterData.end_date) ? dateFilter(to_date, filterDefaults.UI_DATE_FORMAT) : tzIndependentDate(filterData.end_date);

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

		$scope.toDateOptions = _.extend({
			onSelect: function() {
				if(tzIndependentDate(filterData.begin_date) > tzIndependentDate(filterData.end_date)) {
					filterData.begin_date = filterData.end_date;
				}
			}
		}, $scope.fromDateOptions);

		$scope.errorMessage = '';
	};

	$scope.setUpData();

	$scope.updateClicked = function() {
		filterData.selected_date_range = dateFilter(filterData.begin_date, $rootScope.dateFormat) +
										 ' to ' + 
										 dateFilter(filterData.end_date, $rootScope.dateFormat);

		ngDialog.close();
	};

	$scope.toggleUpdate = function() {
		return _.isEmpty(filterData.begin_date) || _.isEmpty(filterData.end_date);
	};

	$scope.cancelClicked = function() {
		filterData.begin_date = orig.begin_date;
		filterData.end_date = orig.end_date;

		ngDialog.close();
	};
}]);