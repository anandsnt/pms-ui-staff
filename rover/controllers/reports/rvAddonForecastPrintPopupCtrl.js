sntRover.controller('RVAddonForecastPrintPopupCtrl', [
	'$rootScope',
	'$scope',
	'$filter',
	'$timeout',
	'RVReportUtilsFac',
	function($rootScope, $scope, $filter, $timeout, reportUtils) {
		$scope.openLevel = $scope.$parent.openLevel;
		$scope.addonGroupBy = $scope.$parent.addonGroupBy;

		$scope.values = {
			'date'  : 'DATE',
			'group' : 'GROUP',
			'addon' : 'ADDON',
			'all'   : 'ALL'
		};
    }
]);
