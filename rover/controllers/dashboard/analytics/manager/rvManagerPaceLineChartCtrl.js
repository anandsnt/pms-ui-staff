angular.module('sntRover')
	.controller('rvManagerPaceLineChartCtrl', ['$scope', 'rvAnalyticsHelperSrv',
		function($scope, rvAnalyticsHelperSrv) {
			
			$scope.drawPaceLineChart = function(chartData) {
				console.log("Line chart");
				console.log(chartData);
			};
		}
	]);