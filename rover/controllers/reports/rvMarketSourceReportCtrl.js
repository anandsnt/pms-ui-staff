sntRover.controller('rvMarketSourceReportCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'RVreportsSrv',
	function($scope, $rootScope, $filter, RVreportsSrv) {

		$scope.results = [{
			"source": [{
				"Booking.com": 27,
				"COP Account": 5,
				"Kiosk": 12,
				"telephoneHQ": 15,
				"walk-in": 12,
				"web": 10,
				"un_assigned": 5
			}],
			"market": [],
			"total_count": 89
		}];

		var markets = _.keys($scope.results[0].source[0]);
		var marketValues = _.values($scope.results[0].source[0]);


		$scope.marketActual = {
			options: {
				chart: {
					type: 'bar'
				}
			},
			xAxis: {
				categories: markets
			},
			series: [{
				data: marketValues
			}]

		}
	}
]);