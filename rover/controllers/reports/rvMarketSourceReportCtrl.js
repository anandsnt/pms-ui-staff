sntRover.controller('rvMarketSourceReportCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'RVreportsSrv',
	function($scope, $rootScope, $filter, RVreportsSrv) {
		$scope.marketActual = {
			options: {
				chart: {
					type: 'bar'
				}
			},
			xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			},
			series: [{
				data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
			}]

		}
	}
]);