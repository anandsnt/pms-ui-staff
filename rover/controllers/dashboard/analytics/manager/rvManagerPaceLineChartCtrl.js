angular.module('sntRover')
	.controller('rvManagerPaceLineChartCtrl', ['$scope', 'rvAnalyticsHelperSrv', 'rvManagersAnalyticsSrv',
		function($scope, rvAnalyticsHelperSrv, rvManagersAnalyticsSrv) {

			var dataForDateInfo = [],
				numberOfDateInfoFetched = 0,
				datesToCompare = [];

			var fetchPaceChartData = function(selectedData, shallowDecodedParams) {
				var options = {
					params: {
						date: selectedData,
						shallowDecodedParams: shallowDecodedParams
					},
					successCallBack: function(data) {
						if (data && data.length === 0) {
							data = [{
								new: 0,
								cancellation: 0,
								on_the_books: 0,
								date: selectedData
							}];
						}
						$scope.screenData.analyticsDataUpdatedTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

						dataForDateInfo.push({
							date: selectedData,
							chartData: data
						});
						numberOfDateInfoFetched++;
						// if numberOfDateInfoFetched reached the dates to compare array length +  1 which the selected date ($scope.dashboardFilter.datePicked)
						if ((datesToCompare.length + 1) === numberOfDateInfoFetched) {
							drawPaceLineChart();
						}
					}
				};

				$scope.callAPI(rvManagersAnalyticsSrv.pace, options);
			};

			$scope.startDrawingPaceLineChart = function(chartData, shallowDecodedParams) {
				// chartData will have one set of data with date $scope.dashboardFilter.datePicked
				numberOfDateInfoFetched = 0;
				dataForDateInfo = [];
				dataForDateInfo.push({
					date: $scope.dashboardFilter.datePicked,
					chartData: chartData
				});
				numberOfDateInfoFetched++;
				// If more dates are selected to compare, fetch data corresponding to all those dates
				// and upon fetching all data, draw the chart
				datesToCompare = $scope.dashboardFilter.datesToCompare;

				if (datesToCompare.length > 0) {
					if (datesToCompare.includes($scope.dashboardFilter.datePicked)) {
						datesToCompare = _.reject(datesToCompare, function(date) {
							return date === $scope.dashboardFilter.datePicked;
						});
					}
					_.each(datesToCompare, function(dateToCompare) {
						fetchPaceChartData(dateToCompare, shallowDecodedParams);
					});
				} else {
					drawPaceLineChart();
				}
			};

			var drawPaceLineChart = function() {
				// draw line chart using the array dataForDateInfo
				console.log("[dataForDateInfo].........");
				console.log(dataForDateInfo);
				// TODO:  delete the test code in below line
				dataForDateInfo = rvAnalyticsHelperSrv.samplePaceCompareDates;
				console.log(dataForDateInfo);
				$scope.$emit("CLEAR_ALL_CHART_ELEMENTS");
				// iterate through array dataForDateInfo to draw line charts
				// Also draw avg line chart which comprises of all the selected data (only if dataForDateInfo.length > 0)
				// Show selected dates as legends on rights ride (only if dataForDateInfo.length > 0)
			};
		}
	]);