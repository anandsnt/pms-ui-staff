sntRover.controller('RVManagerAnalyticsController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvFrontOfficeAnalyticsSrv',
	'rvManagersAnalyticsSrv',
	'rvAnalyticsSrv',
	'rvAnalyticsHelperSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvFrontOfficeAnalyticsSrv, rvManagersAnalyticsSrv, rvAnalyticsSrv, rvAnalyticsHelperSrv, $controller) {

		BaseCtrl.call(this, $scope);

		// Setting the CI / CO time
		rvAnalyticsSrv.setHotelCiCoTime($rootScope.hotelDetails);
		var initialBaseHrefValue = $('base').attr('href');
		var perfomanceData;
		var combinedPerfomanceData = {};

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

		$controller('rvMangerPaceChart', {
			$scope: $scope
		});

		var clearAllExistingChartElements = function() {
			d3.select('#d3-plot').selectAll('svg').remove();
			d3.select('#d3-plot').selectAll('p').remove();
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

		var addChartHeading = function() {
			rvAnalyticsHelperSrv.addChartHeading($scope.screenData.mainHeading, $scope.screenData.analyticsDataUpdatedTime);
		};

		var renderPerfomanceChart = function() {
			$('base').attr('href', initialBaseHrefValue);
			var options = {
				params: {
					date: $scope.dashboardFilter.datePicked
				},
				successCallBack: function(data) {
					$('base').attr('href', '#');
					perfomanceData = data;
					$scope.screenData.analyticsDataUpdatedTime = moment().format("MM ddd, YYYY hh:mm:ss a");
					clearAllExistingChartElements();
					d3.select('#d3-plot').selectAll('svg').remove();
					$scope.drawPerfomceChart(data);
					addChartHeading()
				}
			};

			$scope.callAPI(rvManagersAnalyticsSrv.roomPerformanceKPR, options);
		};

		var renderDistributionChart = function() {

			$('base').attr('href', initialBaseHrefValue);

			var params = {
				start_date: $scope.dashboardFilter.fromDate,
				end_date: $scope.dashboardFilter.toDate,
				chart_type: $scope.dashboardFilter.chartType
			};

			if ($scope.dashboardFilter.aggType) {
				params.group_by = $scope.dashboardFilter.aggType;
			}
			var options = {
				params: params,
				successCallBack: function(data) {
					$('base').attr('href', '#');
					$scope.screenData.analyticsDataUpdatedTime = moment().format("MM ddd, YYYY hh:mm:ss a");
					clearAllExistingChartElements();
					$scope.drawDistributionChart(data);
					addChartHeading();
				}
			};

			$scope.callAPI(rvManagersAnalyticsSrv.distributions, options);
			// var data = {}
			// $scope.drawDistributionChart(data);
		};

		var renderPaceChart = function () {
			var options = {
                params: {
                    date: $scope.dashboardFilter.datePicked
                },
                successCallBack: function(data) {
                    clearAllExistingChartElements();
                    $scope.drawPaceChart(data);
                    addChartHeading();
                }
            };
            $scope.callAPI(rvManagersAnalyticsSrv.pace, options);
			
		};

		var scrollToTop = function() {
			var analyticsScroll = $scope.getScroller('analytics_scroller');

			if (analyticsScroll) {
				analyticsScroll.scrollTo(0, 0, 0);
			}
		};

		var drawChart = function() {
			scrollToTop();
			$scope.screenData.hideChartData = true;
			$scope.dashboardFilter.showFilters = false;
			clearAllExistingChartElements();
			$scope.screenData.mainHeading = "";
			if ($scope.screenData.selectedChart === 'PERFOMANCE') {
				$scope.dashboardFilter.showFilters = false;
				$scope.dashboardFilter.showLastYearData = false;
				renderPerfomanceChart();
			} else if ($scope.screenData.selectedChart === 'DISTRIBUTION') {
				renderDistributionChart();
			} else if ($scope.screenData.selectedChart === 'PACE') {
				renderPaceChart();
			}
		};

		$(window).on("resize.doResize", function() {
			$scope.$apply(function() {
				$timeout(function() {
					// Redraw chart
					drawChart();
				}, 0);
			});
		});

		$scope.$on('ANALYTICS_MENU_CHANGED', function(e, selectedChart) {
			if ($scope.screenData.selectedChart === selectedChart) {
				return;
			}
			$scope.screenData.selectedChart = selectedChart;
			$timeout(function() {
				clearAllExistingChartElements();
				$scope.dashboardFilter.chartType = "occupancy";
				$scope.dashboardFilter.aggType = "";
				$scope.dashboardFilter.datePicked = $rootScope.businessDate;
				drawChart();
			}, 0);
		});

		$scope.$on("$destroy", function() {
			$(window).off("resize.doResize");
		});

		$scope.$on('RELOAD_DATA_WITH_SELECTED_FILTER', function(e, filter) {
			rvAnalyticsSrv.selectedRoomType = filter.room_type;
			drawChart();
		});

		$scope.$on('RESET_ANALYTICS_FILTERS', function() {
			$scope.dashboardFilter.datePicked = $rootScope.businessDate;
			$scope.dashboardFilter.selectedRoomType = "";
			$scope.dashboardFilter.selectedAnalyticsMenu = "PERFOMANCE";
			$scope.screenData.selectedChart = "PERFOMANCE";

		});

		$scope.$on('REFRESH_ANALYTCIS_CHART', function(){
			drawChart();
		});
		/*
		 * Reload graph with date picker change
		 */
		$scope.$on('RELOAD_DATA_WITH_DATE_FILTER', function() {
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
		$scope.$on('SET_PAGE_HEADING', setPageHeading);

		$scope.$on('CHART_TYPE_CHANGED', function(e, data) {
			setPageHeading();
			drawChart();
		});

		$scope.$on('CHART_AGGGREGATION_CHANGED', function(e, data) {
			setPageHeading();
			drawChart();
		});

		$scope.previousDaySelectionChanged = function() {
			clearAllExistingChartElements();
			drawChart();
		};

		var handleFilterChangeForPerfomanceChart = function() {
			if (!$scope.dashboardFilter.showLastYearData) {
				$('base').attr('href', '#');
				clearAllExistingChartElements();
				$scope.drawPerfomceChart(perfomanceData);
				addChartHeading();	
				return;
			}

			$('base').attr('href', initialBaseHrefValue);

			var lastYeardate;

			if ($scope.dashboardFilter.lastyearType === "SAME_DATE_LAST_YEAR") {
				lastYeardate = moment($scope.dashboardFilter.datePicked).subtract(1, 'years').format("YYYY-MM-DD");
			} else if ($scope.dashboardFilter.lastyearType === "SAME_DAY_LAST_YEAR") {
				lastYeardate = rvAnalyticsHelperSrv.getClosetDayOftheYearInPastYear($scope.dashboardFilter.datePicked);
			}
			console.log(lastYeardate);
			var options = {
				params: {
					date: lastYeardate
				},
				successCallBack: function(lastYeardata) {
					console.log(JSON.stringify(lastYeardata));
					console.log(JSON.stringify(perfomanceData));

					for (var key in perfomanceData) {
						for (var key1 in lastYeardata) {
							if (key === key1) {
								combinedPerfomanceData[key] = angular.copy(perfomanceData[key]);
								combinedPerfomanceData[key].adr_diff = parseFloat(perfomanceData[key].adr) -
							 										   parseFloat(lastYeardata[key].adr);
								combinedPerfomanceData[key].rev_par_diff = parseFloat(perfomanceData[key].rev_par) -
							 										   parseFloat(lastYeardata[key].rev_par);
								combinedPerfomanceData[key].occupancy_diff = parseFloat(perfomanceData[key].occupancy) -
							 										   parseFloat(lastYeardata[key].occupancy);
							}
						}
					}

					$('base').attr('href', '#');
					clearAllExistingChartElements();
					d3.select('#d3-plot').selectAll('svg').remove();
					$scope.drawPerfomceChart(combinedPerfomanceData);
					addChartHeading();
				}
			};

			$scope.callAPI(rvManagersAnalyticsSrv.roomPerformanceKPR, options);
		};

		$scope.$on('ANALYTICS_FILTER_CHANGED',  function (){
			console.log($scope.dashboardFilter);
			if ($scope.screenData.selectedChart === 'PERFOMANCE') {
				handleFilterChangeForPerfomanceChart();
			}
		});

		(function() {
			$scope.dashboardFilter.selectedAnalyticsMenu = "PERFOMANCE";
			$scope.dashboardFilter.showFilters = false;
			$scope.dashboardFilter.showLastYearData = false;
			$scope.dashboardFilter.lastyearType = 'SAME_DATE_LAST_YEAR';
			drawChart();
		})();
	}
]);