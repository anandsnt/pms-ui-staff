sntRover.controller('RVManagerAnalyticsController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvFrontOfficeAnalyticsSrv',
	'rvManagersAnalyticsSrv',
	'rvAnalyticsSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvFrontOfficeAnalyticsSrv, rvManagersAnalyticsSrv, rvAnalyticsSrv, $controller) {

		BaseCtrl.call(this, $scope);

		// Setting the CI / CO time
		rvAnalyticsSrv.setHotelCiCoTime($rootScope.hotelDetails);
		var initialBaseHrefValue = $('base').attr('href');

		$scope.screenData = {
			selectedChart: 'PERFOMANCE',
			hideChartData: true,
			analyticsDataUpdatedTime: "",
			showPreviousDayData: false
		};

		$controller('rvManagerSpiderChartCtrl', {
			$scope: $scope
		});

		$controller('rvManagerDistributionAnalyticsCtrl', {
			$scope: $scope
		});

		var clearAllExistingChartElements = function() {
			d3.select('#d3-plot').selectAll('svg').remove();
			var divElements = d3.select('#d3-plot').selectAll('div');
			if (divElements) {
				divElements.remove();
			}
			if (document.getElementById("left-side-legend")) {
				document.getElementById("left-side-legend").innerHTML = "";
			}
			if (document.getElementById("right-side-legend")) {
				document.getElementById("right-side-legend").innerHTML = "";
			}
		};

		var renderPerfomanceChart = function() {
			$('base').attr('href', initialBaseHrefValue);
			var options = {
				params: {
					date: $scope.dashboardFilter.datePicked
				},
				successCallBack: function(data) {
					$('base').attr('href', '#');
					$scope.screenData.analyticsDataUpdatedTime = moment().format("MM ddd, YYYY hh:mm:ss a");
					clearAllExistingChartElements();
					d3.select('#d3-plot').selectAll('svg').remove();
					$scope.drawPerfomceChart(data);
				}
			};

			$scope.callAPI(rvManagersAnalyticsSrv.roomPerformanceKPR, options);


			// var options = {
			//     params: {
			//         start_date: moment($scope.dashboardFilter.datePicked).subtract(7, 'days').format('YYYY-MM-DD'),
			//         end_date: $scope.dashboardFilter.datePicked,
			//         group_by: 'market_id',
            //         chart_type: 'adr'
			//     },
			//     successCallBack: function(data) {
			//         console.log(data);
			//     }
			// };
            //
			// $scope.callAPI(rvManagersAnalyticsSrv.distributions, options);

		};

		var renderDistributionChart = function() {

			$('base').attr('href', initialBaseHrefValue);
			var options = {
			    params: {
			        start_date: $scope.dashboardFilter.fromDate,
			        end_date: $scope.dashboardFilter.toDate,
			        group_by: $scope.dashboardFilter.aggType
			    },
			    successCallBack: function(data) {
			    	$('base').attr('href', '#');
			    	$scope.screenData.analyticsDataUpdatedTime = moment().format("MM ddd, YYYY hh:mm:ss a");
					clearAllExistingChartElements();
			        console.log(JSON.stringify(data));
			        $scope.drawDistributionChart(data);
			    }
			};

			$scope.callAPI(rvManagersAnalyticsSrv.distributions, options);
			// var data = {}
			// $scope.drawDistributionChart(data);
		};

		var drawChart = function() {
			$scope.screenData.hideChartData = true;
			clearAllExistingChartElements();
			$scope.screenData.mainHeading = "";
			if ($scope.screenData.selectedChart === 'PERFOMANCE') {
				renderPerfomanceChart();
			} else if ($scope.screenData.selectedChart === 'DISTRIBUTION'){
				renderDistributionChart();
			}
		};

		$(window).on("resize.doResize", function() {
			$scope.$apply(function() {
				$timeout(function() {
					// Clear existing chart
					d3.select('#d3-plot').selectAll('svg').remove();
					clearAllExistingChartElements();
					// Redraw chart
					drawChart();
				}, 0);
			});
		});

		$scope.$on('ANALYTICS_MENU_CHANGED', function(e, selectedChart) {
			$scope.screenData.selectedChart = selectedChart;
			$timeout(function() {
				clearAllExistingChartElements();
				$scope.dashboardFilter.chartType = "occupancy";
				$scope.dashboardFilter.aggType = "";
				drawChart();
			}, 0);
		});

		$scope.$on("$destroy", function() {
			$(window).off("resize.doResize");
		});

		$scope.$on('RELOAD_DATA_WITH_SELECTED_FILTER', function(e, filter) {
			rvAnalyticsSrv.selectedRoomType = filter.room_type;
			clearAllExistingChartElements();
			drawChart();
		});

		$scope.$on('RESET_ANALYTICS_FILTERS', function() {
			$scope.dashboardFilter.datePicked = $rootScope.businessDate;
			$scope.dashboardFilter.selectedRoomType = "";
			$scope.dashboardFilter.selectedAnalyticsMenu = "PERFOMANCE";
			$scope.screenData.selectedChart = "PERFOMANCE";

		});

		$scope.refreshChart = function() {
			drawChart();
		};
		/*
		 * Reload graph with date picker change
		 */
		$scope.$on('RELOAD_DATA_WITH_DATE_FILTER', function(e, data) {
			// if(data.to_date) {
			// 	console.log(date.to_date);
			// } else if (date.from_date){
			// 	console.log(date.from_date);
			// }
			drawChart();
		});

		$scope.$on("$destroy", function() {
			$('base').attr('href', initialBaseHrefValue);
		});

		
		var setPageHeading = function() {
			var chartTypeSelected = _.find($scope.dashboardFilter.chartTypes, function(chartType) {
				return chartType.code === $scope.dashboardFilter.chartType;
			});
			var aggTypeSelected = _.find($scope.dashboardFilter.aggTypes, function(aggType) {
				return aggType.code === $scope.dashboardFilter.aggType;
			});

			if (aggTypeSelected) {
				$scope.screenData.mainHeading = chartTypeSelected.name + " by " + aggTypeSelected.name;
			} else {
				$scope.screenData.mainHeading = chartTypeSelected.name;
			}
		};
		$scope.$on('CHART_TYPE_CHANGED',function(e, data) {
			setPageHeading();
			console.log(data);
		});

		$scope.$on('CHART_AGGGREGATION_CHANGED',function(e, data) {
			setPageHeading();
			console.log(data);
		});

		$scope.$on('RELOAD_DATA_WITH_DATE_FILTER', function(e, data) {
  			console.log(data);
   		});

		$scope.previousDaySelectionChanged = function() {
			clearAllExistingChartElements();
			drawChart();
		};

		(function() {
			$scope.dashboardFilter.selectedAnalyticsMenu = "PERFOMANCE";
			drawChart();
		})();
	}
]);
